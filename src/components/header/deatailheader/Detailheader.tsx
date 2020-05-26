import React, { Component } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Images } from '../../../assets/images';
import { horizontalScale, moderateScale, verticalScale } from '../../../helpers/scale';
import { parentEnabled, childEnabled } from '../../../../appConfig';

export default class Detailheader extends Component {
  render() {
    const { onBack, onPressSizeFormatter, onPressLogo } = this.props;
    return (
      <View accessible={parentEnabled} style={styles.container}>
        <TouchableOpacity accessible={childEnabled} onPress={onBack} style={styles.leftContainer}>
          <Image
            accessible={childEnabled}
            accessibilityLabel="Back"
            testID="Back"
            source={Images.backArrow}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.centerContainer}
          accessible={parentEnabled}
          onPress={onPressLogo}
        >
          <Image
            accessible={childEnabled}
            accessibilityLabel="WWD"
            testID="WWD"
            source={Images.headerLogo}
            style={styles.headerLogo}
          />
        </TouchableOpacity>
        <TouchableOpacity
          accessible={parentEnabled}
          onPress={onPressSizeFormatter}
          style={styles.rightContainer}
        >
          <Image
            accessible={childEnabled}
            accessibilityLabel="Text sizer"
            testID="Text sizer"
            source={Images.sizeFormatter}
            style={styles.textSizer}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: verticalScale(25),
    paddingBottom: verticalScale(10),
    width: horizontalScale(375),
    // height: verticalScale(87),
    borderBottomWidth: 1,
    borderColor: 'rgba(216,216,216,0.5)',
    paddingHorizontal: horizontalScale(13),
    // marginTop: Platform.OS === 'ios' ? verticalScale(20) : 0,
  },
  headerLogo: {
    height: moderateScale(29),
    width: moderateScale(99),
  },
  textSizer: {
    height: moderateScale(20),
    width: moderateScale(30),
    alignItems: 'center',
  },
  leftContainer: {
    flex: 0.3,
    padding: verticalScale(10),
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    //alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  rightContainer: {
    flex: 0.3,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: verticalScale(10),
  },
});
