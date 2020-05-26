import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  Dimensions,
  Linking,
  Platform,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import HTML from 'react-native-render-html';
import { IGNORED_TAGS } from 'react-native-render-html/src/HTMLUtils';
import Detailheader from '../../components/header/deatailheader/Detailheader';
import { horizontalScale, moderateScale, verticalScale } from '../../helpers/scale';
import Colors from '../../constants/colors/colors';
import FontFamily from '../../assets/fonts/fonts';
import { Images } from '../../assets';
import translate from '../../assets/strings/strings';
import moment from 'moment';
import RelatedStories from '../../components/ArticleSections/RelatedStories';
import CustomImage from '../../components/widgets/CustomImage';
import { parentEnabled, childEnabled, useStaticLable } from '../../../appConfig';
import { ModalView } from '../../components/widgets/ModalView';
import { saveTextSize } from '../../redux/actions/User';
import { LOGIN, DEV_AUTH } from '../../service/config/serviceConstants';
import {
  writeFileStream,
  readLoginFileStream,
  readSubscriptionFileStream,
} from '../../helpers/rn_fetch_blob/createDirectory';
import { savedBookMark, checkSavedBookMark } from '../../redux/actions/FoyYouAction';
import TextSize from '../../constants/TextSize';
import ShowBannerView from '../../components/native-ads/ShowBannerView';

const font = {
  Normal: 'small',
  Medium: 'medium',
  Large: 'large',
  ExtraLarge: 'extralarge',
};

import apiService from '../../service/fetchContentService/FetchContentService';
import ActivityIndicatorView from '../../components/widgets/ActivityIndicator';
import { ApiUrls, ApiPaths, ApiMethods } from '../../service/config/serviceConstants';
import ClickView from '../../components/widgets/clickView';
import automationStaticLables from '../../constants/automationStaticLables';
import EmptyComponent from '../../components/widgets/EmptyComponent';
import {
  handleAndroidBackButton,
  removeAndroidBackButtonHandler,
} from '../../helpers/androidBackButton';
import LoginSubsButton from '../../components/widgets/LoginSubsButton';

class ArticleDetail extends React.Component {
  constructor(props: any) {
    super(props);
    this.readData();
    this.state = {
      articleID: props.navigation.state.params.articleID,
      articleData: {},
      articleItem: props.navigation.state.params.articleItem,
      loading: true,
      modalVisible: false,
      size: props.size,
      refreshing: false,
      key: 1,
      isSmallDisabled: false,
      isLargeDisabled: false,
      checkBookMark: props.checkBookMark,
      Images: [],
      loginData: '',
      isNetworkIssue: false,
      subsData: '',
    };
  }

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

  writeFile = async () => {
    await writeFileStream(this.props.forYouSavedData);
  };
  async UNSAFE_componentWillReceiveProps(nextprops: any) {
    if (
      this.props.navigation.state.params.articleID !== nextprops.navigation.state.params.articleID
    ) {
      this.setState({
        loading: true,
        articleItem: nextprops.navigation.state.params.articleItem,
      });
      this.props.checkSavedBookMark(nextprops.navigation.state.params.articleID);
      apiService(
        ApiUrls.PROD_BASE_URL +
          ApiPaths.ARTICLE_DETAILS +
          nextprops.navigation.state.params.articleID,
        ApiMethods.GET,
        this.onSuccess,
        this.onFailure,
      );
    }
    try {
      if (this.props.checkBookMark !== nextprops.checkBookMark) {
        this.setState({
          checkBookMark: nextprops.checkBookMark,
        });
        await writeFileStream(nextprops.forYouSavedData);
      }
    } catch {
      // do nothing
    }
  }

  componentDidMount = async () => {
    this.handleApiRequest();
    handleAndroidBackButton(() => {
      this.handleBackPress();
    });
    if (this.state.size === 'small') {
      this.setState({ isSmallDisabled: true });
    }

    if (this.state.size === 'extralarge') {
      this.setState({ isLargeDisabled: true });
    }
  };

