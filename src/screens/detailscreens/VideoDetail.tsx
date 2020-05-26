import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  Dimensions,
  Linking,
  Platform,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  NativeModules,
  BackHandler,
  AppState,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import { savedBookMark, checkSavedBookMark } from '../../redux/actions/FoyYouAction';
import {
  writeFileStream,
  readLoginFileStream,
  readSubscriptionFileStream,
} from '../../helpers/rn_fetch_blob/createDirectory';
import HTML from 'react-native-render-html';
import WebView from 'react-native-webview';
import { horizontalScale, moderateScale, verticalScale } from '../../helpers/scale';
import Colors from '../../constants/colors/colors';
import FontFamily from '../../assets/fonts/fonts';
import { Images } from '../../assets';
import translate from '../../assets/strings/strings';
import RelatedVideos from '../../components/ArticleSections/RelatedVideos';
import { parentEnabled, childEnabled, useStaticLable } from '../../../appConfig';
import TextSize from '../../constants/TextSize';
import { ApiMethods } from '../../service/config/';
import apiService from '../../service/fetchContentService/FetchContentService';
import ActivityIndicatorView from '../../components/widgets/ActivityIndicator';
import { getFormattedDateTime } from '../../helpers/dateTimeFormats';
import ShowBannerView from '../../components/native-ads/ShowBannerView';
import JWPlayer from 'react-native-jw-media-player';
import automationStaticLables from '../../constants/automationStaticLables';

import ANJWPlayer from '../../components/jwPlayer/JWPlayer';
import EmptyComponent from '../../components/widgets/EmptyComponent';

const { width }: any = Dimensions.get('window');

