import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Platform,
  LayoutAnimation,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import { onShowHeaderRunway, runwayId, runwatReview } from '../../redux/actions/RunwayAction';
import CustomImage from '../widgets/CustomImage';
import { horizontalScale, verticalScale, moderateScale } from '../../helpers/scale';
import Colors from '../../constants/colors/colors';
import FontFamily from '../../assets/fonts/fonts';
import { getFormattedDateTime } from './../../helpers/dateTimeFormats';
import { Images } from '../../assets';
import { parentEnabled, childEnabled, useStaticLable } from '../../../appConfig';
import automationStaticLables from '../../constants/automationStaticLables';
import ClickView from '../../components/widgets/clickView';
import { withNavigation } from 'react-navigation';
import ShowBannerView from '../native-ads/ShowBannerView';
import translate from '../../assets/strings/strings';
import ConsValues from '../../constants/consValue';
import { onLoadMore } from '../../redux/actions/HomeAction';

class RunwayComponent extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      isActionHeaderVisible: true,
      runwayData: [],
    };
  }

  _listViewOffset = 0;
  componentDidMount = async () => {
    await this.setState({
      runwayData: this.props.runwayDataFromRedux,
    });
  };

  componentDidUpdate = (oldProps) => {
    if (oldProps.runwayDataFromRedux !== this.props.runwayDataFromRedux) {
      this.setState(
        {
          runwayData: [...this.state.runwayData, ...this.props.runwayDataFromRedux],
        },
        () => {
          this.props.onLoadMore(false);
        },
      );
    }
  };

  renderItemTop = ({ item, index }: any) => {
    if (index < 6) {
      const { designerData, screen, jumpTo, navigation }: any = this.props;
      const designerCollection: any = designerData && designerData.collection;
      const designerSeason: any = designerData && designerData.season;
      const url = item && item.image && item.image.crops && item.image.crops[0].url;
      const photonUrl = url === undefined ? '' : url + `&w=${Math.round(horizontalScale(300))}`;
      const designerUrl = item && item.crops && item.crops[0].url;
      const photonDesignerUrl =
        designerUrl === undefined ? '' : designerUrl + `&w=${Math.round(horizontalScale(300))}`;
      const publishedDate: any = getFormattedDateTime(item['published-at']);
      return (
        <ClickView
          accessible={parentEnabled}
          onPress={() => {
            this.props.runwayId(item.id);
            this.props.runwatReview(item['post-type']);
            if (screen === 'runwayHome') {
              navigation.navigate('RunwayTab', {
                season: item && item.season,
                collection: item && item.collection,
                runwayId: item.id,
                tabIndex: item['post-type'] === 'runway-review' ? 1 : 0,
                review: item['post-type'],
                publishedAt: item['published-at'],
                collectionId: item['collection-id'],
              });
            }
            if (screen === 'designer') {
              return jumpTo('gallery');
            }
          }}
          style={styles.renderView}
        >
          <View style={styles.renderViewSub}>
            <CustomImage
              accessible={childEnabled}
              accessibilityRole={'image'}
              accessibilityLabel={useStaticLable ? automationStaticLables.runwayImage : ''}
              testID={useStaticLable ? automationStaticLables.runwayImage : item.image.alt}
              url={photonUrl || photonDesignerUrl}
              style={styles.imageStyle}
            />
            <Text
              accessible={childEnabled}
              accessibilityRole={'text'}
              accessibilityLabel={
                useStaticLable ? automationStaticLables.runwaySeason : item.season || designerSeason
              }
              testID={
                useStaticLable ? automationStaticLables.runwaySeason : item.season || designerSeason
              }
              style={styles.category}
            >
              {item.season || designerSeason}
            </Text>
            <Text
              accessible={childEnabled}
              accessibilityRole={'text'}
              accessibilityLabel={
                useStaticLable ? automationStaticLables.runwayCollection : item.collection
              }
              testID={useStaticLable ? automationStaticLables.runwayCollection : item.collection}
              style={styles.byline}
            >
              {item.collection || designerCollection}
            </Text>
            <Text
              accessible={childEnabled}
              accessibilityRole={'text'}
              accessibilityLabel={
                useStaticLable ? automationStaticLables.runwayPublishDate : publishedDate
              }
              testID={useStaticLable ? automationStaticLables.runwayPublishDate : publishedDate}
              style={styles.publishedDate}
            >
              {publishedDate}
            </Text>
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
        </ClickView>
      );
    }
  };

  renderItemBottom = ({ item, index }: any) => {
    if (index > 5) {
      const { designerData, screen, jumpTo, navigation }: any = this.props;
      const designerCollection: any = designerData && designerData.collection;
      const designerSeason: any = designerData && designerData.season;
      const url = item && item.image && item.image.crops && item.image.crops[1].url;
      const photonUrl = url === undefined ? '' : url + `&w=${Math.round(horizontalScale(300))}`;
      const designerUrl = item && item.crops && item.crops[1].url;
      const photonDesignerUrl =
        designerUrl === undefined ? '' : designerUrl + `&w=${Math.round(horizontalScale(300))}`;
      const publishedDate: any = getFormattedDateTime(item['published-at']);
      return (
        <View>
          <ClickView
            onPress={() => {
              this.props.runwayId(item.id);
              this.props.runwatReview(item['post-type']);
              if (screen === 'runwayHome') {
                navigation.navigate('RunwayTab', {
                  season: item && item.season,
                  collection: item && item.collection,
                  runwayId: item.id,
                  tabIndex: item['post-type'] === 'runway-review' ? 1 : 0,
                  review: item['post-type'],
                  publishedAt: item['published-at'],
                  collectionId: item['collection-id'],
                });
              }
              if (screen === 'designer') {
                return jumpTo('gallery');
              }
            }}
            style={styles.renderView}
            accessible={parentEnabled}
          >
            <View style={styles.renderViewSub}>
              <CustomImage
                accessible={childEnabled}
                accessibilityRole={'image'}
                accessibilityLabel={
                  useStaticLable ? automationStaticLables.runwayImage : item.image.title
                }
                testID={useStaticLable ? automationStaticLables.runwayImage : item.image.title}
                url={photonUrl || photonDesignerUrl}
                style={styles.imageStyle}
              />
              <Text
                accessible={childEnabled}
                accessibilityRole={'text'}
                accessibilityLabel={
                  useStaticLable
                    ? automationStaticLables.runwaySeason
                    : item.season || designerSeason
                }
                testID={
                  useStaticLable
                    ? automationStaticLables.runwaySeason
                    : item.season || designerSeason
                }
                style={styles.category}
              >
                {item.season || designerSeason}
              </Text>
              <Text
                accessible={childEnabled}
                accessibilityRole={'text'}
                accessibilityLabel={
                  useStaticLable ? automationStaticLables.runwayCollection : item.collection
                }
                testID={useStaticLable ? automationStaticLables.runwayCollection : item.collection}
                style={styles.byline}
              >
                {item.collection || designerCollection}
              </Text>
              <Text
                accessible={childEnabled}
                accessibilityRole={'text'}
                accessibilityLabel={
                  useStaticLable ? automationStaticLables.runwayPublishDate : publishedDate
                }
                testID={useStaticLable ? automationStaticLables.runwayPublishDate : publishedDate}
                style={styles.publishedDate}
              >
                {publishedDate}
              </Text>
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
          </ClickView>
        </View>
      );
    }
  };

  handleScroll = (event: Object) => {
    const CustomLayoutLinear = {
      duration: ConsValues.duration,
      create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
      delete: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
    };
    // Check if the user is scrolling up or down by confronting the new scroll position with your own one
    const change = event.nativeEvent.contentOffset.y - this._listViewOffset;
    if (Math.abs(change) > ConsValues.changeVal) {
      const currentOffset = event.nativeEvent.contentOffset.y;
      const direction = currentOffset > 0 && currentOffset > this._listViewOffset ? 'down' : 'up';
      // If the user is scrolling down (and the Header is still visible) hide it
      const isHeaderVisible = direction === 'up';
      if (isHeaderVisible !== this.props.showHeader) {
        LayoutAnimation.configureNext(CustomLayoutLinear);
        this.props.onShowHeaderRunway(isHeaderVisible);
      }
      // Update your scroll position
      this._listViewOffset = currentOffset;
    }
  };
  render() {
    const { designerData, filter, filterApplyData, screen }: any = this.props;
    const { runwayData }: any = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          scrollEventThrottle={16}
          onScroll={(event) => this.handleScroll(event)}
          data={
            filter === true
              ? filterApplyData && filterApplyData.items
              : screen === 'runwayHome'
              ? runwayData
              : designerData && designerData.items
          }
          keyExtractor={(x, i) => i.toString()}
          numColumns={2}
          renderItem={this.renderItemTop}
          style={styles.listView}
          showsVerticalScrollIndicator={false}
        />
        {filter === false && (
          <View style={styles.AddView}>
            <ShowBannerView
              adSizes={['banner', 'mediumRectangle']}
              adUnitID={'/8352/WWD_Mobile/app/runway/'}
            />
          </View>
        )}
        <FlatList
          scrollEventThrottle={16}
          onScroll={(event) => this.handleScroll(event)}
          data={
            filter === true
              ? filterApplyData
              : screen === 'runwayHome'
              ? runwayData
              : designerData && designerData.items
          }
          keyExtractor={(x, i) => i.toString()}
          numColumns={2}
          renderItem={this.renderItemBottom}
          style={styles.listView}
          showsVerticalScrollIndicator={false}
        />
        {this.props.isLoadMore && screen === 'runwayHome' ? (
          <ActivityIndicator size="small" color={Colors.grey} />
        ) : null}
        {filter === true &&
          filterApplyData &&
          filterApplyData.items &&
          filterApplyData.items.length === 0 && (
            <View>
              <Text style={styles.filterSelectedText}>{translate('emptyRunway')}</Text>
            </View>
          )}
      </View>
    );
  }
}
const mapDispatchToProps = (dispatch: any) => ({
  onShowHeaderRunway: (show: any) => dispatch(onShowHeaderRunway(show)),
  runwayId: (id: any) => dispatch(runwayId(id)),
  runwatReview: (RunwayReview: any) => dispatch(runwatReview(RunwayReview)),
  onLoadMore: (data: any) => dispatch(onLoadMore(data)),
});

