import React from 'react';
//import react in our code.
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Switch,
  NativeModules,
  Platform,
} from 'react-native';
//import all the basic component we have used
import HeaderLogoTitle from '../../components/header/HeaderLogoTitle';
import translate from '../../assets/strings/strings';
import { Images } from '../../assets/images';
import { moderateScale } from '../../helpers/scale';
import {
  handleAndroidBackButton,
  removeAndroidBackButtonHandler,
} from '../../helpers/androidBackButton';
import ClickView from '../../components/widgets/clickView';
import Colors from '../../constants/colors/colors';
import FontFamily from '../../assets/fonts/fonts';
import { forYouTabIndex, onShowCustomizeCategory } from '../../redux/actions/FoyYouAction';
import {
  ABOUT_US,
  ADVERTISING,
  CAREERS,
  CLASSIFIEDS,
  WWD_MAGIC,
  SUBSCRIBE_NEWSLETTER,
  PRIVACY_POLICY,
  CALIFORNIA_POLICY,
  EU_PRIVACY_POLICY,
  TERMS_OF_USE,
  DO_NOT_SELL,
  WWD_FAQ,
  DIGITAL_DAILY,
  LOGIN,
  LOGOUT,
  pushNotificationApplicationId,
  pushNotificationAccessToken,
  pushNotificationCloudSdkUrl,
  pushNotificationMembershipId,
  DEV_AUTH,
} from '../../service/config/serviceConstants';
import { connect } from 'react-redux';
import {
  readLoginFileStream,
  readSubscriptionFileStream,
  writeLoginFileStream,
  writeFileStream,
} from '../../helpers/rn_fetch_blob/createDirectory';

import { setJSONItem, asynStoreKeys, setItem, getItem } from '../../helpers/asyncStore';
import ClearSavedEditions from '../digitaldaily/ClearSavedEditions';
const { EUConsent, RNAdConsent } = NativeModules;

class MysettingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      //Heading style
      headerStyle: {
        backgroundColor: navigation.getParam('BackgroundColor', Colors.white),
      },
      headerTitle: () => (
        <HeaderLogoTitle
          accessible={true}
          accessibilityLabel={translate('settings')}
          testID={translate('settings')}
          navigationsany={navigation}
          title={translate('settings')}
        />
      ),
      //Heading text color
      headerTintColor: navigation.getParam('HeaderTintColor', Colors.headerTintColor),
      headerRight: (
        <TouchableOpacity
          style={styles.closeContainer}
          hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
          onPress={() => navigation.goBack(null)}
        >
          <Image
            accessible={true}
            accessibilityLabel="Close"
            testID="Close"
            style={styles.closeSettings}
            source={Images.close}
          />
        </TouchableOpacity>
      ),
      headerLeft: <TouchableOpacity style={styles.backContainer} />,
    };
  };

  constructor(props: any) {
    super(props);
    this.readData();
    this.state = {
      switchValue: false,
      loginData: '',
      subsData: '',
      loading: false,
      EUUser: false,
    };
  }

  readData = async () => {
    let data = await readLoginFileStream();
    let jsonData = JSON.parse(data);
    let subsdata = await readSubscriptionFileStream();
    let jsonSubsData = JSON.parse(subsdata);
    this.setState({
      loginData: jsonData,
      subsData: jsonSubsData,
    });
  };

  componentDidMount = async () => {
    handleAndroidBackButton(() => {
      this.handleBackPress();
    });
    if (Platform.OS === 'android') {
      let androidNotification = await NativeModules.SalesForcePushNotificationApi;
      await androidNotification.isPushEnable((value: any) => {
        this.setState({
          switchValue: value.isPushEnableNotification,
        });
      });
    } else {
      let pushNotificationAlert = await NativeModules.PushNotificationAlert;
      if ((await getItem(asynStoreKeys.iOSPNInitialStatus)) === null) {
        pushNotificationAlert.addEvent(
          pushNotificationApplicationId,
          pushNotificationAccessToken,
          pushNotificationCloudSdkUrl,
          pushNotificationMembershipId,
          (data) => {
            if (data) {
              pushNotificationAlert.setPushEnable('true');
            } else {
              pushNotificationAlert.setPushEnable('false');
            }
            this.setState({
              switchValue: data,
            });
          },
        );
        setItem(asynStoreKeys.iOSPNInitialStatus, 'false');
      } else {
        pushNotificationAlert.addEvent(
          pushNotificationApplicationId,
          pushNotificationAccessToken,
          pushNotificationCloudSdkUrl,
          pushNotificationMembershipId,
          (_data) => {
            // TODO: do something?
          },
        );
        pushNotificationAlert.isPushEnable((data) => {
          this.setState({
            switchValue: data,
          });
        });
      }
    }
    // check EU users
    if (Platform.OS === 'ios') {
      const isRequestLocationInEeaOrUnknown = await RNAdConsent.isRequestLocationInEeaOrUnknown();
      console.log('isRequestLocationInEeaOrUnknown', isRequestLocationInEeaOrUnknown);
      if (isRequestLocationInEeaOrUnknown) {
        this.setState({ EUUser: true });
      }
    } else {
      await EUConsent.getConsentStatus((res) => {
        if (res.status !== undefined && res.status !== null) {
          this.setState({
            EUUser: true,
          });
        }
      });
    }
  };

  handleBackPress = () => {
    this.props.navigation.goBack(null);
    return true;
  };

  componentWillUnmount = () => {
    removeAndroidBackButtonHandler();
  };

  toggleSwitch = async (value: any) => {
    if (Platform.OS === 'ios') {
      let pushNotificationAlert = await NativeModules.PushNotificationAlert;
      if ((await getItem(asynStoreKeys.iOSPNInitialStatus)) === null) {
        pushNotificationAlert.addEvent(
          pushNotificationApplicationId,
          pushNotificationAccessToken,
          pushNotificationCloudSdkUrl,
          pushNotificationMembershipId,
          (data) => {
            if (data) {
              pushNotificationAlert.setPushEnable('true');
            } else {
              pushNotificationAlert.setPushEnable('false');
            }
            this.setState({
              switchValue: data,
            });
          },
        );
        setItem(asynStoreKeys.iOSPNInitialStatus, 'false');
      } else if (value) {
        pushNotificationAlert.setPushEnable('true');
        this.setState({
          switchValue: value,
        });
      } else {
        pushNotificationAlert.setPushEnable('false');
        this.setState({
          switchValue: value,
        });
      }
    } else {
      let androidNotification = await NativeModules.SalesForcePushNotificationApi;
      if (value) {
        androidNotification.enableNotification();
      } else {
        androidNotification.disableNotification();
      }
      //onValueChange of the switch this function will be called
      this.setState({ switchValue: value });
    }
  };

  render() {
    const { loginData, subsData, EUUser }: any = this.state;
    const { navigation }: any = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View>
            {/* START of LogIn */}
            {/* Show if user is not subscribed */}
            {subsData === null ? (
              <ClickView
                style={styles.itemCell}
                onPress={() => {
                  if (loginData === null) {
                    navigation.navigate('login', { url: LOGIN, login: 'second' });
                  }
                  if (loginData != null) {
                    const sid =
                      loginData != null
                        ? loginData &&
                          loginData[DEV_AUTH] &&
                          loginData[DEV_AUTH].ses &&
                          loginData[DEV_AUTH].ses.sid
                        : null;
                    const logoutUrl = LOGOUT + sid;
                    navigation.navigate('login', { url: logoutUrl });
                    let userData = null;
                    let savedData: any = [];
                    writeLoginFileStream(userData);
                    writeFileStream(savedData);
                    setJSONItem(asynStoreKeys.selectedCategory, null);

                    // Clear all Digital daily saved data
                    ClearSavedEditions();
                  }
                }}
              >
                <Text
                  accessible={true}
                  accessibilityLabel={translate('logIn')}
                  testID={translate('logIn')}
                  style={styles.text}
                >
                  {loginData === null ? translate('logIn') : translate('logOut')}
                </Text>
                <Image style={styles.nextIcon} source={Images.arrowLeft} />
              </ClickView>
            ) : null}

            <View style={styles.dividerLine} />
            {/* END of LogIn */}

            {/* START of For You header */}
            <View style={styles.headerCell}>
              <Text
                accessible={true}
                accessibilityLabel={translate('forYou')}
                testID={translate('forYou')}
                style={styles.headerText}
              >
                {translate('forYou')}
              </Text>
            </View>
            {/* END of For You header */}
            {/* START of Push Notifications */}
            <ClickView
              style={styles.itemCell}
              onPress={() => {
                this.toggleSwitch(!this.state.switchValue);
              }}
            >
              <Text
                accessible={true}
                accessibilityLabel={translate('pushNotification')}
                testID={translate('pushNotification')}
                style={styles.text}
              >
                {translate('pushNotification')}
              </Text>
              <Switch
                accessible={true}
                onValueChange={this.toggleSwitch}
                accessibilityLabel={translate('pushNotification')}
                testID={translate('pushNotification')}
                value={this.state.switchValue}
              />
            </ClickView>
            <View style={styles.dividerLine} />
            {/* END of Push Notifications */}
            {/* START of Customize my feed */}
            <ClickView
              style={styles.itemCell}
              onPress={() => {
                this.props.onShowCustomizeCategory(true);
                this.props.forYouTabIndex(0);
                this.props.navigation.navigate('ForYou');
              }}
            >
              <Text
                accessible={true}
                accessibilityLabel={translate('customizeFeed')}
                testID={translate('customizeFeed')}
                style={styles.text}
              >
                {translate('customizeFeed')}
              </Text>
              <Image style={styles.nextIcon} source={Images.arrowLeft} />
            </ClickView>
            <View style={styles.dividerLine} />
            {/* END of Customize my feed */}
            {/* START of saved Stories */}
            <ClickView
              style={styles.itemCell}
              onPress={() => {
                this.props.forYouTabIndex(1);
                this.props.navigation.navigate('ForYou');
              }}
            >
              <Text
                accessible={true}
                accessibilityLabel={translate('savedStories')}
                testID={translate('savedStories')}
                style={styles.text}
              >
                {translate('savedStories')}
              </Text>
              <Image style={styles.nextIcon} source={Images.arrowLeft} />
            </ClickView>
            <View style={styles.dividerLine} />
            {/* END of saved Stories */}

            {/* START of WWD header */}
            <View style={styles.headerCell}>
              <Text
                accessible={true}
                accessibilityLabel={translate('WWD')}
                testID={translate('WWD')}
                style={styles.headerText}
              >
                {translate('WWD')}
              </Text>
            </View>
            {/* END of WWD header */}
            {/* START of About us */}
            <ClickView
              style={styles.itemCell}
              onPress={() =>
                this.props.navigation.navigate('SettingsWeb', {
                  url: ABOUT_US,
                })
              }
            >
              <Text
                accessible={true}
                accessibilityLabel={translate('aboutUs')}
                testID={translate('aboutUs')}
                style={styles.text}
              >
                {translate('aboutUs')}
              </Text>
              <Image style={styles.nextIcon} source={Images.arrowLeft} />
            </ClickView>
            <View style={styles.dividerLine} />
            {/* END of About us */}
            {/* START of Advertising */}
            <ClickView
              style={styles.itemCell}
              onPress={() => {
                this.props.navigation.navigate('SettingsWeb', {
                  url: ADVERTISING,
                });
              }}
            >
              <Text
                accessible={true}
                accessibilityLabel={translate('advertising')}
                testID={translate('advertising')}
                style={styles.text}
              >
                {translate('advertising')}
              </Text>
              <Image style={styles.nextIcon} source={Images.arrowLeft} />
            </ClickView>
            <View style={styles.dividerLine} />
            {/* END of Advertising */}
            {/* START of Carrers */}
            <ClickView
              style={styles.itemCell}
              onPress={() => {
                this.props.navigation.navigate('SettingsWeb', {
                  url: CAREERS,
                });
              }}
            >
              <Text
                accessible={true}
                accessibilityLabel={translate('careers')}
                testID={translate('careers')}
                style={styles.text}
              >
                {translate('careers')}
              </Text>
              <Image style={styles.nextIcon} source={Images.arrowLeft} />
            </ClickView>
            <View style={styles.dividerLine} />
            {/* END of Carrers */}
            {/* START of Classifieds */}
            <ClickView
              style={styles.itemCell}
              onPress={() => {
                this.props.navigation.navigate('SettingsWeb', {
                  url: CLASSIFIEDS,
                });
              }}
            >
              <Text
                accessible={true}
                accessibilityLabel={translate('classifieds')}
                testID={translate('classifieds')}
                style={styles.text}
              >
                {translate('classifieds')}
              </Text>
              <Image style={styles.nextIcon} source={Images.arrowLeft} />
            </ClickView>
            <View style={styles.dividerLine} />
            {/* END of Classifieds */}
            {/* START of WWD Magic */}
            <ClickView
              style={styles.itemCell}
              onPress={() => {
                this.props.navigation.navigate('SettingsWeb', {
                  url: WWD_MAGIC,
                });
              }}
            >
              <Text
                accessible={true}
                accessibilityLabel={translate('wwdMagic')}
                testID={translate('wwdMagic')}
                style={styles.text}
              >
                {translate('wwdMagic')}
              </Text>
              <Image style={styles.nextIcon} source={Images.arrowLeft} />
            </ClickView>
            <View style={styles.dividerLine} />
            {/* END of WWD Magic */}
            {/* START of Subscribe */}
            {subsData === null && loginData === null ? (
              <ClickView
                style={styles.itemCell}
                onPress={() => {
                  this.props.navigation.navigate('subscription', {
                    login: 'second',
                  });
                }}
              >
                <Text
                  accessible={true}
                  accessibilityLabel={translate('subscribe')}
                  testID={translate('subscribe')}
                  style={styles.text}
                >
                  {translate('subscribe')}
                </Text>
                <Image style={styles.nextIcon} source={Images.arrowLeft} />
              </ClickView>
            ) : null}

            {subsData === null && loginData === null ? <View style={styles.dividerLine} /> : null}

            {/* END of Subscribe */}
            {/* START of Subscribe Newsletter */}
            <ClickView
              style={styles.itemCell}
              onPress={() =>
                this.props.navigation.navigate('SettingsWeb', {
                  url: SUBSCRIBE_NEWSLETTER,
                })
              }
            >
              <Text
                accessible={true}
                accessibilityLabel={translate('subscribeNewsletter')}
                testID={translate('subscribeNewsletter')}
                style={styles.text}
              >
                {translate('subscribeNewsletter')}
              </Text>
              <Image style={styles.nextIcon} source={Images.arrowLeft} />
            </ClickView>
            <View style={styles.dividerLine} />
            {/* END of Subscribe Newsletter */}

            {/* START of Legal header */}
            <View style={styles.headerCell}>
              <Text
                accessible={true}
                accessibilityLabel={translate('legal')}
                testID={translate('legal')}
                style={styles.headerText}
              >
                {translate('legal')}
              </Text>
            </View>
            {/* END of Legal header */}
            {/* START of Privacy Policy */}
            <ClickView
              style={styles.itemCell}
              onPress={() => {
                this.props.navigation.navigate('SettingsWeb', {
                  url: PRIVACY_POLICY,
                });
              }}
            >
              <Text
                accessible={true}
                accessibilityLabel={translate('privacyPolicy')}
                testID={translate('privacyPolicy')}
                style={styles.text}
              >
                {translate('privacyPolicy')}
              </Text>
              <Image style={styles.nextIcon} source={Images.arrowLeft} />
            </ClickView>
            <View style={styles.dividerLine} />
            {/* END of Privacy Policy */}
            {/* START of Your California */}
            <ClickView
              style={styles.itemCell}
              onPress={() => {
                this.props.navigation.navigate('SettingsWeb', {
                  url: CALIFORNIA_POLICY,
                });
              }}
            >
              <Text
                accessible={true}
                accessibilityLabel={translate('yourCalifornia')}
                testID={translate('yourCalifornia')}
                style={styles.text}
              >
                {translate('yourCalifornia')}
              </Text>
              <Image style={styles.nextIcon} source={Images.arrowLeft} />
            </ClickView>
            <View style={styles.dividerLine} />
            {/* END of Your California */}
            {/* START of Ad Choices */}
            {/* <ClickView
              style={styles.itemCell}
              onPress={() => {
                this.props.navigation.navigate('SettingsWeb', {
                  url: AD_CHOICE,
                });
              }}>
              <Text
                accessible={true}
                accessibilityLabel={translate('adChoices')}
                testID={translate('adChoices')}
                style={styles.text}>
                {translate('adChoices')}
              </Text>
              <Image style={styles.nextIcon} source={Images.arrowLeft} />
            </ClickView>
            <View style={styles.dividerLine} /> */}
            {/* END of Ad Choices */}
            {/* START of EU Privacy */}
            <ClickView
              style={styles.itemCell}
              onPress={() => {
                if (EUUser) {
                  this.props.navigation.navigate('GDPRConsent');
                } else {
                  this.props.navigation.navigate('SettingsWeb', {
                    url: EU_PRIVACY_POLICY,
                  });
                }
              }}
            >
              <Text
                accessible={true}
                accessibilityLabel={translate('euPrivacy')}
                testID={translate('euPrivacy')}
                style={styles.text}
              >
                {translate('euPrivacy')}
              </Text>
              <Image style={styles.nextIcon} source={Images.arrowLeft} />
            </ClickView>
            <View style={styles.dividerLine} />
            {/* END of EU Privacy */}
            {/* START of termsOfuse */}
            <ClickView
              style={styles.itemCell}
              onPress={() => {
                this.props.navigation.navigate('SettingsWeb', {
                  url: TERMS_OF_USE,
                });
              }}
            >
              <Text
                accessible={true}
                accessibilityLabel={translate('termsOfuse')}
                testID={translate('termsOfuse')}
                style={styles.text}
              >
                {translate('termsOfuse')}
              </Text>
              <Image style={styles.nextIcon} source={Images.arrowLeft} />
            </ClickView>
            <View style={styles.dividerLine} />
            {/* END of termsOfuse */}
            {/* START of PMC Fashion */}
            {/* <ClickView
              style={styles.itemCell}
              onPress={() => {
                this.props.navigation.navigate('SettingsWeb', {
                  url: PMC_FASION,
                });
              }}>
              <Text
                accessible={true}
                accessibilityLabel={translate('pmcFashion')}
                testID={translate('pmcFashion')}
                style={styles.text}>
                {translate('pmcFashion')}
              </Text>
              <Image style={styles.nextIcon} source={Images.arrowLeft} />
            </ClickView>
            <View style={styles.dividerLine} /> */}
            {/* END of PMC Fashion */}
            {/* START of doNotSell */}
            <ClickView
              style={styles.itemCell}
              onPress={() => {
                this.props.navigation.navigate('SettingsWeb', {
                  url: DO_NOT_SELL,
                });
              }}
            >
              <Text
                accessible={true}
                accessibilityLabel={translate('doNotSell')}
                testID={translate('doNotSell')}
                style={styles.text}
              >
                {translate('doNotSell')}
              </Text>
              <Image style={styles.nextIcon} source={Images.arrowLeft} />
            </ClickView>
            <View style={styles.dividerLine} />
            {/* END of doNotSell */}

            {/* START of CustomerService header */}
            <View style={styles.headerCell}>
              <Text
                accessible={true}
                accessibilityLabel={translate('customerService')}
                testID={translate('customerService')}
                style={styles.headerText}
              >
                {translate('customerService')}
              </Text>
            </View>
            {/* END of Customer Service header */}
            {/* START of wwd FAQ */}
            <ClickView
              style={styles.itemCell}
              onPress={() => {
                this.props.navigation.navigate('SettingsWeb', {
                  url: WWD_FAQ,
                });
              }}
            >
              <Text
                accessible={true}
                accessibilityLabel={translate('wwdFaq')}
                testID={translate('wwdFaq')}
                style={styles.text}
              >
                {translate('wwdFaq')}
              </Text>
              <Image style={styles.nextIcon} source={Images.arrowLeft} />
            </ClickView>
            <View style={styles.dividerLine} />
            {/* END of wwd FAQ */}
            {/* START of Digital Daily */}
            <ClickView
              style={styles.itemCell}
              onPress={() => {
                this.props.navigation.navigate('SettingsWeb', {
                  url: DIGITAL_DAILY,
                });
              }}
            >
              <Text
                accessible={true}
                accessibilityLabel={translate('digitalDaily')}
                testID={translate('digitalDaily')}
                style={styles.text}
              >
                {translate('digitalDaily')}
              </Text>
              <Image style={styles.nextIcon} source={Images.arrowLeft} />
            </ClickView>
            <View style={styles.dividerLine} />
            {/* END of Digital Daily */}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  itemCell: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    paddingStart: moderateScale(16),
    paddingEnd: moderateScale(16),
  },
  text: {
    fontSize: moderateScale(16),
    fontFamily: FontFamily.fontFamilyMedium,
    color: Colors.black,
    textAlign: 'left',
    flex: 1,
  },
  nextIcon: {
    transform: [{ rotate: '180deg' }],
  },
  dividerLine: { height: 2, backgroundColor: '#e9e9e9' },
  headerCell: {
    height: 50,
    backgroundColor: Colors.dimBrown,
    justifyContent: 'center',
    paddingStart: moderateScale(16),
    paddingEnd: moderateScale(16),
  },
  headerText: {
    fontFamily: FontFamily.fontFamilyRegular,
    fontSize: moderateScale(12),
    textAlign: 'left',
    color: Colors.dimGrey,
  },

  backContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  backTitle: {
    height: moderateScale(12),
    width: moderateScale(52),
    color: Colors.activeTintColor,
    fontSize: moderateScale(10),
    lineHeight: moderateScale(12),
    textAlign: 'center',
  },
  closeContainer: {
    flex: 1,
    marginRight: moderateScale(10),
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  closeSettings: {
    marginRight: 5,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
});

const mapDispatchToProps = (dispatch: any) => ({
  forYouTabIndex: (data: any) => dispatch(forYouTabIndex(data)),
  onShowCustomizeCategory: (data: any) => dispatch(onShowCustomizeCategory(data)),
});

export default connect(null, mapDispatchToProps)(MysettingsScreen);
