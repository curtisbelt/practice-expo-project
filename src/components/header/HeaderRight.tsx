import React from 'react';
//import react in our code.
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { moderateScale } from '../../helpers/scale';

//import all the basic component we have used
const HeaderRight = (props: any) => {
  const { navigationsany } = props;

  return (
    <View style={styles.headerRightContainer}>
      <TouchableOpacity onPress={() => navigationsany.navigate('search')}>
        <Image
          accessible={true}
          accessibilityLabel="Search"
          testID="Search"
          style={styles.searchIcon}
          source={require('../../assets/images/home/top_bar_icons/SEARCH.png')}
        />
      </TouchableOpacity>
    </View>
  );
};
export default HeaderRight;
const styles = StyleSheet.create({
  headerRightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    //alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  searchIcon: {
    height: moderateScale(21),
    width: moderateScale(20),
    margin: moderateScale(12),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
