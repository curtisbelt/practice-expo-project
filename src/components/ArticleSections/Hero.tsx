import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';

import Colors from '../../constants/colors/colors';
import FontFamily from '../../assets/fonts/fonts';
import { getFormattedDateTime } from './../../helpers/dateTimeFormats';
import { withNavigation } from 'react-navigation';
import ClickView from '../../components/widgets/clickView';
import { verticalScale, moderateScale, horizontalScale } from '../../helpers/scale';
import CustomImage from '../widgets/CustomImage';
import { parentEnabled, childEnabled, useStaticLable } from '../../../appConfig';
import automationStaticLables from '../../constants/automationStaticLables';
import { Images } from '../../assets/images';

const width = Dimensions.get('window').width;
import checkIOSPlatForm from '../../helpers/checkIOSPlatForm';
import { connect } from 'react-redux';
import { runwayId, runwatReview } from '../../redux/actions/RunwayAction';

class Hero extends React.Component {
  render() {
    const { HeroData, type, navigation }: any = this.props;
    if (HeroData && HeroData.items.length > 0) {
      let heroItem = HeroData.items.length >= 1 ? HeroData.items[0] : {};
      let category1Item = HeroData.items.length >= 2 ? HeroData.items[1] : {};
      let category2Item = HeroData.items.length >= 3 ? HeroData.items[2] : {};
      let hero_post_title = heroItem ? heroItem['post-title'] : '';
      let category1_post_title = category1Item ? category1Item['post-title'] : '';
      let category2_post_title = category2Item ? category2Item['post-title'] : '';
      let hero_vertical = heroItem.vertical.toUpperCase();
      let heroPublishedAt: any = heroItem ? getFormattedDateTime(heroItem['published-at']) : null;
      let category1PublishedAt: any = category1Item
        ? getFormattedDateTime(category1Item['published-at'])
        : null;
      let category2PublishedAt: any = category2Item
        ? getFormattedDateTime(category2Item['published-at'])
        : null;
      const heroItemPostType = heroItem && heroItem['post-type'];
      const category1ItemPostType = category1Item && category1Item['post-type'];
      const category2ItemPostType = category2Item && category2Item['post-type'];

      return (
        <View style={styles.container}>
          {heroItem !== null && heroItem !== undefined && Object.entries(heroItem).length !== 0 ? (
            <ClickView
              accessible={parentEnabled}
              onPress={() => {
                if (type && type.term && type.term.name === 'Runway') {
                  this.props.runwayId(heroItem.id);
                  this.props.runwatReview(heroItem['post-type']);
                  navigation.navigate('RunwayTab', {
                    runwayId: heroItem.id,
                    tabIndex: heroItem['post-type'] === 'runway-review' ? 1 : 0,
                    review: heroItem['post-type'],
                    season: heroItem && heroItem['post-title'],
                    collection: heroItem && heroItem.byline,
                    collectionId: heroItem['collection-id']
                      ? heroItem['collection-id']
                      : heroItem.id,
                  });
                } else if (heroItemPostType === 'pmc-gallery') {
                  navigation.navigate('GalleryImages', {
                    galleryID: heroItem.id,
                    postType: heroItemPostType,
                  });
                } else if (heroItemPostType === 'wwd_top_video') {
                  this.props.navigation.navigate('VideoDetail', {
                    articleID: heroItem.id,
                    articleItem: heroItem,
                    articleLink: heroItem.link,
                  });
                } else {
                  navigation.navigate('ArticleDetail', {
                    articleID: heroItem.id,
                    articleItem: heroItem,
                  });
                }
              }}
            >
              {hero_vertical !== '' ? (
                <View style={styles.businesstextContainer}>
                  <Text
                    accessible={childEnabled}
                    accessibilityLabel={
                      useStaticLable
                        ? !checkIOSPlatForm()
                          ? automationStaticLables.heroCategory
                          : hero_vertical
                        : hero_vertical
                    }
                    testID={useStaticLable ? automationStaticLables.heroCategory : hero_vertical}
                    style={styles.businesstextLable}
                  >
                    {hero_vertical}
                  </Text>
                </View>
              ) : null}

              <View accessible={parentEnabled}>
                <Text
                  accessible={childEnabled}
                  accessibilityLabel={
                    useStaticLable
                      ? !checkIOSPlatForm()
                        ? automationStaticLables.heroPostTitle
                        : hero_post_title
                      : hero_post_title
                  }
                  testID={useStaticLable ? automationStaticLables.heroPostTitle : hero_post_title}
                  numberOfLines={3}
                  style={styles.macys_and_bloomingd}
                >
                  {hero_post_title}
                </Text>
                <Text
                  accessible={childEnabled}
                  accessibilityLabel={
                    useStaticLable ? automationStaticLables.heroPublished : heroPublishedAt
                  }
                  testID={
                    useStaticLable
                      ? !checkIOSPlatForm()
                        ? automationStaticLables.heroPublished
                        : heroPublishedAt
                      : heroPublishedAt
                  }
                  style={styles.businesstextHour}
                >
                  {heroPublishedAt}
                </Text>
              </View>

              <View accessible={parentEnabled} style={styles.heroContainer}>
                {Object.entries(heroItem.image).length !== 0 ? (
                  <CustomImage
                    accessible={childEnabled}
                    accessibilityRole={'image'}
                    accessibilityLabel={
                      useStaticLable
                        ? !checkIOSPlatForm()
                          ? automationStaticLables.heroImage
                          : heroItem.image.alt
                        : heroItem.image.alt
                    }
                    testID={useStaticLable ? automationStaticLables.heroImage : heroItem.image.alt}
                    url={
                      heroItem.image.crops.length > 3
                        ? heroItem.image.crops[3].url + `&w=${Math.round(horizontalScale(400))}`
                        : null
                    }
                    style={styles.heroImage}
                  />
                ) : null}
              </View>
              {type &&
                type.term &&
                type.term.name === 'Runway' &&
                heroItem &&
                heroItem['post-type'] === 'runway-review' && (
                  <View style={[styles.review, styles.bigImage]}>
                    <Image
                      accessible={childEnabled}
                      accessibilityRole={'image'}
                      accessibilityLabel={
                        useStaticLable
                          ? automationStaticLables.reviewTag
                          : automationStaticLables.reviewTag
                      }
                      testID={
                        useStaticLable
                          ? automationStaticLables.reviewTag
                          : automationStaticLables.reviewTag
                      }
                      source={Images.review}
                    />
                  </View>
                )}
            </ClickView>
          ) : null}
          <View style={styles.gridArticleContainer}>
            {category1Item !== null &&
            category1Item !== undefined &&
            Object.entries(category1Item).length !== 0 ? (
              <ClickView
                accessible={parentEnabled}
                style={styles.itemContainer}
                onPress={() => {
                  if (type && type.term && type.term.name === 'Runway') {
                    navigation.navigate('RunwayTab', {
                      runwayId: category1Item.id,
                      tabIndex: category1Item['post-type'] === 'runway-review' ? 1 : 0,
                      review: category1Item['post-type'],
                      season: category1Item && category1Item['post-title'],
                      collection: category1Item && category1Item.byline,
                      collectionId: category1Item['collection-id']
                        ? category1Item['collection-id']
                        : category1Item.id,
                    });
                  } else if (category1ItemPostType === 'pmc-gallery') {
                    navigation.navigate('GalleryImages', {
                      galleryID: category1Item.id,
                      postType: category1ItemPostType,
                    });
                  } else if (category1ItemPostType === 'wwd_top_video') {
                    this.props.navigation.navigate('VideoDetail', {
                      articleID: category1Item.id,
                      articleItem: category1Item,
                      articleLink: category1Item.link,
                    });
                  } else {
                    navigation.navigate('ArticleDetail', {
                      articleID: category1Item.id,
                      articleItem: category1Item,
                    });
                  }
                }}
              >
                {Object.entries(category1Item.image).length !== 0 ? (
                  <CustomImage
                    accessible={childEnabled}
                    accessibilityRole={'image'}
                    accessibilityLabel={
                      useStaticLable
                        ? !checkIOSPlatForm()
                          ? automationStaticLables.category1Image
                          : category1Item.image.alt
                        : category1Item.image.alt
                    }
                    testID={
                      useStaticLable
                        ? automationStaticLables.category1Image
                        : category1Item.image.alt
                    }
                    style={styles.itemImage}
                    url={
                      category1Item.image.crops.length > 3
                        ? category1Item.image.crops[3].url +
                          `&w=${Math.round(horizontalScale(400))}`
                        : null
                    }
                  />
                ) : null}
                <View accessible={parentEnabled} style={styles.categoryContainer}>
                  <Text
                    accessible={childEnabled}
                    accessibilityLabel={
                      useStaticLable
                        ? !checkIOSPlatForm()
                          ? automationStaticLables.category1Tag
                          : category1Item.vertical
                        : category1Item.vertical
                    }
                    testID={
                      useStaticLable ? automationStaticLables.category1Tag : category1Item.vertical
                    }
                    style={styles.categoryText}
                  >
                    {category1Item.vertical.toUpperCase()}
                  </Text>
                  <Text
                    accessible={childEnabled}
                    accessibilityLabel={
                      useStaticLable
                        ? !checkIOSPlatForm()
                          ? automationStaticLables.category1Published
                          : category1PublishedAt
                        : category1PublishedAt
                    }
                    testID={
                      useStaticLable
                        ? automationStaticLables.category1Published
                        : category1PublishedAt
                    }
                    style={styles.hourText}
                  >
                    {category1PublishedAt}
                  </Text>
                </View>
                <View accessible={parentEnabled}>
                  <Text
                    accessible={childEnabled}
                    accessibilityLabel={
                      useStaticLable
                        ? !checkIOSPlatForm()
                          ? automationStaticLables.category1PostTitle
                          : category1_post_title
                        : category1_post_title
                    }
                    testID={
                      useStaticLable
                        ? automationStaticLables.category1PostTitle
                        : category1_post_title
                    }
                    numberOfLines={3}
                    style={styles.itemTextTitle}
                  >
                    {category1_post_title}
                  </Text>
                </View>
                {type &&
                  type.term &&
                  type.term.name === 'Runway' &&
                  category1Item &&
                  category1Item['post-type'] === 'runway-review' && (
                    <View style={[styles.review, styles.gridImage]}>
                      <Image
                        accessible={childEnabled}
                        accessibilityRole={'image'}
                        accessibilityLabel={
                          useStaticLable
                            ? automationStaticLables.reviewTag
                            : automationStaticLables.reviewTag
                        }
                        testID={
                          useStaticLable
                            ? automationStaticLables.reviewTag
                            : automationStaticLables.reviewTag
                        }
                        source={Images.review}
                      />
                    </View>
                  )}
              </ClickView>
            ) : null}
            {category2Item !== null &&
            category2Item !== undefined &&
            Object.entries(category2Item).length !== 0 ? (
              <ClickView
                accessible={parentEnabled}
                style={styles.itemContainer}
                onPress={() => {
                  if (type && type.term && type.term.name === 'Runway') {
                    navigation.navigate('RunwayTab', {
                      runwayId: category2Item.id,
                      tabIndex: category2Item['post-type'] === 'runway-review' ? 1 : 0,
                      review: category2Item['post-type'],
                      season: category2Item && category2Item['post-title'],
                      collection: category2Item && category2Item.byline,
                      collectionId: category2Item['collection-id']
                        ? category2Item['collection-id']
                        : category2Item.id,
                    });
                  } else if (category2ItemPostType === 'pmc-gallery') {
                    navigation.navigate('GalleryImages', {
                      galleryID: category2Item.id,
                      postType: category2ItemPostType,
                    });
                  } else if (category2ItemPostType === 'wwd_top_video') {
                    this.props.navigation.navigate('VideoDetail', {
                      articleID: category2Item.id,
                      articleItem: category2Item,
                      articleLink: category2Item.link,
                    });
                  } else {
                    navigation.navigate('ArticleDetail', {
                      articleID: category2Item.id,
                      articleItem: category2Item,
                    });
                  }
                }}
              >
                {Object.entries(category2Item.image).length !== 0 ? (
                  <CustomImage
                    accessible={childEnabled}
                    accessibilityRole={'image'}
                    accessibilityLabel={
                      useStaticLable
                        ? automationStaticLables.category2Image
                        : category2Item.image.alt
                    }
                    testID={
                      useStaticLable
                        ? automationStaticLables.category2Image
                        : category2Item.image.alt
                    }
                    style={styles.itemImage}
                    url={
                      category2Item.image.crops.length > 3
                        ? category2Item.image.crops[3].url +
                          `&w=${Math.round(horizontalScale(400))}`
                        : null
                    }
                  />
                ) : null}
                <View accessible={parentEnabled} style={styles.categoryContainer}>
                  <Text
                    accessible={childEnabled}
                    accessibilityLabel={
                      useStaticLable ? automationStaticLables.category2Tag : category2Item.vertical
                    }
                    testID={
                      useStaticLable ? automationStaticLables.category2Tag : category2Item.vertical
                    }
                    numberOfLines={1}
                    style={styles.categoryText}
                  >
                    {category2Item.vertical.toUpperCase()}
                  </Text>
                  <Text
                    accessible={childEnabled}
                    accessibilityLabel={
                      useStaticLable
                        ? automationStaticLables.category2Published
                        : category2PublishedAt
                    }
                    testID={
                      useStaticLable
                        ? automationStaticLables.category2Published
                        : category2PublishedAt
                    }
                    style={styles.hourText}
                  >
                    {category2PublishedAt}
                  </Text>
                </View>
                <View accessible={parentEnabled}>
                  <Text
                    accessible={childEnabled}
                    accessibilityLabel={
                      useStaticLable
                        ? automationStaticLables.category2PostTitle
                        : category2_post_title
                    }
                    testID={
                      useStaticLable
                        ? automationStaticLables.category2PostTitle
                        : category2_post_title
                    }
                    numberOfLines={3}
                    style={styles.itemTextTitle}
                  >
                    {category2_post_title}
                  </Text>
                </View>
                {type &&
                  type.term &&
                  type.term.name === 'Runway' &&
                  category2Item &&
                  category2Item['post-type'] === 'runway-review' && (
                    <View style={[styles.review, styles.gridImage]}>
                      <Image
                        accessible={childEnabled}
                        accessibilityRole={'image'}
                        accessibilityLabel={
                          useStaticLable
                            ? automationStaticLables.reviewTag
                            : automationStaticLables.reviewTag
                        }
                        testID={
                          useStaticLable
                            ? automationStaticLables.reviewTag
                            : automationStaticLables.reviewTag
                        }
                        source={Images.review}
                      />
                    </View>
                  )}
              </ClickView>
            ) : null}
          </View>
        </View>
      );
    } else null;
  }
}

