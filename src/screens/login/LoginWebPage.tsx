import React, { Component } from 'react';
import {
  View,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  Linking,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Colors from '../../constants/colors/colors';
import ClickView from '../../components/widgets/clickView';
import { Images } from '../../assets';
import { horizontalScale, verticalScale } from '../../helpers/scale';
import ActivityIndicatorView from '../../components/widgets/ActivityIndicator';
import {
  writeLoginFileStream,
  readLoginFileStream,
  writeFileStream,
} from '../../helpers/rn_fetch_blob/createDirectory';
import { setJSONItem, asynStoreKeys, setItem } from '../../helpers/asyncStore';
import moment from 'moment';
import ClearSavedEditions from '../digitaldaily/ClearSavedEditions';

var jwtDecode = require('jwt-decode');

export default class LoginWebPage extends Component {
  static navigationOptions = {
    title: 'login',
  };

  constructor(props: any) {
    super(props);
    this.readData();
    this.state = {
      loading: true,
      url: props.navigation.state.params.url,
      loginData: '',
      login: props.navigation.state.params.login,
    };
  }
  readData = async () => {
    let data = await readLoginFileStream();
    let jsonData = JSON.parse(data);
    this.setState({
      loginData: jsonData,
    });
  };

  componentDidMount() {
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then((url) => {
        this.navigate(url);
      });
    } else {
      Linking.addEventListener('url', this.handleOpenURL);
    }
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  handleOpenURL = async (event) => {
    if (event.url.includes('jwt=')) {
      if (this.state.login === 'first') {
        this.props.navigation.navigate('Home');
      } else {
        this.props.navigation.navigate('Home');
      }
      let res = event.url.split('jwt=');
      let jwtData = res[1];
      let decoded = jwtDecode(jwtData);
      let savedData: any = [];
      writeLoginFileStream(decoded);
      writeFileStream(savedData);
      setJSONItem(asynStoreKeys.selectedCategory, null);
      var loginDate = Date.now();
      setItem(asynStoreKeys.loginDate, loginDate.toString());
      // Clear all Digital daily saved data
      ClearSavedEditions();
    }
    // Redirect to home if user logged out in iOS
    else if (event.url.includes('sub_action=logged_out')) {
      this.props.navigation.navigate('Home');
    }
  };

  navigate = (_url) => {
    // const { navigate } = this.props.navigation;
    // console.log('url---', _url);
  };

  onLoadend = () => {
    this.setState({
      loading: false,
    });
  };

  ActivityIndicatorLoadingView = () => {
    return (
      <View style={{ marginBottom: verticalScale(100) }}>
        <ActivityIndicatorView />
      </View>
    );
  };

  render() {
    const { url }: any = this.state;
    return (
      <SafeAreaView style={this.state.loading === true ? styles.stylOld : styles.styleNew}>
        <ClickView onPress={() => this.props.navigation.goBack()} style={styles.backButton}>
          <Image source={Images.backArrow} />
        </ClickView>

        {this.state.loading ? (
          <ActivityIndicator
            color={Colors.grey}
            size="large"
            style={styles.ActivityIndicatorStyle}
          />
        ) : null}

        <WebView
          style={styles.WebViewStyle}
          onLoadEnd={() => this.onLoadend()}
          source={{ uri: url }}
          scrollEnabled={true}
          startInLoadingState={true}
          onNavigationStateChange={(navChange) => {
            let url = navChange.url;
            if (url.includes('jwt=')) {
              if (this.state.login === 'first') {
                this.props.navigation.navigate('Home');
              }
              if (this.state.login === 'second') {
                this.props.navigation.navigate('Home');
              }

              let res = url.split('jwt=');
              let jwtData = res[1];
              let decoded = jwtDecode(jwtData);
              let savedData: any = [];
              writeLoginFileStream(decoded);
              writeFileStream(savedData);
              setJSONItem(asynStoreKeys.selectedCategory, null);
              var loginDate = moment(new Date());
              setItem(asynStoreKeys.loginDate, loginDate.toString());

              // Clear all Digital daily saved data
              ClearSavedEditions();
            }

            if (url.includes('sub_action=logged_out')) {
              this.props.navigation.navigate('Home');
            }
          }}
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
    width: Dimensions.get('window').width,
  },
  ActivityIndicatorStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  backButton: {
    width: horizontalScale(375),
    height: verticalScale(50),
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: verticalScale(20),
    marginLeft: horizontalScale(15),
  },
});
