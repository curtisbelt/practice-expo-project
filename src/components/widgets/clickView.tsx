import React from 'react';
import { View, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { debounce } from 'lodash';

export interface Props {
  onPress?: () => {};
}

const ClickView = (props: any) => {
  const { style, accessible, disabled } = props;
  if (Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback
        accessible={accessible}
        disabled={disabled}
        onPress={debounce(props.onPress, 1200, {
          leading: true,
          trailing: false,
        })}
        background={
          Platform.Version >= 21
            ? TouchableNativeFeedback.Ripple('#fff', true)
            : TouchableNativeFeedback.SelectableBackground()
        }
        useForeground={false}
      >
        <View style={style}>{props.children}</View>
      </TouchableNativeFeedback>
    );
  } else {
    return (
      <TouchableOpacity
        accessible={accessible}
        activeOpacity={0.5}
        disabled={disabled}
        onPress={debounce(props.onPress, 1200, {
          leading: true,
          trailing: false,
        })}
      >
        <View style={style}>{props.children}</View>
      </TouchableOpacity>
    );
  }
};

export default ClickView;
