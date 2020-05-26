import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '../constants/colors/colors';
import { moderateScale, verticalScale } from '../helpers/scale';
import { connect } from 'react-redux';
import { changeCategoryIndex } from '../redux/actions/HomeAction';
const HomeBottomTabBar = (props: any) => {
  const { tintColor, title, iconName, changeCategoryIndex }: any = props;

  return (
    <View>
      <View style={styles.labelView}>
        <View
          style={[
            styles.rectagleLine,
            tintColor === Colors.inactiveTintColor ? styles.inActiveStyle : styles.activeStyle,
          ]}
        />
      </View>
      {title === 'Home' ? (
        <TouchableOpacity
          style={styles.showNotificationIconView}
          onPress={() => {
            if (title === 'Home') {
              changeCategoryIndex(0);
            }
          }}
        />
      ) : null}
      <View style={styles.iconView}>
        <Image
          accessible={true}
          accessibilityLabel={title}
          testID={title}
          accessibilityRole={'tab'}
          style={styles.imageIcon}
          resizeMode={'contain'}
          source={iconName}
        />
      </View>
      <View style={styles.labelView}>
        <Text
          onPress={() => {
            if (title === 'Home') {
              changeCategoryIndex(0);
            } else {
              // do nothing
            }
          }}
          accessible={true}
          accessibilityLabel={title}
          testID={title}
          accessibilityRole={'tab'}
          numberOfLines={1}
          style={styles.textLabel}
        >
          {title}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rectagleLine: {
    height: moderateScale(4),
    width: moderateScale(54),
    marginTop: moderateScale(-15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconView: {
    marginTop: verticalScale(9),
    marginBottom: verticalScale(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIcon: {
    height: moderateScale(23),
    width: moderateScale(23),
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textLabel: {
    color: '#4D4D4D',
    fontSize: moderateScale(8),
    lineHeight: moderateScale(9),
    textAlign: 'center',
  },
  activeStyle: {
    backgroundColor: Colors.activeTintColor,
  },
  showNotificationIconView: {
    position: 'absolute',

    height: moderateScale(50),
    width: moderateScale(50),
  },
});

//export default HomeBottomTabBar;
const mapDispatchToProps = (dispatch: any) => ({
  changeCategoryIndex: (index: any) => dispatch(changeCategoryIndex(index)),
});

const mapStateToProps = (state: any) => ({
  showHeader: state.home.showHeader,
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeBottomTabBar);
