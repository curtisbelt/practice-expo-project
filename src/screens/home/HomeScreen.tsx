import React from 'react';
import { View, Platform, StyleSheet, Animated, NativeModules } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import {
  onShowHeaderHome,
  onGetMainMenu,
  onGetHomeContent,
  changeCategoryIndex,
} from '../../redux/actions/HomeAction';
import { readSavedBookMark } from '../../redux/actions/FoyYouAction';
import { readFileStream } from '../../helpers/rn_fetch_blob/createDirectory';
import apiService from '../../service/fetchContentService/FetchContentService';
import {
  ApiUrls,
  ApiMethods,
  ApiPaths,
  pushNotificationApplicationId,
  pushNotificationAccessToken,
  pushNotificationCloudSdkUrl,
  pushNotificationMembershipId,
} from '../../service/config/serviceConstants';

//import all the basic component we have used
import HeaderLogoIcon from '../../components/header/HeaderLogoIcon';
import HeaderLeft from '../../components/header/HeaderLeft';
import HeaderRight from '../../components/header/HeaderRight';
import TopBarHeader from '../../components/header/TopBarHeader';
import Colors from '../../constants/colors/colors';
import { moderateScale } from '../../helpers/scale';
// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
import ShowBannerView from '../../components/native-ads/ShowBannerView';
import PushNotificationAlert from './PushNotificationModal';
import translate from '../../assets/strings/strings';
import { removeKey, asynStoreKeys, getItem } from '../../helpers/asyncStore';
import Flurry from 'react-native-flurry-sdk';
import Section from './Section';
import BreakingNews from './BreakingNews';
import EmptyComponent from '../../components/widgets/EmptyComponent';
const { PageSuite } = NativeModules;
const NAVBAR_HEIGHT = 60;

class HomeScreen extends React.Component {
  scroll = new Animated.Value(0);
  headerY: any;
  constructor(props: any) {
    super(props);
    this.headerY = Animated.multiply(Animated.diffClamp(this.scroll, 0, NAVBAR_HEIGHT), -1);
    this.state = {
      refreshing: false,
      isModalVisible: false,
      showLatestNotification: true,
      token: '',
      isConnected: false,
      homeApi: false,
      sectionApi: false,
      isNetworkIssue: false,
    };
    NetInfo.fetch().then((state) => {
      this.setState({
        isConnected: state.isConnected,
      });
    });
  }

  readData = async () => {
    let savedBookMarkeddata = await readFileStream();
    let BookMarkeddata = JSON.parse(savedBookMarkeddata);
    console.log('*****BookMarkeddata**' + BookMarkeddata);
    if (BookMarkeddata !== null) {
      this.props.readSavedBookMark(BookMarkeddata);
    } else {
      let data: any = [];
      this.props.readSavedBookMark(data);
    }
  };

  handleNotificationPermission = async () => {
    if (Platform.OS === 'ios') {
      let pushNotificationAlert = await NativeModules.PushNotificationAlert;
      pushNotificationAlert.addEvent(
        pushNotificationApplicationId,
        pushNotificationAccessToken,
        pushNotificationCloudSdkUrl,
        pushNotificationMembershipId,
        (data) => {
          if (data) {
            pushNotificationAlert.setPushEnable('true');
          } else {
            pushNotificationAlert.setPushEnable('false');
          }
        },
      );
      pushNotificationAlert.getMessageCount((_data: any) => {
        // console.log('Data is: ' + JSON.stringify(data));
      });
    } else {
      let androidNotification = NativeModules.SalesForcePushNotificationApi;

      androidNotification.enableNotification();
      androidNotification.getAllMessageCount((_data: any) => {
        // console.log('Data is: ' + JSON.stringify(data));
      });
    }
  };

  componentDidMount = async () => {
    let SplashScreenTime = await getItem(asynStoreKeys.SplashScreenTime);
    SplashScreenTime = parseInt(SplashScreenTime);
    let currentTime = new Date().getTime();
    let diff = currentTime - SplashScreenTime;
    // converting to seconds
    let diffInSec = ((diff % 60000) / 1000).toFixed(0) + ' sec';
    Flurry.logEvent('App Loading', { loadingTime: diffInSec });
    removeKey(asynStoreKeys.SplashScreenTime);
    if (Platform.OS === 'android') {
      PageSuite.initPageSuiteSdk();
    }
  };

