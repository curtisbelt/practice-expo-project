import React from 'react';
import Modal from 'react-native-modal';
import { StyleSheet } from 'react-native';
import { horizontalScale } from '../../helpers/scale';

export function ModalView(props) {
  const {
    style,
    isVisible,
    fullWidth,
    customColor,
    animationIn,
    transparent,
    onBackButtonPress,
  } = props;
  const finalStyle = fullWidth ? [styles.modelFullWidthStyle, style] : [styles.modelStyle, style];
  return (
    <Modal
      isVisible={isVisible}
      backdropColor={customColor}
      backdropOpacity={0}
      animationIn={animationIn}
      animationOut={'fadeOut'}
      animationInTiming={500}
      animationOutTiming={500}
      backdropTransitionInTiming={500}
      backdropTransitionOutTiming={500}
      style={finalStyle}
      transparent={transparent}
      onBackButtonPress={onBackButtonPress}
      onBackdropPress={props.backDropPressed}
    >
      {props.children}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modelStyle: {
    margin: horizontalScale(10),
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopRightRadius: 2,
  },
  modelFullWidthStyle: {
    margin: horizontalScale(1),
  },
});
