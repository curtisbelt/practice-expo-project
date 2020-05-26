import * as React from 'react';
import { View, Text, Dimensions, StyleSheet, Platform, Image } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import { TabView, TabBar, SceneRendererProps } from 'react-native-tab-view';
import Colors from '../../constants/colors/colors';
import { moderateScale, horizontalScale, verticalScale } from '../../helpers/scale';
import FontFamily from '../../assets/fonts/fonts';
import Gallery from './gallery/Gallery';
import RunwayHeader from '../../components/header/Runwayheader';
import Designer from './Designer';
import Review from './Review';
import Flurry from 'react-native-flurry-sdk';
import apiService from '../../service/fetchContentService/FetchContentService';
import { ApiPaths, ApiMethods } from '../../service/config/serviceConstants';
import {
  handleAndroidBackButton,
  removeAndroidBackButtonHandler,
} from '../../helpers/androidBackButton';
import { writeFileStream } from '../../helpers/rn_fetch_blob/createDirectory';
import {
  savedBookMarkRunWayTab,
  checkSavedBookMark,
  checkRunWayTabsSavedBookMark,
} from '../../redux/actions/FoyYouAction';
import ClickView from '../../components/widgets/clickView';
import { Images } from '../../assets';
import translate from '../../assets/strings/strings';
import EmptyComponent from '../../components/widgets/EmptyComponent';
import { runwayId } from '../../redux/actions/RunwayAction';

