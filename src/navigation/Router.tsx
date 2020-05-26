import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import SplashScreen from '../screens/splash_screen/SplashScreen';
import EducationScreen from '../screens/education/EducationScreen';
import CustomisedCategory from '../screens/category/CategorySelection';
import MyNotificationsScreen from '../screens/my_notifications/MyNotificationsScreen';
import EditNotifications from '../screens/my_notifications/EditNotifications';
import MySettingsScreen from '../screens/my_settings/MySettingsScreen';
import SettingsWebPage from '../screens/my_settings/SettingsWebPage';
import SearchScreen from '../screens/search/SearchScreen';
import ArticleDetail from '../screens/detailscreens/ArticleDetail';
import VideoDetail from '../screens/detailscreens/VideoDetail';
import GalleryImages from '../screens/detailscreens/gallerydetails/GalleryImages';
import ImageDetail from '../screens/detailscreens/gallerydetails/ImageDetail';
import FilterScreen from '../screens/filter/Filter';
import GalleryFullScreen from '../screens/runway/gallery/GalleryFullScreen';
import LatestVideo from '../screens/Video/LatestVideo';
import SubscriptionScreen from '../screens/subscription/SubscriptionScreen';
import LoginWebPage from '../screens/login/LoginWebPage';
import RunwayTabScreens from '../screens/runway/RunwayTabs';
import AppBottomTabNavigator from '../navigation/TabBarRouter';
import GDPRConsentScreen from '../screens/my_settings/GDPRConsentScreen';

const HomeNavigator = createStackNavigator(
  {
    Home: { screen: AppBottomTabNavigator, navigationOptions: { header: null } },
    search: {
      screen: SearchScreen,
    },
    Notifications: {
      screen: MyNotificationsScreen,
    },
    EditNotifications: {
      screen: EditNotifications,
    },
    Settings: {
      screen: MySettingsScreen,
    },
    SettingsWeb: {
      screen: SettingsWebPage,
    },
    ArticleDetail: {
      screen: ArticleDetail,
      navigationOptions: { header: null },
    },
    VideoDetail: {
      screen: VideoDetail,
      navigationOptions: { header: null },
    },
    GalleryImages: {
      screen: GalleryImages,
      navigationOptions: { header: null },
    },
    ImageDetail: {
      screen: ImageDetail,
      navigationOptions: { header: null },
    },
    filter: {
      screen: FilterScreen,
    },
    GalleryFullScreen: {
      screen: GalleryFullScreen,
      navigationOptions: { header: null },
    },
    LatestVideo: {
      screen: LatestVideo,
      navigationOptions: { header: null },
    },
    subscription: {
      screen: SubscriptionScreen,
      navigationOptions: { header: null },
    },
    login: {
      screen: LoginWebPage,
      navigationOptions: { header: null },
    },
    RunwayTab: {
      screen: RunwayTabScreens,
      navigationOptions: { header: null },
    },
    GDPRConsent: {
      screen: GDPRConsentScreen,
      navigationOptions: { header: null },
    },
  },

  {
    navigationOptions: { header: null },
  },
);

const SplashStack = createStackNavigator({
  SplashScreen: { screen: SplashScreen, navigationOptions: { header: null } },
});

const EducationStack = createStackNavigator({
  Education: {
    screen: EducationScreen,
    navigationOptions: { header: null },
  },
});

const StackNavigator = createSwitchNavigator({
  SplashScreen: SplashStack,
  Education: EducationStack,
  Category: {
    screen: CustomisedCategory,
    navigationOptions: { header: null },
  },
  HomeNavigator: HomeNavigator,
});

const AppNavigator = createAppContainer(StackNavigator);

export default AppNavigator;