class VideoDetail extends React.Component {
  JWPlayer: any;
  constructor(props: any) {
    super(props);
    this.props.checkSavedBookMark(props.navigation.getParam('articleID'));
    this.readData();
    this.state = {
      articleID: props.navigation.getParam('articleID'),
      articleItem: props.navigation.getParam('articleItem'),
      articleLink: props.navigation.getParam('articleLink'),
      articleData: {},
      loading: true,
      refreshing: false,
      showDescription: false,
      youTubeURL: '',
      isNetworkIssue: false,
      playlistItem: {
        title: '',
        mediaId: 'Iyfst4Se',
        image: props.navigation.getParam('articleImage'),
        desc: '',
        time: 0,
        autostart: false,
        controls: true,
        repeat: false,
        displayDescription: true,
        displayTitle: true,
        fullScreenOnLandscape: true,
        landscapeOnFullScreen: true,
      },
      checkBookMark: props.checkBookMark,
      isFullScreen: false,
      previewLines: 0,
      loginData: '',
      subsData: '',
    };

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  writeFile = async () => {
    await writeFileStream(this.props.forYouSavedData);
  };

  readData = async () => {
    let data = await readLoginFileStream();
    let jsonData = JSON.parse(data);
    let subsdata = await readSubscriptionFileStream();
    let jsonSubsData = JSON.parse(subsdata);
    this.setState({
      loginData: jsonData,
      subsData: jsonSubsData,
    });
  };

  componentDidMount() {
    this.handleApiRequest();

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  handleBackButtonClick = () => {
    if (this.state.isFullScreen) {
      return true;
    } else {
      this.props.navigation.goBack(null);
      return true;
    }
  };

  _handleAppStateChange = (nextAppState: any) => {
    if (nextAppState !== 'active' && !this.state.isNetworkIssue) {
      this.JWPlayer.pause();
    }
  };

  handleApiRequest = () => {
    if (this.state.articleLink.length > 2) {
      apiService(this.state.articleLink, ApiMethods.GET, this.onSuccess, this.onFailure);
    }
  };

  getSnapshotBeforeUpdate(oldProps: any, _oldState: any) {
    if (
      oldProps.navigation.getParam('articleLink') !==
        this.props.navigation.getParam('articleLink') ||
      oldProps.navigation.getParam('articleID') !== this.props.navigation.getParam('articleID')
    ) {
      this.setState({ showDescription: false });
      return true;
    } else {
      return false;
    }
  }

  componentDidUpdate(oldProps: any, _oldState: any, snapshot: any) {
    const { navigation } = this.props;

    if (this.props.checkBookMark !== oldProps.checkBookMark) {
      this.setState({
        checkBookMark: this.props.checkBookMark,
      });
      this.writeFile();
    }

    if (oldProps.navigation.getParam('articleID') !== this.props.navigation.getParam('articleID')) {
      this.props.checkSavedBookMark(this.props.navigation.getParam('articleID'));
      this.writeFile();
    }

    if (snapshot) {
      const image = navigation.getParam('articleImage');
      this.setState({
        articleID: navigation.getParam('articleID'),
        articleLink: navigation.getParam('articleLink'),
        playlistItem: {
          ...this.state.playlistItem,
          image,
        },
        loading: true,
        showDescription: false,
        youTubeURL: '',
        previewLines: 0,
      });

      apiService(
        navigation.getParam('articleLink'),
        ApiMethods.GET,
        this.onSuccess,
        this.onFailure,
      );
    }
  }

  checkSplit = (codeString: any) => {
    try {
      return codeString.split('-');
    } catch {
      return null;
    }
  };

  onSuccess = (response: any) => {
    if (response && response.data) {
      const { data } = response;
      let videoId = data && data['featured-video'];

      if (videoId.includes('http') || videoId.includes('youtu')) {
        let videoIdSubStrings = videoId.split('/');
        this.setState({
          articleData: data,
          refreshing: false,
          loading: false,
          youTubeURL: videoIdSubStrings.length >= 3 ? videoIdSubStrings[3] : '',
        });
      } else {
        let videoTempId = '';
        if (this.checkSplit(videoId) !== null) {
          let isId = this.checkSplit(videoId);
          videoTempId = isId[0];
        }

        let playlistItem: any = {
          title: '',
          mediaId: 'Iyfst4Se',
          image: this.props.navigation.getParam('articleImage'),
          desc: '',
          time: 0,
          file: 'https://content.jwplatform.com/videos/' + videoTempId + '.mp4',
          autostart: false,
          controls: true,
          repeat: false,
          displayDescription: true,
          displayTitle: true,
          fullScreenOnLandscape: true,
          landscapeOnFullScreen: true,
        };
        this.setState({
          articleData: data,
          refreshing: false,
          loading: false,
          playlistItem: playlistItem,
          isNetworkIssue: false,
        });
      }
    }
  };

  onFailure = (error: any) => {
    if (error === translate('no_internet')) {
      this.setState({ refreshing: false, loading: false, isNetworkIssue: true });
    } else {
      this.setState({ refreshing: false, loading: false, isNetworkIssue: false });
    }
  };

  _handleRefresh = (articleLink: any) => {
    if (articleLink.length > 2) {
      this.setState({ refreshing: true });
      apiService(articleLink, ApiMethods.GET, this.onSuccess, this.onFailure);
    }
  };

  onFullScreen = () => {
    if (Platform.OS === 'android') {
      NativeModules.PageSuite.lockToLandscape();
    } else {
      NativeModules.ChangeOrientation.lockToLandscape();
    }
  };

  onFullScreenExit = () => {
    if (Platform.OS === 'android') {
      NativeModules.PageSuite.lockToPortrait();
      this.setState({ isScroll: true });
    } else {
      NativeModules.ChangeOrientation.lockToPortrait();
    }
  };

  // Find body preview lines
  handleLayout = (e) => {
    const { height } = e.nativeEvent.layout;
    this.setState({
      previewLines: Math.floor(height / styles.bodyPara.lineHeight),
    });
  };

  renderVideo = () => {
    const { articleData, isFullScreen, youTubeURL }: any = this.state;

    return (
      <View accessible={parentEnabled} style={styles.videoContainer}>
        {/* Display article image */}
        {Object.entries(articleData['featured-image']).length !== 0 ? (
          <View
            accessible={parentEnabled}
            style={[
              styles.imgContainer,
              Platform.OS === 'ios'
                ? { width: horizontalScale(375), height: verticalScale(271) }
                : // eslint-disable-next-line react-native/no-inline-styles
                  {
                    width: isFullScreen ? 0 : width,
                    height: isFullScreen ? verticalScale(280) : verticalScale(277),
                  },
            ]}
          >
            <TouchableOpacity
              accessible={parentEnabled}
              onPress={() => {
                this.onFullScreenExit();
                this.props.navigation.goBack(null);
              }}
              style={styles.backContainer}
            >
              <Image
                accessible={childEnabled}
                accessibilityLabel="Back"
                testID="Back"
                source={Images.backArrow}
                style={styles.backButton}
              />
            </TouchableOpacity>

            {/* Youtube video playback */}
            {youTubeURL && youTubeURL !== '' ? (
              <WebView
                accessible={childEnabled}
                accessibilityLabel={translate('videoPlayer')}
                testID={translate('videoPlayer')}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowsFullscreenVideo={true}
                mediaPlaybackRequiresUserAction={true}
                source={{
                  uri:
                    'https://www.youtube.com/embed/' +
                    youTubeURL +
                    '?rel=0&autoplay=0&showinfo=0&controls=1',
                }}
              />
            ) : null}

            {/* iOS JWPlayer */}
            {Platform.OS === 'ios' && youTubeURL === '' ? (
              <JWPlayer
                accessible={childEnabled}
                accessibilityLabel={translate('videoPlayer')}
                testID={translate('videoPlayer')}
                ref={(p: any) => (this.JWPlayer = p)}
                playlistItem={this.state.playlistItem}
                style={styles.player}
                onFullScreenRequested={() => this.onFullScreen()}
                onFullScreenExitRequested={() => this.onFullScreenExit()}
              />
            ) : null}

            {/* Android JWPlayer */}
            {Platform.OS === 'android' && youTubeURL === '' ? (
              <ANJWPlayer
                accessible={childEnabled}
                accessibilityLabel={translate('videoPlayer')}
                testID={translate('videoPlayer')}
                ref={(p: any) => (this.JWPlayer = p)}
                playlistItem={this.state.playlistItem}
                style={styles.player}
                onFullScreen={() => {
                  this.setState({ isFullScreen: true });
                  this.JWPlayer.pause();
                  this.JWPlayer.play();
                }}
                onFullScreenExit={() => {
                  this.setState({ isFullScreen: false });
                  this.JWPlayer.pause();
                  this.JWPlayer.play();
                }}
              />
            ) : null}
          </View>
        ) : null}
      </View>
    );
  };

  renderheadline = (headline: any) => {
    return (
      <View accessible={parentEnabled}>
        <Text
          accessible={childEnabled}
          accessibilityLabel={useStaticLable ? automationStaticLables.articleHeadLine : headline}
          testID={useStaticLable ? automationStaticLables.articleHeadLine : headline}
          numberOfLines={2}
          style={styles.headlineText}
        >
          {headline}
        </Text>
      </View>
    );
  };

  rendercategory = () => {
    const { articleData, checkBookMark, articleLink, articleItem }: any = this.state;
    const author = articleData && articleData.byline;
    const date = getFormattedDateTime(articleData['published-at']);
    const verticle = articleData.vertical ? articleData.vertical.name : null;
    const category = articleData.category ? articleData.category.name : null;

    return (
      <View accessible={parentEnabled} style={styles.infView}>
        <View accessible={parentEnabled} style={styles.subView1}>
          {verticle || category ? (
            <View accessible={parentEnabled}>
              <Text
                accessible={childEnabled}
                accessibilityLabel={
                  useStaticLable
                    ? automationStaticLables.articleCategory
                    : verticle
                    ? verticle + '/'
                    : '' + category
                    ? category
                    : ''
                }
                testID={
                  useStaticLable
                    ? automationStaticLables.articleCategory
                    : verticle
                    ? verticle + '/'
                    : '' + category
                    ? category
                    : ''
                }
                style={styles.categoryText}
              >
                {verticle ? verticle + '/' : ''}
                {category ? category : ''}
              </Text>
            </View>
          ) : null}
          <View accessible={parentEnabled} style={styles.subView2}>
            <Text
              accessible={childEnabled}
              accessibilityLabel={useStaticLable ? automationStaticLables.articleAuthor : author}
              testID={useStaticLable ? automationStaticLables.articleAuthor : author}
              style={styles.text}
            >
              By {author}
            </Text>
            <View>
              <Text style={styles.bullet}> {translate('blackCircle')} </Text>
            </View>
            <Text
              accessible={childEnabled}
              accessibilityLabel={useStaticLable ? automationStaticLables.publishedAt : date}
              testID={useStaticLable ? automationStaticLables.publishedAt : date}
              style={styles.text}
            >
              {date}
            </Text>
          </View>
        </View>
        <View accessible={parentEnabled} style={styles.subView3}>
          <TouchableOpacity
            accessible={parentEnabled}
            onPress={() => {
              let data = {
                'item-type': 'video-detail',
                articleLink: articleLink,
                data: articleItem,
                category: category,
                articleImage: this.props.navigation.getParam('articleImage'),
              };
              this.props.savedBookMark(data);
            }}
            style={{ marginRight: horizontalScale(21) }}
          >
            <Image
              accessible={childEnabled}
              accessibilityLabel="Bookmark"
              testID="Bookmark"
              source={checkBookMark ? Images.bookmark : Images.unBookmark}
              style={styles.bookmarkIcon}
            />
          </TouchableOpacity>
          {/* <View accessible={parentEnabled}>
            <Image
              accessible={childEnabled}
              accessibilityLabel="Share"
              testID="Share"
              source={Images.share}
              style={styles.shareIcon}
            />
          </View> */}
        </View>
      </View>
    );
  };

  renderDescription = () => {
    const { articleData, showDescription }: any = this.state;
    if (showDescription && articleData['body-preview'].length > moderateScale(125)) {
      const data = articleData && articleData.body;
      const bodydata = `<body>${data}</body>`;
      let tagstyles = {
        p: styles.bodyPara,
        a: {
          fontSize: moderateScale(TextSize.bodySmall),
        },
      };
      return (
        <View accessible={parentEnabled} style={styles.webView}>
          <HTML
            accessible={childEnabled}
            accessibilityLabel={translate('articleDescription')}
            testID={translate('articleDescription')}
            key={1}
            html={bodydata}
            imagesMaxWidth={Dimensions.get('window').width}
            onLinkPress={(evt: any, href: any) => {
              Linking.openURL(href);
            }}
            tagsStyles={tagstyles}
          />
        </View>
      );
    } else {
      return (
        <View accessible={parentEnabled} style={styles.webView}>
          <Text
            accessible={childEnabled}
            accessibilityLabel={
              useStaticLable ? automationStaticLables.articleBody : articleData['body-preview']
            }
            testID={
              useStaticLable ? automationStaticLables.articleBody : articleData['body-preview']
            }
            style={styles.bodyPara}
            numberOfLines={3}
          >
            {articleData['body-preview']}
          </Text>

          {articleData['body-preview'].length > moderateScale(125) ? (
            <TouchableOpacity
              accessible={parentEnabled}
              onPress={() => this.setState({ showDescription: true })}
              style={styles.downArrowContainer}
            >
              <Image
                accessible={childEnabled}
                accessibilityLabel="Show description"
                testID="Show description"
                source={Images.downArrow}
                style={styles.showDetailsIcon}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      );
    }
  };

  renderRelatedTags = () => {
    const { articleData }: any = this.state;
    if (articleData && articleData.tags && articleData.tags.length > 0) {
      return (
        <View style={styles.tags_container} accessible={parentEnabled}>
          <Text
            accessible={childEnabled}
            accessibilityLabel={translate('relatedTags')}
            testID={translate('relatedTags')}
            style={styles.related_tags}
          >
            {translate('relatedTags')}
          </Text>

          {/* <View style={styles.flatlistView}> */}
          <FlatList
            contentContainerStyle={styles.flatlistView}
            data={articleData.tags}
            keyExtractor={(x, i) => i.toString()}
            renderItem={this.renderItem}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
          {/* </View> */}
        </View>
      );
    }
  };

  renderItem = ({ item, index }: any) => {
    if (index < 3) {
      return (
        <View style={styles.tag_item} accessible={parentEnabled}>
          <Text
            accessible={childEnabled}
            accessibilityLabel={useStaticLable ? automationStaticLables.tagName : item.name}
            testID={useStaticLable ? automationStaticLables.tagName : item.name}
            style={styles.tag_label}
          >
            {item.name}
          </Text>
        </View>
      );
    }
  };

  renderAdvertisement = () => {
    return (
      <View style={styles.add_container}>
        <ShowBannerView
          adSizes={['mediumRectangle']}
          adUnitID={'/8352/WWD_Mobile/app/ros/mid-article'}
        />
      </View>
    );
  };

  renderRelatedVideos = () => {
    const { articleData }: any = this.state;
    return (
      <View accessible={parentEnabled}>
        <RelatedVideos data={articleData['related-content']} {...this.props} />
      </View>
    );
  };

  render() {
    const { articleData, articleLink, loading, isNetworkIssue }: any = this.state;
    if (loading) {
      return <ActivityIndicatorView />;
    } else if (isNetworkIssue) {
      return (
        <EmptyComponent
          onPress={() => this.handleApiRequest()}
          errorText={translate('internet_connection')}
        />
      );
    } else {
      return (
        <SafeAreaView style={styles.outerContainer}>
          <NavigationEvents
            onWillFocus={async () => {
              await this.writeFile();
              const id = this.props.navigation.getParam('articleID');
              this.props.checkSavedBookMark(id);
            }}
          />
          <View style={styles.outerContainer} accessible={parentEnabled}>
            {/* {this.renderReadMore()} */}
            {Object.entries(articleData).length > 0 ? (
              <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={() => this._handleRefresh(articleLink)}
                  />
                }
              >
                {Object.entries(articleData['featured-image']).length !== 0
                  ? this.renderVideo()
                  : null}

                {articleData.headline !== '' ? this.renderheadline(articleData.headline) : null}

                {this.rendercategory()}
                {this.renderDescription()}
                {this.renderAdvertisement()}
                {this.renderRelatedVideos()}
              </ScrollView>
            ) : null}
          </View>
        </SafeAreaView>
      );
    }
  }
}
const mapStateToProps = (state: any) => {
  return {
    checkBookMark: state.foryou.checkBookMark,
    forYouSavedData: state.foryou.forYouSavedData,
  };
};
const mapDispatchToProps = (dispatch: any) => ({
  savedBookMark: (data: any) => dispatch(savedBookMark(data)),
  checkSavedBookMark: (id: any) => dispatch(checkSavedBookMark(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoDetail);

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  statusBar: {
    backgroundColor: Colors.white,
    height: verticalScale(30),
    width: '100%',
    zIndex: 2,
  },
  add_container: {
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'black',
    marginTop: moderateScale(20),
  },
  headlineText: {
    color: Colors.black,
    fontFamily: FontFamily.fontFamilyBold,
    fontSize: moderateScale(20),
    lineHeight: moderateScale(23),
    paddingHorizontal: moderateScale(15),
    paddingTop: moderateScale(13),
  },
  bylineText: {
    fontSize: moderateScale(17),
    color: Colors.gray38,
    fontFamily: FontFamily.fontFamilyMedium,
    paddingHorizontal: moderateScale(15),
    marginTop: moderateScale(5),
  },
  videoContainer: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  imgContainer: {
    marginTop: verticalScale(13),
  },
  image: {
    width: horizontalScale(375),
    height: verticalScale(271),
  },
  backContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: moderateScale(40),
    width: moderateScale(40),
    borderRadius: moderateScale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    height: moderateScale(15),
    width: moderateScale(15),
    tintColor: Colors.white,
  },
  captionText: {
    fontFamily: FontFamily.fontFamilyRegular,
    color: Colors.viewAllGrey,
    paddingHorizontal: horizontalScale(15),
  },
  categoryText: {
    fontFamily: FontFamily.fontFamilyBold,
    color: Colors.backgroundRed,
    textTransform: 'uppercase',
    width: horizontalScale(230),
  },
  infView: {
    flexDirection: 'row',
    marginHorizontal: horizontalScale(15),
    marginTop: verticalScale(17),
    justifyContent: 'space-between',
  },
  subView1: {
    width: horizontalScale(280),
  },
  subView2: {
    flexDirection: 'row',
    marginTop: verticalScale(5),
  },
  subView3: {
    flexDirection: 'row',
  },
  text: {
    fontFamily: FontFamily.fontFamilyRegular,
    color: Colors.gray43,
  },
  bullet: {
    color: Colors.backgroundRed,
    marginTop: verticalScale(-2),
  },
  webView: {
    marginTop: verticalScale(13),
    paddingHorizontal: horizontalScale(14),
  },
  bodyPara: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(21),
    fontFamily: FontFamily.tiemposTextRegular,
    color: Colors.black,
  },
  downArrowContainer: {
    alignItems: 'center',
  },
  showDetailsIcon: {
    marginVertical: moderateScale(10),
    height: moderateScale(12),
    width: moderateScale(16),
  },
  playIcon: {
    width: moderateScale(54),
    height: moderateScale(54),
  },
  playIconView: {
    position: 'absolute',
    alignSelf: 'center',
    top: verticalScale(130),
  },
  bookmarkIcon: {
    height: moderateScale(21),
    width: moderateScale(15),
  },
  shareIcon: {
    height: moderateScale(22),
    width: moderateScale(23),
  },
  gridImg: {
    width: horizontalScale(116),
    height: verticalScale(116),
    marginLeft: horizontalScale(6.2),
    marginTop: verticalScale(6),
  },
  gridImage: {
    width: horizontalScale(116),
    height: verticalScale(116),
  },
  galleryText: {
    fontSize: moderateScale(18),
    lineHeight: moderateScale(22),
    color: Colors.white,
    textAlign: 'center',
    fontFamily:
      Platform.OS === 'ios'
        ? FontFamily.publicoBannerMediumIos
        : FontFamily.publicoBannerMediumAndroid,
    fontWeight: '500',
  },
  galleryimages: {
    width: horizontalScale(87),
    position: 'absolute',
    right: horizontalScale(15),
    bottom: verticalScale(8),
  },
  imagesText: {
    fontSize: moderateScale(11),
    lineHeight: moderateScale(16),
    color: Colors.white,
    fontFamily: FontFamily.fontFamilyMedium,
    fontWeight: '500',
    textAlign: 'center',
  },
  smallImage: {
    alignSelf: 'center',
    marginTop: verticalScale(10),
  },
  disabled: {
    tintColor: Colors.greyMedium,
  },
  notDisabled: {
    tintColor: Colors.black,
  },
  whiteSeparator: {
    width: horizontalScale(85.94),
    height: verticalScale(0.66),
    backgroundColor: Colors.white,
  },
  tags_container: {
    alignItems: 'center',
    marginVertical: verticalScale(12),
  },
  flatlistView: {
    width: '100%',
    justifyContent: 'center',
  },
  related_tags: {
    fontSize: moderateScale(18),
    lineHeight: moderateScale(32),
    letterSpacing: moderateScale(0.33),
    color: Colors.black,
    fontFamily: FontFamily.fontFamilyBold,
  },
  tag_item: {
    marginHorizontal: moderateScale(6),
    marginVertical: verticalScale(10),
    borderRadius: moderateScale(15),
    justifyContent: 'center',
    alignItems: 'center',
    height: moderateScale(30),
    paddingHorizontal: horizontalScale(10),
    elevation: 3,
    shadowOpacity: 1,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowColor: Colors.greyMedium,
    backgroundColor: Colors.white,
  },
  tag_label: {
    fontSize: moderateScale(13),
    letterSpacing: moderateScale(0.24),
    color: Colors.viewAllGrey,
    textTransform: 'capitalize',
    fontFamily: FontFamily.fontFamilyRegular,
  },

  player: {
    flex: 1,
  },
});
