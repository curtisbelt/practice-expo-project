import React from 'react';
//import react in our code.
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/colors/colors';
import FontFamily from '../assets/fonts/fonts';
import { getFormattedDateTime } from '../helpers/dateTimeFormats';
import { moderateScale, horizontalScale } from '../helpers/scale';
import CustomImage from './widgets/CustomImage';
import { childEnabled, useStaticLable } from '../../appConfig';
import ClickView from '../components/widgets/clickView';
import automationStaticLables from '../constants/automationStaticLables';
import { withNavigation } from 'react-navigation';
class LatestNewsCard extends React.Component {
  constructor(props: any) {
    super(props);
  }
  render() {
    const post = this.props.LatestNewsData;
    const url = post && post.image && post.image.crops && post.image.crops[3].url;
    const photonUrl = url === undefined ? '' : url + `&w=${Math.round(horizontalScale(375))}`;
    let byLineAuthors;
    if (post && post.byline.includes(',')) {
      byLineAuthors = post.byline.split(',');
    }
    const postType = post && post['post-type'];
    return (
      <View style={Styles.container} accessible={true}>
        {/* check if image is an empty object, then return empty view */}
        <ClickView
          onPress={() => {
            if (postType === 'pmc-gallery') {
              this.props.navigation.navigate('GalleryImages', {
                galleryID: post.id,
                postType: postType,
              });
            } else if (postType === 'wwd_top_video') {
              this.props.navigation.navigate('VideoDetail', {
                articleID: post.id,
                articleItem: post,
                articleLink: post.link,
              });
            } else {
              this.props.navigation.navigate('ArticleDetail', {
                articleID: post.id,
                articleItem: post,
              });
            }
          }}
        >
          <CustomImage
            accessible={childEnabled}
            style={Styles.post_image}
            url={photonUrl ? photonUrl : ''}
          />
          <View style={Styles.post_container}>
            {Object.prototype.hasOwnProperty.call(post, 'vertical') &&
            post.vertical !== null &&
            post.vertical !== '' ? (
              <Text
                style={Styles.category_header}
                accessible={childEnabled}
                accessibilityLabel={
                  useStaticLable ? automationStaticLables.latestNewsCategory : post.vertical
                }
                testID={useStaticLable ? automationStaticLables.latestNewsCategory : post.vertical}
              >
                {post.vertical}
              </Text>
            ) : null}

            {Object.prototype.hasOwnProperty.call(post, 'post-title') &&
            post['post-title'] !== null &&
            post['post-title'] !== '' ? (
              <Text
                style={Styles.post_title}
                accessible={childEnabled}
                numberOfLines={3}
                accessibilityLabel={
                  useStaticLable ? automationStaticLables.latestNewsPostTitle : post['post-title']
                }
                testID={
                  useStaticLable ? automationStaticLables.latestNewsPostTitle : post['post-title']
                }
              >
                {post['post-title']}
              </Text>
            ) : null}
            <View style={Styles.time_container}>
              {Object.prototype.hasOwnProperty.call(post, 'published-at') &&
              post['published-at'] !== null &&
              post['published-at'] !== '' ? (
                <Text
                  style={Styles.post_time}
                  accessible={childEnabled}
                  accessibilityLabel={
                    useStaticLable
                      ? automationStaticLables.latestNewsPublished
                      : getFormattedDateTime(post['published-at'])
                  }
                  testID={
                    useStaticLable
                      ? automationStaticLables.latestNewsPublished
                      : getFormattedDateTime(post['published-at'])
                  }
                >
                  {getFormattedDateTime(post['published-at'])}
                </Text>
              ) : null}

              <View style={Styles.seperator}>
                <View style={Styles.seperator_dot} />
              </View>
              {Object.prototype.hasOwnProperty.call(post, 'byline') &&
              post.byline !== null &&
              post.byline !== '' ? (
                <View>
                  {post.byline.includes(',') ? (
                    <View>
                      <Text
                        style={Styles.post_time}
                        accessible={childEnabled}
                        accessibilityLabel={
                          useStaticLable ? automationStaticLables.latestNewsByLine : post.byline
                        }
                        testID={
                          useStaticLable ? automationStaticLables.latestNewsByLine : post.byline
                        }
                      >
                        {(byLineAuthors[0], byLineAuthors[1])}
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={Styles.post_time}
                      accessible={childEnabled}
                      accessibilityLabel={
                        useStaticLable ? automationStaticLables.latestNewsByLine : post.byline
                      }
                      testID={
                        useStaticLable ? automationStaticLables.latestNewsByLine : post.byline
                      }
                    >
                      {post.byline}
                    </Text>
                  )}
                </View>
              ) : null}
            </View>
          </View>
        </ClickView>
      </View>
    );
  }
}
const Styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  post_image: {
    flex: 1,
    width: '100%',
    height: moderateScale(245),
  },
  post_container: {
    padding: moderateScale(15),
  },
  category_header: {
    textTransform: 'uppercase',
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.99,
    color: Colors.red,
    fontFamily: FontFamily.fontFamilyBold,
  },
  post_title: {
    marginVertical: moderateScale(8),
    fontSize: moderateScale(20),
    lineHeight: moderateScale(24),
    color: Colors.black,
    fontFamily: FontFamily.fontFamilyBold,
  },
  post_time: {
    fontSize: moderateScale(11),
    lineHeight: moderateScale(16),
    letterSpacing: moderateScale(0.39),
    fontFamily: FontFamily.fontFamilyRegular,
  },
  time_container: {
    flex: 1,
    flexDirection: 'row',
  },
  seperator: {
    justifyContent: 'center',
    width: moderateScale(16),
    alignItems: 'center',
  },
  seperator_dot: {
    backgroundColor: Colors.red,
    height: moderateScale(4),
    width: moderateScale(4),
    borderRadius: moderateScale(2),
  },
});
export default withNavigation(LatestNewsCard);
