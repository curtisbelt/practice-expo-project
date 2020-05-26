import React from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  Text,
  Image,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import translate from '../../assets/strings/strings';
import { moderateScale, horizontalScale, verticalScale } from '../../helpers/scale';
import FontFamily from '../../assets/fonts/fonts';
import Colors from '../../constants/colors/colors';
import { Images } from '../../assets';
import ClickView from '../../components/widgets/clickView';
import * as RNIap from 'react-native-iap';
import {
  PRODUCT_ID,
  TERMS_OF_USE,
  PRIVACY_POLICY,
  LOGIN,
  IOS_SECTET,
} from '../../service/config/serviceConstants';
import { parentEnabled, childEnabled } from '../../../appConfig';
import automationStaticLables from '../../constants/automationStaticLables';
import {
  readLoginFileStream,
  readSubscriptionFileStream,
  writeSubscriptionFileStream,
} from '../../helpers/rn_fetch_blob/createDirectory';
import { asynStoreKeys, setItem } from '../../helpers/asyncStore';
import ActivityIndicatorView from '../../components/widgets/ActivityIndicator';
import { ModalView } from '../../components/widgets/ModalView';

const itemSkus = Platform.select({
  ios: ['com.condenet.wwd.digitaledition.subs.1mo', 'com.condenet.wwd.digitaledition.subs.1yr'],
  android: ['wwd.combo.subs.1mo', 'wwd.combo.subs.1yr'],
});

let purchaseErrorSubscription;

class SubscriptionScreen extends React.Component {
  constructor(props: any) {
    super(props);
    this.readData();
    this.state = {
      productList: [],
      receipt: '',
      connectionStatus: false,
      isSubscribed: false,
      login: props.navigation.state.params.login,
      loading: false,
      loginData: '',
      subsData: '',
      showModal: false,
      restoreStatus: false,
    };
  }

  readData = async () => {
    let data = await readLoginFileStream();
    let jsonData = JSON.parse(data);
    let subsdata = await readSubscriptionFileStream();
    let subsParsedData = JSON.parse(subsdata);
    this.setState({
      loginData: jsonData,
      subsData: subsParsedData,
    });
  };

  handleRedirect = () => {
    this.props.navigation.navigate('Home');
  };

  async componentDidMount() {
    await RNIap.initConnection().then((conn) => {
      this.setState({ connectionStatus: conn });
      RNIap.getSubscriptions(itemSkus).then((response) => {
        this.setState({ productList: response });
      });
    });

    purchaseErrorSubscription = RNIap.purchaseErrorListener((_error: RNIap.PurchaseError) => {
      this.setState({ loading: false });
    });
  }

  async componentWillUnmount(): Promise<void> {
    if (purchaseErrorSubscription) {
      purchaseErrorSubscription.remove();
      purchaseErrorSubscription = null;
    }

    if (Platform.OS === 'android') {
      await RNIap.endConnectionAndroid();
    }
  }

