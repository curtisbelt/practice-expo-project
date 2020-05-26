import React from 'react';
//import react in our code.
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  NativeModules,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { setPNotificationBRNewsStatus } from '../../redux/actions/HomeAction';
//import all the basic component we have used
import HeaderLogoTitle from '../../components/header/HeaderLogoTitle';
import translate from '../../assets/strings/strings';
import { moderateScale } from '../../helpers/scale';
import FontFamily from '../../assets/fonts/fonts';
import { parentEnabled, childEnabled } from '../../../appConfig';
import Colors from '../../constants/colors/colors';
import {
  handleAndroidBackButton,
  removeAndroidBackButtonHandler,
} from '../../helpers/androidBackButton';
import { setJSONItem, asynStoreKeys } from '../../helpers/asyncStore';
class EditNotifications extends React.Component {
  constructor(props: any) {
    super(props);
    // alert(this.props.pnBRNewsStatus);
    this.state = {
      switchValue: this.props.pnBRNewsStatus,
      pushNotification: ' Off',
      pushNotificationTab: 'show',
    };
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
      headerRight: <TouchableOpacity style={styles.closeContainer} />,
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

  async ComponentWillMount() {
    handleAndroidBackButton(() => {
      if (this.props.navigation !== null) {
        this.props.navigation.goBack(null);
        return true;
      }
      return false;
    });
  }
  async UNSAFE_componentWillReceiveProps(nextProps: any) {
    let { pnBRNewsStatus }: any = this.props;
    if (pnBRNewsStatus !== nextProps.pnBRNewsStatus) {
      this.setState({
        switchValue: nextProps.pnBRNewsStatus,
      });
    }
  }
  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }
  toggleSwitch = async (value: any) => {
    //onValueChange of the switch this function will be called
    //this.setState({switchValue: value});

    this.props.setPNotificationBRNewsStatus(value);
    //state changes according to switch
    if (value) {
      this.setState({ pushNotification: 'On' });
      let data = {
        status: true,
      };
      if (Platform.OS === 'ios') {
        let pushNotificationAlert = await NativeModules.PushNotificationAlert;
        pushNotificationAlert.setPushEnable('true');
      } else {
        let androidNotification = await NativeModules.SalesForcePushNotificationApi;
        androidNotification.enableNotification();
      }
      await setJSONItem(asynStoreKeys.PN_BN_Status, data);
    } else {
      this.setState({ pushNotification: 'Off' });
      let data = {
        status: false,
      };
      if (Platform.OS === 'ios') {
        let pushNotificationAlert = await NativeModules.PushNotificationAlert;
        pushNotificationAlert.setPushEnable('false');
      } else {
        let androidNotification = await NativeModules.SalesForcePushNotificationApi;
        androidNotification.disableNotification();
      }
      await setJSONItem(asynStoreKeys.PN_BN_Status, data);
    }
  };
  renderBreackingNewAlert = () => {
    let { switchValue, pushNotification }: any = this.state;
    return (
      <View accessible={parentEnabled} style={styles.pushNotificationsView}>
        <View accessible={parentEnabled} style={styles.pNSubView}>
          <Text
            accessible={childEnabled}
            accessibilityLabel="Breaking News Alerts"
            testID="Breaking News Alerts"
            style={{
              color: Colors.black,
              fontFamily: FontFamily.fontFamilyBold,
              fontSize: moderateScale(20),
              paddingBottom: moderateScale(5),
            }}
          >
            Breaking News Alerts
          </Text>
          <Text
            accessible={childEnabled}
            accessibilityLabel="Be the first to know the latest news"
            testID="Be the first to know the latest news"
            style={{
              color: Colors.black,
              fontFamily: FontFamily.fontFamilyRegular,
              fontSize: moderateScale(16),
            }}
          >
            Be the first to know the latest news
          </Text>
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
  render() {
    return (
      <View style={styles.container}>
        <View style={{ backgroundColor: Colors.snow }}>
          <View
            accessible={parentEnabled}
            style={{
              backgroundColor: Colors.snow,
              margin: moderateScale(18),
            }}
          >
            <Text
              accessible={childEnabled}
              accessibilityLabel="Enable Your Push Notification"
              testID="Enable Your Push Notification"
              style={{
                color: Colors.black,
                fontFamily: FontFamily.fontFamilyBold,
                fontSize: moderateScale(16),
                paddingBottom: moderateScale(3),
              }}
            >
              Enable Your Push Notification
            </Text>
            <Text
              accessible={childEnabled}
              accessibilityLabel="Stay up to date with your custom notifications on your favorite
              topics"
              testID="Stay up to date with your custom notifications on your favorite
              topics"
              style={{
                color: Colors.black,
                fontFamily: FontFamily.fontFamilyRegular,
                fontSize: moderateScale(16),
              }}
            >
              Stay up to date with your custom notifications on your favorite topics
            </Text>
          </View>

          <View>{this.renderBreackingNewAlert()}</View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.snow,
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
  closeContainer: {
    flex: 1,
    marginRight: moderateScale(10),
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  //
  pushNotificationsView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: Colors.snow,
  },
  pNSubView: {
    flex: 1,
    justifyContent: 'center',
    margin: moderateScale(16),
    backgroundColor: Colors.snow,
  },

  pNSubView2SwitchView: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    margin: moderateScale(16),
    backgroundColor: Colors.snow,
  },
});
const mapDispatchToProps = (dispatch: any) => ({
  setPNotificationBRNewsStatus: (data: any) => dispatch(setPNotificationBRNewsStatus(data)),
});

const mapStateToProps = (state: any) => ({
  pnBRNewsStatus: state.home.pn_br_new_status,
});

export default connect(mapStateToProps, mapDispatchToProps)(EditNotifications);
