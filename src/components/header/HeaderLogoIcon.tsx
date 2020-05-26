import React from 'react';
//import react in our code.
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
//import all the basic component we have used
import { changeCategoryIndex } from '../../redux/actions/HomeAction';
import { moderateScale } from '../../helpers/scale';

const HeaderLogoIcon = (props: any) => {
  const { navigationsany } = props;
  return (
    <View style={styles.logoContainer}>
      <TouchableOpacity
        onPress={() => {
          props.changeCategoryIndex(0);
          navigationsany.navigate('Home');
        }}
      >
        <Image
          accessible={true}
          accessibilityLabel="WWD"
          testID="WWD"
          source={require('../../assets/images/home/top_bar_icons/WWD-LOGO-BLK.png')}
          style={styles.logoImage}
        />
      </TouchableOpacity>
    </View>
  );
};
const mapDispatchToProps = (dispatch: any) => ({
  changeCategoryIndex: (index: any) => dispatch(changeCategoryIndex(index)),
});

const mapStateToProps = (state: any) => ({
  category_index: state.home.category_index,
});
export default connect(mapStateToProps, mapDispatchToProps)(HeaderLogoIcon);
const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  logoImage: {
    width: moderateScale(100),
    height: moderateScale(29),
    margin: moderateScale(10),
  },
});
