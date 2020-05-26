import React, { SFC } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  // [1/5] The commented code below leads up to the variable 'poses' in init(). 'poses' is assigned a value but never used.
  // Dimensions,
  Platform,
} from 'react-native';
import posed from 'react-native-pose';
import { moderateScale } from '../../helpers/scale';
import { connect } from 'react-redux';
import { changeCategoryIndex } from '../../redux/actions/HomeAction';
// [2/5] The commented code below leads up to the variable 'poses' in init(). 'poses' is assigned a value but never used.
// const windowWidth = Dimensions.get('window').width;

const Scaler = posed.View({
  active: { scale: 1 },
  inactive: { scale: 1 },
});

const S = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: moderateScale(60),
    elevation: 2,
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? moderateScale(20) : 0,
  },
  tabButton: { flex: 1 },
});

type Props = {
  tabColors: string[];
  renderIcon: SFC<{
    route: any;
    focused: boolean;
    tintColor: string;
  }>;
  activeTintColor: string;
  inactiveTintColor: string;
  onTabPress: ({ route: any }) => void;
  onTabLongPress: ({ route: any }) => void;
  getAccessibilityLabel: ({ route: any }) => string;
  navigation: any;
};

class TabBar extends React.Component<Props, {}> {
  SpotLight = undefined;
  spotlightStyle = undefined;
  Inner = undefined;
  constructor(props) {
    super(props);
    // [3/5] The commented code below leads up to the variable 'poses' in init(). 'poses' is assigned a value but never used.
    // this.init();
  }

  // [4/5] The commented code below leads up to the variable 'poses' in init(). 'poses' is assigned a value but never used.
  // componentDidUpdate(prevProps) {
  //   const numTabs = this.props.navigation.state.routes.length;
  //   const prevNumTabs = prevProps.navigation.state.routes.length;
  //   if (numTabs !== prevNumTabs) {
  //     this.init();
  //   }
  // }

  // [5/5] The commented code below leads up to the variable 'poses' in init(). 'poses' is assigned a value but never used.
  // init() {
  //   const numTabs = this.props.navigation.state.routes.length;
  //   const tabWidth = windowWidth / numTabs;
  //   const poses = Array.from({ length: numTabs }).reduce((poses, _, index) => {
  //     return { ...poses, [`route${index}`]: { x: tabWidth * index } };
  //   }, {});
  // }

  render() {
    const {
      renderIcon,
      activeTintColor,
      inactiveTintColor,
      onTabPress,
      onTabLongPress,
      getAccessibilityLabel,
      navigation,
    } = this.props;

    const { routes, index: activeRouteIndex } = navigation.state;

    return (
      <View style={S.container}>
        {routes.map((route, routeIndex) => {
          const isRouteActive = routeIndex === activeRouteIndex;
          const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;

          return (
            <TouchableOpacity
              key={routeIndex}
              style={S.tabButton}
              onPress={() => {
                onTabPress({ route });
                if (routeIndex === 0) {
                  this.props.changeCategoryIndex(0);
                }
              }}
              onLongPress={() => {
                onTabLongPress({ route });
              }}
              accessibilityLabel={getAccessibilityLabel({ route })}
            >
              <Scaler pose={isRouteActive ? 'active' : 'inactive'} style={S.scaler}>
                {renderIcon({ route, focused: isRouteActive, tintColor })}
              </Scaler>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

//export default TabBar;
const mapDispatchToProps = (dispatch: any) => ({
  changeCategoryIndex: (index: any) => dispatch(changeCategoryIndex(index)),
});

const mapStateToProps = (state: any) => ({
  showHeader: state.home.showHeader,
});

export default connect(mapStateToProps, mapDispatchToProps)(TabBar);
