import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  UIManager,
  Platform,
  LayoutAnimation,
  RefreshControl,
  Dimensions,
} from 'react-native';
import Colors from '../../constants/colors/colors';
import FontFamily from '../../assets/fonts/fonts';
import { moderateScale, verticalScale, horizontalScale } from '../../helpers/scale';
import { connect } from 'react-redux';
import {
  setSubCategoryIndex,
  onShowHeaderHome,
  onLoadMore,
  onGetLatestNewsSuccess,
} from '../../redux/actions/HomeAction';
import Hero from '../../components/ArticleSections/Hero';
import LatestNews from '../../components/ArticleSections/LatestNews';
import apiService from '../../service/fetchContentService/FetchContentService';
import { ApiMethods, LATEST_NEWS_PAGE_LIMIT } from '../../service/config/serviceConstants';
import { ScrollView } from 'react-native-gesture-handler';
import ActivityIndicatorView from '../../components/widgets/ActivityIndicator';
import { parentEnabled, childEnabled, useStaticLable } from '../../../appConfig';
import automationStaticLables from '../../constants/automationStaticLables';
import EmptyComponent from '../../components/widgets/EmptyComponent';
import translate from '../../assets/strings/strings';
import NetInfo from '@react-native-community/netinfo';
import ConsValues from '../../constants/consValue';
import WebView from 'react-native-webview';

class SubSection extends React.Component {
  constructor(props: any) {
    super(props);
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    this.state = {
      selected: 0,
      loading: false,
      refreshing: false,
      sub_sections: props.children,
      sub_section_data: {},
      pageNo: 1,
      isConnected: true,
      paginationData: '',
    };

    NetInfo.fetch().then((state) => {
      this.setState({ isConnected: state.isConnected });
    });
  }

  componentDidMount() {
    if (this.state.isConnected) {
      this.handleAPICall(this.props.children[this.props.subcategory_index].link);
    }

    this.scrollToIndex(this.props.subcategory_index);
  }

  getSnapshotBeforeUpdate = (oldProps: any, _oldState: any) => {
    if (oldProps.subcategory_index !== this.props.subcategory_index) {
      return true;
    } else {
      return false;
    }
  };

  componentDidUpdate(oldProps: any, oldState: any, snapShot: any) {
    //This will invoke when user change the tab. We are again setting the pageNo. to 1.
    if (oldProps.category_index !== this.props.category_index) {
      this.setState({
        pageNo: 1,
      });
    }
    if (snapShot) {
      this.scrollToIndex(this.props.subcategory_index);
    }

    if (this.state.sub_sections !== this.props.children) {
      this.setState({
        sub_sections: this.props.children,
      });

      this.props.setSubCategoryIndex(this.props.subcategory_index);

      if (this.state.isConnected) {
        this.handleAPICall(this.props.children[this.props.subcategory_index].link);
      }

      this.scrollToIndex(this.props.subcategory_index);
    }
  }

  renderItem = ({ item, index }: any) => {
    const { subcategory_index }: any = this.props;
    return (
      <View
        style={[styles.item, subcategory_index === index ? styles.active_item : null]}
        accessible={parentEnabled}
      >
        <Text
          accessible={childEnabled}
          accessibilityLabel={useStaticLable ? automationStaticLables.subSectionTitle : item.title}
          testID={useStaticLable ? automationStaticLables.subSectionTitle : item.title}
          style={[styles.label, subcategory_index === index ? styles.active_label : null]}
          onPress={() => this._handleItemPress(item, index)}
        >
          {item.title}
        </Text>
      </View>
    );
  };

  scrollToIndex = (index: any) => {
    this.flatListRef.scrollToIndex({
      animated: true,
      index: index,
      viewOffset: horizontalScale(100),
    });
  };

  _handleItemPress = (item: any, index: Number) => {
    this.setState({ pageNo: 1 });
    this.props.setSubCategoryIndex(index);
    this.handleAPICall(item.link);
    this.scrollToIndex(index);
  };

  handleAPICall = (link: any) => {
    if (link.length > 2 && link.includes('https://wwd.com')) {
      try {
        this.setState({ sub_section_data: {}, loading: true });
        apiService(link, ApiMethods.GET, this.onSectionSuccess, this.onSectionFailure);
      } catch (error) {
        console.log('Sub section error catch', error);
      }
    } else {
      this.setState({ sub_section_data: {} });
    }
  };

  //API call to fetch LatestNews more data
  handlepaginationAPICall = (link: any) => {
    if (link.length > 2) {
      apiService(
        link + '/?page=' + this.state.pageNo,
        ApiMethods.GET,
        this.onLatestNewsSuccess,
        this.onLatestNewsFailure,
      );
    }
  };

  onSectionSuccess = (response: any) => {
    console.log('section response', response);
    if (response && response.data) {
      this.setState({
        sub_section_data: response.data,
        loading: false,
        refreshing: false,
        isConnected: true,
      });
    } else {
      this.setState({ loading: false });
      console.log('Sub section success', response);
    }
  };

  onSectionFailure = (error: any) => {
    if (error === translate('no_internet')) {
      this.setState({ loading: false, isConnected: false });
    } else {
      this.setState({ loading: false, isConnected: true });
    }

    console.log('Sub section error', error);
  };

  _handleRefresh = (selected: any) => {
    const item = this.state.sub_sections[selected];
    this.setState({ refreshing: true });
    if (item.link.length > 2) {
      apiService(item.link, ApiMethods.GET, this.onSectionSuccess, this.onSectionFailure);
    }
  };

