import React from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Animated,
  NativeModules,
  StyleSheet,
  Platform,
} from 'react-native';
import { Images } from '../../assets/images';
import { asynStoreKeys, getItem, setItem } from '../../helpers/asyncStore';
import apiService from '../../service/fetchContentService/FetchContentService';
import { ApiUrls, ApiMethods, ApiPaths } from '../../service/config/serviceConstants';
import { connect } from 'react-redux';
import translate from '../../assets/strings/strings';
import { onGetMainMenu, onGetHomeContent } from '../../redux/actions/HomeAction';
import Flurry from 'react-native-flurry-sdk';
import { createDirectory } from '../../helpers/rn_fetch_blob/createDirectory';
import { moderateScale } from '../../helpers/scale';
import Colors from '../../constants/colors/colors';

declare var global: { HermesInternal: null | {} };

class SplashScreen extends React.Component {
  Animation: Animated.Value;
  constructor(props: any) {
    super(props);
    this.state = {
      progressStatus: 0,
      sectionApi: false,
      homeApi: false,
    };
    this.Animation = new Animated.Value(0);
  }

  componentDidMount = async () => {
    if (Platform.OS === 'android') {
      NativeModules.PageSuite.lockToPortrait();
    } else {
      NativeModules.ChangeOrientation.lockToPortrait();
    }

    this._handleProgressAnimation();

    // create app data directory
    this.handleDataLoading();
  };

  handleDataLoading = async () => {
    this._handleProgressAnimation();

    // create app data directory
    await createDirectory();
    Flurry.logEvent('Spalash screen inoved');
    setItem(asynStoreKeys.SplashScreenTime, new Date().getTime().toString());
    setItem(asynStoreKeys.is_FirstTimeHomeScreen, 'splash');

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
      this.setState({ sectionApi: true });
    }
  };

  onFailure = (_error: any) => {};

  onHomeSuccess = (response: any) => {
    if (response && response.data) {
      this.props.onGetHomeContent(response.data);
      this.setState({ homeApi: true });
    }
  };

  onHomeFailure = async (error: any) => {
    if (error === translate('no_internet')) {
      // Redirect to pages
      this._handleRedirect();
    } else {
      // console.log('Error is: ' + error);
    }
  };

  componentDidUpdate() {
    const { sectionApi, homeApi } = this.state;
    if (sectionApi && homeApi) {
      this._handleRedirect();
    }
  }

  _handleProgressAnimation = () => {
    this.Animation.addListener(({ value }: any) => {
      this.setState({ progressStatus: parseInt(value, 10) });
    });
    Animated.timing(this.Animation, {
      toValue: 100,
      duration: 2800,
    }).start();
  };

  _handleRedirect = async () => {
    try {
      const value = await getItem(asynStoreKeys.is_continued);
      if (value === 1 || value === '1') {
        this.props.navigation.navigate('Category');
      } else if (value === 2 || value === '2') {
        this.props.navigation.navigate('Home');
      } else {
        this.props.navigation.navigate('Education');
      }
    } catch (e) {
      // error reading value
    }
  };

  render() {
    const { progressStatus }: any = this.state;

    return (
      <View accessible={true} style={styles.main_container}>
        <SafeAreaView accessible={true} style={styles.bg_dark}>
          {/* Logo container */}
          <View style={styles.logo_container}>
            <Image
              source={Images.whiteLogo}
              style={styles.logo}
              accessibilityLabel="WWD"
              testID="WWD"
            />
          </View>

          {/* Progress bar container */}
          <View accessibilityLabel="Loading" testID="Loading">
            <View style={styles.inactive_progress} />

            <Animated.View style={[styles.progress_bar, { width: progressStatus + '%' }]} />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  logo_container: {
    alignItems: 'center',
  },
  noInternetView: {
    marginTop: moderateScale(20),
  },
  inactive_progress: {
    marginTop: moderateScale(30),
    backgroundColor: Colors.grey,
    height: moderateScale(6),
    width: '100%',
  },
  progress_bar: {
    marginTop: moderateScale(-6),
    backgroundColor: Colors.white,
    height: moderateScale(6),
    width: '100%',
  },
  bg_dark: {
    backgroundColor: Colors.black,
  },
  logo: {
    height: moderateScale(59),
    width: moderateScale(202),
  },
  textStyle: {
    color: Colors.white,
  },
});

const mapDispatchToProps = (dispatch: any) => ({
  onGetMainMenu: (data: any) => dispatch(onGetMainMenu(data)),
  onGetHomeContent: (data: any) => dispatch(onGetHomeContent(data)),
});

export default connect(null, mapDispatchToProps)(SplashScreen);
