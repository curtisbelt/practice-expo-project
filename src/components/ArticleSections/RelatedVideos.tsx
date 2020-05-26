import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Platform } from 'react-native';
import { verticalScale, moderateScale, horizontalScale } from '../../helpers/scale';
import Colors from '../../constants/colors/colors';
import translate from '../../assets/strings/strings';
import FontFamily from '../../assets/fonts/fonts';
import ClickView from '../widgets/clickView';
import CustomImage from '../widgets/CustomImage';
import { parentEnabled, childEnabled, useStaticLable } from '../../../appConfig';
import automationStaticLables from '../../constants/automationStaticLables';
import { getFormattedDateTime } from '../../helpers/dateTimeFormats';

class RelatedStories extends Component {
  renderItem = ({ item }) => {
    if (item && Object.entries(item).length > 0) {
      return (
        <ClickView
          accessible={parentEnabled}
          style={styles.storyContainer}
          onPress={() =>
            this.props.navigation.navigate('VideoDetail', {
              articleID: item.id,
              articleLink: item.link,
              articleItem: item,
              articleImage:
                Object.entries(item.image).length !== 0 && item.image.crops.length > 3
                  ? item.image.crops[3].url +
                    `&w=${Math.round(horizontalScale(147))},${Math.round(
                      Platform.OS === 'ios' ? verticalScale(97) : verticalScale(117),
                    )}`
                  : '',
            })
          }
        >
          <View style={styles.imageView}>
            {Object.entries(item.image).length !== 0 ? (
              <CustomImage
                accessible={childEnabled}
                accessibilityRole={'image'}
                accessibilityLabel={
                  useStaticLable
                    ? automationStaticLables.relatedStoriesImage
                    : 'relatedStoriesImage'
                }
                testID={
                  useStaticLable
                    ? automationStaticLables.relatedStoriesImage
                    : 'relatedStoriesImage'
                }
                url={
                  item.image.crops.length > 3
                    ? item.image.crops[3].url + `&w=${Math.round(horizontalScale(147))}`
                    : ''
                }
                style={styles.image}
              />
            ) : null}
          </View>

          <View accessible={parentEnabled} style={styles.textContainer}>
            {item.title && item.title !== '' ? (
              <View accessible={childEnabled}>
                <Text
                  accessible={childEnabled}
                  accessibilityLabel={
                    useStaticLable ? automationStaticLables.relatedStoriesPostTitle : item.title
                  }
                  testID={
                    useStaticLable ? automationStaticLables.relatedStoriesPostTitle : item.title
                  }
                  numberOfLines={2}
                  style={styles.title}
                >
                  {item.title}
                </Text>
              </View>
            ) : null}

            {item['published-at'] && item['published-at'] !== '' ? (
              <View accessible={childEnabled}>
                <Text
                  accessible={childEnabled}
                  accessibilityLabel={
                    useStaticLable
                      ? automationStaticLables.relatedStoriesPostTitle
                      : item['published-at']
                  }
                  testID={
                    useStaticLable
                      ? automationStaticLables.relatedStoriesPostTitle
                      : item['published-at']
                  }
                  style={styles.dateTime}
                >
                  {getFormattedDateTime(item['published-at'])}
                </Text>
              </View>
            ) : null}
          </View>
        </ClickView>
      );
    }
  };

  renderHeader = () => {
    return (
      <View accessible={parentEnabled}>
        <Text
          accessible={childEnabled}
          accessibilityLabel="related videos"
          testID="related videos"
          style={styles.header}
        >
          {translate('relatedVideos')}
        </Text>
      </View>
    );
  };

  render() {
    const { data } = this.props;

    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <View style={styles.broadSeparator} />
        {data && data.length > 0 ? (
          <View style={styles.subContainer}>
            <FlatList
              data={data}
              renderItem={this.renderItem}
              keyExtractor={(x, i) => i.toString()}
            />
          </View>
        ) : null}
        <View style={styles.separator} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(40),
  },
  broadSeparator: {
    width: horizontalScale(345),
    height: verticalScale(8),
    backgroundColor: Colors.black,
    alignSelf: 'center',
    marginBottom: verticalScale(15),
  },
  subContainer: {
    marginHorizontal: horizontalScale(16),
  },
  header: {
    marginLeft: horizontalScale(15),
    fontSize: moderateScale(27),
    lineHeight: moderateScale(32),
    color: Colors.black,
    fontFamily:
      Platform.OS === 'ios'
        ? FontFamily.publicoBannerMediumIos
        : FontFamily.publicoBannerMediumAndroid,
  },
  image: {
    width: horizontalScale(108),
    height: Platform.OS === 'ios' ? verticalScale(97) : verticalScale(117),
  },
  imageView: {
    width: horizontalScale(108),
    height: moderateScale(83),
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: horizontalScale(188),
    marginLeft: horizontalScale(10),
  },
  storyContainer: {
    flexDirection: 'row',
    marginBottom: Platform.OS === 'ios' ? moderateScale(20) : moderateScale(25),
    alignSelf: 'center',
  },
  title: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(19),
    textAlign: 'left',
    fontFamily: FontFamily.fontFamilyMedium,
    color: Colors.black,
  },
  dateTime: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(15),
    letterSpacing: moderateScale(0.38),
    textAlign: 'left',
    fontFamily: FontFamily.fontFamilyRegular,
    color: Colors.viewAllGrey,
  },

  separator: {
    width: horizontalScale(350),
    height: verticalScale(1),
    backgroundColor: Colors.black,
    alignSelf: 'center',
    marginTop: verticalScale(5),
  },
});

export default RelatedStories;
