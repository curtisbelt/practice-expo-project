import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import translate from '../../assets/strings/strings';
import { verticalScale, moderateScale, horizontalScale } from '../../helpers/scale';
import FontFamily from '../../assets/fonts/fonts';
import Colors from '../../constants/colors/colors';
import { parentEnabled, childEnabled } from '../../../appConfig';
import automationStaticLables from '../../constants/automationStaticLables';

export interface Props {
  onPress: Function;
  style: any;
  buttonStyle: any;
  errorText: String;
  textStyle: any;
}

const EmptyComponent = (props: any) => {
  const { onPress, style, buttonStyle, errorText, title, textStyle } = props;
  return (
    <View style={[styles.container, style]} accessible={parentEnabled}>
      <Text
        accessible={childEnabled}
        accessibilityLabel={automationStaticLables.tryAgain}
        testID={automationStaticLables.tryAgain}
        style={[styles.tryAgain, textStyle]}
      >
        {errorText}
      </Text>
      <TouchableOpacity
        onPress={onPress}
        accessible={parentEnabled}
        style={[styles.button, buttonStyle]}
      >
        <Text
          accessible={childEnabled}
          accessibilityLabel={automationStaticLables.refresh}
          testID={automationStaticLables.refresh}
          style={styles.refresh}
        >
          {title === undefined ? translate('refresh') : title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: verticalScale(250),
  },
  tryAgain: {
    fontSize: moderateScale(16),
    fontFamily: FontFamily.fontFamilyRegular,
    color: Colors.black,
  },
  button: {
    width: horizontalScale(100),
    height: verticalScale(30),
    borderRadius: moderateScale(2),
    backgroundColor: Colors.red,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(5),
  },
  refresh: {
    textAlign: 'center',
    color: Colors.white,
    fontFamily: FontFamily.fontFamilyBold,
  },
});

export default EmptyComponent;
