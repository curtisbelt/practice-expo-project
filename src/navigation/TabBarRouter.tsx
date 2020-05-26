import React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';

import HomeScreen from '../screens/home/HomeScreen';
import ForYouScreen from '../screens/foryou/ForYouScreen';
import RunwayScreen from '../screens/runway/RunwayScreen';
import SectionsScreen from '../screens/sections/SectionsScreen';
import DigitalDailyScreen from '../screens/digitaldaily/DigitalDailyScreen';

import HomeBottomTabBar from '../components/HomeBottomTabBar';
import TabBar from '../components/widgets/TabBar';

import translate from '../assets/strings/strings';
import Colors from '../constants/colors/colors';
import { Images } from '../assets';
// import RunwayTabScreens from '../screens/runway/RunwayTabs';
import { moderateScale } from '../helpers/scale';

const HomeStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      //header: null,
    },
  },
});

const ForYouStack = createStackNavigator({
  ForYou: {
    screen: ForYouScreen,
    navigationOptions: {
      header: null,
    },
  },
});

const RunwayStack = createStackNavigator(
  {
    Runway: {
      screen: RunwayScreen,
      navigationOptions: {
        header: null,
      },
    },
    // RunwayTab: {
    //   screen: RunwayTabScreens,
    // },
  },
  {
    defaultNavigationOptions: () => {
      return {
        header: null,
      };
    },
  },
);

const SectionsStack = createStackNavigator({
  Sections: {
    screen: SectionsScreen,
    navigationOptions: {
      header: null,
    },
  },
});

const DigitalDailyStack = createStackNavigator({
  DigitalDaily: {
    screen: DigitalDailyScreen,
    navigationOptions: {
      header: null,
    },
  },
});

const AppBottomTabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: {
        title: translate('home'),
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({ tintColor }) => (
          <HomeBottomTabBar
            tintColor={tintColor}
            title={translate('home')}
            iconName={Images.home}
          />
        ),
      },
    },
    ForYou: {
      screen: ForYouStack,
      navigationOptions: {
        title: translate('for_you'),
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({ tintColor }) => (
          <HomeBottomTabBar
            tintColor={tintColor}
            title={translate('for_you')}
            iconName={Images.forYou}
          />
        ),
      },
    },
    Sections: {
      screen: SectionsStack,
      navigationOptions: {
        title: translate('sections'),
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({ tintColor }) => (
          <HomeBottomTabBar
            tintColor={tintColor}
            title={translate('sections')}
            iconName={Images.sections}
          />
        ),
      },
    },
    Runway: {
      screen: RunwayStack,
      navigationOptions: {
        title: translate('runway'),
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({ tintColor }) => (
          <HomeBottomTabBar
            tintColor={tintColor}
            title={translate('runway')}
            iconName={Images.runWay}
          />
        ),
      },
    },
    DigitalDaily: {
      screen: DigitalDailyStack,
      navigationOptions: ({ screenProps }) => ({
        title: translate('digital_daily'),
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({ tintColor }) => (
          <HomeBottomTabBar
            //showNotification={screenProps.visible}
            tintColor={tintColor}
            title={translate('digital_daily')}
            iconName={screenProps.visible ? Images.digitalDailyUnRead : Images.digitalDailyRead}
          />
        ),
      }),
    },
  },
  {
    // eslint-disable-next-line react/display-name
    tabBarComponent: (props) => <TabBar {...props} />,
    tabBarOptions: {
      showLabel: false,
      activeTintColor: Colors.activeTintColor,
      inactiveTintColor: Colors.inactiveTintColor,
      style: { height: moderateScale(60) },
    },
  },
);

export default AppBottomTabNavigator;
