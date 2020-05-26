import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, RefreshControl } from 'react-native';
import RunwayComponent from '../../components/ArticleSections/RunwayComponent';
import { horizontalScale, verticalScale, moderateScale } from '../../helpers/scale';
import ActivityIndicatorView from '../../components/widgets/ActivityIndicator';
import apiService from '../../service/fetchContentService/FetchContentService';
import { ApiPaths, ApiMethods } from '../../service/config/serviceConstants';
import EmptyComponent from '../../components/widgets/EmptyComponent';
import translate from '../../assets/strings/strings';
import FontFamily from '../../assets/fonts/fonts';
export default class Designer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      designerdata: [],
      loading: true,
      runwayId: this.props.runwayId,
      refreshing: false,
      isNetworkIssue: false,
      collectionId: this.props.runwayId,
    };
  }
  componentDidMount() {
    this.handleApiRequest();
  }
  handleApiRequest = () => {
    apiService(
      `${ApiPaths.RUNWAY_DESIGNER}` + `${this.state.collectionId}`,
      // ApiPaths.RUNWAY_DESIGNER,
      ApiMethods.GET,
      this.onSuccess,
      this.onFailure,
    );
  };
  onPull = () => {
    this.setState({ refreshing: true }, () => {
      this.handleApiRequest();
    });
  };
  onRefresh = () => {
    this.setState({ loading: true }, () => {
      this.handleApiRequest();
    });
  };
  onSuccess = (response: any) => {
    this.setState(
      {
        designerdata: response.data,
        loading: false,
        refreshing: false,
        isNetworkIssue: false,
      },
      () => {},
    );
  };
  onFailure = (error: any) => {
    if (error === translate('no_internet')) {
      this.setState({ loading: false, isNetworkIssue: true });
    } else {
      this.setState({ loading: false, isNetworkIssue: false });
    }
  };
  render() {
    const { loading, designerdata, refreshing, isNetworkIssue }: any = this.state;
    if (isNetworkIssue) {
      return (
        <View>
          <EmptyComponent
            onPress={() => this.handleApiRequest()}
            errorText={translate('internet_connection')}
          />
        </View>
      );
    } else if (loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicatorView />
        </View>
      );
    } else
      return (
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          bounces={
            designerdata && designerdata.items && designerdata.items.length === 0 ? false : true
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={this.onPull.bind(this)} />
          }
        >
          <RunwayComponent
            designerData={designerdata}
            screen="designer"
            jumpTo={this.props.jumpTo}
          />
          {designerdata && designerdata.items && designerdata.items.length === 0 && (
            <View style={styles.emptyView}>
              <Text
                style={{
                  fontFamily: FontFamily.fontFamilyBold,
                  fontSize: moderateScale(18),
                }}
              >
                {translate('try_again')}
              </Text>
            </View>
          )}
        </ScrollView>
      );
  }
}
const styles = StyleSheet.create({
  container: {
    marginLeft: horizontalScale(14),
    marginRight: horizontalScale(18),
    marginBottom: verticalScale(94),
  },
  loader: {
    marginTop: verticalScale(318),
  },
  emptyView: { marginTop: verticalScale(210), alignSelf: 'center' },
});
