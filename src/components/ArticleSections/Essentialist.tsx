import React from 'react';
import { View, Text, StyleSheet, FlatList, Platform } from 'react-native';
import Colors from '../../constants/colors/colors';
import { parentEnabled, childEnabled, useStaticLable } from '../../../appConfig';
import automationStaticLables from '../../constants/automationStaticLables';
import { verticalScale, horizontalScale, moderateScale } from '../../helpers/scale';
import FontFamily from '../../assets/fonts/fonts';
import translate from '../../assets/strings/strings';
import { getFormattedDateTime } from './../../helpers/dateTimeFormats';
import CustomImage from '../widgets/CustomImage';
import ClickView from '../widgets/clickView';

class Essentialist extends React.Component {
  renderItem = ({ item, index }: any) => {
    if (item && item !== null && item !== undefined) {
      let Index = index + 1;
      const publishedDate = getFormattedDateTime(item['published-at']);
      const url = item && item.image && item.image.crops && item.image.crops[3].url;
      const photonUrl = url === undefined ? '' : url + `&w=${Math.round(horizontalScale(124))}`;
      const postType = item && item['post-type'];
      return (
        <View accessible={parentEnabled} style={styles.subContainer}>
          <ClickView
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
              <View style={styles.imageView}>
                {Object.entries(item.image).length !== 0 ? (
                  <CustomImage
                    accessible={childEnabled}
                    accessibilityRole={'image'}
                    accessibilityLabel={
                      useStaticLable ? automationStaticLables.essentiaListImage : item.image.alt
                    }
                    testID={
                      useStaticLable ? automationStaticLables.essentiaListImage : item.image.alt
                    }
                    url={photonUrl ? photonUrl : null}
                    style={styles.image}
                  />
                ) : null}
              </View>
              <View style={styles.indexView}>
                <Text
                  accessible={childEnabled}
                  accessibilityLabel={
                    useStaticLable ? automationStaticLables.essentiaListCategory : Index.toString()
                  }
                  testID={
                    useStaticLable ? automationStaticLables.essentiaListCategory : Index.toString()
                  }
                  style={styles.indexText}
                >
                  {Index}
                </Text>
              </View>
            </View>
            {item['post-title'] && item['post-title'] !== '' ? (
              <View style={styles.titleView}>
                <Text
                  accessible={childEnabled}
                  accessibilityLabel={
                    useStaticLable
                      ? automationStaticLables.essentiaListPostTitle
                      : item['post-title']
                  }
                  testID={
                    useStaticLable
                      ? automationStaticLables.essentiaListPostTitle
                      : item['post-title']
                  }
                  numberOfLines={3}
                  style={styles.title}
                >
                  {item['post-title']}
                </Text>
              </View>
            ) : null}
            {publishedDate ? (
              <View style={styles.timeView}>
                <Text
                  accessible={childEnabled}
                  accessibilityLabel={
                    useStaticLable ? automationStaticLables.essentiaListPublished : publishedDate
                  }
                  testID={
                    useStaticLable ? automationStaticLables.essentiaListPublished : publishedDate
                  }
                  style={styles.time}
                >
                  {publishedDate}
                </Text>
              </View>
            ) : null}
          </ClickView>
        </View>
      );
    }
  };

  renderHeader = () => {
    return (
      <View accessible={parentEnabled} style={styles.headerView}>
        <View style={styles.headerTextView}>
          <Text
            accessible={childEnabled}
            accessibilityLabel="Essentialist"
            testID="Essentialist"
            style={styles.headerText}
          >
            {translate('essentialist')}
          </Text>
        </View>
      </View>
    );
  };

  render() {
    const { EssentialistData } = this.props;
    return (
      <View accessible={parentEnabled} style={styles.container}>
        {this.renderHeader()}

        {/* Display essentialists data */}
        {EssentialistData.items && EssentialistData.items.length > 0 ? (
          <View accessible={parentEnabled} style={styles.flatListView}>
            <FlatList
              data={EssentialistData.items}
              keyExtractor={(x, i) => i.toString()}
              renderItem={this.renderItem}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    height: Platform.OS === 'ios' ? moderateScale(222) : moderateScale(250),
    width: horizontalScale(377),
    marginBottom: moderateScale(10),
  },
  subContainer: {
    width: moderateScale(140),
    /// height: Platform.OS === 'ios' ? moderateScale(178) : moderateScale(210),
    backgroundColor: Colors.white,
    marginLeft: horizontalScale(9),
    borderWidth: 0.2,
    borderColor: '#d3d3d3',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 7,
  },
  flatListView: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? moderateScale(41) : moderateScale(55),
    shadowColor: Colors.black,
    shadowOpacity: 0.2,
    shadowOffset: { height: 1, width: 0 },
    elevation: 5,
  },
  imageView: {
    width: moderateScale(124),
    height: verticalScale(94),
    paddingTop: moderateScale(8),
    paddingHorizontal: moderateScale(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: horizontalScale(8),
  },
  image: {
    width: moderateScale(124),
    height: verticalScale(94),
    resizeMode: 'cover',
  },
  time: {
    fontSize: moderateScale(12),
    fontFamily: FontFamily.fontFamilyRegular,
    textAlign: 'left',
    color: Colors.darkGrey,
    marginBottom: moderateScale(10),
  },
  title: {
    fontSize: moderateScale(14),
    fontFamily: FontFamily.fontFamilyBold,
    textAlign: 'left',
    color: Colors.black,
    width: moderateScale(124),
  },
  headerView: {
    backgroundColor: Colors.backgroundRed,
    height: moderateScale(82),
    width: horizontalScale(377),
  },
  headerTextView: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    marginLeft: moderateScale(11),
    paddingTop: moderateScale(10),
  },
  headerText: {
    fontSize: moderateScale(22),
    lineHeight: moderateScale(31),
    letterSpacing: moderateScale(2.1),
    textAlign: 'left',
    fontFamily:
      Platform.OS === 'ios'
        ? FontFamily.publicoBannerMediumIos
        : FontFamily.publicoBannerMediumAndroid,
    color: Colors.white,
  },
  viewAllView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: horizontalScale(16),
  },
  viewAll: {
    fontSize: horizontalScale(10),
    color: Colors.torchRed,
    fontWeight: '500',
    fontFamily: FontFamily.fontFamilyMedium,
  },
  timeView: {
    paddingHorizontal: horizontalScale(8),
    paddingTop: verticalScale(5),
  },
  titleView: {
    marginTop: verticalScale(14),
    paddingRight: horizontalScale(5),
    paddingHorizontal: horizontalScale(8),
  },
  indexView: {
    position: 'absolute',
    left: horizontalScale(8),
    bottom: verticalScale(-8),
    height: moderateScale(21),
    width: moderateScale(21),
    backgroundColor: Colors.backgroundRed,
  },
  indexText: {
    fontSize: horizontalScale(13),
    textAlign: 'center',
    paddingTop: verticalScale(5),
    color: Colors.white,
    fontFamily:
      Platform.OS === 'ios'
        ? FontFamily.publicoBannerMediumIos
        : FontFamily.publicoBannerMediumAndroid,
  },
});

export default Essentialist;
