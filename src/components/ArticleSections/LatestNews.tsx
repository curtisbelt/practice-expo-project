import React from 'react';
import { View, FlatList, Text, StyleSheet, Platform, ActivityIndicator, Image } from 'react-native';
import { verticalScale, horizontalScale, moderateScale } from '../../helpers/scale';
import Colors from '../../constants/colors/colors';
import FontFamily from '../../assets/fonts/fonts';
import { getFormattedDateTime } from './../../helpers/dateTimeFormats';
import CustomImage from '../widgets/CustomImage';
import { parentEnabled, childEnabled, useStaticLable } from '../../../appConfig';
import automationStaticLables from '../../constants/automationStaticLables';
import ClickView from '../widgets/clickView';
import ShowBannerView from '../native-ads/ShowBannerView';
import { connect } from 'react-redux';
import translate from '../../assets/strings/strings';
import { changeCategoryIndex, onLoadMore } from '../../redux/actions/HomeAction';
import { withNavigation } from 'react-navigation';
import { Images } from '../../assets/images';
import { runwayId, runwatReview } from '../../redux/actions/RunwayAction';

class LatestNews extends React.Component {
  constructor(props: any) {
    super(props);
    this.onEndReachedCalledDuringMomentum = true;
    this.state = {
      latestNewsData: [],
      persisteLatestNewsData: [],
      showViewAll: false,
    };
  }

  componentDidMount = async () => {
    await this.setState({
      latestNewsData: this.props.LatestNewsData.items,
      persisteLatestNewsData: this.props.LatestNewsData.items,
      showViewAll: this.props.showViewAll,
    });
  };

  componentDidUpdate = (oldProps, _oldState) => {
    if (oldProps.latestNewsDataFromRedux !== this.props.latestNewsDataFromRedux) {
      this.setState(
        {
          latestNewsData: [...this.state.latestNewsData, ...this.props.latestNewsDataFromRedux],
        },
        () => {
          this.props.onLoadMore(false);
        },
      );
    }
  };

  componentWillUnmount = () => {
    this.props.callParent();
  };

