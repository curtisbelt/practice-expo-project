import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { parentEnabled, childEnabled } from '../../../appConfig';
import { horizontalScale, moderateScale } from '../../helpers/scale';
import translate from '../../assets/strings/strings';
import ClickView from './clickView';
import Colors from '../../constants/colors/colors';
import FontFamily from '../../assets/fonts/fonts';
import { LOGIN } from '../../service/config/serviceConstants';
import { withNavigation } from 'react-navigation';

class LoginSubsButton extends Component {
  render() {
    const { navigation }: any = this.props;
    return (
      <View>
        <View accessible={parentEnabled}>
          <Text
            accessible={childEnabled}
            accessibilityLabel={translate('continueReading')}
            testID={translate('continueReading')}
            style={styles.continueReading}
          >
            {translate('continueReading')}
          </Text>
          <Text
            accessible={childEnabled}
            accessibilityLabel={translate('subscribeWWD')}
            testID={translate('subscribeWWD')}
            style={styles.continueReading}
          >
            {translate('subscribeWWD')}
          </Text>
        </View>
        <View accessible={parentEnabled} style={styles.buttonView}>
          <ClickView
            accessible={parentEnabled}
            onPress={() => {
              navigation.navigate('subscription', { login: 'second' });
            }}
            style={styles.subscribeBtn}
          >
            <Text
              accessible={childEnabled}
              accessibilityLabel={translate('subscribeCaps')}
              testID={translate('subscribeCaps')}
              style={styles.subscribe}
            >
              {translate('subscribeCaps')}
            </Text>
          </ClickView>
          <ClickView
            accessible={parentEnabled}
            onPress={() => {
              navigation.navigate('login', { url: LOGIN, login: 'second' });
            }}
            style={styles.loginBtn}
          >
            <Text
              accessible={childEnabled}
              accessibilityLabel={translate('login')}
              testID={translate('login')}
              style={styles.login}
            >
              {translate('login')}
            </Text>
          </ClickView>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  continueReading: {
    fontSize: moderateScale(24),
    fontFamily: FontFamily.fontFamilyBold,
    color: Colors.black,
    textAlign: 'center',
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: moderateScale(14),
    marginHorizontal: horizontalScale(24),
  },
  subscribeBtn: {
    width: horizontalScale(154),
    height: moderateScale(44),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundRed,
    borderRadius: moderateScale(2),
  },
  loginBtn: {
    width: horizontalScale(154),
    height: moderateScale(44),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.black,
    borderRadius: moderateScale(2),
  },
  subscribe: {
    fontSize: moderateScale(15),
    fontFamily: FontFamily.fontFamilyBold,
    color: Colors.white,
  },
  login: {
    fontSize: moderateScale(15),
    fontFamily: FontFamily.fontFamilyBold,
    color: Colors.white,
  },
});
export default withNavigation(LoginSubsButton);
