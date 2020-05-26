import React from 'react';
//import react in our code.
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  ScrollView,
  RefreshControl,
  Platform,
  NativeModules,
} from 'react-native';
//import all the basic component we have used
import { connect } from 'react-redux';
import {
  setPNotificationStatus,
  closePNotificationStatus,
  setPNotificationBRNewsStatus,
} from '../../redux/actions/HomeAction';
import HeaderLogoTitle from '../../components/header/HeaderLogoTitle';
import translate from '../../assets/strings/strings';
import Colors from '../../constants/colors/colors';
import { moderateScale, horizontalScale, verticalScale } from '../../helpers/scale';
import { Images } from '../../assets/images';
import FontFamily from '../../assets/fonts/fonts';
import { parentEnabled, childEnabled } from '../../../appConfig';
import { getDays } from '../../helpers/dateTimeFormats';
import ActivityIndicator from '../../components/widgets/ActivityIndicator';
import DATA from './PNSampleData';
import {
  setJSONItem,
  getJSONItem,
  asynStoreKeys,
  setItem,
  getItem,
} from '../../helpers/asyncStore';
import NetInfo from '@react-native-community/netinfo';
import EmptyComponent from '../../components/widgets/EmptyComponent';

import {
  pushNotificationApplicationId,
  pushNotificationAccessToken,
  pushNotificationCloudSdkUrl,
  pushNotificationMembershipId,
} from '../../service/config/serviceConstants';
import {
  handleAndroidBackButton,
  removeAndroidBackButtonHandler,
} from '../../helpers/androidBackButton';
class MyNotifications extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      switchValue: false,
      pushNotification: ' Off',
      pushNotificationTab: 'show',
      PNData: DATA,
      pnStatus: false,
      loadingData: true,
      pullToRefresh: false,
      BNStatus: false,
      isConnected: false,
      isNetworkIssue: false,
    };
    NetInfo.fetch().then((state) => {
      this.setState({
        isConnected: state.isConnected,
      });
    });
  }

  static navigationOptions = ({ navigation }: any) => {
    return {
      //Heading style
      headerStyle: {
        backgroundColor: navigation.getParam('BackgroundColor', Colors.white),
      },
      headerTitle: () => (
        <HeaderLogoTitle
          accessible={true}
          accessibilityLabel={translate('notifications')}
          testID={translate('notifications')}
          navigationsany={navigation}
          title={translate('notifications')}
        />
      ),
      //Heading text color
      headerTintColor: navigation.getParam('HeaderTintColor', Colors.headerTintColor),
      headerRight: (
        <TouchableOpacity
          disabled={navigation.getParam('isDisable', true)}
          style={styles.editSettingsContainer}
          onPress={() => navigation.navigate('EditNotifications')}
        >
          <Text
            accessible={true}
            accessibilityLabel="Edit settings"
            testID="Edit settings"
            style={styles.editSettings}
          >
            {navigation.getParam('isDisable', true) ? '' : 'Edit Settings'}
          </Text>
        </TouchableOpacity>
      ),
      headerLeft: (
        <TouchableOpacity style={styles.backContainer} onPress={() => navigation.goBack(null)}>
          <Image
            accessible={true}
            accessibilityLabel="Back button"
            testID="back button"
            source={require('../../assets/images/home/top_bar_icons/arrow.png')}
            style={styles.backImage}
          />
        </TouchableOpacity>
      ),
    };
  };

  async componentDidMount() {
    /* use this code when notifications working */
    let { navigation }: any = this.props;
    await NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        // TODO: was something suppose to happen here?
      }
      this.setState({ isConnected: state.isConnected });
    });
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
              this.setState({
                pnStatus: false,
                loadingData: false,
              });
              navigation.setParams({
                isDisable: false,
              });
              this.props.setPNotificationBRNewsStatus(true);
            } else {
              console.log('if data is2: ' + data);
              pushNotificationAlert.setPushEnable('false');
              this.setState({
                pnStatus: true,
                loadingData: false,
              });
              navigation.setParams({
                isDisable: true,
              });
              this.props.setPNotificationBRNewsStatus(false);
              // this.setNotification();
            }
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

        pushNotificationAlert.isPushEnable((value: any) => {
          if (value) {
            this.setState({
              pnStatus: false,
              loadingData: false,
            });
            navigation.setParams({
              isDisable: false,
            });
            this.props.setPNotificationBRNewsStatus(true);
          } else {
            this.setNotification();
          }
        });
      }
    } else {
      let androidNotification = await NativeModules.SalesForcePushNotificationApi;
      await androidNotification.isPushEnable((value: any) => {
        if (value.isPushEnableNotification) {
          this.setState({
            pnStatus: false,
            loadingData: false,
          });
          navigation.setParams({
            isDisable: false,
          });
          this.props.setPNotificationBRNewsStatus(true);
        } else {
          this.setNotification();
        }
      });
    }

    handleAndroidBackButton(() => {
      this.handleBackPress();
    });
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }

  handleBackPress = () => {
    this.props.navigation.goBack(null);
    return true;
  };

  setNotification = async () => {
    let { navigation }: any = this.props;
    let data = await getJSONItem(asynStoreKeys.PN_Status);
    if (data !== null) {
      data = JSON.parse(data);
      let status = data.statusDate !== null ? getDays(data.statusDate) : false;

      if (status) {
        navigation.setParams({
          isDisable: status,
        });

        this.setState({
          loadingData: false,
          pnStatus: true,
        });
      } else {
        navigation.setParams({
          isDisable: true,
        });
        this.setState({
          loadingData: false,
          pnStatus: false,
        });
      }
    } else {
      navigation.setParams({ isDisable: true });
      this.setState({
        loadingData: false,
        pnStatus: true,
      });
      this.props.setPNotificationBRNewsStatus(false);
    }
  };

  async UNSAFE_componentWillReceiveProps(nextProps: any) {
    let { pnEDSStatus, navigation, pnStatus }: any = this.props;
    if (pnEDSStatus !== nextProps.pnEDSStatus) {
      navigation.setParams({
        isDisable: nextProps.pnEDSStatus,
      });
    }
    if (pnStatus !== nextProps.pnStatus) {
      navigation.setParams({
        isDisable: nextProps.pnStatus === 'show' ? false : true,
      });
    }
  }

  toggleSwitch = async (value: any) => {
    let { setPNotificationData }: any = this.props;
    //onValueChange of the switch this function will be called
    this.setState({ switchValue: value });
    //state changes according to switch
    this.props.setPNotificationBRNewsStatus(value);
    if (value) {
      this.setState({ pushNotification: 'On' });
      let data = {
        status: 'show',
        closeStatus: 'hide',
        statusDate: null,
        statusEdit: false,
      };
      this.setState({
        pnStatus: false,
      });
      if (Platform.OS === 'ios') {
        let pushNotificationAlert = await NativeModules.PushNotificationAlert;
        pushNotificationAlert.setPushEnable('true');
      } else {
        let androidNotification = await NativeModules.SalesForcePushNotificationApi;
        androidNotification.enableNotification();
      }
      setPNotificationData(data);
    } else {
      this.setState({ pushNotification: 'Off' });
      let data = {
        status: 'hide',
        statusEdit: true,
      };
      this.setState({
        pnStatus: true,
      });

      if (Platform.OS === 'ios') {
        let pushNotificationAlert = await NativeModules.PushNotificationAlert;
        pushNotificationAlert.setPushEnable('false');
      } else {
        let androidNotification = await NativeModules.SalesForcePushNotificationApi;
        androidNotification.disableNotification();
      }

      setPNotificationData(data);
    }
  };

  markedAllRed = () => {
    const array = [...this.state.PNData];
    array.map((value) => {
      value.data.map((subValue: any) => {
        subValue.read = true;
      });
    });
    this.setState(() => {
      return {
        PNData: array,
      };
    });
  };

  renderPushNotificationTab = () => {
    let { switchValue, pushNotification }: any = this.state;
    let { closePNotificationData }: any = this.props;
    return (
      <View accessible={parentEnabled} style={styles.pushNotificationsView}>
        <View accessible={parentEnabled} style={styles.pNSubView}>
          <View accessible={parentEnabled} style={{ marginTop: moderateScale(10) }}>
            <View accessible={parentEnabled} style={styles.pNSubView1}>
              <TouchableOpacity
                accessible={parentEnabled}
                style={styles.pNSubView1CloseIconView}
                onPress={async () => {
                  let data = {
                    status: 'hide',
                    statusDate: new Date().toString(),
                    statusEdit: true,
                  };
                  this.setState({
                    pnStatus: false,
                  });
                  closePNotificationData(data);
                  await setJSONItem(asynStoreKeys.PN_Status, data);
                }}
              >
                <Image
                  accessible={childEnabled}
                  accessibilityLabel="Close Icon"
                  testID="Close Icon"
                  source={Images.close}
                />
              </TouchableOpacity>
              <View accessible={parentEnabled} style={styles.pNSubView1TxtView}>
                <Text
                  accessible={childEnabled}
                  accessibilityLabel="Turn on Push Notifications"
                  testID="Turn on Push Notifications"
                  style={{
                    color: Colors.black,
                    fontFamily: FontFamily.fontFamilyBold,
                    fontSize: moderateScale(18),
                  }}
                >
                  Turn on Push Notifications
                </Text>
              </View>
            </View>
            <View accessible={parentEnabled} style={styles.pNSubView2}>
              <View accessible={parentEnabled} style={styles.pNSubView2TxtView}>
                <Text
                  accessible={childEnabled}
                  accessibilityLabel="Stay up to date with your custom notifications on your favorite topics"
                  testID="Stay up to date with your custom notifications on your favorite topics"
                  style={{
                    color: Colors.matterhorn,
                    fontFamily: FontFamily.fontFamilyRegular,
                    fontSize: moderateScale(13),
                  }}
                >
                  Stay up to date with your custom notifications on your favorite topics
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View accessible={parentEnabled} style={styles.pNSubView2SwitchView}>
          <Switch
            accessible={childEnabled}
            style={{ height: moderateScale(24) }}
            onValueChange={this.toggleSwitch}
            accessibilityLabel={pushNotification}
            testID={pushNotification}
            value={switchValue}
          />
        </View>
      </View>
    );
  };

  onRefresh = () => {
    this.setState({ pullToRefresh: false });
  };

  render() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    let { PNData, loadingData, pullToRefresh, pnStatus }: any = this.state;
    if (!this.state.isConnected) {
      return <EmptyComponent errorText={translate('internet_connection')} />;
    } else {
      return (
        <View style={styles.container}>
          {/* use this code when notifications working */}
          {!loadingData ? (
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={pullToRefresh}
                  onRefresh={() => {
                    this.onRefresh();
                  }}
                />
              }
              style={{ backgroundColor: Colors.white }}
              showsVerticalScrollIndicator={false}
            >
              {pnStatus ? this.renderPushNotificationTab() : null}

              <Text style={styles.emptyView}>No notifications at this time.</Text>
              {/* <NotificationsLayout
                PNData={PNData}
                {...this.props}
                markedAllRed={() => this.markedAllRed.bind(this)}
              /> */}
            </ScrollView>
          ) : (
            <ActivityIndicator />
          )}
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  textLable: {
    marginTop: moderateScale(50),
    fontSize: moderateScale(25),
  },
  backContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
    height: '60%',
  },

  backImage: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: moderateScale(10),
    marginRight: moderateScale(10),
  },
  editSettingsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
    height: '60%',
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
    marginTop: verticalScale(250),
    fontSize: moderateScale(16),
    fontFamily: FontFamily.fontFamilyRegular,
    color: Colors.black,
  },
  editSettings: {
    // height: moderateScale(12),
    marginRight: moderateScale(16),
    color: Colors.activeTintColor,
    fontSize: moderateScale(10),
    lineHeight: moderateScale(12),
    textAlign: 'auto',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  pushNotificationsView: {
    margin: moderateScale(5),
    backgroundColor: Colors.white,
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    height: moderateScale(98),
    flexDirection: 'row',
  },
  pNSubView: {
    flex: 1,
    flexDirection: 'row',
  },
  pNSubView1: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  pNSubView2: {
    flex: 1,
    justifyContent: 'flex-start',
    marginLeft: moderateScale(12),
    marginBottom: moderateScale(12),
  },
  pNSubView1CloseIconView: {
    alignItems: 'center',
    padding: horizontalScale(12),
  },
  pNSubView1TxtView: {
    flex: 1,
  },
  pNSubView2TxtView: {
    flex: 1,
  },
  pNSubView2SwitchView: {
    justifyContent: 'center',
    flex: 0.3,
    alignItems: 'center',
  },
});
const mapDispatchToProps = (dispatch: any) => ({
  setPNotificationData: (data: any) => dispatch(setPNotificationStatus(data)),
  closePNotificationData: (data: any) => dispatch(closePNotificationStatus(data)),
  setPNotificationBRNewsStatus: (data: any) => dispatch(setPNotificationBRNewsStatus(data)),
});

const mapStateToProps = (state: any) => ({
  pnStatus: state.sections.pn_status,
  pnCloseStatus: state.home.pn_close_status,
  pnCloseStatusDate: state.home.pn_close_status_date,
  pnEDSStatus: state.home.edit_settings,
});

export default connect(mapStateToProps, mapDispatchToProps)(MyNotifications);