  _listViewOffset = 0;
  handleScroll = async (event: Object) => {
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
      }
      // Update your scroll position
      this._listViewOffset = currentOffset;
    }
  };

  handlePagination = async (link: any) => {
    if (this.state.pageNo !== LATEST_NEWS_PAGE_LIMIT) {
      this.props.onLoadMore(false);
      await this.setState({
        pageNo: this.state.pageNo + 1,
      });
      this.handlepaginationAPICall(link);
    }
    if (this.state.pageNo === LATEST_NEWS_PAGE_LIMIT) {
      this.props.onLoadMore(false);
    }
  };

  onLatestNewsSuccess = async (response: any) => {
    this.setState({ loading: false, isConnected: true });
    this.props.onGetLatestNewsSuccess(response.data.river.items);
    this.props.onLoadMore(true);
  };
  onLatestNewsFailure = (_error: any) => {
    this.props.onLoadMore(false);
  };
  resetPageNo = () => {};

  renderSubSectionView = (item, selected) => {
    if (this.state.isConnected) {
      if (
        this.state.sub_sections[selected].link.includes('https://wwd.com') &&
        ((item.hero && item.hero !== null && item.hero.items && item.hero.items.length > 0) ||
          (item.river && item.river !== null && item.river.items && item.river.items.length > 0))
      ) {
        return (
          <ScrollView
            scrollEventThrottle={16}
            onScroll={(event) => this.handleScroll(event)}
            onMomentumScrollEnd={() =>
              this.handlePagination(this.props.children[this.props.subcategory_index].link)
            }
            style={styles.sub_container}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => this._handleRefresh(selected)}
              />
            }
          >
            <View accessible={parentEnabled}>
              {/* Rendering hero data */}
              {item.hero && item.hero !== null && item.hero.items && item.hero.items.length > 0 ? (
                <Hero HeroData={item.hero} type={item} {...this.props} />
              ) : null}

              {/* Rendering latest news */}
              {item.river &&
              item.river !== null &&
              item.river.items &&
              item.river.items.length > 0 ? (
                <LatestNews
                  LatestNewsData={item.river}
                  type={item}
                  {...this.props}
                  callParent={this.resetPageNo}
                />
              ) : null}
            </View>
          </ScrollView>
        );
      } else if (!this.state.sub_sections[selected].link.includes('https://wwd.com')) {
        return (
          <WebView
            style={styles.sub_container}
            source={{ uri: this.state.sub_sections[selected].link }}
          />
        );
      } else {
        return (
          <EmptyComponent
            style={styles.noContentContainer}
            onPress={() => this.handleAPICall(this.state.sub_sections[selected].link)}
            errorText={translate('try_again')}
          />
        );
      }
    } else {
      return (
        <EmptyComponent
          onPress={() => {
            this.handleAPICall(this.state.sub_sections[this.props.subcategory_index].link);
          }}
          style={styles.noContentContainer}
          errorText={translate('internet_connection')}
        />
      );
    }
  };

  render() {
    const { loading, sub_sections, sub_section_data }: any = this.state;
    const { subcategory_index }: any = this.props;
    return (
      <View style={styles.container}>
        {sub_sections && sub_sections.length > 0 ? (
          <View style={styles.flatListView}>
            <FlatList
              data={sub_sections}
              ref={(ref) => (this.flatListRef = ref)}
              renderItem={this.renderItem}
              onScrollToIndexFailed={(info) => {
                const wait = new Promise((resolve) => setTimeout(resolve, 100));
                wait.then(() => {
                  this.flatListRef.scrollToIndex({
                    index: info.index,
                    animated: true,
                    viewOffset: horizontalScale(100),
                  });
                });
              }}
              keyExtractor={(item) => item.title}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        ) : null}

        {loading ? (
          <ActivityIndicatorView />
        ) : (
          this.renderSubSectionView(sub_section_data, subcategory_index)
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: verticalScale(6),
  },
  flatListView: {
    width: Dimensions.get('window').width,
    height: verticalScale(44),
    marginBottom: verticalScale(6),
    padding: moderateScale(4),
  },
  item: {
    marginHorizontal: moderateScale(6),
    height: verticalScale(30),
    borderWidth: 1,
    borderColor: Colors.transparent,
    borderRadius: moderateScale(15),
    paddingHorizontal: horizontalScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowColor: Colors.lightGrey,
    shadowOpacity: 1,
    elevation: 3,
    backgroundColor: Colors.white,
  },
  active_item: {
    borderColor: Colors.red,
  },
  label: {
    fontSize: moderateScale(14),
    letterSpacing: moderateScale(0.48),
    color: Colors.black,
    textTransform: 'capitalize',
    fontFamily: FontFamily.fontFamilyRegular,
  },
  active_label: {
    color: Colors.red,
  },
  sub_container: {
    flex: 1,
  },
  noContentContainer: {
    marginTop: 0,
    flex: 1,
    justifyContent: 'center',
  },
});

const mapStateToProps = (state: any) => ({
  showHeader: state.home.showHeader,
  subcategory_index: state.home.subcategory_index,
  sub_sections_index: state.sections.sub_sections_index,
  category_index: state.home.category_index,
});

const mapDispatchToProps = (dispatch: any) => ({
  onShowHeaderHome: (show: any) => dispatch(onShowHeaderHome(show)),
  setSubCategoryIndex: (index: any) => dispatch(setSubCategoryIndex(index)),
  onLoadMore: (data: any) => dispatch(onLoadMore(data)),
  onGetLatestNewsSuccess: (data: any) => dispatch(onGetLatestNewsSuccess(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SubSection);
