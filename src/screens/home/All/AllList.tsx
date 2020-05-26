import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  RefreshControl,
  View,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { verticalScale, moderateScale, horizontalScale } from '../../../helpers/scale';
import Colors from '../../../constants/colors/colors';
import TrendingStories from '../../../components/ArticleSections/TrendingStories';
import MemoPads from '../../../components/ArticleSections/MemoPads';
import SponsoredCard from '../../../components/ArticleSections/SponsoredCard';
import LatestRunway from '../../../components/ArticleSections/LatestRunway';
import Hero from '../../../components/ArticleSections/Hero';
import LatestNews from '../../../components/ArticleSections/LatestNews';
import Essentialist from '../../../components/ArticleSections/Essentialist';
import LatestVideos from '../../../components/ArticleSections/LatestVideos';
import Section from '../../../components/ArticleSections/Section';
import apiService from '../../../service/fetchContentService/FetchContentService';
import {
  ApiMethods,
  ApiPaths,
  ApiUrls,
  LATEST_NEWS_PAGE_LIMIT,
  LATEST_NEWS_PER_PAGE,
} from '../../../service/config/serviceConstants';
import {
  onGetHomeContent,
  onGetLatestNewsSuccess,
  onShowHeaderHome,
  onLoadMore,
} from '../../../redux/actions/HomeAction';
import Flurry from 'react-native-flurry-sdk';
import ShowBannerView from '../../../components/native-ads/ShowBannerView';
import { withNavigation } from 'react-navigation';
import ConsValues from '../../../constants/consValue';
import EmptyComponent from '../../../components/widgets/EmptyComponent';
import translate from '../../../assets/strings/strings';
class AllList extends React.Component {
  constructor(props: any) {
    super(props);
    this.onEndReachedCalledDuringMomentum = true;
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this.state = {
      refreshing: false,
      pageNo: 1,
      loadMore: false,
      loading: true,
      isNetworkIssue: false,
    };
  }
  componentDidMount = async () => {
    Flurry.logEvent('Home All Tab invoked');
    this.HomeRefresh(false);
  };

  // This method used for fetching more data for latestnews inside All Tab
  calculatePageNumber = async ({ _distanceFromEnd }) => {
    if (!this.onEndReachedCalledDuringMomentum && this.state.pageNo !== LATEST_NEWS_PAGE_LIMIT) {
      await this.setState({ pageNo: this.state.pageNo + 1 });
      this.props.onLoadMore(true);
      this.onLoadMoreData();
      this.onEndReachedCalledDuringMomentum = true;
    }
  };
  //API call to fetch LatestNews more data
  onLoadMoreData = async () => {
    await apiService(
      ApiUrls.PROD_BASE_URL +
        ApiPaths.LATEST_NEWS +
        LATEST_NEWS_PER_PAGE +
        '&page=' +
        `${this.state.pageNo}`,
      ApiMethods.GET,
      this.onLatestNewsSuccess,
      this.onLatestNewsFailure,
    );
  };
  onLatestNewsSuccess = async (response: any) => {
    this.props.onGetLatestNewsSuccess(response.data.river.items);
    this.props.onLoadMore(false);
    this.setState({ refreshing: false });
  };
  onLatestNewsFailure = (_error: any) => {
    this.props.onLoadMore(false);
    this.setState({
      loadMore: false,
      refreshing: false,
    });
  };

  HomeRefresh = async (isPullToRefresh) => {
    if (isPullToRefresh) {
      apiService(
        ApiUrls.PROD_BASE_URL + ApiPaths.HOME_CONTENT,
        ApiMethods.GET,
        this.onHomeSuccess,
        this.onHomeFailure,
      );
    } else {
      await apiService(
        ApiUrls.PROD_BASE_URL +
          ApiPaths.LATEST_NEWS +
          LATEST_NEWS_PER_PAGE +
          '&page=' +
          `${this.state.pageNo}`,
        ApiMethods.GET,
        this.onLatestNewsSuccess,
        this.onLatestNewsFailure,
      );
    }
  };

  onHomeSuccess = (response: any) => {
    this.props.onGetHomeContent(response.data);
    this.setState({
      refreshing: false,
      isNetworkIssue: false,
    });
  };

  onHomeFailure = (error: any) => {
    if (error === translate('no_internet')) {
      this.setState({ isNetworkIssue: true });
    } else {
      this.setState({ loading: false, isNetworkIssue: false });
    }
  };

  _listViewOffset = 0;
  renderAdvertisement = () => {
    return (
      <View style={styles.addView}>
        <ShowBannerView
          adSizes={['mediumRectangle']}
          adUnitID={'/8352/WWD_Mobile/app/homepage/box/'}
        />
      </View>
    );
  };
  renderHero = (item: any) => {
    return <View>{item.items.length > 0 ? <Hero HeroData={item} {...this.props} /> : null}</View>;
  };
  resetPageNo = () => {
    this.setState({
      pageNo: 1,
    });
  };

  renderLatestNews = (item: any) => {
    return (
      <View style={styles.subContainer}>
        <LatestNews
          LatestNewsData={item}
          showViewAll={true}
          {...this.props}
          callParent={this.resetPageNo}
        />
      </View>
    );
  };

