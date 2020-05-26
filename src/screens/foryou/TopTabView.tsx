import * as React from 'react';
import { StyleSheet, Dimensions, View, Text } from 'react-native';
import { TabView, TabBar, SceneRendererProps } from 'react-native-tab-view';
import { connect } from 'react-redux';
import { onShowHeaderForYou, forYouTabIndex } from '../../redux/actions/FoyYouAction';
import Colors from '../../constants/colors/colors';
import FontFamily from '../../assets/fonts/fonts';
import MyFeed from '../foryou/MyFeed';
import Saved from '../foryou/Saved';
import { moderateScale } from '../../helpers/scale';
import Flurry from 'react-native-flurry-sdk';
import { parentEnabled, childEnabled } from '../../../appConfig';

const initialLayout = { width: Dimensions.get('window').width };

class TopTabView extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: 'my_feed', title: 'MY FEED' },
        { key: 'saved', title: 'SAVED' },
      ],
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.tabIndex !== state.index) {
      return {
        index: props.tabIndex,
      };
    }
    return null;
  }

  renderScene = ({ route }: any) => {
    switch (route.key) {
      case 'my_feed':
        return <MyFeed {...this.props} />;
      case 'saved':
        return <Saved {...this.props} />;
      default:
        return null;
    }
  };

  renderTabBar = (props: SceneRendererProps & { navigationState: State }) => (
    <TabBar
      {...props}
      renderLabel={({ route, focused, color }) => (
        <View accessible={parentEnabled}>
          <Text
            accessible={childEnabled}
            accessibilityLabel={route.title}
            testID={route.title}
            style={[styles.label, { color }]}
          >
            {route.title}
          </Text>
          <View
            style={[
              styles.icon,
              {
                backgroundColor: focused ? Colors.activeTintColor : Colors.white,
              },
            ]}
          />
        </View>
      )}
      indicatorStyle={styles.indicator}
      activeColor={Colors.black}
      inactiveColor={Colors.inactiveTintColor}
      style={styles.tabbar}
      tabStyle={styles.tab}
      labelStyle={styles.label}
    />
  );

  setIndex = (index: any) => {
    this.setState({
      index: index,
    });
    this.props.forYouTabIndex(index);
  };

  render() {
    const { index, routes }: any = this.state;
    return (
      <TabView
        navigationState={{ index, routes }}
        renderScene={this.renderScene}
        swipeEnabled={false}
        onIndexChange={(index: Number) => {
          this.setIndex(index);
          this.props.onShowHeaderForYou(true);
          Flurry.logEvent(routes[index].title + ' invoked');
        }}
        initialLayout={initialLayout}
        renderTabBar={this.renderTabBar}
      />
    );
  }
}

const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: Colors.white,
    shadowOpacity: 0,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowRadius: 0,
    elevation: 0,
    marginTop: moderateScale(5),
  },
  tab: {
    width: Dimensions.get('window').width / 2,
  },
  indicator: {
    backgroundColor: Colors.white,
    height: 0,
    width: 0,
  },
  textLable: {
    fontSize: moderateScale(25),
    textAlign: 'center',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: moderateScale(5),
  },
  icon: {
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: moderateScale(4),
    height: moderateScale(4),
    width: moderateScale(30),
  },
  label: {
    marginHorizontal: 0,
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    fontFamily: FontFamily.fontFamilyBold,
    backgroundColor: 'transparent',
  },
});
const mapDispatchToProps = (dispatch: any) => ({
  onShowHeaderForYou: (show: any) => dispatch(onShowHeaderForYou(show)),
  forYouTabIndex: (data: any) => dispatch(forYouTabIndex(data)),
});

const mapStateToProps = (state: any) => ({
  showHeader: state.myfeed.showHeader,
  tabIndex: state.myfeed.tabIndex,
});
export default connect(mapStateToProps, mapDispatchToProps)(TopTabView);
