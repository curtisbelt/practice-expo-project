import React, { Component } from 'react';
import FastImage from 'react-native-fast-image';
import { ImageBackground } from 'react-native';
import { Images } from '../../assets/images/index';
import { moderateScale } from '../../helpers/scale';
class BackgroundImage extends Component {
  render() {
    const { source, children, style, ...props } = this.props;
    if (JSON.stringify(source).toString().includes('https://')) {
      return (
        <FastImage
          source={source}
          resizeMode={'center'}
          style={{ flex: 1, width: null, height: null, ...style }}
          {...props}
        >
          {children}
        </FastImage>
      );
    } else {
      return (
        <ImageBackground
          source={Images.categoryPlaceholder}
          style={{
            flex: 1,
            width: moderateScale(166),
            height: moderateScale(250),
            ...style,
          }}
          {...props}
        >
          {children}
        </ImageBackground>
      );
    }
  }
}

export default BackgroundImage;
