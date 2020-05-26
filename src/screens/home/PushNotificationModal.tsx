import React from 'react';
import {
  View,
  Platform,
  StyleSheet,
  SafeAreaView,
  Text,
  Dimensions,
  Image,
  NativeModules,
} from 'react-native';

// TODO: imports below are unused, commenting out instead of removing though, since I think this is part of incomplete notification logic
/*
import {
  pushNotificationApplicationId,
  pushNotificationAccessToken,
  pushNotificationSenderId,
  pushNotificationCloudSdkUrl,
  pushNotificationMembershipId,
} from '../../service/config/serviceConstants';
*/

import { Images } from '../../assets/index';
import FontFamily from '../../assets/fonts/fonts';
import ClickedView from '../../components/widgets/clickView';
import Colors from '../../constants/colors/colors';
import Modal from 'react-native-modal';
import { moderateScale } from '../../helpers/scale';
import translate from '../../assets/strings/strings';
import { asynStoreKeys, setItem, getItem } from '../../helpers/asyncStore';
import { parentEnabled, childEnabled } from '../../../appConfig';
import automationStaticLables from '../../constants/automationStaticLables';

class PushNotificationAlert extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { isModalVisible: false, token: '' };
  }

  componentDidMount = async () => {
    // Handling alert for enabling push notification only for the first time when users landed to home screen.
    const value = await getItem(asynStoreKeys.is_FirstTimeHomeScreen);
    const isPNActionPerformed = await getItem(asynStoreKeys.isPNActionPerformed);
    if (value == 'category') {
      this.setState({ isModalVisible: true });
    } else if (isPNActionPerformed === 'false') {
      this.setState({ isModalVisible: true });
    } else {
      this.setState({ isModalVisible: false });
    }
  };

  handleClose = () => {
    setItem(asynStoreKeys.isPNActionPerformed, 'true');
    if (Platform.OS === 'android') {
      let androidNotification = NativeModules.SalesForcePushNotificationApi;
      androidNotification.disableNotification();
    }
    this.setState({ isModalVisible: false });
  };

  render() {
    return (
      <SafeAreaView>
        <Modal
          isVisible={this.state.isModalVisible} //this.state.isModalVisible
          animationIn={'slideInLeft'}
          animationOut={'slideOutUp'}
          animationOutTiming={1300}
          deviceWidth={Dimensions.get('window').width}
          style={styles.modalLayout}
        >
          <SafeAreaView style={styles.modalInnerView} accessible={parentEnabled}>
            {/* START of close button */}
            <View style={styles.closeModal}>
              <ClickedView onPress={() => this.handleClose()}>
                <Image
                  source={Images.close}
                  accessible={childEnabled}
                  accessibilityLabel={automationStaticLables.close}
                  testID={automationStaticLables.close}
                />
              </ClickedView>
            </View>
            {/* END of close button */}
            {/* START of Notification header, titile and button */}
            <View style={styles.notificationAlertHeader} accessible={parentEnabled}>
              <View style={styles.headerSubSection}>
                <Image style={styles.pushNotificationIcon} source={Images.pushNotification} />
                <Text
                  style={styles.headerText}
                  accessible={childEnabled}
                  accessibilityRole={'text'}
                  accessibilityLabel={automationStaticLables.notificationAlertHeader}
                  testID={automationStaticLables.notificationAlertHeader}
                >
                  {translate('push_notification_header')}
                </Text>
              </View>

              <Text
                style={styles.titleText}
                accessible={childEnabled}
                accessibilityRole={'text'}
                accessibilityLabel={automationStaticLables.notificationAlertTitle}
                testID={automationStaticLables.notificationAlertTitle}
              >
                {translate('push_notification_title')}
              </Text>
              <ClickedView
                style={styles.buttonContainer}
                accessible={childEnabled}
                accessibilityRole={'close'}
                accessibilityLabel={automationStaticLables.turnOn}
                testID={automationStaticLables.turnOn}
                onPress={() => {
                  this.setState({ isModalVisible: false });
                  setItem(asynStoreKeys.isPNActionPerformed, 'true');
                  setItem(asynStoreKeys.iOSPNInitialStatus, 'false');
                  this.props.notificationPermissionCallBack();
                }}
              >
                <Text style={styles.buttonText}>TURN ON</Text>
              </ClickedView>
            </View>
            {/* END of Notification header, titile and button */}
          </SafeAreaView>
        </Modal>
        {/* END of notification alert */}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  modalLayout: {
    justifyContent: 'flex-start',
    marginTop: Platform.OS ? moderateScale(50) : moderateScale(5),
  },
  modalInnerView: {
    backgroundColor: 'white',
    height: moderateScale(160),
  },
  closeModal: {
    marginTop: moderateScale(10),
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginRight: moderateScale(10),
  },
  notificationAlertHeader: {
    marginTop: moderateScale(10),
    alignItems: 'center',
  },
  headerSubSection: {
    flexDirection: 'row',
  },
  pushNotificationIcon: {
    width: 29,
    height: 31,
  },
  headerText: {
    marginLeft: moderateScale(10),
    color: Colors.black,
    fontSize: moderateScale(23),
    fontFamily: FontFamily.fontFamilyBold,
    textAlign: 'center',
  },
  titleText: {
    textAlign: 'center',
    fontFamily: FontFamily.fontFamilyRegular,
    fontSize: moderateScale(15),
    color: Colors.black,
    marginTop: moderateScale(8),
  },
  buttonContainer: {
    backgroundColor: Colors.red,
    marginTop: moderateScale(8),
    height: 32,
    width: 145,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: moderateScale(15),
    fontFamily: FontFamily.fontFamilyBold,
    textAlign: 'center',
  },
});
export default PushNotificationAlert;