  requestForSubscription = async (productId) => {
    if (this.state.connectionStatus) {
      try {
        this.setState({ loading: true });

        await RNIap.getAvailablePurchases()
          .then(async (purchases) => {
            if (purchases && purchases.length > 0) {
              // iOS
              if (Platform.OS === 'ios') {
                var receiptBody = {
                  'receipt-data': purchases[purchases.length - 1].transactionReceipt,
                  password: IOS_SECTET,
                };

                await RNIap.validateReceiptIos(receiptBody, true).then(async (receipt) => {
                  const renewalHistory = receipt.latest_receipt_info;

                  const filteredHistory = await renewalHistory.filter(
                    (o) => o.product_id === productId,
                  );

                  // console.log('Filtered hidtory', filteredHistory);

                  if (filteredHistory.length > 0) {
                    const sortedHistory = await filteredHistory.sort(function (a, b) {
                      return a.purchase_date_ms > b.purchase_date_ms;
                    });

                    // console.log('Sorted hidtory', sortedHistory);

                    const latestPurchase = sortedHistory[sortedHistory.length - 1];

                    // console.log('Latest purchase', latestPurchase);

                    if (latestPurchase.expires_date_ms > Date.now()) {
                      RNIap.finishTransaction(purchases[purchases.length - 1], false);

                      writeSubscriptionFileStream(
                        purchases[purchases.length - 1].transactionReceipt,
                      );
                    }

                    // console.log(latestPurchase.expires_date_ms > Date.now());

                    this.setState({
                      isSubscribed: latestPurchase.expires_date_ms > Date.now(),
                    });
                  }
                });
              }

              //Android
              if (Platform.OS === 'android') {
                const filteredResults = purchases.filter((o) => o.productId === productId);

                if (filteredResults.length > 0) {
                  const sortedResults = filteredResults.sort(function (a, b) {
                    return a.transactionDate > b.transactionDate;
                  });

                  if (sortedResults[sortedResults.length - 1].purchaseStateAndroid === 1) {
                    writeSubscriptionFileStream(
                      sortedResults[sortedResults.length - 1].transactionReceipt,
                    );

                    this.setState({ isSubscribed: true });
                  }
                }
              }
            }
          })
          .catch(() => {
            this.setState({ loading: false });
          });

        // Request subscription if not subscribed already
        if (!this.state.isSubscribed) {
          // console.log('request Subscription');
          await RNIap.requestSubscription(productId, false)
            .then(async (purchase) => {
              if (purchase.transactionReceipt) {
                //       // iOS
                if (Platform.OS === 'ios') {
                  var receiptBody = {
                    'receipt-data': purchase.transactionReceipt,
                    password: IOS_SECTET,
                  };

                  await RNIap.validateReceiptIos(receiptBody, true)
                    .then(async (response) => {
                      this.setState({ loading: false });
                      if (response.status === 0) {
                        try {
                          await RNIap.finishTransactionIOS(purchase.transactionId);
                          await RNIap.finishTransaction(purchase, false);
                        } catch (ackErr) {
                          Alert.alert(ackErr);
                        }
                      }
                    })
                    .catch((err) => {
                      Alert.alert(err.message);
                    });
                }

                // Android
                if (Platform.OS === 'android') {
                  if (purchase.purchaseStateAndroid === 1) {
                    await RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
                    await RNIap.finishTransaction(purchase, false);
                  }
                }

                this.setState({ loading: false });

                Alert.alert('Subscribe success');

                writeSubscriptionFileStream(purchase.transactionReceipt);

                setItem(asynStoreKeys.lastSubscriptionValidated, Date.now().toString());

                setTimeout(this.handleRedirect, 2000);
              }
            })
            .catch(() => {
              // console.log(' error', error);
            });
        } else {
          this.setState({ loading: false });
          Alert.alert('Purchase restored');
          // console.log("'Purchase restored'");

          setItem(asynStoreKeys.lastSubscriptionValidated, Date.now().toString());

          setTimeout(this.handleRedirect, 2000);
        }
      } catch (err) {
        this.setState({ loading: false });
        Alert.alert(err.message);
      }
    } else {
      Alert.alert('Request failed, try again later');
    }
  };

