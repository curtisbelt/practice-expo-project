import React from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  RefreshControl,
  LayoutAnimation,
  UIManager,
  Platform,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import LatestNewsCard from '../../components/LatestNewsCard';
import apiService from '../../service/fetchContentService/FetchContentService';
import ActivityIndicatorView from '../../components/widgets/ActivityIndicator';
import { moderateScale } from '../../helpers/scale';
import translate from '../../assets/strings/strings';
import {
  ApiMethods,
  ApiPaths,
  ApiUrls,
  LATEST_NEWS_PAGE_LIMIT,
  LATEST_NEWS_PER_PAGE,
} from '../../service/config/serviceConstants';
import Flurry from 'react-native-flurry-sdk';
import EmptyComponent from '../../components/widgets/EmptyComponent';
import Colours from '../../constants/colors/colors';
import ShowBannerView from '../../components/native-ads/ShowBannerView';
import ConsValues from '../../constants/consValue';
import { connect } from 'react-redux';
import { onShowHeaderHome } from '../../redux/actions/HomeAction';
class LatestNewsScreen extends React.Component {
  constructor(props: any) {
    super(props);
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this.onEndReachedCalledDuringMomentum = true;
    this.state = {
      refreshing: false,
      isActionButtonVisible: true,
      pageNo: 1,
      latestNewsData: [],
      loadMore: false,
      loading: true,
    };
  }
  _listViewOffset = 0;
  componentDidMount = async () => {
    this.onRefresh(false);
    Flurry.logEvent('Latest News Tab invoked');
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
        this.props.onShowHeaderHome(isHeaderVisible);
        //this.setState({isHeaderVisible});
      }
      // Update your scroll position
      this._listViewOffset = currentOffset;
    }
  };
  onSuccess = (response: any) => {
    // Appending next set of data to existing dataset.
    this.setState({
      latestNewsData: [...this.state.latestNewsData, ...response.data.river.items],
      refreshing: false,
      loadMore: false,
      loading: false,
    });
  };
  onFailure = (_error: any) => {
    this.setState({
      loadMore: false,
      refreshing: false,
      loading: false,
    });
  };

  onPullSuccess = (response: any) => {
    this.setState({
      pageNo: 1,
      refreshing: false,
      loadMore: false,
      latestNewsData: response.data.river.items,
    });
  };
  onPullFailure = (_error: any) => {
    // console.log('error', error);
    this.setState({
      loadMore: false,
      refreshing: false,
      pageNo: 1,
    });
  };
  onRefresh = async (isPullToRefresh) => {
    if (isPullToRefresh) {
      apiService(
        ApiUrls.PROD_BASE_URL + ApiPaths.LATEST_NEWS + LATEST_NEWS_PER_PAGE + '&page=1',
        ApiMethods.GET,
        this.onPullSuccess,
        this.onPullFailure,
      );
    } else {
      await apiService(
        ApiUrls.PROD_BASE_URL +
          ApiPaths.LATEST_NEWS +
          LATEST_NEWS_PER_PAGE +
          '&page=' +
          `${this.state.pageNo}`,
        ApiMethods.GET,
        this.onSuccess,
        this.onFailure,
      );
    }
  };
  renderItem = ({ item, index }) => {
    return (
      <View>
        <LatestNewsCard {...this.props} LatestNewsData={item} />
        {(index + 1) % 3 === 0 && (
          <View style={styles.AddView}>
            <ShowBannerView
              adSizes={['mediumRectangle']}
              adUnitID={'/8352/WWD_Mobile/app/homepage/box/'}
            />
          </View>
        )}
      </View>
    );
  };
  //Calculating the page number to get next set of items based on page number.
  calculatePageNumber = async () => {
    if (!this.onEndReachedCalledDuringMomentum && this.state.pageNo !== LATEST_NEWS_PAGE_LIMIT) {
      await this.setState({ pageNo: this.state.pageNo + 1, loadMore: true });
      this.onRefresh(false);
      this.onEndReachedCalledDuringMomentum = true;
    }
  };
  render() {
    const { loading, latestNewsData } = this.state;
    if (loading) {
      return <ActivityIndicatorView />;
    } else {
      return (
        <SafeAreaView style={this.state.loadMore ? styles.enableLoader : styles.disableLoader}>
          <View>
            {latestNewsData.length > 0 ? (
              <View>
                <FlatList
                  scrollEventThrottle={16}
                  onScroll={(event) => this.handleScroll(event)}
                  onEndReached={this.calculatePageNumber}
                  onEndReachedThreshold={0.7}
                  onMomentumScrollBegin={() => {
                    this.onEndReachedCalledDuringMomentum = false;
                  }}
                  data={this.state.latestNewsData}
                  renderItem={this.renderItem}
                  keyExtractor={(x, i) => i.toString()}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={() => {
                        this.setState({
                          refreshing: true,
                        });
                        //Latestnews API request
                        this.onRefresh(true);
                      }}
                    />
                  }
                />
                {/* <ActivityIndicator size="small" color={Colours.grey} /> */}
                {/* Showing bottom loader when more data are getting fetched from the server */}
                {this.state.loadMore ? (
                  <ActivityIndicator size="small" color={Colours.grey} />
                ) : (
                  <View />
                )}
              </View>
            ) : (
              <EmptyComponent
                onPress={() => {
                  this.onRefresh(false);
                }}
                errorText={translate('internet_connection')}
              />
            )}
          </View>
        </SafeAreaView>
      );
    }
  }
}
const styles = StyleSheet.create({
  enableLoader: {
    flex: 1,
    marginBottom: moderateScale(64),
  },
  disableLoader: {
    flex: 1,
    marginBottom: moderateScale(0),
  },
  AddView: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: moderateScale(10),
    // height: 66,
  },
});
const mapDispatchToProps = (dispatch: any) => ({
  onShowHeaderHome: (show: any) => dispatch(onShowHeaderHome(show)),
});
const mapStateToProps = (state: any) => ({
  showHeader: state.home.showHeader,
});
export default connect(mapStateToProps, mapDispatchToProps)(LatestNewsScreen);
