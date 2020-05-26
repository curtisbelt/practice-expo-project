import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Platform,
  LayoutAnimation,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { onShowHeaderRunway, runwayId, runwatReview } from '../../redux/actions/RunwayAction';
import CustomImage from '../../components/widgets/CustomImage';
import { horizontalScale, verticalScale, moderateScale } from '../../helpers/scale';
import Colors from '../../constants/colors/colors';
import FontFamily from '../../assets/fonts/fonts';
import { getFormattedDateTime } from './../../helpers/dateTimeFormats';
import { Images } from '../../assets';
import { parentEnabled, childEnabled, useStaticLable } from '../../../appConfig';
import automationStaticLables from '../../constants/automationStaticLables';
import ClickView from '../../components/widgets/clickView';
import ShowBannerView from '../../components/native-ads/ShowBannerView';
import translate from '../../assets/strings/strings';
import ConsValues from '../../constants/consValue';
import EmptyComponent from '../../components/widgets/EmptyComponent';

const { width } = Dimensions.get('screen');

class RunwayComponent extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      isActionHeaderVisible: true,
    };

    this.onEndReachedCalledDuringMomentum = true;
  }

  _listViewOffset = 0;

  renderItemTop = ({ item, index }: any) => {
    const { designerData, navigation }: any = this.props;
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
          accessible={parentEnabled}
          onPress={() => {
            this.props.runwayId(item.id);
            this.props.runwatReview(item['post-type']);
            navigation.navigate('RunwayTab', {
              season: item && item.season,
              collection: item && item.collection,
              runwayId: item.id,
              tabIndex: item['post-type'] === 'runway-review' ? 1 : 0,
              review: item['post-type'],
              publishedAt: item['published-at'],
              collectionId: item['collection-id'],
            });
          }}
          style={styles.renderView}
        >
          <View style={styles.renderViewSub}>
            <View style={styles.imageView}>
              {Object.entries(item.image).length > 0 ? (
                <CustomImage
                  accessible={childEnabled}
                  accessibilityRole={'image'}
                  accessibilityLabel={useStaticLable ? automationStaticLables.runwayImage : ''}
                  testID={useStaticLable ? automationStaticLables.runwayImage : item.image.alt}
                  url={photonUrl || photonDesignerUrl}
                  style={styles.imageStyle}
                />
              ) : null}
            </View>
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

        {index > 0 && (index + 1) % 6 === 0 ? (
          <View style={styles.addContainer}>
            <ShowBannerView
              adSizes={['banner', 'fullBanner']}
              adUnitID={'/8352/WWD_Mobile/app/runway/'}
            />
          </View>
        ) : null}
      </View>
    );
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

  _handleEndReached = () => {
    // alert('End reached');
    if (!this.onEndReachedCalledDuringMomentum) {
      this.props.handlePagination();
      this.onEndReachedCalledDuringMomentum = true;
    }
  };

  render() {
    const { runwayData, loadMore }: any = this.props;

    return (
      <View style={styles.container}>
        {runwayData && runwayData.length > 0 ? (
          <FlatList
            onEndReached={this._handleEndReached}
            onEndReachedThreshold={0.1}
            onMomentumScrollBegin={() => (this.onEndReachedCalledDuringMomentum = false)}
            onScroll={(event) => this.handleScroll(event)}
            data={runwayData}
            keyExtractor={(x, i) => i.toString()}
            numColumns={2}
            renderItem={this.renderItemTop}
            style={styles.listView}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={this.props.refreshing}
                onRefresh={() => this.props.handlePullRefresh()}
              />
            }
            ListFooterComponent={
              loadMore ? (
                <View style={styles.loadMore}>
                  <ActivityIndicator size="small" color={Colors.grey} />
                </View>
              ) : null
            }
          />
        ) : (
          <EmptyComponent
            style={styles.emptyContainer}
            onPress={() => {
              this.props.handleRefresh();
            }}
            errorText={translate('try_again')}
          />
        )}
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  onShowHeaderRunway: (show: any) => dispatch(onShowHeaderRunway(show)),
  runwayId: (id: any) => dispatch(runwayId(id)),
  runwatReview: (RunwayReview: any) => dispatch(runwatReview(RunwayReview)),
});

const mapStateToProps = (state: any) => ({
  showHeader: state.runway.showHeader,
});

export default connect(mapStateToProps, mapDispatchToProps)(RunwayComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  listView: {
    marginTop: verticalScale(7),
  },
  renderView: {
    marginRight: horizontalScale(9),
    marginTop: verticalScale(10),
    width: width / 2 - moderateScale(14),
  },
  renderViewSub: {
    backgroundColor: Colors.whiteSmoke,
    elevation: 3,
    shadowColor: Colors.lightGrey,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
  },
  imageStyle: {
    width: width / 2 - moderateScale(14),
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
  addContainer: {
    marginLeft: horizontalScale(-(width / 2 - moderateScale(-14))),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(10),
  },
  filterSelectedText: {
    fontSize: moderateScale(18),
    fontFamily: FontFamily.fontFamilyMedium,
    color: Colors.black,
    textAlign: 'center',
  },
  loadMore: {
    marginVertical: verticalScale(15),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageView: {
    width: width / 2 - moderateScale(14),
    height: verticalScale(285),
    backgroundColor: Colors.greyLight,
  },
});
