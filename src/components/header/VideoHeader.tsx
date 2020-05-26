import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import translate from '../../assets/strings/strings';
import { horizontalScale, moderateScale } from '../../helpers/scale';
import { Images } from '../../assets/images';
import FontFamily from '../../assets/fonts/fonts';
import Colors from '../../constants/colors/colors';
import { parentEnabled, childEnabled } from '../../../appConfig';
import automationStaticLables from '../../constants/automationStaticLables';

export interface Props {
  onBack: Function;
}

const VideoHeader = (props: any) => {
  const { onBack }: any = props;
  return (
    <View accessible={parentEnabled} style={styles.container}>
      <TouchableOpacity accessible={childEnabled} onPress={onBack} style={styles.backImgStyle}>
        <Image
          accessible={childEnabled}
          accessibilityLabel={automationStaticLables.back}
          testID={automationStaticLables.back}
          source={Images.backArrow}
        />
      </TouchableOpacity>
      <View accessible={childEnabled}>
        <Text
          accessible={childEnabled}
          accessibilityLabel={automationStaticLables.videos}
          testID={automationStaticLables.videos}
          style={styles.videoText}
        >
          {translate('videos')}
        </Text>
      </View>
      <View />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: moderateScale(60),
    width: horizontalScale(375),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: horizontalScale(14),
    borderBottomWidth: 1,
    borderColor: 'rgba(216,216,216,0.5)',
  },
  backImgStyle: {
    paddingVertical: 10,
    paddingRight: 10,
  },
  videoText: {
    fontSize: moderateScale(23),
    fontFamily: FontFamily.fontFamilyBold,
    color: Colors.black,
    textAlign: 'center',
  },
});

export default VideoHeader;
