/*
 * Filename: /Volumes/Development/Development Drive/WWC/Naomi_Frontend/src/components/header/deatailheader/GalleryHeader.tsx
 * Path: /Volumes/Development/Development Drive/WWC/Naomi_Frontend
 * Created Date: Thursday, February 18th 2020, 1:08:07 pm
 * Author: Shahistha S

 * Copyright (c) 2020 Penske
 */
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { horizontalScale, verticalScale, moderateScale } from '../../helpers/scale';
import Colors from '../../constants/colors/colors';
import { Images } from '../../assets/images';
import FontFamily from '../../assets/fonts/fonts';
import { parentEnabled, childEnabled, useStaticLable } from '../../../appConfig';
import automationStaticLables from '../../constants/automationStaticLables';

export interface Props {
  onBack: Function;
  onShare: Function;
  onBookmark: Function;
  collection: String;
  byline: String;
  accessible: any;
  accessibilityLabel: any;
  testID: any;
  showBookMark: any;
  checkBookMark: any;
}

const RunwayHeader = (props: any) => {
  const {
    onBack,
    // onShare,
    onBookmark,
    collection,
    byline,
    showBookMark,
    checkBookMark,
  } = props;
  return (
    <View accessible={parentEnabled} style={styles.container}>
      <TouchableOpacity accessible={parentEnabled} style={styles.backView} onPress={onBack}>
        <Image
          accessible={childEnabled}
          accessibilityLabel={automationStaticLables.back}
          testID={automationStaticLables.back}
          source={Images.backArrow}
          style={styles.backImg}
        />
      </TouchableOpacity>
      <View accessible={parentEnabled} style={styles.textView}>
        <View>
          <Text
            accessible={childEnabled}
            accessibilityLabel={
              useStaticLable ? automationStaticLables.runwayCollection : collection
            }
            testID={useStaticLable ? automationStaticLables.runwayCollection : collection}
            style={styles.collection}
          >
            {collection}
          </Text>
        </View>
        <View>
          <Text
            accessible={childEnabled}
            accessibilityLabel={useStaticLable ? automationStaticLables.runwaySeason : byline}
            testID={useStaticLable ? automationStaticLables.runwaySeason : byline}
            style={styles.byline}
          >
            {byline}
          </Text>
        </View>
      </View>
      <View accessible={parentEnabled} style={styles.imgView}>
        {showBookMark ? (
          <View style={styles.imgView1}>
            <TouchableOpacity
              accessible={parentEnabled}
              style={styles.unBookmarkView}
              onPress={onBookmark}
            >
              <Image
                accessible={childEnabled}
                accessibilityLabel={automationStaticLables.bookmark}
                testID={automationStaticLables.bookmark}
                source={checkBookMark ? Images.bookmark : Images.unBookmark}
              />
            </TouchableOpacity>
            {/* <TouchableOpacity accessible={parentEnabled} onPress={onShare}>
              <Image
                accessible={childEnabled}
                accessibilityLabel={automationStaticLables.share}
                testID={automationStaticLables.share}
                source={Images.share}
              />
            </TouchableOpacity> */}
          </View>
        ) : null}
      </View>
    </View>
  );
};

RunwayHeader.defaultProps = {
  showBookMark: true,
};

export default RunwayHeader;

const styles = StyleSheet.create({
  container: {
    width: horizontalScale(375),
    height: verticalScale(87),
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: verticalScale(51),
    paddingHorizontal: horizontalScale(13),
    borderBottomWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowRadius: 4,
    shadowOpacity: 1,
    zIndex: 1,
    borderColor: 'rgba(216,216,216,0.5)',
  },
  text: {
    fontSize: 16,
    color: Colors.darkGrey,
    // marginLeft: horizontalScale(40),
  },
  backView: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(5),
    padding: moderateScale(10),
    flex: 0.1,
  },
  imgView: {
    flexDirection: 'row',
    flex: 0.3,
    justifyContent: 'flex-end',
  },
  imgView1: {
    flexDirection: 'row',
  },
  unBookmarkView: {
    marginRight: horizontalScale(10),
    paddingHorizontal: 10,
  },
  backImg: { alignSelf: 'center' },
  collection: {
    fontSize: moderateScale(16),
    color: Colors.black,
    fontFamily: FontFamily.fontFamilyBold,
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: verticalScale(15),
  },
  byline: {
    fontSize: moderateScale(10),
    color: Colors.red,
    fontFamily: FontFamily.fontFamilyRegular,
    alignSelf: 'center',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: verticalScale(10),
    flexShrink: 1,
  },
  textView: {
    marginLeft: horizontalScale(15),
    justifyContent: 'space-around',
    // alignItems: 'center',
    flexDirection: 'column',
  },
});