  handleBackPress = () => {
    this.props.navigation.goBack(null);
    return true;
  };

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }

  handleApiRequest = async () => {
    await apiService(
      ApiUrls.PROD_BASE_URL +
        ApiPaths.ARTICLE_DETAILS +
        this.props.navigation.state.params.articleID,
      ApiMethods.GET,
      this.onSuccess,
      this.onFailure,
    );
  };

  // getSnapshotBeforeUpdate(oldProps, oldState) {
  //   if (
  //     oldProps.navigation.getParam('articleID') !==
  //     this.props.navigation.getParam('articleID')
  //   ) {
  //     alert(oldProps.checkBookMark);
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot) {
      this.setState({
        loading: true,
      });

      apiService(
        ApiUrls.PROD_BASE_URL +
          ApiPaths.ARTICLE_DETAILS +
          this.props.navigation.getParam('articleID'),
        ApiMethods.GET,
        this.onSuccess,
        this.onFailure,
      );
    }
  }

  onSuccess = (response: any) => {
    if (response && response.data) {
      this.setState({
        articleData: response.data,
        loading: false,
        isNetworkIssue: false,
      });
    }
    const GalleryImages: any = [];
    if (
      response &&
      response.data &&
      response.data['featured-gallery'] &&
      response.data['featured-gallery'].images &&
      response.data['featured-gallery'].images.length > 0
    ) {
      response.data['featured-gallery'].images.map((gallery: any) => {
        if (gallery.crops.length > 0) {
          GalleryImages.push({
            url: gallery.crops[3].url + `&w=${Math.round(horizontalScale(375))}`,
          });
        }
      });
    }
    this.setState({ Images: GalleryImages });
  };

  onRefresh = () => {
    this.setState({ refreshing: true });
    setTimeout(() => {
      this.setState({
        refreshing: false,
      });
    }, 500);
  };

  onFailure = (error: any) => {
    if (error === translate('no_internet')) {
      this.setState({ loading: false, isNetworkIssue: true });
    } else {
      this.setState({ loading: false, isNetworkIssue: false });
    }
  };

  resetWebViewToInitialUrl = () => {
    this.setState({
      key: this.state.key + 1,
    });
  };

  renderheadline = () => {
    const { articleData } = this.state;
    const fontsize =
      this.state.size === 'small'
        ? { fontSize: moderateScale(TextSize.titleSmall) }
        : this.state.size === 'medium'
        ? { fontSize: moderateScale(TextSize.titleMedium) }
        : this.state.size === 'large'
        ? { fontSize: moderateScale(TextSize.titleLarge) }
        : { fontSize: moderateScale(TextSize.titleExtraLarge) };
    return (
      <View accessible={parentEnabled}>
        {articleData.headeline !== '' ? (
          <Text
            accessible={childEnabled}
            accessibilityLabel={
              useStaticLable ? automationStaticLables.articleHeadLine : articleData.headline
            }
            testID={useStaticLable ? automationStaticLables.articleHeadLine : articleData.headline}
            style={[styles.headlineText, fontsize]}
          >
            {articleData.headline}
          </Text>
        ) : null}
      </View>
    );
  };

  renderTagLine = () => {
    const { articleData, size } = this.state;
    const data = articleData && articleData.tagline;

    const bodydata = `<body>${data}</body>`;
    let tagstyles = {
      p: {
        fontSize:
          size === 'small'
            ? moderateScale(TextSize.tagLineSmall)
            : size === 'medium'
            ? moderateScale(TextSize.tagLineMedium)
            : size === 'large'
            ? moderateScale(TextSize.tagLineLarge)
            : moderateScale(TextSize.tagLineExtraLarge),
        fontFamily: FontFamily.fontFamilyMedium,
        color: Colors.gray38,
      },
      body: {
        fontSize:
          size === 'small'
            ? moderateScale(TextSize.tagLineSmall)
            : size === 'medium'
            ? moderateScale(TextSize.tagLineMedium)
            : size === 'large'
            ? moderateScale(TextSize.tagLineLarge)
            : moderateScale(TextSize.tagLineExtraLarge),
        fontFamily: FontFamily.fontFamilyMedium,
        color: Colors.gray38,
      },
      a: {
        fontSize:
          size === 'small'
            ? moderateScale(TextSize.tagLineSmall)
            : size === 'medium'
            ? moderateScale(TextSize.tagLineMedium)
            : size === 'large'
            ? moderateScale(TextSize.tagLineLarge)
            : moderateScale(TextSize.tagLineExtraLarge),
      },
    };

    return (
      <View accessible={parentEnabled} style={styles.webView}>
        {data !== '' ? (
          <HTML
            html={bodydata}
            key={this.state.key}
            ignoredStyles={[
              'display',
              'text-align',
              'font-family',
              'font-size',
              'padding',
              'transform',
            ]}
            ignoredTags={[...IGNORED_TAGS]}
            imagesMaxWidth={Dimensions.get('window').width}
            onLinkPress={(evt: any, href: any) => {
              Linking.openURL(href);
            }}
            tagsStyles={tagstyles}
          />
        ) : null}
      </View>
    );
  };

  renderImage = () => {
    const { articleData } = this.state;

    const url =
      articleData &&
      articleData['featured-image'] &&
      articleData['featured-image'].crops &&
      articleData['featured-image'].crops[3].url;
    const photonUrl = url === undefined ? '' : url + `&w=${Math.round(horizontalScale(375))}`;

    return (
      <View accessible={parentEnabled}>
        {/* Display article image */}
        {Object.entries(articleData['featured-image']).length !== 0 &&
        articleData['featured-video'] === '' &&
        Object.entries(articleData['featured-gallery']).length === 0 ? (
          <View style={styles.imgContainer}>
            <CustomImage
              accessible={childEnabled}
              accessibilityLabel={'Article Image'}
              testID={'Article Image'}
              url={photonUrl ? photonUrl : null}
              style={styles.image}
            />
          </View>
        ) : null}
        {/* Display article video */}
        {articleData['featured-video'] !== '' ? (
          <View accessible={true}>
            <View style={styles.imgContainer}>
              <CustomImage
                accessible={true}
                accessibilityLabel={
                  useStaticLable
                    ? automationStaticLables.articleImage
                    : articleData['featured-image'].alt
                }
                testID={
                  useStaticLable
                    ? automationStaticLables.articleImage
                    : articleData['featured-image'].alt
                }
                url={photonUrl ? photonUrl : null}
                style={styles.image}
              />
            </View>
            <TouchableOpacity
              style={styles.playIconView}
              onPress={() => {
                this.props.navigation.navigate('JWPlayer', {
                  title: articleData.headline,
                  image:
                    articleData['featured-image'].crops.length > 0
                      ? articleData['featured-image'].crops[0].url +
                        `?h=${Math.round(verticalScale(300))}`
                      : '',
                  video: 'https://www.youtube.com/embed/RWWmJiJc89A',
                });
              }}
            >
              <Image
                accessible={true}
                accessibilityLabel="Play video"
                testID="Play video"
                source={Images.playIcon}
                style={styles.playIcon}
              />
            </TouchableOpacity>
          </View>
        ) : null}
        {/* Display article gallery */}
        {Object.entries(articleData['featured-gallery']).length !== 0 ? (
          <ClickView
            accessible={parentEnabled}
            style={styles.imgContainer}
            onPress={() => {
              this.props.navigation.navigate('GalleryImages', {
                galleryData: this.state.articleData,
                Images: this.state.Images,
                isNetworkIssue: this.state.isNetworkIssue,
              });
            }}
          >
            <CustomImage
              accessible={childEnabled}
              accessibilityRole={'image'}
              accessibilityLabel={
                useStaticLable
                  ? automationStaticLables.articleImage
                  : articleData['featured-image'].alt
              }
              testID={
                useStaticLable
                  ? automationStaticLables.articleImage
                  : articleData['featured-image'].alt
              }
              url={url ? url + `&w=${Math.round(horizontalScale(375))}` : ''}
              style={styles.image}
            />
          </ClickView>
        ) : null}
      </View>
    );
  };

  renderImageCaption = () => {
    const { articleData } = this.state;
    const caption =
      articleData && articleData['featured-image'] && articleData['featured-image'].caption;
    const credit =
      articleData && articleData['featured-image'] && articleData['featured-image'].credit;
    const fontsize =
      this.state.size === 'small'
        ? { fontSize: moderateScale(TextSize.captionSmall) }
        : this.state.size === 'medium'
        ? { fontSize: moderateScale(TextSize.captionMedium) }
        : this.state.size === 'large'
        ? { fontSize: moderateScale(TextSize.captionLarge) }
        : { fontSize: moderateScale(TextSize.captionExtraLarge) };
    return (
      <View accessible={parentEnabled} style={{ paddingTop: verticalScale(10) }}>
        <Text
          accessible={childEnabled}
          accessibilityLabel={useStaticLable ? automationStaticLables.articleCaption : caption}
          testID={useStaticLable ? automationStaticLables.articleCaption : caption}
          style={[styles.captionText, fontsize]}
        >
          {caption}
        </Text>
        <Text
          accessible={childEnabled}
          accessibilityLabel={useStaticLable ? automationStaticLables.articleCredit : credit}
          testID={useStaticLable ? automationStaticLables.articleCredit : credit}
          style={[styles.captionText, fontsize]}
        >
          {credit}
        </Text>
      </View>
    );
  };

  renderGridImage = () => {
    const { articleData } = this.state;
    const count =
      articleData &&
      articleData['featured-gallery'] &&
      articleData['featured-gallery']['image-count'];
    const galleryData =
      articleData && articleData['featured-gallery'] && articleData['featured-gallery'].images;
    return (
      <View>
        <FlatList
          data={galleryData}
          keyExtractor={(x, i) => i.toString()}
          renderItem={this.renderItem}
          horizontal={true}
          bounces={false}
        />
        <ClickView
          style={styles.galleryimages}
          onPress={() => {
            this.props.navigation.navigate('GalleryImages', {
              galleryData: this.state.articleData,
              Images: this.state.Images,
              isNetworkIssue: this.state.isNetworkIssue,
            });
          }}
        >
          <Text style={styles.galleryText}>{translate('gallery')}</Text>
          <View style={styles.whiteSeparator} />
          <Text style={styles.imagesText}>
            {count} {translate('images')}
          </Text>
        </ClickView>
      </View>
    );
  };

  renderItem = ({ item, index }) => {
    if (index < 3) {
      const url = item && item.crops && item.crops[3].url;
      const photonUrl = url === undefined ? '' : url + `&w=${Math.round(horizontalScale(116))}`;
      return (
        <ClickView
          accessible={parentEnabled}
          style={styles.gridImg}
          onPress={() => {
            this.props.navigation.navigate('GalleryImages', {
              galleryData: this.state.articleData,
              Images: this.state.Images,
            });
          }}
        >
          <CustomImage
            accessible={childEnabled}
            accessibilityRole={'image'}
            accessibilityLabel={
              useStaticLable ? automationStaticLables.gridImage : item.title + (1 + index)
            }
            testID={useStaticLable ? automationStaticLables.gridImage : item.title + (1 + index)}
            url={photonUrl ? photonUrl : null}
            style={styles.gridImage}
          />
        </ClickView>
      );
    }
  };

  rendercategory = () => {
    const { articleData } = this.state;
    const author = articleData && articleData.byline;
    const date = moment(articleData['published-at']).format('hh:mm A - MMM DD, YYYY');
    const fontsize =
      this.state.size === 'small'
        ? { fontSize: moderateScale(TextSize.categorySmall) }
        : this.state.size === 'medium'
        ? { fontSize: moderateScale(TextSize.categoryMedium) }
        : this.state.size === 'large'
        ? { fontSize: moderateScale(TextSize.categoryLarge) }
        : { fontSize: moderateScale(TextSize.categoryExtraLarge) };
    const verticle = articleData.vertical ? articleData.vertical.name : '';
    const category = articleData.category ? articleData.category.name : '';

    return (
      <View accessible={parentEnabled} style={styles.infView}>
        <View accessible={childEnabled} style={styles.subView1}>
          <View accessible={parentEnabled}>
            <Text
              accessible={childEnabled}
              accessibilityLabel={
                useStaticLable ? automationStaticLables.articleCategory : verticle + '/' + category
              }
              testID={
                useStaticLable ? automationStaticLables.articleCategory : verticle + '/' + category
              }
              style={[styles.categoryText, fontsize]}
            >
              {verticle ? verticle : ''} {category ? ' / ' + category : ''}
            </Text>
          </View>
          <View accessible={parentEnabled} style={styles.subView2}>
            <Text style={{ flexShrink: 1 }}>
              <Text
                accessible={childEnabled}
                accessibilityLabel={useStaticLable ? automationStaticLables.articleAuthor : author}
                testID={useStaticLable ? automationStaticLables.articleAuthor : author}
                style={[styles.text, fontsize]}
              >
                By {author}
              </Text>
              <Text style={styles.bullet}> {translate('blackCircle')} </Text>
              <Text
                accessible={childEnabled}
                accessibilityLabel={useStaticLable ? automationStaticLables.publishedAt : date}
                testID={useStaticLable ? automationStaticLables.publishedAt : date}
                style={[styles.text, fontsize]}
              >
                {date}
              </Text>
            </Text>
          </View>
        </View>
        <View accessible={parentEnabled} style={styles.subView3}>
          <TouchableOpacity
            accessible={childEnabled}
            style={{ marginRight: horizontalScale(21) }}
            onPress={() => {
              try {
                let type = 'article';
                if (Object.entries(articleData['featured-gallery']).length !== 0) {
                  type = 'article';
                } else if (Object.entries(articleData['featured-video']).length !== 0) {
                  type = 'article-video';
                }
                let data = {
                  'item-type': type,
                  data: this.state.articleItem,
                };
                this.props.savedBookMark(data);
              } catch {
                // do nothing
              }
            }}
          >
            <Image
              accessible={childEnabled}
              accessibilityLabel="Bookmark"
              testID="Bookmark"
              source={this.state.checkBookMark ? Images.bookmark : Images.unBookmark}
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

  renderArticleDetails = (item: any, index: any) => {
    const { size }: any = this.state;
    const bodydata = item;
    `<p>${item}</p>`;
    let tagstyles = {
      p: {
        fontSize:
          size === 'small'
            ? moderateScale(TextSize.bodySmall)
            : size === 'medium'
            ? moderateScale(TextSize.bodyMedium)
            : size === 'large'
            ? moderateScale(TextSize.bodyLarge)
            : moderateScale(TextSize.bodyExtraLarge),
        fontFamily: FontFamily.tiemposTextRegular,
        color: Colors.black,
      },
      a: {
        fontSize:
          size === 'small'
            ? moderateScale(TextSize.bodySmall)
            : size === 'medium'
            ? moderateScale(TextSize.bodyMedium)
            : size === 'large'
            ? moderateScale(TextSize.bodyLarge)
            : moderateScale(TextSize.bodyExtraLarge),
        color: Colors.backgroundRed,
      },
    };
    return (
      <View accessible={parentEnabled}>
        <HTML
          key={this.state.key}
          html={bodydata}
          ignoredStyles={[
            'display',
            'text-align',
            'font-family',
            'font-size',
            'class',
            'padding',
            'transform',
          ]}
          ignoredTags={[...IGNORED_TAGS]}
          imagesMaxWidth={Dimensions.get('window').width}
          onLinkPress={(evt: any, href: any) => {
            Linking.openURL(href);
          }}
          tagsStyles={tagstyles}
          imagesInitialDimensions={{
            width: horizontalScale(375),
            height: moderateScale(311),
          }}
        />

        {(index + 1) % 5 === 0 && (
          <View>
            {/* <View style={styles.separator} /> */}
            <View style={styles.addView}>
              <ShowBannerView
                adSizes={['mediumRectangle']}
                adUnitID={'/8352/WWD_Mobile/app/ros/mid-article'}
              />
            </View>
            {/* <View style={styles.separator} /> */}
          </View>
        )}
      </View>
    );
  };

  renderDescription = () => {
    const { articleData, loginData, subsData }: any = this.state;
    const entitlementLength =
      articleData && articleData.entitlements && articleData.entitlements.length;
    const preview =
      articleData && articleData['body-preview'] ? `<p>${articleData['body-preview']}</p>` : null;

    const data =
      (loginData &&
        loginData[DEV_AUTH] &&
        loginData[DEV_AUTH].ent &&
        loginData[DEV_AUTH].ent.length != 0) ||
      subsData != null ||
      entitlementLength === 0
        ? articleData && articleData.body
        : preview;
    const splitData = data.split('</p>');

    return (
      <View accessible={parentEnabled} style={styles.webView}>
        <FlatList
          data={splitData}
          extraData={this.state.key}
          renderItem={({ item, index }) => this.renderArticleDetails(item, index)}
          keyExtractor={(x, i) => i.toString()}
          automaticallyAdjustContentInset={false}
        />
      </View>
    );
  };

  renderRelatedarticles = () => {
    const { articleData }: any = this.state;
    return (
      <View accessible={parentEnabled}>
        <RelatedStories data={articleData['related-content']} {...this.props} />
      </View>
    );
  };

  renderSubscribeLogin = () => {
    const { navigation }: any = this.props;
    return (
      <View accessible={parentEnabled} style={styles.SuscribeLoginView}>
        <ClickView
          onPress={() => {
            navigation.navigate('subscription', { login: 'second' });
          }}
          style={styles.subscribeView}
        >
          <Text
            accessible={childEnabled}
            accessibilityLabel={translate('subscribe_today')}
            testID={translate('subscribe_today')}
            style={styles.subscribeTodayText}
          >
            {translate('subscribe_today')}
          </Text>
          <View
            style={{
              paddingLeft: horizontalScale(7),
            }}
          >
            <Image
              accessible={childEnabled}
              accessibilityRole={'image'}
              accessibilityLabel={automationStaticLables.expand}
              testID={automationStaticLables.expand}
              source={Images.arrow}
              style={styles.icon}
            />
          </View>
        </ClickView>
        <ClickView
          onPress={() => {
            this.props.navigation.navigate('login', {
              url: LOGIN,
              login: 'second',
            });
          }}
          style={styles.loginView}
        >
          <Text
            accessible={childEnabled}
            accessibilityLabel={translate('login')}
            testID={translate('login')}
            style={styles.loginText}
          >
            {translate('login')}
          </Text>
        </ClickView>
      </View>
    );
  };

  smallSizePressed = (_size: any) => {
    const { saveTextSize }: any = this.props;
    this.resetWebViewToInitialUrl();
    if (this.state.size === 'extralarge') {
      this.setState({ size: font.Large, isSmallDisabled: false, isLargeDisabled: false }, () => {
        saveTextSize(this.state.size);
      });
    } else if (this.state.size === 'large') {
      this.setState({ size: font.Medium, isSmallDisabled: false, isLargeDisabled: false }, () => {
        saveTextSize(this.state.size);
      });
    } else if (this.state.size === 'medium') {
      this.setState({ size: font.Normal, isSmallDisabled: true, isLargeDisabled: false }, () => {
        saveTextSize(this.state.size);
      });
    } else {
      this.setState({ size: font.Normal, isSmallDisabled: true, isLargeDisabled: false }, () => {
        saveTextSize(this.state.size);
      });
    }
  };

  largeSizePressed = (_size: any) => {
    this.resetWebViewToInitialUrl();
    const { saveTextSize }: any = this.props;
    if (this.state.size === 'small') {
      this.setState({ size: font.Medium, isLargeDisabled: false, isSmallDisabled: false }, () => {
        saveTextSize(this.state.size);
      });
    } else if (this.state.size === 'medium') {
      this.setState({ size: font.Large, isLargeDisabled: false, isSmallDisabled: false }, () => {
        saveTextSize(this.state.size);
      });
    } else if (this.state.size === 'large') {
      this.setState(
        { size: font.ExtraLarge, isLargeDisabled: true, isSmallDisabled: false },
        () => {
          saveTextSize(this.state.size);
        },
      );
    } else {
      this.setState(
        { size: font.ExtraLarge, isLargeDisabled: true, isSmallDisabled: false },
        () => {
          saveTextSize(this.state.size);
        },
      );
    }
  };

  textSizerModal = () => {
    const { modalVisible, isSmallDisabled, isLargeDisabled }: any = this.state;
    if (modalVisible) {
      return (
        <ModalView
          backdropColor={Colors.white}
          backdropOpacity={0.9}
          isVisible={modalVisible}
          customColor={Colors.white}
          style={styles.modalView}
          animationIn={'fadeIn'}
          transparent={true}
          backDropPressed={() => {
            this.setState({
              modalVisible: false,
            });
          }}
        >
          <View accessible={parentEnabled} style={styles.sizeView}>
            <ClickView
              accessible={parentEnabled}
              disabled={isSmallDisabled}
              accessibilityState={!isSmallDisabled}
              onPress={this.smallSizePressed}
              style={styles.smallSizeIcon}
            >
              <Image
                accessible={childEnabled}
                accessibilityLabel={automationStaticLables.small}
                testID={automationStaticLables.small}
                source={Images.smallSize}
                style={
                  isSmallDisabled
                    ? [styles.smallImage, styles.disabled]
                    : [styles.smallImage, styles.notDisabled]
                }
              />
            </ClickView>
            <ClickView
              accessible={parentEnabled}
              disabled={isLargeDisabled}
              accessibilityState={!isLargeDisabled}
              style={styles.largeSizeIcon}
              onPress={this.largeSizePressed}
            >
              <Image
                accessible={childEnabled}
                accessibilityLabel={automationStaticLables.large}
                testID={automationStaticLables.large}
                source={Images.largeSize}
                style={
                  isLargeDisabled
                    ? [styles.largeIcon, styles.disabled]
                    : [styles.largeIcon, styles.notDisabled]
                }
              />
            </ClickView>
          </View>
        </ModalView>
      );
    }
  };

  renderLogin = () => {
    const { navigation }: any = this.props;
    return (
      <View accessible={parentEnabled} style={{ marginTop: verticalScale(20) }}>
        <LoginSubsButton navigation={navigation} />
      </View>
    );
  };

  render() {
    const { goBack, navigate } = this.props.navigation;
    const { articleData, modalVisible, isNetworkIssue, loginData, subsData }: any = this.state;
    const entitlementLength =
      articleData && articleData.entitlements && articleData.entitlements.length;
    if (isNetworkIssue) {
      return (
        <View>
          {Platform.OS === 'ios' && <View style={styles.statusBar} />}
          <Detailheader
            onBack={() => goBack()}
            onPressLogo={() => {
              navigate('Home');
            }}
            onPressSizeFormatter={() => {
              this.setState({ modalVisible: !modalVisible });
            }}
          />
          <EmptyComponent
            onPress={() => this.handleApiRequest()}
            errorText={translate('internet_connection')}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.outerContainer}>
          {Platform.OS === 'ios' && <View style={styles.statusBar} />}
          <NavigationEvents
            onWillFocus={async () => {
              await this.writeFile();
              this.props.checkSavedBookMark(this.props.navigation.state.params.articleID);
              this.setState({
                checkBookMark: this.props.checkBookMark,
              });
            }}
          />
          <Detailheader
            onBack={() => goBack()}
            onPressLogo={() => {
              navigate('Home');
            }}
            onPressSizeFormatter={() => {
              this.setState({ modalVisible: !modalVisible });
            }}
          />
          {this.state.loading ? (
            <ActivityIndicatorView />
          ) : (
            <View style={{ flex: 1 }}>
              <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.AddView}>
                  <ShowBannerView
                    adSizes={['banner', 'fullBanner']}
                    adUnitID={'/8352/WWD_Mobile/app/ros/leaderboard'}
                  />
                </View>
                {articleData.headline !== '' ? this.renderheadline() : null}

                {articleData.tagline !== '' ? this.renderTagLine() : null}

                {Object.entries(articleData['featured-image']).length !== 0
                  ? this.renderImage()
                  : null}

                {Object.entries(articleData['featured-gallery']).length !== 0
                  ? this.renderGridImage()
                  : null}

                {Object.entries(articleData['featured-image']).length !== 0
                  ? this.renderImageCaption()
                  : null}

                {this.rendercategory()}
                {this.renderDescription()}
                {(loginData &&
                  loginData[DEV_AUTH] &&
                  loginData[DEV_AUTH].ent &&
                  loginData[DEV_AUTH].ent.length != 0) ||
                subsData !== null ||
                entitlementLength == 0 ? (
                  <View />
                ) : (
                  this.renderLogin()
                )}
                {this.renderRelatedarticles()}
              </ScrollView>
              {(loginData &&
                loginData[DEV_AUTH] &&
                loginData[DEV_AUTH].ent &&
                loginData[DEV_AUTH].ent.length != 0) ||
              subsData !== null ? (
                <View />
              ) : (
                this.renderSubscribeLogin()
              )}
            </View>
          )}
          {this.textSizerModal()}
        </View>
      );
    }
  }
}