  onPress = (item: any) => {
    const { type, navigation }: any = this.props;
    const postType = item && item['post-type'];
    if (type && type.term && type.term.name === 'Runway') {
      this.props.runwayId(item.id);
      this.props.runwatReview(item['post-type']);
      navigation.navigate('RunwayTab', {
        runwayId: item.id,
        tabIndex: item['post-type'] === 'runway-review' ? 1 : 0,
        review: item['post-type'],
        season: item && item['post-title'],
        collection: item && item.byline,
        collectionId: item['collection-id'] ? item['collection-id'] : item.id,
      });
    } else if (postType === 'pmc-gallery') {
      navigation.navigate('GalleryImages', {
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
      navigation.navigate('ArticleDetail', {
        articleID: item.id,
        articleItem: item,
      });
    }
  };

  renderLatestNews = ({ item }: any) => {
    const { type }: any = this.props;
    const publishedAt = getFormattedDateTime(item['published-at']);
    const url = item && item.image && item.image.crops && item.image.crops[3].url;
    const photonUrl = url === undefined ? '' : url + `&w=${Math.round(horizontalScale(124))}`;

    return (
      <ClickView
        accessible={parentEnabled}
        style={styles.subContainer}
        onPress={() => this.onPress(item)}
      >
        <View style={styles.imageContainer}>
          <CustomImage
            accessible={childEnabled}
            accessibilityLabel={
              useStaticLable ? automationStaticLables.latestNewsImage : item.image.alt
            }
            testID={useStaticLable ? automationStaticLables.latestNewsImage : item.image.alt}
            url={photonUrl ? photonUrl : ''}
            style={styles.image}
          />
        </View>
        <View style={styles.textView}>
          <View style={styles.titleTextView}>
            <Text
              accessible={childEnabled}
              accessibilityLabel={
                useStaticLable ? automationStaticLables.latestNewsPostTitle : item['post-title']
              }
              testID={
                useStaticLable ? automationStaticLables.latestNewsPostTitle : item['post-title']
              }
              numberOfLines={3}
              style={styles.titleText}
            >
              {item['post-title']}
            </Text>
          </View>
          <View style={styles.subTextView}>
            {item.vertical !== null && item.vertical !== '' ? (
              <Text
                accessible={childEnabled}
                accessibilityLabel={
                  useStaticLable ? automationStaticLables.latestNewsCategory : item.vertical
                }
                testID={useStaticLable ? automationStaticLables.latestNewsCategory : item.vertical}
                numberOfLines={1}
                style={styles.categoryText}
              >
                {item.vertical.toUpperCase()}
              </Text>
            ) : null}
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
        {type &&
          type.term &&
          type.term.name === 'Runway' &&
          item &&
          item['post-type'] === 'runway-review' && (
            <View style={styles.review}>
              <Image
                accessible={childEnabled}
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
    );
  };

  renderItem = ({ item, index }: any) => {
    return (
      <View>
        {this.renderLatestNews({ item })}
        {(index + 1) % 5 === 0 && (
          <View style={styles.AddView}>
            <ShowBannerView
              adSizes={['banner', 'fullBanner']}
              adUnitID={'/8352/WWD_Mobile/app/homepage/banner'}
            />
          </View>
        )}
      </View>
    );
  };

  _handleViewAll = () => {
    //Taking user to Latest news tab which is by default on index 1.
    this.props.setCategoryIndex(1);
  };

  renderHeader = (item: any) => {
    return (
      <View accessible={parentEnabled}>
        <View style={styles.headerView}>
          <View style={styles.headerTitle}>
            <Text
              accessible={childEnabled}
              accessibilityLabel={
                useStaticLable ? automationStaticLables.latestNewsHeaderTitle : item.title
              }
              testID={useStaticLable ? automationStaticLables.latestNewsHeaderTitle : item.title}
              style={styles.headerText}
            >
              {item.title}
            </Text>
          </View>
          {this.state.showViewAll ? (
            <View accessible={parentEnabled} style={styles.viewAllView}>
              <ClickView onPress={() => this._handleViewAll()}>
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
          ) : null}
        </View>
        <View style={styles.thickBorder} />
      </View>
    );
  };

  renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  render() {
    const { latestNewsData }: any = this.state;
    return (
      <View>
        {latestNewsData.length > 0 ? (
          <View style={this.props.isLoadMore ? styles.enableLoader : styles.disableLoader}>
            <FlatList
              scrollEventThrottle={16}
              data={latestNewsData}
              renderItem={this.renderItem}
              keyExtractor={(x, i) => i.toString()}
              ListHeaderComponent={this.renderHeader(this.props.LatestNewsData)}
              ItemSeparatorComponent={this.renderSeparator}
            />

            {this.props.isLoadMore ? <ActivityIndicator size="small" color={Colors.grey} /> : null}
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  enableLoader: {
    flex: 1,
    marginBottom: moderateScale(80),
  },
  disableLoader: {
    flex: 1,
    marginBottom: moderateScale(0),
  },
  subContainer: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    width: horizontalScale(355),
  },
  headerView: {
    height: moderateScale(55),
    flexDirection: 'row',
    width: horizontalScale(353),
    alignItems: 'center',
    paddingLeft: moderateScale(10),
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
  activityIndicationView: {
    marginBottom: moderateScale(180),
  },
  imageContainer: {
    width: moderateScale(96.45),
    height: moderateScale(76),
    backgroundColor: Colors.greyLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: moderateScale(96.45),
    height: moderateScale(76),
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
    height: verticalScale(5),
    backgroundColor: Colors.black,
    marginBottom: verticalScale(15),
    alignSelf: 'center',
  },
  textView: {
    flexDirection: 'column',
    width: horizontalScale(233),
    marginLeft: horizontalScale(10),
    //marginTop: moderateScale(10),
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
  AddView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: verticalScale(10),
    //height: 60,
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
  review: {
    position: 'absolute',
    left: 0,
    top: verticalScale(10),
  },
});

const mapDispatchToProps = (dispatch: any) => ({
  setCategoryIndex: (index: any) => dispatch(changeCategoryIndex(index)),
  onLoadMore: (data: any) => dispatch(onLoadMore(data)),
  runwayId: (id: any) => dispatch(runwayId(id)),
  runwatReview: (RunwayReview: any) => dispatch(runwatReview(RunwayReview)),
});

const mapStateToProps = (state: any) => {
  return {
    latestNewsDataFromRedux: state.home.latest_news,
    isLoadMore: state.home.isLoadMore,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(LatestNews));
