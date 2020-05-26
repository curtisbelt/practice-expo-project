import React from 'react';
//import react in our code.
import { Text, StyleSheet, View } from 'react-native';
//import all the basic component we have used
import FontFamily from '../../assets/fonts/fonts';
import Colors from '../../constants/colors/colors';
import { moderateScale } from '../../helpers/scale';

const HeaderLogoTitle = (props: any) => {
  const { title } = props;
  return (
    <View style={styles.logoContainer}>
      <Text accessible={true} accessibilityLabel={title} testID={title} style={styles.logoTitle}>
        {title}
      </Text>
    </View>
  );
};
export default HeaderLogoTitle;
const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  logoTitle: {
    height: moderateScale(24),
    color: Colors.black,
    fontSize: moderateScale(23),
    fontWeight: 'bold',
    letterSpacing: moderateScale(0.72),
    lineHeight: moderateScale(24),
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
    fontFamily: FontFamily.fontFamilyBold,
  },
});
