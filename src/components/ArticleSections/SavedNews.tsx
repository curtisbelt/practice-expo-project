import React from 'react';
import { View, Text, StyleSheet, Platform, Image } from 'react-native';
import { verticalScale, horizontalScale, moderateScale } from '../../helpers/scale';
import Colors from '../../constants/colors/colors';
import FontFamily from '../../assets/fonts/fonts';
import { getFormattedDateTime } from './../../helpers/dateTimeFormats';
import CustomImage from '../widgets/CustomImage';
import { parentEnabled, childEnabled, useStaticLable } from '../../../appConfig';
import automationStaticLables from '../../constants/automationStaticLables';
import ClickView from '../widgets/clickView';
import { Images } from '../../assets/images/index';
import { connect } from 'react-redux';
import { onShowHeaderRunway, runwayId, runwatReview } from '../../redux/actions/RunwayAction';
const SavedNews = (props: any) => {
  let { item } = props.item;
  let { data } = item;
  let type = item['item-type'];
  console.log('***' + JSON.stringify(data));
  // console.log('saved' + type);
  const publishedAt = getFormattedDateTime(data['published-at']);
  const renderGalleryImages = (imageUrl: any) => {
    return (
      <CustomImage
        accessible={childEnabled}
        accessibilityRole={'image'}
        // accessibilityLabel={'saved image'}
        // testID={'saved image'}
        url={imageUrl}
        style={styles.image}
      />
    );
  };
  return (
    <ClickView
      accessible={parentEnabled}
      style={styles.subContainer}
      onPress={() => {
        let tempData = {
          category: data.category,
          publishedAt: data['published-at'],
          id: data.currentCount,
        };
        if (type === 'runway-tabs') {
          props.runwayId(data.runwayId);
          props.runwatReview(data.review);
        }

        type === 'gallery-images'
          ? props.navigation.navigate('GalleryImages', {
              galleryData: item.galleryData,
              imagesData: item.imagesData,
              Images: item.Images,
            })
          : type === 'images-details'
          ? props.navigation.navigate('ImageDetail', {
              imageData: item.galleryData,
              count: data.count,
              currentCount: data.currentCount,
              galleryData: tempData,
              image: data.image.url,
              Images: item.ImagesData,
              bookMarkShow: true,
            })
          : type === 'runway-Image'
          ? props.navigation.navigate('GalleryFullScreen', {
              Images: item.ImagesData,
              count: data.count,
              GalleryData: item.galleryData,
              CurrentCount: data.currentCount,
              runwayId: data.runwayId,
              publishedAt: data['published-at'],
            })
          : type === 'runway-tabs'
          ? props.navigation.navigate('RunwayTab', {
              season: data && data.season,
              collection: data && data.collection,
              runwayId: data.runwayId,
              id: data.id,
              review: data.review,
              tabIndex: data.tabIndex,
              publishedAt: data['published-at'],
              collectionId: data.collectionId,
            })
          : type === 'video-detail'
          ? props.navigation.navigate('VideoDetail', {
              articleID: data.id,
              articleLink: data.link,
              articleItem: data,
              articleImage:
                Object.entries(data.image).length > 0 && data.image.crops.length > 0
                  ? data.image.crops[0].url +
                    `?resize=${Math.round(horizontalScale(149))},${Math.round(verticalScale(87))}`
                  : '',
            })
          : props.navigation.navigate('ArticleDetail', {
              articleID: data.id,
              articleItem: data,
            });
      }}
    >
      <View style={styles.imageContainer}>
        {Object.entries(data.image) !== null ? (
          type === 'gallery-images' ? (
            renderGalleryImages(
              data.image !== null ? data.image.url + `?h=${Math.round(verticalScale(71))}` : null,
            )
          ) : type === 'images-details' ? (
            renderGalleryImages(
              data.image !== null ? data.image.url + `?h=${Math.round(verticalScale(71))}` : null,
            )
          ) : type === 'runway-Image' ? (
            renderGalleryImages(
              data.image !== null ? data.image.url + `?h=${Math.round(verticalScale(71))}` : null,
            )
          ) : type === 'runway-tabs' ? (
            renderGalleryImages(
              data.image !== null ? data.image + `?h=${Math.round(verticalScale(71))}` : null,
            )
          ) : (
            <CustomImage
              accessible={childEnabled}
              // accessibilityLabel={'saved image'}
              // testID={'saved image'}
              url={
                Object.keys(data.image).length !== 0 &&
                data.image.crops !== null &&
                data.image.crops.length > 2
                  ? data.image.crops[2].url + `?h=${Math.round(verticalScale(71))}`
                  : null
              }
              style={styles.image}
            />
          )
        ) : null}
        {type !== null && type !== undefined ? (
          <View style={[styles.imageIconView]}>
            <Image
              accessible={childEnabled}
              accessibilityLabel={
                type === 'article'
                  ? ''
                  : type === 'article-video'
                  ? 'video'
                  : type === 'video-detail'
                  ? 'video '
                  : 'photo'
              }
              testID={
                type === 'article'
                  ? ''
                  : type === 'article-video'
                  ? 'video'
                  : type === 'video-detail'
                  ? 'video'
                  : 'photo'
              }
              style={[
                styles.imageIcon,
                {
                  width: type === 'article-video' ? 12 : type === 'video-detail' ? 12 : 15,
                },
              ]}
              source={
                type === 'article'
                  ? ''
                  : type === 'article-video'
                  ? Images.videoIcon
                  : type === 'video-detail'
                  ? Images.videoIcon
                  : Images.photoIcon
              }
            />
          </View>
        ) : null}
      </View>
      <View style={styles.textView}>
        <View style={styles.titleTextView}>
          <Text
            accessible={childEnabled}
            accessibilityLabel={
              useStaticLable
                ? automationStaticLables.latestNewsPostTitle
                : data['post-title']
                ? data['post-title']
                : data.title
            }
            testID={
              useStaticLable
                ? automationStaticLables.latestNewsPostTitle
                : data['post-title']
                ? data['post-title']
                : data.title
            }
            numberOfLines={2}
            style={styles.titleText}
          >
            {data['post-title'] ? data['post-title'] : data.title}
          </Text>
        </View>
        <View style={styles.subTextView}>
          {item.category === undefined && item.category == null ? (
            <Text
              accessible={childEnabled}
              accessibilityLabel={
                useStaticLable
                  ? automationStaticLables.latestNewsCategory
                  : data.category
                  ? data.category
                  : ''
              }
              testID={
                useStaticLable
                  ? automationStaticLables.latestNewsCategory
                  : data.category
                  ? data.category
                  : ''
              }
              numberOfLines={1}
              style={styles.categoryText}
            >
              {data.category ? data.category.toUpperCase() : ''}
            </Text>
          ) : (
            <Text
              accessible={childEnabled}
              accessibilityLabel={
                useStaticLable
                  ? automationStaticLables.latestNewsCategory
                  : item.category
                  ? item.category
                  : ''
              }
              testID={
                useStaticLable
                  ? automationStaticLables.latestNewsCategory
                  : item.category
                  ? item.category
                  : ''
              }
              numberOfLines={1}
              style={styles.categoryText}
            >
              {item.category ? item.category.toUpperCase() : ''}
            </Text>
          )}

          {publishedAt !== null && publishedAt !== '' ? (
            <Text
              accessible={childEnabled}
              accessibilityLabel={
                useStaticLable ? automationStaticLables.latestNewsPublished : publishedAt
              }
              testID={useStaticLable ? automationStaticLables.latestNewsPublished : publishedAt}
              style={styles.hourText}
            >
              {publishedAt}
            </Text>
          ) : null}
        </View>
      </View>
    </ClickView>
  );
};