  renderLatestVideos = (item: any) => {
    return (
      <View style={styles.subContainer}>
        <LatestVideos
          LatestVideosData={item}
          {...this.props}
          handleSpinner={this.handleSpinnerUI}
        />
      </View>
    );
  };
  renderSection = (item: any) => {
    return (
      <View style={styles.subContainer}>
        {item.items.length > 0 ? <Section SectionData={item} {...this.props} /> : null}
      </View>
    );
  };
  renderTrending = (item: any) => {
    return (
      <View style={styles.subContainer}>
        {item.items.length > 0 ? (
          <TrendingStories TrendingStoriesData={item} {...this.props} />
        ) : null}
      </View>
    );
  };
  renderEssentialist = (item: any) => {
    return (
      <View style={styles.subContainer}>
        {item.items.length > 0 ? <Essentialist EssentialistData={item} {...this.props} /> : null}
      </View>
    );
  };
  renderRunway = (item: any) => {
    return (
      <View style={styles.subContainer}>
        {item.items.length > 0 ? <LatestRunway LatestRunwayData={item} {...this.props} /> : null}
      </View>
    );
  };
  renderSectionExcerpt = (item: any) => {
    return (
      <View style={styles.subContainer}>
        {item.items.length > 0 ? <MemoPads MemoPadsData={item} {...this.props} /> : null}
      </View>
    );
  };
  renderSponsoredCard = (item: any) => {
    return (
      <View style={styles.subContainer}>
        {item.items.length > 0 ? <SponsoredCard SponsoredData={item} {...this.props} /> : null}
      </View>
    );
  };

  renderLayout = ({ item }) => {
    switch (item.layout) {
      case 'hero':
        return <View>{this.renderHero(item)}</View>;
      case 'latest-news':
        return <View>{this.renderLatestNews(item)}</View>;
      case 'latest-videos':
        return <View>{this.renderLatestVideos(item)}</View>;
      case 'section':
        return <View>{this.renderSection(item)}</View>;
      case 'trending':
        return <View>{this.renderTrending(item)}</View>;
      case 'essentialist':
        return <View>{this.renderEssentialist(item)}</View>;
      case 'runway':
        return <View>{this.renderRunway(item)}</View>;
      case 'section-excerpt':
        return <View>{this.renderSectionExcerpt(item)}</View>;
      case 'sponsored-card':
        return <View>{this.renderSponsoredCard(item)}</View>;
      case 'advertisement':
        return <View>{this.renderAdvertisement()}</View>;
      default:
        return <View />;
    }
  };

  renderItem = ({ item }) => {
    return <View>{this.renderLayout({ item })}</View>;
  };
  keyExtractor = (item: any) => item.id;
  renderSeparator = () => {
    return <View style={styles.separator} />;
  };
  handleScroll = (event: Object) => {
    const CustomLayoutLinear = {
      duration: ConsValues.duration2,
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
        this.props.onShowHeaderHome(isHeaderVisible);
      }
      // Update your scroll position
      this._listViewOffset = currentOffset;
    }
  };
  render() {
    const { home_content }: any = this.props;
    if (this.state.isNetworkIssue) {
      return (
        <View style={{ marginBottom: moderateScale(200) }}>
          <EmptyComponent
            onPress={() => {
              apiService(
                ApiUrls.PROD_BASE_URL + ApiPaths.HOME_CONTENT,
                ApiMethods.GET,
                this.onHomeSuccess,
                this.onHomeFailure,
              );
            }}
            errorText={translate('internet_connection')}
          />
        </View>
      );
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <View>
            {home_content && home_content.modules.items ? (
              <FlatList
                scrollEventThrottle={16}
                onScroll={(event) => this.handleScroll(event)}
                onMomentumScrollBegin={() => {
                  this.onEndReachedCalledDuringMomentum = false;
                }}
                onEndReached={this.calculatePageNumber}
                onEndReachedThreshold={0.7}
                data={home_content.modules.items}
                renderItem={this.renderItem}
                keyExtractor={(x, i) => i.toString()}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={() => {
                      this.setState({
                        refreshing: true,
                        pageNo: 1,
                      });
                      // Home All section API request
                      this.HomeRefresh(true);
                    }}
                  />
                }
              />
            ) : null}
          </View>
        </SafeAreaView>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addView: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 260,
  },
  subContainer: {
    marginVertical: moderateScale(10),
    alignSelf: 'center',
  },
  layoutText: {
    fontSize: horizontalScale(20),
  },
  separator: {
    height: verticalScale(1),
    width: '90%',
    alignSelf: 'center',
    backgroundColor: Colors.grey,
  },
});
const mapDispatchToProps = (dispatch: any) => ({
  onShowHeaderHome: (show: any) => dispatch(onShowHeaderHome(show)),
  onGetHomeContent: (data: any) => dispatch(onGetHomeContent(data)),
  onGetLatestNewsSuccess: (data: any) => dispatch(onGetLatestNewsSuccess(data)),
  onLoadMore: (data: any) => dispatch(onLoadMore(data)),
});
const mapStateToProps = (state: any) => ({
  showHeader: state.home.showHeader,
  home_content: state.home.home_content,
});
export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(AllList));
