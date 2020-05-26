import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import Colors from '../../constants/colors/colors';

export interface Props {
  style: any;
}

export default class ActivityIndicatorView extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { style } = this.props;
    return (
      <View style={[styles.container, style]}>
        <ActivityIndicator size="large" color={Colors.grey} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.transparent,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