  static navigationOptions = ({ navigation }: any) => {
    return {
      //Heading style
      headerStyle: {
        backgroundColor: navigation.getParam('BackgroundColor', Colors.white),
      },
      header: null,
      headerTitle: () => (
        <HeaderLogoIcon
          accessible={true}
          accessibilityLabel="WWD"
          testID="WWD"
          navigationsany={navigation}
        />
      ),
      //Heading text color
      headerTintColor: navigation.getParam('HeaderTintColor', Colors.headerTintColor),
      headerRight: (
        <HeaderRight
          accessible={true}
          accessibilityLabel="Search"
          testID="Search"
          navigationsany={navigation}
        />
      ),
      headerLeft: (
        <HeaderLeft
          accessible={true}
          accessibilityLabel="Notifications"
          testID="Notifications"
          navigationsany={navigation}
          onClick={() => navigation.navigate('Home')}
        />
      ),
    };
  };

  _onRefresh() {
    this.setState({ refreshing: true });
    setTimeout(() => {
      this.setState({ refreshing: false });
    }, 500);
  }

  fetchHomeContent = async () => {
    // Main menu API request
    await apiService(
      ApiUrls.PROD_BASE_URL + ApiPaths.MAIN_MENU,
      ApiMethods.GET,
      this.onSuccess,
      this.onFailure,
    );

    // Home All section API request
    await apiService(
      ApiUrls.PROD_BASE_URL + ApiPaths.HOME_CONTENT,
      ApiMethods.GET,
      this.onHomeSuccess,
      this.onHomeFailure,
    );
  };

  onSuccess = (response: any) => {
    if (response && response.data) {
      response.data.items.unshift(
        { title: 'All', link: '', children: [] },
        { title: 'Latest News', link: '', children: [] },
      );
      this.props.onGetMainMenu(response.data.items);
    }
  };

  onFailure = (_error: any) => {};

  onHomeSuccess = (response: any) => {
    if (response && response.data) {
      this.props.onGetHomeContent(response.data);
      this.setState({
        homeApi: true,
        isConnected: true,
        sectionApi: true,
        isNetworkIssue: false,
      });
    }
  };

  onHomeFailure = (error: any) => {
    if (error === translate('no_internet')) {
      this.setState({
        isNetworkIssue: true,
        isConnected: true,
        homeApi: false,
        sectionApi: false,
      });
    } else {
      //console.log('Error is: ' + error);
    }
  };

  render() {
    const { showHeader }: any = this.props;

    if (!this.state.isConnected) {
      return (
        <View>
          {Platform.OS === 'ios' && <View style={styles.statusBar} />}
          {showHeader ? (
            <View>
              <TopBarHeader navigationany={this.props.navigation} />
            </View>
          ) : null}
          <EmptyComponent
            onPress={() => this.fetchHomeContent()}
            errorText={translate('internet_connection')}
          />
        </View>
      );
    } else if (this.state.isNetworkIssue) {
      return (
        <View>
          {Platform.OS === 'ios' && <View style={styles.statusBar} />}
          {showHeader ? (
            <View>
              <TopBarHeader navigationany={this.props.navigation} />
            </View>
          ) : null}
          <EmptyComponent
            onPress={() => this.fetchHomeContent()}
            errorText={translate('internet_connection')}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <NavigationEvents
            onWillFocus={async () => {
              // this.props.changeCategoryIndex(0);
              this.props.onShowHeaderHome(true);
              await this.readData();
            }}
          />
          {Platform.OS === 'ios' && <View style={styles.statusBar} />}
          {showHeader ? (
            <View>
              <TopBarHeader navigationany={this.props.navigation} />
            </View>
          ) : null}

          {/* Start of notification alert */}
          <PushNotificationAlert
            notificationPermissionCallBack={this.handleNotificationPermission}
          />
          {/* END of notification alert */}

          {/* START of breaking new section */}
          <BreakingNews {...this.props} />
          {/* END of breaking new section */}

          {/* <View style={styles.AddView}>
            <ShowBannerView
              adSizes={['banner', 'mediumRectangle']}
              adUnitID={'/8352/WWD_Mobile/app/homepage/leaderboard/'}
            />
          </View> */}

          {/* Display sections and subsections */}
          <Section />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    backgroundColor: Colors.white,
    height: moderateScale(30),
    width: '100%',
    //position: 'absolute',
    zIndex: 2,
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
  closeButtonTint: {
    tintColor: Colors.white,
    padding: moderateScale(10),
  },
  AddView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
});

const mapDispatchToProps = (dispatch: any) => ({
  onShowHeaderHome: (show: any) => dispatch(onShowHeaderHome(show)),
  readSavedBookMark: (data: any) => dispatch(readSavedBookMark(data)),
  onGetMainMenu: (data: any) => dispatch(onGetMainMenu(data)),
  onGetHomeContent: (data: any) => dispatch(onGetHomeContent(data)),
  changeCategoryIndex: (index: any) => dispatch(changeCategoryIndex(index)),
});

const mapStateToProps = (state: any) => ({
  showHeader: state.home.showHeader,
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
