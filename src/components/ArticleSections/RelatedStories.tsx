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

class RelatedStories extends Component {
  renderItem = ({ item, index }) => {
    if (index < 3 && item && Object.entries(item).length > 0) {
      const postType = item && item['post-type'];
      return (
        <ClickView
          accessible={parentEnabled}
          style={styles.storyContainer}
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
          <View style={styles.imageView}>
            {Object.entries(item.image).length !== 0 ? (
              <CustomImage
                accessible={childEnabled}
                accessibilityRole={'image'}
                accessibilityLabel={
                  useStaticLable ? automationStaticLables.relatedStoriesImage : item.image.alt
                }
                testID={
                  useStaticLable ? automationStaticLables.relatedStoriesImage : item.image.alt
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
            {item.vertical && item.vertical !== '' ? (
              <View accessible={childEnabled}>
                <Text
                  accessible={childEnabled}
                  accessibilityLabel={item.vertical}
                  testID={item.vertical}
                  style={styles.category}
                >
                  {item.vertical}
                </Text>
              </View>
            ) : null}

            {item['post-title'] && item['post-title'] !== '' ? (
              <View accessible={childEnabled}>
                <Text
                  accessible={childEnabled}
                  accessibilityLabel={
                    useStaticLable
                      ? automationStaticLables.relatedStoriesPostTitle
                      : item['post-title']
                  }
                  testID={
                    useStaticLable
                      ? automationStaticLables.relatedStoriesPostTitle
                      : item['post-title']
                  }
                  numberOfLines={2}
                  style={styles.title}
                >
                  {item['post-title']}
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
          accessibilityLabel="related stories"
          testID="related stories"
          style={styles.header}
        >
          {translate('relatedStories')}
        </Text>
      </View>
    );
  };

  render() {
    const { data } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.broadSeparator} />
        {data && data.length > 0 ? (
          <View style={styles.subContainer}>
            <FlatList
              data={data}
              renderItem={this.renderItem}
              keyExtractor={(x, i) => i.toString()}
              ListHeaderComponent={this.renderHeader}
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
    width: horizontalScale(350),
    height: verticalScale(8),
    backgroundColor: Colors.black,
    alignSelf: 'center',
  },
  subContainer: {
    marginHorizontal: horizontalScale(16),
  },
  header: {
    fontSize: moderateScale(22),
    lineHeight: moderateScale(32),
    color: Colors.black,
    fontFamily:
      Platform.OS === 'ios'
        ? FontFamily.publicoBannerMediumIos
        : FontFamily.publicoBannerMediumAndroid,
    marginBottom: Platform.OS === 'ios' ? verticalScale(5) : verticalScale(15),
  },
  image: {
    width: horizontalScale(147),
    height: Platform.OS === 'ios' ? verticalScale(97) : verticalScale(117),
  },
  imageView: {
    width: horizontalScale(147),
    height: Platform.OS === 'ios' ? verticalScale(97) : verticalScale(117),
    backgroundColor: Colors.greyLight,
  },
  textContainer: {
    width: horizontalScale(188),
    marginLeft: horizontalScale(8),
  },
  storyContainer: {
    flexDirection: 'row',
    marginBottom: verticalScale(20),
    alignSelf: 'center',
  },
  category: {
    textTransform: 'uppercase',
    fontSize: moderateScale(11),
    lineHeight: moderateScale(16),
    textAlign: 'left',
    fontFamily: FontFamily.fontFamilyBold,
    color: Colors.backgroundRed,
  },
  title: {
    fontSize: moderateScale(15),
    lineHeight: moderateScale(19),
    textAlign: 'left',
    fontFamily: FontFamily.fontFamilyRegular,
    color: Colors.black,
    marginTop: verticalScale(10),
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