  handleRestoreSubscription = async () => {
    if (this.state.connectionStatus) {
      try {
        this.setState({ loading: true });

        await RNIap.getAvailablePurchases()
          .then(async (purchases) => {
            if (purchases && purchases.length > 0) {
              // iOS
              if (Platform.OS === 'ios') {
                var receiptBody = {
                  'receipt-data': purchases[purchases.length - 1].transactionReceipt,
                  password: IOS_SECTET,
                };

                await RNIap.validateReceiptIos(receiptBody, true).then(async (receipt) => {
                  const renewalHistory = receipt.latest_receipt_info;

                  if (renewalHistory.length > 0) {
                    const sortedHistory = await renewalHistory.sort(function (a, b) {
                      return a.purchase_date_ms > b.purchase_date_ms;
                    });

                    const latestPurchase = sortedHistory[sortedHistory.length - 1];

                    if (latestPurchase.expires_date_ms > Date.now()) {
                      RNIap.finishTransaction(purchases[purchases.length - 1], false);

                      writeSubscriptionFileStream(
                        purchases[purchases.length - 1].transactionReceipt,
                      );
                    }

                    this.setState({
                      restoreStatus: latestPurchase.expires_date_ms > Date.now(),
                    });
                  } else {
                    this.setState({
                      restoreStatus: false,
                    });
                  }
                });
              }

              //Android
              if (Platform.OS === 'android') {
                const sortedResults = purchases.sort(function (a, b) {
                  return a.transactionDate > b.transactionDate;
                });

                if (sortedResults[sortedResults.length - 1].purchaseStateAndroid === 1) {
                  writeSubscriptionFileStream(
                    sortedResults[sortedResults.length - 1].transactionReceipt,
                  );

                  this.setState({
                    restoreStatus: true,
                  });
                } else {
                  this.setState({
                    restoreStatus: false,
                  });
                }
              }
            } else {
              this.setState({
                restoreStatus: false,
              });
            }
          })
          .catch(() => {
            this.setState({ loading: false });
          });

        this.setState({ loading: false, showModal: true });
      } catch (err) {
        this.setState({ loading: false });
        Alert.alert(err.message);
      }
    } else {
      Alert.alert('Request failed, try again later');
    }
  };

  renderFilterModal = () => {
    const { showModal, restoreStatus }: any = this.state;
    return (
      <ModalView
        backdropColor={Colors.white}
        backdropOpacity={0.9}
        isVisible={showModal}
        customColor={Colors.white}
        style={styles.modalContainer}
        transparent={true}
        onBackButtonPress={() => {
          this.setState({ showModal: false });
        }}
        backDropPressed={() => {}}
      >
        <View style={styles.modalView}>
          {this.renderModalHeader()}

          <Text
            accessible={childEnabled}
            accessibilityLabel={
              restoreStatus ? translate('subscriptionRestored') : translate('unableToRestore')
            }
            testID={
              restoreStatus ? translate('subscriptionRestored') : translate('unableToRestore')
            }
            style={styles.modalText}
          >
            {restoreStatus ? translate('subscriptionRestored') : translate('unableToRestore')}
          </Text>

          {restoreStatus ? (
            <View accessible={parentEnabled} style={styles.buttonsContainer}>
              <ClickView
                accessible={parentEnabled}
                onPress={() => {
                  this.setState({ showModal: false });
                  this.props.navigation.navigate('Home');
                }}
                style={[styles.buttonView, styles.blackButton]}
              >
                <Text
                  accessible={childEnabled}
                  accessibilityLabel={translate('proceedToApp')}
                  testID={translate('proceedToApp')}
                  style={styles.buttonText}
                >
                  {translate('proceedToApp')}
                </Text>
              </ClickView>
            </View>
          ) : (
            <View accessible={parentEnabled} style={styles.buttonsContainer}>
              <ClickView
                accessible={parentEnabled}
                onPress={() => {
                  this.setState({ showModal: false });
                  this.handleRestoreSubscription();
                }}
                style={[styles.buttonView, styles.blackButton]}
              >
                <Text
                  accessible={childEnabled}
                  accessibilityLabel={translate('tryAgain')}
                  testID={translate('tryAgain')}
                  style={styles.buttonText}
                >
                  {translate('tryAgain')}
                </Text>
              </ClickView>
              <ClickView
                accessible={parentEnabled}
                onPress={() => this.setState({ showModal: false })}
                style={[styles.buttonView, styles.redButton]}
              >
                <Text
                  accessible={childEnabled}
                  accessibilityLabel={translate('cancel')}
                  testID={translate('cancel')}
                  style={styles.buttonText}
                >
                  {translate('cancel')}
                </Text>
              </ClickView>
            </View>
          )}
        </View>
      </ModalView>
    );
  };

  renderModalHeader = () => {
    return (
      <View accessible={parentEnabled} style={styles.modalHeader}>
        <ClickView
          accessible={parentEnabled}
          onPress={() => {
            this.setState({ showModal: false });
          }}
        >
          <Image
            accessible={childEnabled}
            accessibilityLabel={automationStaticLables.close}
            testID={automationStaticLables.close}
            source={Images.close}
            style={styles.closeIcon}
          />
        </ClickView>
      </View>
    );
  };

