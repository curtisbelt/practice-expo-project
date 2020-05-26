import React from 'react';
import { View, FlatList, Text, StyleSheet, Platform } from 'react-native';
import { verticalScale, moderateScale, horizontalScale } from '../../helpers/scale';
import Colors from '../../constants/colors/colors';
import translate from '../../assets/strings/strings';
import FontFamily from '../../assets/fonts/fonts';
import CustomImage from '../widgets/CustomImage';
import { parentEnabled, childEnabled, useStaticLable } from '../../../appConfig';
import automationStaticLables from '../../constants/automationStaticLables';
import ClickView from '../widgets/clickView';

class TrendingStories extends React.Component {
  renderItem = ({ item, index }) => {
    if (item && Object.entries(item).length > 0) {
      let Index = index + 1;
      const url = item && item.image && item.image.crops && item.image.crops[3].url;
      const photonUrl = url === undefined ? '' : url + `&w=${Math.round(horizontalScale(86))}`;
      const postType = item && item['post-type'];
      return (
        <ClickView
          accessible={parentEnabled}
          style={styles.subContainer}
          onPress={() => {
            if (postType === 'pmc-gallery') {
              this.props.navigation.navigate('GalleryImages', {
                galleryID: item.id,
                postType: postType,
              });
            } else if (postType === 'wwd_top_video') {
              this.props.navigation.navigate('VideoDetail', {
                articleID: item.id,
                articleItem: item,
                articleLink: item.link,
              });
            } else {
              this.props.navigation.navigate('ArticleDetail', {
                articleID: item.id,
                articleItem: item,
              });
            }
          }}
        >
          <View>
            {Object.entries(item.image).length !== 0 ? (
              <CustomImage
                accessible={childEnabled}
                accessibilityRole={'image'}
                accessibilityLabel={
                  useStaticLable ? automationStaticLables.trendingStoriesImage : item.image.alt
                }
                testID={
                  useStaticLable ? automationStaticLables.trendingStoriesImage : item.image.alt
                }
                url={photonUrl ? photonUrl : null}
                style={{ width: horizontalScale(86), height: verticalScale(73) }}
              />
            ) : null}
          </View>
          <View style={styles.indexView}>
            <Text
              accessible={childEnabled}
              accessibilityLabel={
                useStaticLable ? automationStaticLables.trendingStoriesIndex : Index.toString()
              }
              testID={
                useStaticLable ? automationStaticLables.trendingStoriesIndex : Index.toString()
              }
              style={styles.index}
            >
              {Index}
            </Text>
          </View>
          {item['post-title'] && item['post-title'] !== '' ? (
            <View style={styles.titleTextView}>
              <Text
                accessible={childEnabled}
                accessibilityLabel={
                  useStaticLable
                    ? automationStaticLables.trendingStoriesPostTitle
                    : item['post-title']
                }
                testID={
                  useStaticLable
                    ? automationStaticLables.trendingStoriesPostTitle
                    : item['post-title']
                }
                numberOfLines={3}
                style={styles.titleText}
              >
                {item['post-title']}
              </Text>
            </View>
          ) : null}
        </ClickView>
      );
    }
  };

  renderHeader = () => {
    return (
      <View accessible={parentEnabled} style={styles.header}>
        <Text
          accessible={childEnabled}
          accessibilityLabel="trending_stories"
          testID="trending_stories"
          style={styles.headerText}
        >
          {translate('trending_stories')}
        </Text>
      </View>
    );
  };

  renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  render() {
    const { TrendingStoriesData } = this.props;
    return (
      <View style={styles.container}>
        {TrendingStoriesData.items && TrendingStoriesData.items.length > 0 ? (
          <FlatList
            data={TrendingStoriesData.items}
            renderItem={this.renderItem}
            keyExtractor={(x, i) => i.toString()}
            ListHeaderComponent={this.renderHeader}
            ItemSeparatorComponent={this.renderSeparator}
            style={styles.list}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: moderateScale(10),
  },
  header: {
    height: verticalScale(51),
    width: horizontalScale(355),
    backgroundColor: Colors.backgroundRed,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: moderateScale(18),
  },
  headerText: {
    fontSize: horizontalScale(32),
    fontWeight: '500',
    color: Colors.white,
    fontFamily:
      Platform.OS === 'ios'
        ? FontFamily.publicoBannerMediumIos
        : FontFamily.publicoBannerMediumAndroid,
  },
  subContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: horizontalScale(323),
  },
  index: {
    fontSize: moderateScale(28),
    fontWeight: '500',
    textAlign: 'center',
    color: Colors.backgroundRed,
    fontFamily:
      Platform.OS === 'ios'
        ? FontFamily.publicoBannerMediumIos
        : FontFamily.publicoBannerMediumAndroid,
  },
  separator: {
    height: moderateScale(1),
    width: '90%',
    alignSelf: 'center',
    backgroundColor: Colors.whisperGrey,
    marginVertical: moderateScale(10),
  },
  indexView: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginLeft: moderateScale(10),
    width: moderateScale(32),
    height: moderateScale(33.6),
  },
  titleTextView: {
    marginLeft: moderateScale(10),
    alignSelf: 'center',
    justifyContent: 'center',
    width: moderateScale(180),
  },
  titleText: {
    fontSize: moderateScale(15),
    fontFamily: FontFamily.fontFamilyMedium,
    textAlign: 'left',
    color: Colors.black,
  },
  list: {
    borderWidth: 1,
    paddingBottom: moderateScale(20),
    borderColor: Colors.backgroundRed,
  },
});

export default TrendingStories;