const mapStateToProps = (state: any) => ({
  showHeader: state.runway.showHeader,
  runwayDataFromRedux: state.runway.runway_data,
  isLoadMore: state.home.isLoadMore,
});

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(RunwayComponent));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  listView: {
    marginTop: verticalScale(7),
    marginBottom: verticalScale(33),
  },
  renderView: {
    marginRight: horizontalScale(9),
    marginTop: verticalScale(10),
  },
  renderViewSub: {
    backgroundColor: Colors.whiteSmoke,
    elevation: 3,
    shadowColor: Colors.lightGrey,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    // shadowRadius: 7,
  },
  imageStyle: {
    width: horizontalScale(167),
    height: verticalScale(285),
  },
  category: {
    width: horizontalScale(167),
    textAlign: 'center',
    fontSize: moderateScale(13),
    color: Colors.backgroundRed,
    fontFamily: FontFamily.fontFamilyRegular,
    textTransform: 'uppercase',
    marginTop: verticalScale(9),
  },
  byline: {
    width: horizontalScale(167),
    textAlign: 'center',
    fontSize: moderateScale(18),
    color: Colors.black,
    fontFamily: FontFamily.fontFamilyBold,
    paddingTop: Platform.OS === 'ios' ? verticalScale(2) : verticalScale(8),
  },
  publishedDate: {
    width: horizontalScale(167),
    textAlign: 'center',
    fontSize: moderateScale(10),
    color: Colors.gray38,
    fontFamily: FontFamily.fontFamilyRegular,
    marginTop: verticalScale(3),
    marginBottom: verticalScale(10),
  },
  review: {
    position: 'absolute',
    left: 0,
    top: verticalScale(18),
  },
  add: {
    width: horizontalScale(322),
    height: verticalScale(53.04),
    alignSelf: 'center',
    marginBottom: verticalScale(20),
    position: 'absolute',
    paddingTop: verticalScale(100),
    left: 0,
  },
  AddView: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },
  filterSelectedText: {
    fontSize: moderateScale(18),
    fontFamily: FontFamily.fontFamilyMedium,
    color: Colors.black,
    marginLeft: horizontalScale(14),
    marginTop: verticalScale(150),
    textAlign: 'center',
  },
});
