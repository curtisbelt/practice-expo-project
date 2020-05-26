import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  Dimensions,
  Linking,
} from 'react-native';
import { horizontalScale, verticalScale, moderateScale } from '../../helpers/scale';
import Colors from '../../constants/colors/colors';
import apiService from '../../service/fetchContentService/FetchContentService';
import { ApiPaths, ApiMethods, DEV_AUTH } from '../../service/config/serviceConstants';
import ActivityIndicatorView from '../../components/widgets/ActivityIndicator';
import CustomImage from '../../components/widgets/CustomImage';
import FontFamily from '../../assets/fonts/fonts';
import { getFormattedDateTime } from '../../helpers/dateTimeFormats';
import translate from '../../assets/strings/strings';
import LinearGradient from 'react-native-linear-gradient';
import HTML from 'react-native-render-html';
import ClickView from '../../components/widgets/clickView';
import { parentEnabled, childEnabled, useStaticLable } from '../../../appConfig';
import automationStaticLables from '../../constants/automationStaticLables';
import ShowBannerView from '../../components/native-ads/ShowBannerView';
import {
  readLoginFileStream,
  readSubscriptionFileStream,
} from '../../helpers/rn_fetch_blob/createDirectory';
import EmptyComponent from '../../components/widgets/EmptyComponent';
import { connect } from 'react-redux';
import { runwayId } from '../../redux/actions/RunwayAction';
import LoginSubsButton from '../../components/widgets/LoginSubsButton';