  renderText = () => {
    return (
      <View accessible={parentEnabled}>
        <Text
          accessible={childEnabled}
          accessibilityLabel={translate('unlimitedDigitalAccess')}
          testID={translate('unlimitedDigitalAccess')}
          style={styles.unlimitedAccess}
        >
          {translate('unlimitedDigitalAccess')}
        </Text>
        <Text
          accessible={childEnabled}
          accessibilityLabel={translate('expertReporting')}
          testID={translate('expertReporting')}
          style={styles.expertReporting}
        >
          {translate('expertReporting')}
        </Text>
        <View accessible={parentEnabled} style={styles.imageContainer}>
          <Image
            accessible={childEnabled}
            accessibilityRole={'image'}
            accessibilityLabel={automationStaticLables.deviceImage}
            testID={automationStaticLables.deviceImage}
            source={Images.lockUp}
            style={styles.image}
            resizeMode={'contain'}
          />
        </View>
        <View accessible={parentEnabled} style={styles.textContainer}>
          <View accessible={parentEnabled} style={styles.textView}>
            <Image
              accessible={childEnabled}
              accessibilityRole={'image'}
              accessibilityLabel={automationStaticLables.redTick}
              testID={automationStaticLables.redTick}
              source={Images.redTick}
              style={styles.tickImg}
            />
            <Text
              accessible={childEnabled}
              accessibilityLabel={translate('unlimitedAccess')}
              testID={translate('unlimitedAccess')}
              style={styles.text}
            >
              {translate('unlimitedAccess')}
            </Text>
          </View>
          <View accessible={parentEnabled} style={styles.textView}>
            <Image
              accessible={childEnabled}
              accessibilityRole={'image'}
              accessibilityLabel={automationStaticLables.redTick}
              testID={automationStaticLables.redTick}
              source={Images.redTick}
              style={styles.tickImg}
            />
            <Text
              accessible={childEnabled}
              accessibilityLabel={translate('industryBriefing')}
              testID={translate('industryBriefing')}
              style={styles.text}
            >
              {translate('industryBriefing')}
            </Text>
          </View>
          <View accessible={parentEnabled} style={styles.textView}>
            <Image
              accessible={childEnabled}
              accessibilityRole={'image'}
              accessibilityLabel={automationStaticLables.redTick}
              testID={automationStaticLables.redTick}
              source={Images.redTick}
              style={styles.tickImg}
            />
            <Text
              accessible={childEnabled}
              accessibilityLabel={translate('archieveArticles')}
              testID={translate('archieveArticles')}
              style={styles.text}
            >
              {translate('archieveArticles')}
            </Text>
          </View>
        </View>
        <View style={styles.separator} />
      </View>
    );
  };

