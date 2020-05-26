import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { horizontalScale, moderateScale, verticalScale } from '../../../helpers/scale';
import Colors from '../../../constants/colors/colors';
import { Images } from '../../../assets/images';
import { parentEnabled, childEnabled } from '../../../../appConfig';
export default class GalleryHeader extends Component {
  render() {
    const { onBack, onBookmark, count, checkBookMark, showBookMark } = this.props;
    return (
      <View accessible={parentEnabled} style={styles.container}>
        <TouchableOpacity accessible={parentEnabled} style={styles.backView} onPress={onBack}>
          <Image
            accessible={childEnabled}
            accessibilityLabel="Back"
            testID="Back"
            source={Images.backArrow}
            style={styles.backImg}
          />
        </TouchableOpacity>
        <Text
          accessible={count}
          accessibilityLabel={'gallery image' + count}
          testID={'gallery image' + count}
          style={styles.text}
        >
          {count}
        </Text>
        <View accessible={parentEnabled} style={styles.imgView}>
          {showBookMark ? (
            <TouchableOpacity
              accessible={parentEnabled}
              style={styles.unBookmarkView}
              onPress={onBookmark}
            >
              <Image
                accessible={childEnabled}
                accessibilityLabel="bookmark"
                testID="bookmark"
                source={checkBookMark ? Images.bookmark : Images.unBookmark}
                style={styles.bookmarkIcon}
              />
            </TouchableOpacity>
          ) : null}
          {/* <TouchableOpacity accessible={parentEnabled} onPress={onShare}>
            <Image
              accessible={childEnabled}
              accessibilityLabel="share"
              testID="share"
              source={Images.share}
              style={styles.shareIcon}
            />
          </TouchableOpacity> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: horizontalScale(375),
    height: verticalScale(75),
    backgroundColor: Colors.black,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: verticalScale(51),
    paddingHorizontal: horizontalScale(13),
    paddingBottom: verticalScale(20),
    alignItems: 'center',
  },
  text: {
    fontSize: moderateScale(16),
    color: Colors.darkGrey,
    marginLeft: horizontalScale(40),
    paddingBottom: verticalScale(20),
  },
  backView: {
    height: moderateScale(27),
    width: moderateScale(27),
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: moderateScale(13.5),
    alignSelf: 'center',
    justifyContent: 'center',
    padding: verticalScale(10),
  },
  imgView: {
    flexDirection: 'row',
  },
  bookmarkIcon: {
    height: moderateScale(21),
    width: moderateScale(15),
    tintColor: Colors.white,
  },
  shareIcon: {
    height: moderateScale(22),
    width: moderateScale(23),
    tintColor: Colors.white,
  },
  unBookmarkView: {
    marginRight: horizontalScale(24),
  },
  backImg: { tintColor: Colors.white, alignSelf: 'center' },
});
