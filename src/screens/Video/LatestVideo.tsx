import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Platform,
  RefreshControl,
  BackHandler,
} from 'react-native';
import VideoHeader from '../../components/header/VideoHeader';
import apiService from '../../service/fetchContentService/FetchContentService';
import { ApiPaths, ApiMethods } from '../../service/config/serviceConstants';
import EmptyComponent from '../../components/widgets/EmptyComponent';
import ActivityIndicatorView from '../../components/widgets/ActivityIndicator';
import { moderateScale, verticalScale, horizontalScale } from '../../helpers/scale';
import FontFamily from '../../assets/fonts/fonts';
import Colors from '../../constants/colors/colors';
import translate from '../../assets/strings/strings';
import CustomImage from '../../components/widgets/CustomImage';
import { getFormattedDateTime } from './../../helpers/dateTimeFormats';
import ClickView from '../../components/widgets/clickView';
import { parentEnabled, childEnabled, useStaticLable } from '../../../appConfig';
import automationStaticLables from '../../constants/automationStaticLables';
import ShowBannerView from '../../components/native-ads/ShowBannerView';

export default class LatestVideo extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      LatedtVideoData: [],
      loading: true,
      refreshing: false,
    };

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    apiService(ApiPaths.LATEST_VIDEOS, ApiMethods.GET, this.onSuccess, this.onFailure);

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  onRefresh = () => {
    this.setState({ loading: true }, () => {
      apiService(ApiPaths.LATEST_VIDEOS, ApiMethods.GET, this.onSuccess, this.onFailure);
    });
  };

  onPull = () => {
    this.setState({ refreshing: true }, () => {
      apiService(ApiPaths.LATEST_VIDEOS, ApiMethods.GET, this.onSuccess, this.onFailure);
    });
  };

  onSuccess = (response: any) => {
    if (response && response.data) {
      this.setState({
        LatedtVideoData: response.data,
        loading: false,
        refreshing: false,
      });
    }
  };

  onFailure = (_error: any) => {
    // do nothing
  };

  videoHeader = () => {
    return (
      <View style={styles.headerView} accessible={parentEnabled}>
        <Text
          accessible={childEnabled}
          style={styles.videoText}
          accessibilityRole={'text'}
          accessibilityLabel={automationStaticLables.latestVideo}
          testID={automationStaticLables.latestVideo}
        >
          {translate('latest_videos')}
        </Text>
        <View style={styles.broadSeparator} />
      </View>
    );
  };

  renderItem = ({ item, index }: any) => {
    const title: string = item && item.title;
    const publishDate: any = item && getFormattedDateTime(item['published-at']);
    return (
      <View>
        <ClickView
          accessible={parentEnabled}
          onPress={() =>
            this.props.navigation.navigate('VideoDetail', {
              articleID: item.id,
              articleLink: item.link,
              articleItem: item,
              articleImage:
                Object.entries(item.image).length > 0 && item.image.crops.length > 3
                  ? item.image.crops[3].url + `&w=${Math.round(horizontalScale(149))}`
                  : '',
            })
          }
          style={styles.renderView}
        >
          <View>
            {Object.entries(item.image).length > 0 ? (
              <CustomImage
                accessible={childEnabled}
                accessibilityRole={'image'}
                accessibilityLabel={
                  useStaticLable ? automationStaticLables.latetVideoImage : item.image.title
                }
                testID={useStaticLable ? automationStaticLables.latetVideoImage : item.image.title}
                url={
                  item.image.crops.length > 3
                    ? item.image.crops[3].url + `&w=${Math.round(horizontalScale(149))}`
                    : ''
                }
                style={styles.imgStyle}
              />
            ) : null}
          </View>
          <View style={styles.textView}>
            <Text
              accessible={childEnabled}
              accessibilityRole={'text'}
              accessibilityLabel={useStaticLable ? automationStaticLables.latestVideoTitle : title}
              testID={useStaticLable ? automationStaticLables.latestVideoTitle : title}
              style={styles.titletext}
              numberOfLines={2}
            >
              {title}
            </Text>
            <Text
              accessible={childEnabled}
              accessibilityRole={'text'}
              accessibilityLabel={
                useStaticLable ? automationStaticLables.latestVideoPublishdate : publishDate
              }
              testID={useStaticLable ? automationStaticLables.latestVideoPublishdate : publishDate}
              style={styles.publishdate}
            >
              {publishDate}
            </Text>
          </View>
        </ClickView>
        {(index + 1) % 5 === 0 && (
          <View style={styles.AddView}>
            <ShowBannerView
              adSizes={['banner', 'fullBanner']}
              adUnitID={'/8352/WWD_Mobile/app/videos/'}
            />
          </View>
        )}
      </View>
    );
  };

  render() {
    const { navigation }: any = this.props;
    const { LatedtVideoData, loading, refreshing }: any = this.state;

    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <View style={styles.statusBar} />}

        <VideoHeader
          onBack={() => {
            navigation.goBack();
          }}
          onSearch={() => {
            navigation.navigate('search');
          }}
        />

        {this.videoHeader()}

        {loading ? (
          <View style={styles.loadingView}>
            <ActivityIndicatorView />
          </View>
        ) : LatedtVideoData && LatedtVideoData.items && LatedtVideoData.items.length === 0 ? (
          <View>
            <EmptyComponent
              onPress={() => {
                this.onRefresh();
              }}
              errorText={translate('try_again')}
            />
          </View>
        ) : (
          <FlatList
            data={LatedtVideoData && LatedtVideoData.items}
            extraData={this.state}
            renderItem={this.renderItem}
            keyExtractor={(x, i) => i.toString()}
            style={styles.flatlistView}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={this.onPull.bind(this)} />
            }
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerView: {
    marginTop: verticalScale(19),
    paddingHorizontal: horizontalScale(14),
  },
  videoText: {
    fontSize: moderateScale(27),
    fontFamily:
      Platform.OS === 'ios'
        ? FontFamily.publicoBannerMediumIos
        : FontFamily.publicoBannerMediumAndroid,
    color: Colors.black,
    textAlign: 'left',
  },
  broadSeparator: {
    width: horizontalScale(346),
    height: moderateScale(5),
    backgroundColor: Colors.black,
  },
  flatlistView: {
    marginTop: verticalScale(14),
    backgroundColor: Colors.white,
    marginBottom: verticalScale(15),
    flex: 1,
  },

  renderView: {
    flexDirection: 'row',
    marginBottom: verticalScale(19),
    paddingHorizontal: horizontalScale(13),
    backgroundColor: Colors.white,
  },
  imgStyle: {
    width: horizontalScale(149),
    height: verticalScale(87),
  },
  textView: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: horizontalScale(191),
    paddingLeft: horizontalScale(9),
  },
  titletext: {
    fontSize: moderateScale(16),
    fontFamily: FontFamily.fontFamilyMedium,
    color: Colors.black,
  },
  dateText: {
    fontSize: moderateScale(12),
    fontFamily: FontFamily.fontFamilyRegular,
    color: Colors.viewAllGrey,
    textAlign: 'center',
  },
  loadingView: {
    marginTop: verticalScale(318),
  },
  statusBar: {
    backgroundColor: Colors.white,
    height: moderateScale(30),
    width: '100%',
    zIndex: 2,
  },
  publishdate: {
    fontSize: moderateScale(12),
    color: Colors.viewAllGrey,
    fontFamily: FontFamily.fontFamilyRegular,
  },
  AddView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(20),
    minHeight: verticalScale(60),
  },
});