  renderSubscription = () => {
    const { navigation }: any = this.props;
    var key = '';
    if (Platform.OS === 'ios') {
      key = 'afterYourFirstTermIOS';
    }
    if (Platform.OS === 'android') {
      key = 'afterYourFirstTermAndroid';
    }
    return (
      <View accessible={parentEnabled} style={styles.subscriptionView}>
        <View accessible={parentEnabled} style={styles.descriptionView}>
          <Text
            accessible={childEnabled}
            accessibilityLabel={translate('automaticRenewal')}
            testID={translate('automaticRenewal')}
            style={styles.boldText}
          >
            {translate('automaticRenewal')}
          </Text>
          <Text
            accessible={childEnabled}
            accessibilityLabel={translate(key)}
            testID={translate(key)}
            style={styles.normalText}
          >
            {translate(key)}
          </Text>
        </View>

        <View accessible={parentEnabled} style={styles.termsView}>
          <Text
            accessible={childEnabled}
            accessibilityLabel={translate('placingYourOrderLabel')}
            testID={translate('placingYourOrderLabel')}
            style={[styles.normalText]}
          >
            {translate('placingYourOrder')}
            <Text
              onPress={() => {
                navigation.navigate('SettingsWeb', { url: TERMS_OF_USE });
              }}
              style={[styles.normalText, { color: Colors.red }]}
            >
              {translate('termsOfUse')}
            </Text>
            {translate('and')}
            <Text
              onPress={() => {
                navigation.navigate('SettingsWeb', { url: PRIVACY_POLICY });
              }}
              style={[styles.normalText, { color: Colors.red }]}
            >
              {translate('privacyPolicy')}
            </Text>
            .
          </Text>
        </View>

        <Text
          accessible={childEnabled}
          accessibilityLabel={translate('chooseSubscription')}
          testID={translate('chooseSubscription')}
          style={styles.subscription}
        >
          {translate('chooseSubscription')}
        </Text>

        <ClickView
          onPress={() => {
            this.requestForSubscription(
              Platform.select({
                ios: PRODUCT_ID.IOS_MONTHLY,
                android: PRODUCT_ID.ANDROID_MONTHLY,
              }),
            );
          }}
          style={styles.subscribeNowView}
          accessible={parentEnabled}
        >
          <View accessible={parentEnabled} style={styles.subContainer}>
            <Text
              accessible={childEnabled}
              accessibilityLabel={translate('$')}
              testID={translate('$')}
              style={styles.dollar}
            >
              {translate('$')}
              <Text
                accessible={childEnabled}
                accessibilityLabel={translate('19')}
                testID={translate('19')}
                style={styles.price}
              >
                {translate('19')}
                <Text
                  accessible={childEnabled}
                  accessibilityLabel={translate('perMonth')}
                  testID={translate('perMonth')}
                  style={styles.perMonth}
                >
                  {translate('perMonth')}
                </Text>
              </Text>
            </Text>
          </View>
        </ClickView>
        <Text
          accessible={childEnabled}
          accessibilityLabel={translate('billedMonthlys')}
          testID={translate('billedMonthly')}
          style={styles.billed}
        >
          {translate('billedMonthly')}
        </Text>
        <ClickView
          accessible={parentEnabled}
          onPress={() => {
            this.requestForSubscription(
              Platform.select({
                ios: PRODUCT_ID.IOS_YEARLY,
                android: PRODUCT_ID.ANDROID_YEARLY,
              }),
            );
          }}
          style={styles.subscribeNowView}
        >
          <View accessible={parentEnabled} style={styles.subContainer}>
            <Text
              accessible={childEnabled}
              accessibilityLabel={translate('$')}
              testID={translate('$')}
              style={styles.dollar}
            >
              {translate('$')}
              <Text
                accessible={childEnabled}
                accessibilityLabel={translate('199')}
                testID={translate('199')}
                style={styles.price}
              >
                {translate('199')}
                <Text
                  accessible={childEnabled}
                  accessibilityLabel={translate('perYear')}
                  testID={translate('perYear')}
                  style={styles.perMonth}
                >
                  {translate('perYear')}
                </Text>
              </Text>
            </Text>
            <Text
              accessible={childEnabled}
              accessibilityLabel={translate('save')}
              testID={translate('save')}
              style={styles.save}
            >
              {translate('save')}
            </Text>
          </View>
        </ClickView>
        <Text
          accessible={childEnabled}
          accessibilityLabel={translate('billAnnually')}
          testID={translate('billAnnually')}
          style={styles.billed}
        >
          {translate('billAnnually')}
        </Text>

        <Text
          accessible={childEnabled}
          accessibilityLabel={
            translate('alreadySubscribed') + ' ' + translate('restoreSubscription')
          }
          testID={translate('alreadySubscribed') + ' ' + translate('restoreSubscription')}
          style={styles.restoreText}
        >
          {translate('alreadySubscribed')}
          <Text
            style={styles.restoreRedText}
            onPress={() => {
              this.handleRestoreSubscription();
            }}
          >
            {' '}
            {translate('restoreSubscription')}
          </Text>
        </Text>
      </View>
    );
  };

