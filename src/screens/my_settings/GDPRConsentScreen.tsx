import React, { Component } from 'react';
import { Text, View, Switch, StyleSheet, Image, NativeModules, Platform } from 'react-native';
import { Images } from '../../assets/images';
import { moderateScale, horizontalScale } from '../../helpers/scale';
import ClickView from '../../components/widgets/clickView';
import translate from '../../assets/strings/strings';
import FontFamily from '../../assets/fonts/fonts';
import Colors from '../../constants/colors/colors';
import { parentEnabled, childEnabled } from '../../../appConfig';
import { PUBLISHER_ID, EU_PRIVACY_STATUS } from '../../service/config/serviceConstants';
const { EUConsent, RNAdConsent } = NativeModules;

export default class GDPRConsentScreen extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      switchValue: false,
    };
  }

  componentDidMount = async () => {
    if (Platform.OS === 'android') {
      await EUConsent.getConsentStatus((response: any) => {
        if (response.status === EU_PRIVACY_STATUS.ANDROID_PERSONALIZED) {
          this.setState({ switchValue: true });
        }
        if (response.status === EU_PRIVACY_STATUS.ANDROID_NON_PERSONALISED) {
          this.setState({ switchValue: false });
        }
      });
    }
    if (Platform.OS === 'ios') {
      const consentStatus = await RNAdConsent.requestConsentInfoUpdate({
        publisherId: PUBLISHER_ID,
      });
      if (consentStatus === EU_PRIVACY_STATUS.IOS_PERSONALIZED) {
        this.setState({ switchValue: true });
      }
      if (consentStatus === EU_PRIVACY_STATUS.IOS_NON_PERSONALISED) {
        this.setState({ switchValue: false });
      }
    }
  };

  renderHeader = () => {
    return (
      <View accessible={parentEnabled} style={styles.headerView}>
        <ClickView
          onPress={() => {
            this.props.navigation.goBack();
          }}
          style={{ paddingVertical: 10, paddingRight: 10 }}
        >
          <Image
            accessible={childEnabled}
            accessibilityLabel="Back"
            testID="Back"
            source={Images.backArrow}
          />
        </ClickView>
        <Text
          accessible={childEnabled}
          accessibilityLabel={translate('euPrivacy')}
          testID={translate('euPrivacy')}
          style={styles.euPrivacy}
        >
          {translate('euPrivacy')}
        </Text>
        <View />
      </View>
    );
  };
  toggleSwitch = async () => {
    if (Platform.OS === 'ios') {
      const consentStatus = await RNAdConsent.requestConsentInfoUpdate({
        publisherId: PUBLISHER_ID,
      });
      if (consentStatus === EU_PRIVACY_STATUS.IOS_PERSONALIZED) {
        RNAdConsent.setConsentStatus(RNAdConsent.NON_PERSONALIZED);
        this.setState({ switchValue: false });
      }
      if (consentStatus === EU_PRIVACY_STATUS.IOS_NON_PERSONALISED) {
        RNAdConsent.setConsentStatus(RNAdConsent.PERSONALIZED);
        this.setState({ switchValue: true });
      }
    }
    if (Platform.OS === 'android') {
      await EUConsent.getConsentStatus(async (response: any) => {
        if (response.status === EU_PRIVACY_STATUS.ANDROID_PERSONALIZED) {
          await EUConsent.setConsentStatus('reject').then((responses: any) => {
            if (responses) {
              // this.props.navigation.goBack(null);
            }
          });
          this.setState({ switchValue: false });
        }
        if (response.status === EU_PRIVACY_STATUS.ANDROID_NON_PERSONALISED) {
          await EUConsent.setConsentStatus('accept').then((responses: any) => {
            if (responses) {
              // this.props.navigation.goBack(null);
            }
          });
          this.setState({ switchValue: true });
        }
      });
    }
  };

  renderBody = () => {
    const { switchValue }: any = this.state;
    const selectedText = switchValue ? translate('switchAccept') : translate('switchReject');
    return (
      <View accessible={parentEnabled}>
        <View style={styles.updatePreferencesView}>
          <Text
            accessible={childEnabled}
            accessibilityLabel={translate('updatePreferences')}
            testID={translate('updatePreferences')}
            style={styles.updatePreferences}
          >
            {translate('updatePreferences')}
          </Text>
        </View>
        <View style={styles.privacyDescView}>
          <Text
            accessible={childEnabled}
            accessibilityLabel={translate('privacyDescription')}
            testID={translate('privacyDescription')}
            style={styles.privacyDescription}
          >
            {translate('privacyDescription')}
          </Text>
        </View>
        <View>
          <View style={{ marginTop: moderateScale(13) }} />
          <View style={styles.consentView}>
            <Text
              accessible={childEnabled}
              accessibilityLabel={translate('GDPRConsent')}
              testID={translate('GDPRConsent')}
              style={styles.GDPRConsent}
            >
              {translate('GDPRConsent')}
            </Text>
            <View style={styles.subView}>
              <Text style={styles.selectedText}>{selectedText}</Text>
              <Switch
                accessible={true}
                onValueChange={this.toggleSwitch}
                accessibilityLabel={translate('pushNotification')}
                testID={translate('pushNotification')}
                value={this.state.switchValue}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <View style={styles.statusBar} />}
        {this.renderHeader()}
        {this.renderBody()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: { backgroundColor: Colors.whiteSmoke, flex: 1 },
  headerView: {
    width: horizontalScale(375),
    height: moderateScale(67),
    paddingHorizontal: moderateScale(15),
    justifyContent: 'space-between',
    paddingTop: moderateScale(20),
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'rgba(216,216,216,0.5)',
    backgroundColor: Colors.white,
  },
  euPrivacy: {
    fontSize: moderateScale(19),
    fontFamily: FontFamily.fontFamilyBold,
    color: Colors.black,
  },
  updatePreferencesView: {
    height: moderateScale(40),
    paddingLeft: moderateScale(15),
    alignSelf: 'flex-start',
    justifyContent: 'center',
    backgroundColor: Colors.whiteSmoke,
    width: '100%',
    paddingTop: moderateScale(10),
  },
  updatePreferences: {
    fontSize: moderateScale(12),
    fontFamily: FontFamily.fontFamilyRegular,
    color: Colors.dimGrey,
  },
  privacyDescView: {
    paddingTop: moderateScale(13),
    paddingLeft: moderateScale(15),
    paddingRight: moderateScale(18),
    backgroundColor: Colors.white,
    paddingBottom: moderateScale(17),
  },
  privacyDescription: {
    fontSize: moderateScale(15),
    fontFamily: FontFamily.fontFamilyRegular,
    color: Colors.black,
  },
  GDPRConsent: {
    fontSize: moderateScale(16),
    fontFamily: FontFamily.fontFamilyMedium,
    color: Colors.black,
  },
  statusBar: {
    backgroundColor: Colors.white,
    height: moderateScale(30),
    width: '100%',
    zIndex: 2,
  },
  selectedText: {
    fontSize: moderateScale(12),
    fontFamily: FontFamily.fontFamilyRegular,
    color: Colors.gray38,
    marginRight: moderateScale(14),
  },
  subView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  consentView: {
    backgroundColor: Colors.white,
    height: moderateScale(46),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(15),
  },
});
