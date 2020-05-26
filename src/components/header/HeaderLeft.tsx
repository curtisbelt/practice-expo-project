import React from 'react';
//import react in our code.
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { moderateScale } from '../../helpers/scale';
import { Images } from '../../assets';
//import all the basic component we have used

const HeaderLeft = (props: any) => {
  const { navigationsany } = props;
  return (
    <View style={styles.headerLeftContainer}>
      <TouchableOpacity
        onPress={() =>
          navigationsany.navigate('Settings', {
            go_back_key: navigationsany.state.key,
          })
        }
      >
        <Image
          accessible={true}
          accessibilityLabel="Settings"
          testID="Settings"
          style={styles.settingIcon}
          source={require('../../assets/images/home/top_bar_icons/SETTINGS.png')}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigationsany.navigate('Notifications')}>
        <Image
          accessible={true}
          accessibilityLabel="Notifications"
          testID="Notifications"
          style={styles.notificationIcon}
          source={Images.notificationNone}
        />
      </TouchableOpacity>
    </View>
  );
};
export default HeaderLeft;
const styles = StyleSheet.create({
  headerLeftContainer: {
    flex: 1,
    flexDirection: 'row',
    //alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  settingIcon: {
    margin: moderateScale(10),
    height: moderateScale(24),
    width: moderateScale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    height: moderateScale(23),
    width: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