class Review extends Component {
  constructor(props) {
    super(props);
    this.readData();
    this.state = {
      reviewData: {},
      loading: true,
      runwayId: props.runway_id,
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

  componentDidMount() {
    this.handleApiRequest();
  }

  UNSAFE_componentWillReceiveProps(nextprops: any) {
    if (this.props.runway_id != nextprops.runway_id) {
      this.setState({ loading: true });
      this.handleApiRequest();
    }
  }

  handleApiRequest = () => {
    apiService(
      `${ApiPaths.RUNWAY_REVIEW}` + `${this.state.runwayId}`,
      ApiMethods.GET,
      this.onSuccess,
      this.onFailure,
    );
  };

  onSuccess = (response: any) => {
    this.setState(
      {
        reviewData: response && response.data,
        loading: false,
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

  renderAdvertisement = () => {
    return (
      <View style={styles.addView}>
        <ShowBannerView
          adSizes={['banner', 'fullBanner']}
          adUnitID={'/8352/WWD_Mobile/app/ros/leaderboard/'}
        />
      </View>
    );
  };

  renderImage = () => {
    const { reviewData } = this.state;
    const url =
      reviewData &&
      reviewData['featured-image'] &&
      reviewData['featured-image'].crops &&
      reviewData['featured-image'].crops[3].url;
    const photonUrl = url === undefined ? '' : url + `&w=${Math.round(horizontalScale(800))}`;
    const headline = reviewData && reviewData.headline;
    const tagline = reviewData && reviewData.tagline;
    const publisheddate = reviewData && reviewData['published-at'];
    const formatedDate = getFormattedDateTime(publisheddate);
    const byline = reviewData && reviewData.byline;
    const { jumpTo } = this.props;
    return (
      <View accessible={parentEnabled} style={styles.featuredImageView}>
        <ClickView
          onPress={() => {
            return jumpTo('gallery');
          }}
        >
          {Object.entries(reviewData['featured-image']).length !== 0 ? (
            <View>
              <CustomImage
                url={photonUrl}
                style={styles.featuredImage}
                accessible={childEnabled}
                accessibilityRole={'image'}
                accessibilityLabel={
                  useStaticLable
                    ? automationStaticLables.reviewImage
                    : reviewData['featured-image'].title
                }
                testID={
                  useStaticLable
                    ? automationStaticLables.reviewImage
                    : reviewData['featured-image'].title
                }
              />
              <View style={styles.textView}>
                <LinearGradient
                  colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)', Colors.black]}
                  locations={[0, 0.5, 0.7, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.gradientView}
                >
                  <View style={styles.view} accessible={parentEnabled}>
                    <Text
                      accessible={childEnabled}
                      accessibilityRole={'text'}
                      accessibilityLabel={
                        useStaticLable ? automationStaticLables.reviewHeadline : headline
                      }
                      testID={useStaticLable ? automationStaticLables.reviewHeadline : headline}
                      style={styles.headline}
                    >
                      {headline}
                    </Text>
                    <Text
                      accessible={childEnabled}
                      accessibilityRole={'text'}
                      accessibilityLabel={
                        useStaticLable ? automationStaticLables.reviewTagline : tagline
                      }
                      testID={useStaticLable ? automationStaticLables.reviewTagline : tagline}
                      style={styles.tagline}
                    >
                      {tagline}
                    </Text>
                    <View style={styles.subTextView}>
                      <Text
                        accessible={childEnabled}
                        accessibilityRole={'text'}
                        accessibilityLabel={
                          useStaticLable ? automationStaticLables.reviewPublishedDate : formatedDate
                        }
                        testID={
                          useStaticLable ? automationStaticLables.reviewPublishedDate : formatedDate
                        }
                        style={styles.subText}
                      >
                        {formatedDate}
                      </Text>
                      <View>
                        <Text style={styles.bullet}>{translate('blackCircle')} </Text>
                      </View>
                      <Text
                        accessible={childEnabled}
                        accessibilityRole={'text'}
                        accessibilityLabel={
                          useStaticLable ? automationStaticLables.reviewByline : byline
                        }
                        testID={useStaticLable ? automationStaticLables.reviewByline : byline}
                        style={styles.subText}
                      >
                        {byline}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </View>
          ) : null}
        </ClickView>
      </View>
    );
  };

  renderItem = ({ item, index }) => {
    if (index < 3) {
      const url = item && item.crops && item.crops[1].url;
      const photonUrl = url === undefined ? '' : url + `&w=${Math.round(horizontalScale(200))}`;
      const { jumpTo } = this.props;
      return (
        <View accessible={parentEnabled}>
          {index === 0 && (
            <ClickView
              accessible={parentEnabled}
              style={styles.gridImageView}
              onPress={() => {
                return jumpTo('gallery');
              }}
            >
              <CustomImage
                accessible={childEnabled}
                accessibilityRole={'image'}
                accessibilityLabel={
                  useStaticLable ? automationStaticLables.reviewImage : item.title
                }
                testID={useStaticLable ? automationStaticLables.reviewImage : item.title}
                url={photonUrl}
                style={styles.gridImage}
              />
            </ClickView>
          )}
          {index === 1 && (
            <ClickView
              accessible={parentEnabled}
              style={styles.gridImageView}
              onPress={() => {
                return jumpTo('gallery');
              }}
            >
              <CustomImage
                accessible={childEnabled}
                accessibilityRole={'image'}
                accessibilityLabel={
                  useStaticLable ? automationStaticLables.reviewImage : item.title
                }
                testID={useStaticLable ? automationStaticLables.reviewImage : item.title}
                url={photonUrl}
                style={styles.gridImage}
              />
            </ClickView>
          )}
          {index === 2 && (
            <ClickView
              accessible={parentEnabled}
              style={styles.gridImageView}
              onPress={() => {
                return jumpTo('gallery');
              }}
            >
              <CustomImage
                accessible={childEnabled}
                accessibilityRole={'image'}
                accessibilityLabel={
                  useStaticLable ? automationStaticLables.reviewImage : item.title
                }
                testID={useStaticLable ? automationStaticLables.reviewImage : item.title}
                url={photonUrl}
                style={styles.gridImage}
              />
              <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.7)', Colors.black]}
                locations={[0, 0.2, 0.8, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradientGridView}
              />
            </ClickView>
          )}
        </View>
      );
    }
  };

  gridImages = () => {
    const { reviewData } = this.state;
    const { jumpTo } = this.props;
    const count = reviewData && reviewData.gallery && reviewData.gallery['image-count'];
    const data = reviewData && reviewData.gallery && reviewData.gallery.images;
    return (
      <View>
        <FlatList
          data={data}
          keyExtractor={(x, i) => i.toString()}
          renderItem={this.renderItem}
          numColumns={3}
        />
        {Object.keys(reviewData && reviewData.gallery).length != 0 && (
          <ClickView
            accessible={parentEnabled}
            style={styles.imageCountView}
            onPress={() => {
              return jumpTo('gallery');
            }}
          >
            <Text
              accessible={childEnabled}
              accessibilityRole={'text'}
              accessibilityLabel={
                useStaticLable
                  ? automationStaticLables.collection
                  : automationStaticLables.collection
              }
              testID={
                useStaticLable
                  ? automationStaticLables.collection
                  : automationStaticLables.collection
              }
              style={styles.collection}
            >
              {translate('collection')}
            </Text>
            <View style={styles.whiteSeparator} />
            <Text
              accessible={childEnabled}
              accessibilityRole={'text'}
              accessibilityLabel={
                useStaticLable
                  ? automationStaticLables.imageCount
                  : count + 1 + automationStaticLables.imageCount
              }
              testID={
                useStaticLable
                  ? automationStaticLables.imageCount
                  : count + 1 + automationStaticLables.imageCount
              }
              style={styles.count}
            >
              {count} {translate('images')}
            </Text>
          </ClickView>
        )}
      </View>
    );
  };

  renderReviewDetails = (item: any, index: any) => {
    const bodydata = `<body>${item}</body>`;
    let tagstyles = {
      p: {
        fontSize: moderateScale(18),
        fontFamily: FontFamily.tiemposTextRegular,
        color: Colors.black,
        lineHeight: moderateScale(26),
      },
      a: {
        fontSize: moderateScale(18),
        lineHeight: moderateScale(26),
        fontFamily: FontFamily.tiemposTextRegular,
      },
    };

    return (
      <View accessible={parentEnabled} testID="review description" style={styles.webView}>
        <HTML
          html={bodydata}
          imagesMaxWidth={Dimensions.get('window').width}
          onLinkPress={(evt: any, href: any) => {
            Linking.openURL(href);
          }}
          tagsStyles={tagstyles}
        />
        {(index + 1) % 3 === 0 && (
          <View>
            <View style={styles.separator} />
            <View style={styles.addView}>
              <ShowBannerView
                adSizes={['mediumRectangle']}
                adUnitID={'/8352/WWD_Mobile/app/ros/mid-article'}
              />
            </View>
            <View style={styles.separator} />
          </View>
        )}
      </View>
    );
  };
  renderLogin = () => {
    const { navigation }: any = this.props;
    return (
      <View
        accessible={parentEnabled}
        style={{
          marginTop: verticalScale(20),
          marginBottom: verticalScale(100),
        }}
      >
        <LoginSubsButton navigation={navigation} />
      </View>
    );
  };

  renderReviewDescription = () => {
    const { reviewData, loginData, subsData }: any = this.state;
    const entitlementLength =
      reviewData && reviewData.entitlements && reviewData.entitlements.length;
    const preview =
      reviewData && reviewData['body-preview'] ? `<p>${reviewData['body-preview']}</p>` : null;
    const data =
      (loginData &&
        loginData[DEV_AUTH] &&
        loginData[DEV_AUTH].ent &&
        loginData[DEV_AUTH].ent.length != 0) ||
      subsData != null ||
      entitlementLength === 0
        ? reviewData && reviewData.body
        : preview;
    const splitData = data.split('\n');
    return (
      <View accessible={parentEnabled} style={styles.webView}>
        <FlatList
          data={splitData}
          extraData={this.state.key}
          renderItem={({ item, index }) => this.renderReviewDetails(item, index)}
          keyExtractor={(x, i) => i.toString()}
          automaticallyAdjustContentInset={false}
        />
      </View>
    );
  };

  render() {
    const { loginData, isNetworkIssue, subsData, reviewData }: any = this.state;
    const entitlementLength =
      reviewData && reviewData.entitlements && reviewData.entitlements.length;
    if (isNetworkIssue) {
      return (
        <View>
          <EmptyComponent
            onPress={() => this.handleApiRequest()}
            errorText={translate('internet_connection')}
          />
        </View>
      );
    } else if (this.state.loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicatorView />
        </View>
      );
    } else
      return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {this.renderAdvertisement()}
          {this.renderImage()}
          {this.gridImages()}
          {this.renderReviewDescription()}
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
          <View style={styles.footer} />
        </ScrollView>
      );
  }
}

const mapStateToProps = (state: any) => {
  return {
    runway_id: state.runway.runway_id,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  runwayId: (id: any) => dispatch(runwayId(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Review);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  footer: {
    height: verticalScale(100),
  },
  add: {
    width: horizontalScale(321),
    height: moderateScale(52),
    backgroundColor: Colors.black,
    alignSelf: 'center',
    marginTop: moderateScale(5),
  },
  loader: {
    marginTop: moderateScale(318),
  },
  featuredImage: {
    height: moderateScale(471),
    width: horizontalScale(375),
  },
  featuredImageView: {
    marginTop: verticalScale(9),
    backgroundColor: 'grey',
  },
  headline: {
    fontSize: moderateScale(26),
    lineHeight: moderateScale(30),
    color: Colors.white,
    fontFamily: FontFamily.fontFamilyBold,
    textAlign: 'left',
  },
  textView: {
    position: 'absolute',
    bottom: moderateScale(20),
    height: verticalScale(217),
    width: horizontalScale(375),
  },
  gradientView: {
    position: 'absolute',
    top: verticalScale(23),
    height: verticalScale(217),
    width: horizontalScale(375),
  },
  view: {
    marginLeft: horizontalScale(15),
    marginRight: horizontalScale(5),
    position: 'absolute',
    bottom: moderateScale(23),
  },
  tagline: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(20),
    color: Colors.white,
    fontFamily: FontFamily.fontFamilyMedium,
    textAlign: 'left',
    fontWeight: '500',
  },
  subTextView: {
    flexDirection: 'row',
  },
  subText: {
    fontSize: moderateScale(13),
    lineHeight: moderateScale(16),
    color: Colors.white,
    fontFamily: FontFamily.fontFamilyRegular,
  },
  bullet: {
    color: Colors.backgroundRed,
    alignSelf: 'center',
    marginBottom: moderateScale(5),
  },
  gridImage: {
    height: moderateScale(175),
    width: horizontalScale(113),
  },
  gridImageView: {
    marginLeft: horizontalScale(9),
    marginTop: moderateScale(9),
    height: moderateScale(175),
    width: horizontalScale(113),
  },
  whiteSeparator: {
    width: horizontalScale(83),
    height: moderateScale(1),
    backgroundColor: Colors.white,
  },
  collection: {
    fontSize: moderateScale(18),
    lineHeight: moderateScale(22),
    color: Colors.white,
    fontFamily:
      Platform.OS === 'ios'
        ? FontFamily.publicoBannerMediumIos
        : FontFamily.publicoBannerMediumAndroid,
    textAlign: 'center',
  },
  count: {
    fontSize: moderateScale(11),
    lineHeight: moderateScale(16),
    color: Colors.white,
    fontFamily: FontFamily.fontFamilyMedium,
    textAlign: 'center',
  },
  imageCountView: {
    position: 'absolute',
    right: horizontalScale(20),
    bottom: moderateScale(17),
  },
  gradientGridView: {
    flex: 1,
    height: moderateScale(175),
    width: horizontalScale(113),
  },
  webView: {
    marginLeft: horizontalScale(14),
    marginRight: horizontalScale(18),
    marginTop: moderateScale(22),
  },
  addView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(10),
  },
  separator: {
    width: horizontalScale(344),
    height: verticalScale(2),
    alignSelf: 'center',
    backgroundColor: Colors.whisperGrey,
    marginVertical: verticalScale(5),
  },
});
