import React from 'react';
import { View, StyleSheet } from 'react-native';
import HeaderLogoIcon from './HeaderLogoIcon';
import HeaderLeft from './HeaderLeft';
// import HeaderRight from './HeaderRight';
import Colors from '../../constants/colors/colors';
import { moderateScale } from '../../helpers/scale';

const TopBarHeader = (props: any) => {
  const { navigationany } = props;
  return (
    <View style={[styles.headerContainer]}>
      <View style={styles.leftContainer}>
        <HeaderLeft navigationsany={navigationany} />
      </View>
      <View style={styles.centerContainer}>
        <HeaderLogoIcon navigationsany={navigationany} />
      </View>
      <View style={styles.rightContainer}>
        {/* <HeaderRight navigationsany={navigationany} /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Colors.white,
    height: moderateScale(60),
    flexDirection: 'row',
    borderColor: Colors.lighterGrey,
    borderBottomWidth: moderateScale(0.5),
    //display: 'none',
  },
  leftContainer: { flex: 0.5, backgroundColor: Colors.white },
  centerContainer: { flex: 1 },
  rightContainer: { flex: 0.5, backgroundColor: Colors.white },
});

export default TopBarHeader;