  render() {
    const { navigation }: any = this.props;
    const { loginData, loading, showModal }: any = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView bounces={false}>
          <View accessible={parentEnabled} style={styles.loginView}>
            <ClickView
              accessible={parentEnabled}
              onPress={() => {
                if (this.state.login === 'first') {
                  navigation.navigate('Education');
                } else {
                  navigation.goBack();
                }
              }}
              style={styles.backClick}
            >
              <Image
                accessible={childEnabled}
                accessibilityLabel={automationStaticLables.back}
                testID={automationStaticLables.back}
                source={Images.backArrow}
                style={styles.backImg}
              />
              <Text
                accessible={childEnabled}
                accessibilityLabel={translate('backToWWD')}
                testID={translate('backToWWD')}
                style={styles.proceedText}
              >
                {translate('backToWWD')}
              </Text>
            </ClickView>
            <ClickView
              accessible={parentEnabled}
              onPress={() => {
                if (loginData === null) {
                  this.props.navigation.navigate('login', {
                    url: LOGIN,
                    login: 'first',
                  });
                }
              }}
              style={styles.loginClick}
            >
              <Text
                accessible={childEnabled}
                accessibilityLabel={translate('login')}
                testID={translate('login')}
                style={styles.loginText}
              >
                {translate('login')}
              </Text>
              <View style={styles.underline} />
            </ClickView>
          </View>
          <View accessible={parentEnabled} style={styles.logoView}>
            <Image
              accessible={childEnabled}
              accessibilityRole={'image'}
              accessibilityLabel="WWD"
              testID="WWD"
              source={Images.headerLogo}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          {this.renderText()}
          {this.renderSubscription()}

          {/* Alert modal */}
          {showModal ? this.renderFilterModal() : null}
        </ScrollView>

        {loading ? <ActivityIndicatorView style={styles.loaderContainer} /> : null}
      </SafeAreaView>
    );
  }
}

