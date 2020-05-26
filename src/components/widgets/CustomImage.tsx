import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../../constants/colors/colors';
import FastImage from 'react-native-fast-image';

export interface Props {
  url: String;
  style: any;
  accessible: any;
  accessibilityLabel: any;
  testID: any;
  resizeMode: any;
}

const CustomImage = (props: any) => {
  const { url, style, accessible, accessibilityLabel, testID, resizeMode } = props;
  return (
    <View style={[styles.container, style]}>
      <FastImage
        accessible={accessible}
        accessibilityRole={'image'}
        accessibilityLabel={accessibilityLabel}
        testID={testID}
        source={{
          uri: url,
          priority: FastImage.priority.normal,
        }}
        style={style}
        resizeMode={resizeMode !== undefined ? resizeMode : FastImage.resizeMode.cover}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.greyLight,
    flex: 1,
  },
});

export default CustomImage;
