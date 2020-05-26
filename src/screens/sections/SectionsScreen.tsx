import React from 'react';
import {
  Platform,
  View,
  StyleSheet,
  BackHandler,
  UIManager,
  LayoutAnimation,
  RefreshControl,
  ScrollView,
  Text,
} from 'react-native';

import TopBarHeader from '../../components/header/TopBarHeader';
import { moderateScale } from '../../helpers/scale';
import Colors from '../../constants/colors/colors';
import ActivityIndicatorView from '../../components/widgets/ActivityIndicator';
import SectionsExpandableView from '../../components/SectionsExpandableView';
import { connect } from 'react-redux';
import { onShowHeaderSections } from '../../redux/actions/SectionsActions';
import { onGetMainMenu } from '../../redux/actions/HomeAction';
import {
  handleAndroidBackButton,
  removeAndroidBackButtonHandler,
} from '../../helpers/androidBackButton';
import translate from '../../assets/strings/strings';
import { NavigationEvents } from 'react-navigation';
import FontFamily from '../../assets/fonts/fonts';
import ClickView from '../../components/widgets/clickView';
import ConsValues from '../../constants/consValue';
import NetInfo from '@react-native-community/netinfo';
import EmptyComponent from '../../components/widgets/EmptyComponent';
import apiService from '../../service/fetchContentService/FetchContentService';
import { ApiUrls, ApiMethods, ApiPaths } from '../../service/config/serviceConstants';

class SectionsScreen extends React.Component {
  constructor(props: any) {
    super(props);
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    this.state = {
      sectionsData: this.props.menu_sections,
      pullToRefresh: false,
      menuIndex: 0,
      isActionHeaderVisible: true,
      isConnected: true,
      isNetworkIssue: false,
      loading: false,
    };

    NetInfo.fetch().then((state) => {
      this.setState({
        isConnected: state.isConnected,
      });
    });
  }

  _listViewOffset = 0;
  async componentDidMount() {
    await NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        this.setState({
          sectionsData: this.props.menu_sections,
        });
      }
      this.setState({ isConnected: state.isConnected });
    });
    handleAndroidBackButton(() => {
      BackHandler.exitApp();
    });
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }

  async hadleApiCall() {
    this.setState({ loading: true });

    // Main menu API request
    await apiService(
      ApiUrls.PROD_BASE_URL + ApiPaths.MAIN_MENU,
      ApiMethods.GET,
      this.onSuccess,
      this.onFailure,
    );
  }

  onSuccess = (response: any) => {
    if (response && response.data) {
      response.data.items.unshift(
        { title: 'All', link: '', children: [] },
        { title: 'Latest News', link: '', children: [] },
      );
      this.props.onGetMainMenu(response.data.items);
    }
    this.setState({
      sectionsData: response.data.items,
      isConnected: true,
      isNetworkIssue: false,
      loading: false,
    });
  };

  onFailure = (error: any) => {
    if (error === translate('no_internet')) {
      this.setState({ loading: false, isNetworkIssue: true });
    } else {
      this.setState({ loading: false, isNetworkIssue: false });
    }
  };

  updateLayout = (index: any) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...this.state.sectionsData];
    //For Single Expand at a time
    array.map((value, placeindex) =>
      placeindex === index
        ? (array[placeindex].isExpanded = !array[placeindex].isExpanded)
        : (array[placeindex].isExpanded = false),
    );
    this.setState(() => {
      return {
        sectionsData: array,
        menuIndex: index,
      };
    });
  };

  onRefresh = () => {
    this.setState({ pullToRefresh: false });
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
        this.setState({ isHeaderVisible });
        this.props.setShowHeaderSections(isHeaderVisible);
      }
      // Update your scroll position
      this._listViewOffset = currentOffset;
    }
  };

  render() {
    let { loading, sectionsData, pullToRefresh, menuIndex }: any = this.state;
    let { showHeader, setShowHeaderSections, navigation }: any = this.props;

    if (!this.state.isConnected || this.state.isNetworkIssue) {
      return (
        <View>
          {Platform.OS === 'ios' && <View style={styles.statusBar} />}
          {showHeader ? (
            <View>
              <TopBarHeader navigationany={this.props.navigation} />
            </View>
          ) : null}
          <EmptyComponent
            onPress={() => this.hadleApiCall()}
            errorText={translate('internet_connection')}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <View style={styles.statusBar} />}
          <NavigationEvents
            onWillFocus={() => {
              setShowHeaderSections(true);
            }}
          />
          {showHeader ? <TopBarHeader navigationany={navigation} /> : null}

          {loading ? (
            <ActivityIndicatorView />
          ) : (
            <ScrollView
              scrollEventThrottle={16}
              onScroll={(event) => this.handleScroll(event)}
              refreshControl={
                <RefreshControl
                  refreshing={pullToRefresh}
                  onRefresh={() => {
                    this.onRefresh();
                  }}
                />
              }
            >
              {sectionsData.length > 0
                ? sectionsData.map((item: any, key: any) =>
                    item.title !== 'All' && item.title !== 'Latest News' ? (
                      <View style={{ marginBottom: 2 }}>
                        <SectionsExpandableView
                          key={key}
                          onClickFunction={this.updateLayout.bind(this, key)}
                          navigation={navigation}
                          menuIndex={menuIndex}
                          item={item}
                        />
                        <View style={styles.separator} />
                      </View>
                    ) : null,
                  )
                : null}
              <ClickView
                style={styles.videoView}
                onPress={() => {
                  this.props.navigation.navigate('LatestVideo');
                }}
              >
                <Text style={styles.videoText}>{translate('videos')}</Text>
              </ClickView>
              <View style={styles.separator} />
            </ScrollView>
          )}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.snow,
  },
  statusBar: {
    backgroundColor: Colors.white,
    height: moderateScale(30),
    width: '100%',
    zIndex: 2,
  },
  textLable: {
    marginTop: moderateScale(50),
    fontSize: moderateScale(25),
  },
  headerNavBar: {
    width: '100%',
    position: 'absolute',
    elevation: 0,
    flex: 1,
    zIndex: 1,
    marginTop: Platform.OS === 'ios' ? moderateScale(20) : 0,
  },
  animScrollView: {
    zIndex: 0,
    elevation: -1,
  },
  separator: {
    height: 1,
    backgroundColor: '#E9E9E9ed',
  },
  videoView: {
    backgroundColor: Colors.white,
    paddingLeft: moderateScale(24),
    paddingTop: moderateScale(13),
    paddingBottom: moderateScale(13),
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  videoText: {
    fontSize: moderateScale(22),
    fontFamily: FontFamily.fontFamilyBold,
  },
});

const mapDispatchToProps = (dispatch: any) => ({
  setShowHeaderSections: (show: any) => dispatch(onShowHeaderSections(show)),
  onGetMainMenu: (data: any) => dispatch(onGetMainMenu(data)),
});

const mapStateToProps = (state: any) => ({
  showHeader: state.sections.showHeader,
  menu_sections: state.home.menu_sections,
});

export default connect(mapStateToProps, mapDispatchToProps)(SectionsScreen);