const styles = StyleSheet.create({
  container: {},
  businesstextContainer: {
    marginTop: 15,
    height: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#46853D',
  },
  businesstextLable: {
    paddingHorizontal: moderateScale(10),
    fontFamily: FontFamily.fontFamilyMedium,
    fontSize: moderateScale(12),
    fontWeight: '500',
    color: Colors.white,
    letterSpacing: moderateScale(1.03),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  businesstextHour: {
    fontFamily: FontFamily.fontFamilyRegular,
    fontSize: verticalScale(13),
    color: Colors.black,
    letterSpacing: verticalScale(0.46),
    lineHeight: verticalScale(20),
    alignItems: 'center',
    textAlign: 'center',
  },
  heroContainer: {
    height: verticalScale(242),
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: Colors.greyLight,
  },
  heroImage: {
    width: '100%',
    height: verticalScale(242),
  },
  macys_and_bloomingd: {
    color: Colors.black,
    fontFamily: FontFamily.fontFamilyBold,
    fontSize: moderateScale(26),
    textAlign: 'center',
    marginTop: 7,
    marginHorizontal: 6,
  },
  gridArticleContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5,
    paddingHorizontal: moderateScale(5),
    marginBottom: 10,
  },
  itemContainer: {
    // flex: 1,
    width: width / 2 - moderateScale(15),
    margin: moderateScale(5),
    // justifyContent: 'center',
  },
  itemImage: {
    height: verticalScale(129),
    backgroundColor: Colors.greyLight,
    width: width / 2 - moderateScale(15),
  },
  categoryContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
  },
  categoryText: {
    color: Colors.red,
    flex: 1,
    fontFamily: FontFamily.fontFamilyBold,
    fontSize: moderateScale(9),
    fontWeight: 'bold',
    letterSpacing: moderateScale(1.63),
  },
  hourText: {
    flex: 1,
    justifyContent: 'flex-end',
    fontFamily: FontFamily.fontFamilyRegular,
    fontSize: moderateScale(10),
    color: Colors.darkGrey,
    letterSpacing: moderateScale(0.36),
    alignItems: 'flex-end',
    textAlign: 'right',
  },
  itemTextTitle: {
    marginTop: moderateScale(5),
    fontFamily: FontFamily.fontFamilyMedium,
    fontSize: moderateScale(14),
    color: Colors.black,
    letterSpacing: moderateScale(0.37),
  },
  review: {
    position: 'absolute',
    left: 0,
  },
  bigImage: {
    top: verticalScale(140),
  },
  gridImage: {
    top: verticalScale(18),
  },
});
const mapDispatchToProps = (dispatch: any) => ({
  runwayId: (id: any) => dispatch(runwayId(id)),
  runwatReview: (RunwayReview: any) => dispatch(runwatReview(RunwayReview)),
});

const mapStateToProps = (_state: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(Hero));
