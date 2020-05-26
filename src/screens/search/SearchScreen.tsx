import React from 'react';
//import react in our code.
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
//import all the basic component we have used
import Colors from '../../constants/colors/colors';
import { Images } from '../../assets/images';
import { moderateScale } from '../../helpers/scale';

export default class SearchScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      //Heading style
      headerStyle: {
        backgroundColor: navigation.getParam('BackgroundColor', Colors.white),
      },
      //Heading text color
      headerTintColor: navigation.getParam('HeaderTintColor', Colors.headerTintColor),
      headerRight: (
        <TouchableOpacity style={styles.closeContainer} onPress={() => navigation.goBack(null)}>
          <Image
            accessible={true}
            accessibilityLabel="Close"
            testID="Close"
            style={styles.closeSettings}
            source={Images.close}
          />
        </TouchableOpacity>
      ),
    };
  };

  render() {
    return (
      <View style={styles.container}>
        <Text
          accessible={true}
          accessibilityLabel="My search"
          testID="My search"
          style={styles.textLable}
        >
          My Search
        </Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textLable: {
    marginTop: moderateScale(50),
    fontSize: moderateScale(25),
  },
  closeContainer: {
    flex: 1,
    marginRight: moderateScale(10),
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  closeSettings: {
    marginRight: 5,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
});
