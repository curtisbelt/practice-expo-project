import * as React from 'react';
import { StyleSheet, Platform } from 'react-native';
import Animated from 'react-native-reanimated';
import TopBarHeader from './TopBarHeader';
import Colors from '../../constants/colors/colors';
const HEADER_HEIGHT = 60;
const { diffClamp, interpolate } = Animated;

const AnimatedTopHeader = (props: any) => {
  let { navigationany } = props;
  const diffClampY = diffClamp(props.y, 0, HEADER_HEIGHT);
  const translateY = interpolate(diffClampY, {
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
  });
  return (
    <Animated.View
      style={[
        styles.headerContainer,
        {
          transform: [{ translateY: translateY }],
        },
      ]}
    >
      <TopBarHeader navigationany={navigationany} />
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 1,
    backgroundColor: Colors.white,
    paddingTop: Platform.OS === 'ios' ? 30 : 0,
  },
});
export default AnimatedTopHeader;