const initialLayout = {
  width: Dimensions.get('window').width,
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const IS_IPHONE_X = SCREEN_HEIGHT === 812;

class RunwayTabScreens extends React.Component {
  constructor(props: any) {
    super(props);
    // the line below, variable is never used -- bug?
    // let runwayId = props.navigation.getParam('runwayId');
    this.state = {
      index: this.props.navigation.getParam('tabIndex'),
      routes: [],
      withReview: '',
      season: props.navigation.getParam('season'),
      collection: props.navigation.getParam('collection'),
      runwayId: props.runway_id,
      review: props.runway_review,
      bookMarkData: null,
      runwayData: null,
      checkBookMark: props.checkBookMark,
      publishedAt: props.navigation.getParam('publishedAt'),
      isNetworkIssue: false,
      collectionId: props.navigation.getParam('collectionId'),
    };
  }

  writeFile = async () => {
    await writeFileStream(this.props.forYouSavedData);
  };

  UNSAFE_componentWillReceiveProps(nextprops: any) {
    if (this.props.checkBookMark !== nextprops.checkBookMark) {
      this.setState({
        checkBookMark: nextprops.checkBookMark,
      });
      this.writeFile();
    }
  }

  componentDidMount() {
    this.sectionTabs();
    handleAndroidBackButton(() => {
      this.handleBackPress();
    });
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }

  handleBackPress = () => {
    this.props.navigation.goBack(null);
    return true;
  };

  handleIndexChange = (index: any, runwayId: any) => {
    if (this.state.review === 'runway-review') {
      index === 0
        ? apiService(
            `${ApiPaths.RUNWAY_REVIEW}` + runwayId,
            ApiMethods.GET,
            this.onSuccess,
            this.onFailure,
          )
        : index === 1
        ? apiService(
            `${ApiPaths.RUNWAY_REVIEW}` + runwayId,
            ApiMethods.GET,
            this.onSuccess,
            this.onFailure,
          )
        : index === 2
        ? apiService(
            `${ApiPaths.RUNWAY_DESIGNER}` + this.state.collectionId,
            ApiMethods.GET,
            this.onSuccess,
            this.onFailure,
          )
        : null;
    } else {
      index === 0
        ? apiService(
            `${ApiPaths.RUNWAY_GALLERY}` + runwayId,
            ApiMethods.GET,
            this.onSuccess,
            this.onFailure,
          )
        : index === 1
        ? apiService(
            `${ApiPaths.RUNWAY_DESIGNER}` + this.state.collectionId,
            ApiMethods.GET,
            this.onSuccess,
            this.onFailure,
          )
        : null;
    }
  };

  onSuccess = (response: any) => {
    this.setState({ runwayData: response && response.data, isNetworkIssue: false }, () => {});
  };

  onFailure = (error: any) => {
    if (error === translate('no_internet')) {
      this.setState({
        isNetworkIssue: true,
      });
    }
  };

  sectionTabs = () => {
    if (this.state.review === 'runway-review') {
      this.setState(
        {
          routes: [
            { key: 'gallery', title: 'GALLERY' },
            { key: 'review', title: 'REVIEW' },
            { key: 'designer', title: 'DESIGNER' },
          ],
          withReview: true,
        },
        () => {},
      );
    } else {
      this.setState({
        routes: [
          { key: 'gallery', title: 'GALLERY' },
          { key: 'designer', title: 'DESIGNER' },
        ],
        withReview: false,
      });
    }
  };

  renderScene = ({ route, jumpTo }) => {
    const { navigation } = this.props;
    switch (route.key) {
      case 'gallery':
        return (
          <View style={styles.galleryViewStyle}>
            <Gallery
              navigation={navigation}
              runwayId={this.state.runwayId}
              review={this.state.review}
              {...this.props}
            />
          </View>
        );
      case 'review':
        return (
          <View>
            <Review
              jumpTo={() => jumpTo('gallery')}
              runwayId={this.state.runwayId}
              id={this.state.runwayId}
            />
          </View>
        );
      case 'designer':
        return (
          <View>
            <Designer
              jumpTo={() => jumpTo('gallery')}
              runwayId={this.state.collectionId}
              id={this.state.collectionId}
            />
          </View>
        );
    }
  };

  renderTabBar = (props: SceneRendererProps & { navigationState: State }) => (
    <View
      style={{
        paddingHorizontal: horizontalScale(25),
        backgroundColor: Colors.whiteSmoke,
      }}
    >
      <TabBar
        {...props}
        scrollEnabled
        renderLabel={({ route, focused, color }) => (
          <View>
            <Text style={[styles.label, { color }]}>{route.title}</Text>
            <View
              style={{
                backgroundColor: focused ? Colors.activeTintColor : Colors.white,
              }}
            />
          </View>
        )}
        indicatorStyle={styles.indicator}
        activeColor={Colors.black}
        inactiveColor={Colors.inactiveTintColor}
        style={styles.tabbar}
        tabStyle={this.state.withReview === true ? styles.tab : styles.tab1}
        labelStyle={styles.label}
      />
    </View>
  );

  updateRoute(newIdx: any) {
    this.setState({ index: newIdx });
  }

  renderFooterTab = () => {
    const { navigation }: any = this.props;
    return (
      <View style={styles.footer}>
        <ClickView
          style={styles.view}
          onPress={() => {
            navigation.navigate('Home');
          }}
        >
          <Image source={Images.home} />
          <Text style={styles.text}>{translate('home')}</Text>
        </ClickView>
        <ClickView
          style={styles.view}
          onPress={() => {
            navigation.navigate('ForYou');
          }}
        >
          <Image source={Images.forYou} />
          <Text style={styles.text}>{translate('for_you')}</Text>
        </ClickView>
        <View style={styles.view}>
          <Image source={Images.runWay} />
          <Text style={styles.text}>{translate('runway')}</Text>
          <View style={styles.border} />
        </View>
        <ClickView
          style={styles.view}
          onPress={() => {
            navigation.navigate('Sections');
          }}
        >
          <Image source={Images.sections} />
          <Text style={styles.text}>{translate('sections')}</Text>
        </ClickView>
        <ClickView
          style={styles.view}
          onPress={() => {
            navigation.navigate('DigitalDaily');
          }}
        >
          <Image source={Images.digitalDailyUnRead} />
          <Text style={styles.text}>{translate('digital_daily')}</Text>
        </ClickView>
      </View>
    );
  };

  render() {
    const {
      review,
      season,
      index,
      collection,
      runwayData,
      runwayId,
      checkBookMark,
      collectionId,
    }: any = this.state;
    if (this.state.isNetworkIssue) {
      return (
        <View>
          <RunwayHeader
            onBack={() => this.props.navigation.goBack(null)}
            onShare={() => this.props.navigation.navigate('')}
            byline={this.state.season}
            collection={this.state.collection}
          />
          <EmptyComponent
            onPress={() => this.handleIndexChange(index, this.state.runwayId)}
            errorText={translate('internet_connection')}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <NavigationEvents
            onWillFocus={async () => {
              await this.writeFile();
              let tabIndex = this.props.navigation.getParam('tabIndex');
              let runwayId = this.props.navigation.getParam('runwayId');
              let collectionId = this.props.navigation.getParam('collectionId');
              let reviews = this.props.navigation.getParam('review');
              this.setState({
                review: reviews,
                collectionId: collectionId,
                runwayId: runwayId,
              });
              if (reviews === 'runway-review') {
                if (tabIndex === 2) {
                  let data = {
                    id: runwayId,
                    tabIndex: tabIndex,
                  };
                  this.props.checkRunWayTabsSavedBookMark(data);
                  this.handleIndexChange(tabIndex, runwayId);
                } else {
                  this.props.checkSavedBookMark(runwayId);
                  let data = {
                    id: runwayId,
                    tabIndex: tabIndex,
                  };
                  this.props.checkRunWayTabsSavedBookMark(data);
                  this.handleIndexChange(tabIndex, runwayId);
                }
              } else {
                if (tabIndex === 1) {
                  let data = {
                    id: runwayId,
                    tabIndex: tabIndex,
                  };
                  this.props.checkRunWayTabsSavedBookMark(data);
                  this.handleIndexChange(tabIndex, runwayId);
                } else {
                  let data = {
                    id: runwayId,
                    tabIndex: tabIndex,
                  };
                  this.props.checkRunWayTabsSavedBookMark(data);
                  this.handleIndexChange(tabIndex, runwayId);
                }
              }
              this.setState({
                checkBookMark: this.props.checkBookMark,
              });
            }}
          />
          <RunwayHeader
            onBack={() => this.props.navigation.goBack(null)}
            onShare={() => this.props.navigation.navigate('')}
            byline={this.state.season}
            showBookMark={
              runwayData !== null && runwayData.items !== undefined && runwayData.items.length === 0
                ? false
                : true
            }
            checkBookMark={checkBookMark}
            onBookmark={() => {
              try {
                let imageUrl = '';
                let title = '';
                let publishedAt = '';
                if (this.state.review === 'runway-review') {
                  index !== 2
                    ? ((imageUrl =
                        runwayData &&
                        runwayData['featured-image'] &&
                        runwayData['featured-image'].crops &&
                        runwayData['featured-image'].crops[0].url),
                      ((title = runwayData.headline), (publishedAt = runwayData['published-at'])))
                    : index !== 1
                    ? ((imageUrl =
                        runwayData.items &&
                        runwayData.items[0].image.crops &&
                        runwayData.items[0].image.crops[0].url),
                      ((title = runwayData.items && runwayData.items[0].headline),
                      (publishedAt = runwayData.items[0]['published-at'])))
                    : ((imageUrl =
                        runwayData.items &&
                        runwayData.items[0].image.crops &&
                        runwayData.items[0].image.crops[0].url),
                      (title = runwayData.items && runwayData.items[0].title));
                } else {
                  if (index === 0) {
                    imageUrl =
                      runwayData.items &&
                      runwayData.items[0].crops &&
                      runwayData.items[0].crops[0].url;
                    title = runwayData.items && runwayData.items[0].title;
                  } else {
                    (imageUrl =
                      runwayData.items &&
                      runwayData.items[0].image.crops &&
                      runwayData.items[0].image.crops[0].url),
                      (title = runwayData.items && runwayData.items[0].headline);
                  }
                }
                let data = {
                  'item-type': 'runway-tabs',
                  data: {
                    id: runwayId,
                    runwayId: runwayId,
                    tabIndex: index,
                    collectionId: collectionId,
                    'post-title': title,
                    'published-at': publishedAt,
                    category: 'Runway',
                    image: imageUrl,
                    review: review,
                    season: season,
                    collection: collection,
                  },
                };
                //console.log('******\n' + JSON.stringify(runwayData));
                this.props.savedBookMarkRunWayTab(data);
              } catch {
                // do nothing
              }
            }}
            collection={this.state.collection}
          />
          <TabView
            navigationState={this.state}
            renderScene={this.renderScene}
            onIndexChange={(index: Number) => {
              this.setState({ index });
              if (this.state.reviews === 'runway-review') {
                let data = {
                  id: this.state.runwayId,
                  tabIndex: index,
                };
                this.props.checkRunWayTabsSavedBookMark(data);
              } else {
                let data = {
                  id: this.state.runwayId,
                  tabIndex: index,
                };
                this.props.checkRunWayTabsSavedBookMark(data);
              }
              this.handleIndexChange(index, this.state.runwayId);
              Flurry.logEvent(this.state.routes[index].title + ' invoked');
              collection;
            }}
            lazy={true}
            initialLayout={initialLayout}
            renderTabBar={this.renderTabBar}
            changeRoute={this.updateRoute.bind(this)}
          />
          {this.renderFooterTab()}
        </View>
      );
    }
  }
}

const mapStateToProps = (state: any) => {
  return {
    checkBookMark: state.foryou.checkBookMark,
    forYouSavedData: state.foryou.forYouSavedData,
    runway_id: state.runway.runway_id,
    runway_review: state.runway.runway_review,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  savedBookMarkRunWayTab: (data: any) => dispatch(savedBookMarkRunWayTab(data)),
  checkSavedBookMark: (id: any) => dispatch(checkSavedBookMark(id)),
  runwayId: (id: any) => dispatch(runwayId(id)),
  runwatReview: (RunwayReview: any) => dispatch(runwayId(RunwayReview)),
  checkRunWayTabsSavedBookMark: (data: any) => dispatch(checkRunWayTabsSavedBookMark(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RunwayTabScreens);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scene: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  galleryViewStyle: {
    alignItems: 'center',
  },
  tabbar: {
    backgroundColor: Colors.whiteSmoke,
    shadowOpacity: 0,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowRadius: 0,
    elevation: 0,
  },
  tab: {
    width: Dimensions.get('window').width / 3 - horizontalScale(20),
  },
  tab1: {
    width: Dimensions.get('window').width / 2 - horizontalScale(20),
  },
  indicator: {
    backgroundColor: Colors.white,
    height: 0,
    width: 0,
  },
  textLable: {
    fontSize: moderateScale(25),
    textAlign: 'center',
  },
  label: {
    marginHorizontal: 0,
    fontSize: moderateScale(13),
    fontWeight: 'bold',
    fontFamily: FontFamily.fontFamilyBold,
    backgroundColor: 'transparent',
    letterSpacing: moderateScale(1.51),
    alignSelf: 'auto',
  },
  footer: {
    width: '100%',
    height:
      Platform.OS === 'ios'
        ? IS_IPHONE_X
          ? verticalScale(94)
          : verticalScale(68)
        : verticalScale(76),
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
    backgroundColor: Colors.white,
  },
  text: {
    fontSize: moderateScale(8),
    fontFamily: FontFamily.fontFamilyRegular,
    color: Colors.black,
    textAlign: 'center',
    marginTop: verticalScale(6),
  },
  view: {
    alignItems: 'center',
    justifyContent: 'center',
    width: horizontalScale(75),
    height: verticalScale(94),
    paddingBottom: verticalScale(20),
  },
  border: {
    height: 4,
    width: horizontalScale(54),
    backgroundColor: Colors.backgroundRed,
    position: 'absolute',
    top: verticalScale(-3),
  },
});