export default SubscriptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  loginView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: horizontalScale(19),
    marginRight: horizontalScale(15),
    marginTop: verticalScale(10),
  },
  loginText: {
    fontSize: moderateScale(10),
    fontFamily: FontFamily.fontFamilyMedium,
    color: Colors.black,
  },
  underline: {
    width: horizontalScale(30),
    height: 1,
    backgroundColor: Colors.black,
  },
  proceedText: {
    fontSize: moderateScale(10),
    fontFamily: FontFamily.fontFamilyMedium,
    color: Colors.black,
  },
  logoView: {
    alignItems: 'center',
    marginTop: verticalScale(29),
  },
  logo: {
    width: horizontalScale(107),
    height: verticalScale(32),
  },
  unlimitedAccess: {
    fontSize: moderateScale(18),
    fontFamily: FontFamily.fontFamilyBold,
    color: Colors.black,
    paddingHorizontal: horizontalScale(76),
    textAlign: 'center',
    marginTop: verticalScale(18),
  },
  expertReporting: {
    fontSize: moderateScale(13),
    fontFamily: FontFamily.fontFamilyRegular,
    color: Colors.black,
    paddingHorizontal: horizontalScale(50),
    textAlign: 'center',
    marginTop: verticalScale(5),
  },
  imageContainer: {
    width: horizontalScale(218),
    height: verticalScale(119),
    alignSelf: 'center',
    marginTop: verticalScale(21),
  },
  image: {
    width: horizontalScale(218),
    height: verticalScale(119),
  },
  text: {
    fontFamily: FontFamily.fontFamilyRegular,
    fontSize: moderateScale(16),
    color: Colors.black,
    marginLeft: horizontalScale(5),
  },
  separator: {
    width: horizontalScale(335),
    height: verticalScale(1),
    backgroundColor: Colors.gray89,
    alignSelf: 'center',
    marginTop: verticalScale(22),
  },
  subscription: {
    fontSize: moderateScale(16),
    fontFamily: FontFamily.fontFamilyRegular,
    color: Colors.black,
    textAlign: 'center',
    marginTop: verticalScale(31),
  },
  subscriptionView: {
    marginBottom: verticalScale(25),
  },
  dollar: {
    fontSize: moderateScale(16),
    fontFamily: FontFamily.fontFamilyMedium,
    color: Colors.white,
  },
  price: {
    fontSize: moderateScale(16),
    fontFamily: FontFamily.fontFamilyBold,
    color: Colors.white,
  },
  perMonth: {
    fontSize: moderateScale(16),
    fontFamily: FontFamily.fontFamilyRegular,
    color: Colors.white,
    alignSelf: 'center',
    marginTop: verticalScale(10),
  },
  billed: {
    fontSize: moderateScale(14),
    fontFamily: FontFamily.fontFamilyRegular,
    color: Colors.billedtextGrey,
    textAlign: 'center',
    marginTop: verticalScale(5),
  },
  restoreText: {
    fontSize: moderateScale(15),
    lineHeight: moderateScale(24),
    letterSpacing: moderateScale(0.38),
    fontFamily: FontFamily.fontFamilyRegular,
    color: Colors.grey,
    textAlign: 'center',
    marginTop: verticalScale(30),
  },
  restoreRedText: {
    color: Colors.red,
  },
  subscribeNowView: {
    width: horizontalScale(330),
    height: verticalScale(45),
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: verticalScale(19),
  },
  subscribeNow: {
    fontSize: moderateScale(16),
    fontFamily: FontFamily.fontFamilyMedium,
    color: Colors.white,
    textAlign: 'center',
  },
  cancel: {
    fontSize: moderateScale(12),
    fontFamily: FontFamily.fontFamilyRegular,
    color: Colors.black,
    textAlign: 'center',
    marginTop: verticalScale(8),
  },
  save: {
    fontSize: moderateScale(14),
    fontFamily: FontFamily.fontFamilyMedium,
    color: Colors.white,
    textAlign: 'center',
    marginTop: verticalScale(2),
  },
  click: {
    padding: 10,
  },
  textContainer: {
    marginTop: verticalScale(21),
    marginLeft: horizontalScale(70),
  },
  textView: {
    flexDirection: 'row',
    marginTop: verticalScale(7),
  },
  descriptionView: {
    width: horizontalScale(330),
    borderWidth: 1,
    borderColor: Colors.greySemiDark,
    alignSelf: 'center',
    paddingLeft: horizontalScale(14),
    paddingTop: verticalScale(12),
    paddingRight: horizontalScale(9),
    paddingBottom: verticalScale(20),
  },
  termsView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: horizontalScale(330),
    alignSelf: 'center',
    marginTop: verticalScale(15),
  },
  boldText: {
    fontFamily: FontFamily.fontFamilyBold,
    fontSize: moderateScale(16),
    color: Colors.black,
  },
  normalText: {
    fontFamily: FontFamily.fontFamilyRegular,
    fontSize: moderateScale(16),
    color: Colors.black,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  tickImg: {
    width: 15,
    height: 22,
  },
  backClick: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: moderateScale(5),
  },
  backImg: {
    marginRight: moderateScale(6),
  },
  loginClick: {
    paddingTop: moderateScale(5),
    paddingRight: moderateScale(5),
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: horizontalScale(20),
  },
  modalView: {
    width: '100%',
    backgroundColor: Colors.white,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowColor: Colors.darkGrey,
    shadowOpacity: 1,
    elevation: 4,
    padding: moderateScale(20),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeIcon: {
    height: moderateScale(18),
    width: moderateScale(18),
  },
  modalText: {
    fontSize: moderateScale(20),
    fontFamily: FontFamily.fontFamilyBold,
    color: Colors.black,
    lineHeight: moderateScale(24),
    letterSpacing: moderateScale(0.38),
    textAlign: 'center',
    marginTop: verticalScale(10),
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: moderateScale(15),
  },
  buttonView: {
    height: moderateScale(44),
    minWidth: horizontalScale(120),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(2),
    paddingHorizontal: horizontalScale(20),
  },
  blackButton: {
    backgroundColor: Colors.black,
  },
  redButton: {
    backgroundColor: Colors.red,
  },
  buttonText: {
    fontSize: moderateScale(15),
    fontFamily: FontFamily.fontFamilyBold,
    color: Colors.white,
  },
});
