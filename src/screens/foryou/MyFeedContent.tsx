import React from 'react';
import {
  StyleSheet,
  RefreshControl,
  View,
  SafeAreaView,
  FlatList,
  Text,
  ActivityIndicator,
} from 'react-native';
import { asynStoreKeys, getJSONItem } from '../../helpers/asyncStore';
import apiService from '../../service/fetchContentService/FetchContentService';
import {
  ApiMethods,
  ApiPaths,
  ApiUrls,
  LATEST_NEWS_PAGE_LIMIT,
} from '../../service/config/serviceConstants';
import ActivityIndicatorView from '../../components/widgets/ActivityIndicator';
import LatestNewsCard from '../../components/LatestNewsCard';
import ShowBannerView from '../../components/native-ads/ShowBannerView';
import { moderateScale } from '../../helpers/scale';
import FontFamily from '../../assets/fonts/fonts';
import Colors from '../../constants/colors/colors';
import {
  handleAndroidBackButton,
  removeAndroidBackButtonHandler,
} from '../../helpers/androidBackButton';
import translate from '../../assets/strings/strings';
import EmptyComponent from '../../components/widgets/EmptyComponent';
import { onShowHeaderHome } from '../../redux/actions/HomeAction';
import { connect } from 'react-redux';

class MyFeedContent extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      refreshing: false,
      myFeedData: [],
      isNetworkIssue: false,
      pageNo: 1,
      loadMore: false,
    };
    handleAndroidBackButton(() => {
      this.handleBackPress();
    });
  }

  _listViewOffset = 0;

  componentDidMount = async () => {
    this.fetchMyFeedData();
  };

  handleBackPress = () => {
    this.props.navigation.goBack(null);
    return true;
  };

  componentWillUnmount = () => {
    removeAndroidBackButtonHandler();
  };

  fetchMyFeedData = async () => {
    let categoreis = await getJSONItem(asynStoreKeys.selectedCategory);
    categoreis = JSON.parse(categoreis);
    //Generating Vertical Ids with comma seperated values
    let verticalsId = null;
    for (let i = 0; i < categoreis?.length; i++) {
      if (i === 0) {
        verticalsId = categoreis[i].id;
      } else {
        verticalsId = verticalsId + ',' + categoreis[i].id;
      }
    }
    await apiService(
      ApiUrls.PROD_BASE_URL +
        ApiPaths.PERSONALIZATION_FEED +
        verticalsId +
        '&page=' +
        `${this.state.pageNo}`,
      ApiMethods.GET,
      this.onSuccess,
      this.onFaliure,
    );
  };

  onRefreshSuccess = (response: any) => {
    this.setState({
      pageNo: 1,
      loading: false,
      loadMore: false,
      myFeedData: response.data.items,
      isNetworkIssue: false,
    });
  };
  onRefreshFaliure = (error: any) => {
    if (error === translate('no_internet')) {
      this.setState({
        loading: false,
        loadMore: false,
        refreshing: false,
        isNetworkIssue: true,
      });
    } else {
      this.setState({
        loadMore: false,
        refreshing: false,
        pageNo: 1,
      });
    }
  };

  onSuccess = (response: any) => {
    // Appending next set of data to existing dataset.
    const { pageNo, myFeedData }: any = this.state;
    let updatedResponse = [];
    if (pageNo === 1) {
      updatedResponse = [...response.data.items];
    } else {
      updatedResponse = [...myFeedData, ...response.data.items];
    }
    this.setState({
      myFeedData: updatedResponse,
      loading: false,
      loadMore: false,
    });
  };

  onFaliure = () => {
    this.setState({
      loadMore: false,
      refreshing: false,
      loading: false,
    });
  };

  //Calculating the page number to get next set of items based on page number.
  onEndReached = async ({ _distanceFromEnd }) => {
    console.log('end reched');
    const { pageNo }: any = this.state;
    const updated = pageNo + 1;
    if (updated <= LATEST_NEWS_PAGE_LIMIT) {
      await this.setState({ pageNo: this.state.pageNo + 1, loadMore: true });
      this.fetchMyFeedData();
    }
  };

  renderItem = ({ item, index }) => {
    return (
      <View>
        <LatestNewsCard {...this.props} LatestNewsData={item} />
        {(index + 1) % 3 === 0 && (
          <View style={styles.AddView}>
            <ShowBannerView
              adSizes={['banner', 'fullBanner']}
              adUnitID={'/8352/WWD_Mobile/app/feed/'}
            />
          </View>
        )}
      </View>
    );
  };
  render() {
    if (this.state.loading) {
      return <ActivityIndicatorView />;
    } else if (this.state.isNetworkIssue) {
      return (
        <EmptyComponent
          onPress={() => this.fetchMyFeedData()}
          errorText={translate('internet_connection')}
        />
      );
    } else if (this.state.myFeedData.length === 0) {
      return (
        <SafeAreaView style={styles.emptyView}>
          <Text style={styles.textView}>No feed for selected categories</Text>
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <FlatList
            scrollEventThrottle={16}
            // onScroll={event => this.handleScroll(event)}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={1}
            // onMomentumScrollBegin={() => {
            //   this.onEndReachedCalledDuringMomentum = false;
            // }}
            data={this.state.myFeedData}
            renderItem={this.renderItem}
            keyExtractor={(x, i) => i.toString()}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => {
                  this.setState({
                    refreshing: true,
                  });
                  //myfeed api request
                  this.fetchMyFeedData();
                }}
              />
            }
          />
          {this.state.loadMore ? <ActivityIndicator size="small" color={Colors.grey} /> : <View />}
        </SafeAreaView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: moderateScale(250),
  },
  textView: {
    fontSize: moderateScale(16),
    fontFamily: FontFamily.fontFamilyRegular,
    color: Colors.black,
  },
  AddView: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: moderateScale(10),
  },
});
const mapDispatchToProps = (dispatch: any) => ({
  onShowHeaderHome: (show: any) => dispatch(onShowHeaderHome(show)),
});
const mapStateToProps = (state: any) => ({
  showHeader: state.home.showHeader,
});

export default connect(mapStateToProps, mapDispatchToProps)(MyFeedContent);
