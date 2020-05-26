import React from 'react';
import HeaderLogoIcon from '../../components/header/HeaderLogoIcon';
import HeaderLeft from '../../components/header/HeaderLeft';
import HeaderRight from '../../components/header/HeaderRight';

const NAVBAR_HEIGHT = 60;
import { View, StyleSheet, BackHandler, Platform, Animated } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Colors from '../../constants/colors/colors';
import { moderateScale } from '../../helpers/scale';
import TopBarHeader from '../../components/header/TopBarHeader';
import { onShowHeaderForYou } from '../../redux/actions/FoyYouAction';
import {
  handleAndroidBackButton,
  removeAndroidBackButtonHandler,
} from '../../helpers/androidBackButton';
import { connect } from 'react-redux';
import TopTabView from '../foryou/TopTabView';
import Flurry from 'react-native-flurry-sdk';

class ForYouScreen extends React.Component {
  scroll = new Animated.Value(0);
  headerY: any;

  constructor(props: any) {
    super(props);
    this.headerY = Animated.multiply(Animated.diffClamp(this.scroll, 0, NAVBAR_HEIGHT), -1);
    this.state = {
      refreshing: false,
    };
  }

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

  componentDidMount() {
    Flurry.logEvent('ForYou Sceen invoked');
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      handleAndroidBackButton(() => {
        BackHandler.exitApp();
      });
    });
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }

  render() {
    const { showHeader }: any = this.props;

    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <View style={styles.statusBar} />}
        {showHeader ? <TopBarHeader navigationany={this.props.navigation} /> : null}
        <NavigationEvents
          onWillFocus={() => {
            this.props.onShowHeaderForYou(true);
          }}
        />
        <TopTabView {...this.props} />
      </View>
    );
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
});

const mapDispatchToProps = (dispatch: any) => ({
  onShowHeaderForYou: (show: any) => dispatch(onShowHeaderForYou(show)),
});

const mapStateToProps = (state: any) => ({
  showHeader: state.myfeed.showHeader,
  forYouSavedData: state.foryou.forYouSavedData,
});

export default connect(mapStateToProps, mapDispatchToProps)(ForYouScreen);