const styles = StyleSheet.create({
  container: {},
  subContainer: {
    flex: 1,
    flexDirection: 'row',
    ///alignSelf: 'center',
    marginLeft: moderateScale(10),
    marginRight: moderateScale(10),
  },
  headerView: {
    height: moderateScale(55),
    flexDirection: 'row',
    width: horizontalScale(353),
    alignItems: 'center',
  },
  headerText: {
    fontSize: horizontalScale(31),
    fontWeight: '500',
    color: Colors.black,
    fontFamily:
      Platform.OS === 'ios'
        ? FontFamily.publicoBannerMediumIos
        : FontFamily.publicoBannerMediumAndroid,
  },
  headerTitle: {
    marginLeft: horizontalScale(0),
  },
  imageContainer: {
    width: moderateScale(96.45),
    height: moderateScale(71),
    backgroundColor: Colors.greyLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: moderateScale(96.45),
    height: moderateScale(71),
    backgroundColor: Colors.greyLight,
  },
  separator: {
    height: verticalScale(1),
    width: horizontalScale(353),
    alignSelf: 'center',
    backgroundColor: Colors.grey,
    marginVertical: verticalScale(15),
  },
  thickBorder: {
    width: horizontalScale(355),
    height: verticalScale(8),
    backgroundColor: Colors.black,
    marginBottom: verticalScale(15),
  },
  textView: {
    flexDirection: 'column',
    width: horizontalScale(233),
    marginLeft: horizontalScale(10),
    marginTop: moderateScale(10),
  },
  titleTextView: {},
  subTextView: {
    flex: 1,
    marginTop: moderateScale(10),
    alignItems: 'flex-end',
    flexDirection: 'row',
  },

  titleText: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: Colors.black,
    fontFamily: FontFamily.fontFamilyMedium,
    letterSpacing: moderateScale(0.42),
    lineHeight: moderateScale(18),
  },
  categoryText: {
    color: '#D0021A',
    fontFamily: FontFamily.fontFamilyBold,
    fontSize: moderateScale(9),
    fontWeight: 'bold',
    marginRight: moderateScale(10),
    letterSpacing: moderateScale(1.63),
    textAlign: 'left',
  },
  hourText: {
    fontFamily: FontFamily.fontFamilyRegular,
    fontSize: moderateScale(9),
    color: '#515151',
    textAlign: 'left',
  },
  imageIconView: {
    position: 'absolute',
    marginRight: moderateScale(5),
    right: 0,
    bottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageIcon: {
    width: 15,
    height: 12,
  },
});
const mapDispatchToProps = (dispatch: any) => ({
  onShowHeaderRunway: (show: any) => dispatch(onShowHeaderRunway(show)),
  runwayId: (id: any) => dispatch(runwayId(id)),
  runwatReview: (RunwayReview: any) => dispatch(runwatReview(RunwayReview)),
});
export default connect(null, mapDispatchToProps)(SavedNews);
//export default SavedNews;