const mapStateToProps = (state: any) => {
  return {
    size: state.user.size,
    checkBookMark: state.foryou.checkBookMark,
    forYouSavedData: state.foryou.forYouSavedData,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  saveTextSize: (size: any) => dispatch(saveTextSize(size)),
  savedBookMark: (data: any) => dispatch(savedBookMark(data)),
  checkSavedBookMark: (id: any) => dispatch(checkSavedBookMark(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ArticleDetail);

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    // marginBottom: moderateScale(42),
  },
  container: {
    flex: 1,
  },
  add: {
    width: moderateScale(321),
    height: moderateScale(52),
    alignSelf: 'center',
    backgroundColor: 'black',
    marginTop: moderateScale(9),
  },
  headlineText: {
    color: Colors.black,
    fontFamily: FontFamily.fontFamilyBold,
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
  imgContainer: {
    width: horizontalScale(375),
    height: verticalScale(271),
    marginTop: verticalScale(13),
  },
  image: {
    width: horizontalScale(375),
    height: verticalScale(271),
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
    flex: 1,
  },
  subView1: {
    width: horizontalScale(280),
  },
  subView2: {
    flexDirection: 'row',
    marginTop: verticalScale(5),
    flex: 1,
  },
  subView3: {
    flexDirection: 'row',
  },
  text: {
    fontFamily: FontFamily.fontFamilyRegular,
    color: Colors.gray43,
    flexShrink: 1,
  },
  bullet: {
    color: Colors.backgroundRed,
  },
  SuscribeLoginView: {
    flexDirection: 'row',
    width: horizontalScale(375),
    height: verticalScale(58),
    borderTopWidth: 1,
    borderColor: 'rgba(216,216,216,0.5)',
  },
  readMoreText: {
    textAlign: 'center',
    marginVertical: verticalScale(10),
    fontSize: moderateScale(14),
    fontFamily: FontFamily.fontFamilyBold,
    color: Colors.backgroundRed,
  },
  webView: {
    marginTop: verticalScale(13),
    paddingHorizontal: horizontalScale(14),
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
  statusBar: {
    backgroundColor: Colors.white,
    height: moderateScale(20),
    width: '100%',
    zIndex: 2,
  },
  sizeView: {
    height: verticalScale(50),
    width: horizontalScale(110),
    marginTop: Platform.OS === 'ios' ? verticalScale(86) : verticalScale(68),
    backgroundColor: Colors.white,
    borderRadius: 5,
    borderColor: 'rgba(216, 216, 216, 0.5)',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  smallSizeIcon: {
    borderRightWidth: 1,
    borderColor: 'rgba(216,216,216,0.5)',
    alignSelf: 'center',
    width: horizontalScale(45),
    padding: 10,
  },
  largeSizeIcon: {
    padding: 10,
    alignSelf: 'center',
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
    // TODO Form Deck FontFamily
    fontFamily: FontFamily.fontFamilyMedium,
    fontWeight: '500',
    textAlign: 'center',
  },
  smallImage: {
    alignItems: 'center',
    justifyContent: 'center',
    width: moderateScale(14),
    height: moderateScale(14),
  },
  largeIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: moderateScale(18),
    height: moderateScale(20),
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
  modalView: {
    top: 0,
    right: 0,
    marginLeft: 20,
    position: 'absolute',
  },
  addView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(10),
    // height: 260,
  },
  separator: {
    width: horizontalScale(344),
    height: verticalScale(2),
    alignSelf: 'center',
    backgroundColor: Colors.whisperGrey,
    marginVertical: verticalScale(10),
  },
  AddView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  subscribeView: {
    flexDirection: 'row',
    width: horizontalScale(294),
    height: verticalScale(58),
    backgroundColor: Colors.backgroundRed,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: horizontalScale(17.5),
    paddingRight: horizontalScale(39),
  },
  priceText: {
    fontSize: moderateScale(19),
    fontFamily: FontFamily.fontFamilyBold,
    color: Colors.black,
  },
  subscribeTodayText: {
    fontSize: moderateScale(18),
    fontFamily: FontFamily.fontFamilyBold,
    color: Colors.white,
    paddingLeft: horizontalScale(6.5),
  },
  icon: {
    width: 15,
    height: 15,
    tintColor: Colors.white,
  },
  loginView: {
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    width: horizontalScale(81),
    height: verticalScale(58),
  },
  loginText: {
    fontSize: moderateScale(16),
    fontFamily: FontFamily.fontFamilyBold,
    color: Colors.white,
  },
});
