import React from 'react';
import { View, Text, StyleSheet, FlatList, Platform, Image } from 'react-native';
import Colors from '../../constants/colors/colors';
import { horizontalScale, verticalScale, moderateScale } from '../../helpers/scale';
import FontFamily from '../../assets/fonts/fonts';
import translate from '../../assets/strings/strings';
import CustomImage from '../widgets/CustomImage';
import { parentEnabled, childEnabled, useStaticLable } from '../../../appConfig';
import automationStaticLables from '../../constants/automationStaticLables';
import ClickView from '../widgets/clickView';
import { changeCategoryIndex, setSubCategoryIndex } from '../../redux/actions/HomeAction';
import { getCategoryIndex } from '../../helpers/getCategoryIndex';
import { connect } from 'react-redux';

import { Images } from '../../assets';
import { runwayId, runwatReview } from '../../redux/actions/RunwayAction';

class LatestRunway extends React.Component {
  _handleViewAll = (title) => {
    const index = getCategoryIndex(this.props.menu_sections, title);
    this.props.setCategoryIndex(index);
    this.props.setSubCategoryIndex(0);
  };

  renderItem = ({ item }) => {
    if (item && Object.entries(item).length > 0) {
      const category = item && item.category && item.category.toUpperCase();
      const url = item && item.image && item.image.crops && item.image.crops[1].url;
      const photonUrl = url === undefined ? '' : url + `&w=${Math.round(moderateScale(400))}`;
      return (
        <ClickView
          accessible={parentEnabled}
          style={styles.subContainer}
          onPress={() => {
            // this.props.navigation.navigate('ArticleDetail', {
            //   articleID: item.id,
            // });
            this.props.runwayId(item.id);
            this.props.runwatReview(item['post-type']);
            this.props.navigation.navigate('RunwayTab', {
              season: item && item['post-title'],
              collection: item && item.byline,
              runwayId: item.id,
              tabIndex: item && item['post-type'] === 'runway-review' ? 1 : 0,
              review: item['post-type'],
              collectionId: item['collection-id'] ? item['collection-id'] : item.id,
            });
          }}
        >
          <View style={styles.imageContianer}>
            {Object.entries(item.image).length !== 0 ? (
              <CustomImage
                accessible={childEnabled}
                accessibilityRole={'image'}
                accessibilityLabel={
                  useStaticLable ? automationStaticLables.latestRunwayImage : item.image.alt
                }
                testID={useStaticLable ? automationStaticLables.latestRunwayImage : item.image.alt}
                url={photonUrl ? photonUrl : null}
                style={styles.image}
              />
            ) : null}
            {item && item['post-type'] === 'runway-review' && (
              <View style={styles.review}>
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
          </View>

          <View style={styles.categoryView}>
            <Text
              accessible={childEnabled}
              accessibilityLabel={
                useStaticLable ? automationStaticLables.latestRunwayCategory : category
              }
              testID={useStaticLable ? automationStaticLables.latestRunwayCategory : category}
              style={styles.category}
            >
              {category}
            </Text>
          </View>
          <View style={styles.titleView}>
            <Text
              accessible={childEnabled}
              accessibilityLabel={
                useStaticLable ? automationStaticLables.latestRunwayPostTitle : item['post-title']
              }
              testID={
                useStaticLable ? automationStaticLables.latestRunwayPostTitle : item['post-title']
              }
              numberOfLines={2}
              style={styles.title}
            >
              {item['post-title']}
            </Text>
          </View>
        </ClickView>
      );
    }
  };

  renderHeader = () => {
    return (
      <View accessible={parentEnabled} style={styles.headerView}>
        <View style={styles.headerTextView}>
          <Text
            accessible={childEnabled}
            accessibilityLabel="latest runway"
            testID="latest runway"
            style={styles.headerText}
          >
            {translate('latest_runway')}
          </Text>
        </View>
        <View accessible={parentEnabled} style={styles.viewAllView}>
          <ClickView
            onPress={() => {
              this.props.navigation.navigate('Runway');
            }}
          >
            <Text
              accessible={childEnabled}
              accessibilityLabel="view all"
              testID="view all"
              style={styles.viewAll}
            >
              {translate('view_all')}
            </Text>
          </ClickView>
        </View>
      </View>
    );
  };

  render() {
    const { LatestRunwayData } = this.props;
    return (
      <View accessible={parentEnabled} style={styles.container}>
        {this.renderHeader()}

        {/* Display latest runway data */}
        {LatestRunwayData.items && LatestRunwayData.items.length > 0 ? (
          <FlatList
            data={LatestRunwayData.items}
            keyExtractor={(x, i) => i.toString()}
            renderItem={this.renderItem}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.black,
    height: moderateScale(400),
    width: horizontalScale(377),
    paddingHorizontal: moderateScale(10),
  },
  subContainer: {
    width: moderateScale(155),
    height: moderateScale(300),
    backgroundColor: Colors.white,
    marginRight: moderateScale(5),
    marginLeft: moderateScale(5),
  },
  imageContianer: {
    width: moderateScale(146),
    height: moderateScale(220),
    backgroundColor: Colors.white,
    marginTop: moderateScale(5),
    marginHorizontal: moderateScale(5),
  },
  image: {
    width: moderateScale(146),
    height: moderateScale(220),
    resizeMode: 'cover',
  },
  category: {
    fontSize: moderateScale(11),
    fontFamily: FontFamily.fontFamilyRegular,
    textAlign: 'center',
    color: Colors.backgroundRed,
  },
  title: {
    fontSize: moderateScale(16),
    fontFamily: FontFamily.fontFamilyBold,
    textAlign: 'center',
    color: Colors.black,
  },
  headerView: {
    flexDirection: 'row',
    backgroundColor: Colors.black,
    height: moderateScale(67),
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(5),
  },
  headerTextView: {
    alignSelf: 'center',
  },
  headerText: {
    fontSize: moderateScale(32),
    lineHeight: moderateScale(32),
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
  },
  viewAll: {
    fontSize: moderateScale(10),
    lineHeight: moderateScale(14),
    letterSpacing: moderateScale(0.81),
    color: Colors.torchRed,
    fontWeight: '500',
    fontFamily: FontFamily.fontFamilyBold,
  },
  categoryView: {
    marginTop: moderateScale(6),
    paddingRight: moderateScale(5),
  },
  titleView: {
    marginTop: moderateScale(6),
  },
  review: {
    position: 'absolute',
    left: 0,
    top: verticalScale(18),
  },
});

const mapDispatchToProps = (dispatch: any) => ({
  setCategoryIndex: (index: any) => dispatch(changeCategoryIndex(index)),
  setSubCategoryIndex: (index: any) => dispatch(setSubCategoryIndex(index)),
  runwayId: (id: any) => dispatch(runwayId(id)),
  runwatReview: (RunwayReview: any) => dispatch(runwatReview(RunwayReview)),
});

const mapStateToProps = (state: any) => ({
  menu_sections: state.home.menu_sections,
});

export default connect(mapStateToProps, mapDispatchToProps)(LatestRunway);
