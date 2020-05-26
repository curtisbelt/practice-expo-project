import React from 'react';
//import react in our code.
import { StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import Colors from '../../constants/colors/colors';
export default class SettingsWebPage extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      url: this.props.navigation.state.params.url,
    };
  }

  hanldeSpinner = () => {
    this.setState({
      loading: false,
    });
  };

  render() {
    return (
      <SafeAreaView style={this.state.loading === true ? styles.stylOld : styles.styleNew}>
        {this.state.loading ? (
          <ActivityIndicator
            color={Colors.grey}
            size="large"
            style={styles.ActivityIndicatorStyle}
          />
        ) : null}

        <WebView
          style={styles.WebViewStyle}
          onLoadEnd={() => this.hanldeSpinner()}
          source={{ uri: this.state.url }}
        />
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  stylOld: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleNew: {
    flex: 1,
  },
  WebViewStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  ActivityIndicatorStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
});
