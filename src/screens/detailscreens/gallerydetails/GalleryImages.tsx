import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import { savedBookMark, checkSavedBookMark } from '../../../redux/actions/FoyYouAction';
import GalleryHeader from '../../../components/header/deatailheader/GalleryHeader';
import Colors from '../../../constants/colors/colors';
import ClickView from '../../../components/widgets/clickView';
import { horizontalScale, moderateScale, verticalScale } from '../../../helpers/scale';
import translate from '../../../assets/strings/strings';
import FontFamily from '../../../assets/fonts/fonts';
import CustomImage from '../../../components/widgets/CustomImage';
import { parentEnabled, childEnabled } from '../../../../appConfig';
import moment from 'moment';
import { writeFileStream } from '../../../helpers/rn_fetch_blob/createDirectory';
import ShowBannerView from '../../../components/native-ads/ShowBannerView';
import { apiService } from '../../../service';
import { ApiPaths, ApiMethods } from '../../../service/config';
import EmptyComponent from '../../../components/widgets/EmptyComponent';
import ActivityIndicatorView from '../../../components/widgets/ActivityIndicator';

class GalleryImages extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      galleryId: props.navigation.getParam('galleryID'),
      postType: props.navigation.getParam('postType'),
      galleryData: '',
      isNetworkIssue: false,
      // galleryData: props.navigation.getParam('galleryData'),
      checkBookMark: props.checkBookMark,
      // Images: props.navigation.getParam('Images'),
      images: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.renderData();
    const galleryData = this.props.navigation.getParam('galleryData');
    const id = galleryData && galleryData['featured-gallery'] && galleryData['featured-gallery'].id;
    this.props.checkSavedBookMark(id);
  }

  renderData = () => {
    const data =
      this.state.postType === 'pmc-gallery' ? '' : this.props.navigation.getParam('galleryData');
    if (this.state.postType === 'pmc-gallery') {
      this.renderGalleryApi();
    } else {
      if (data && data['featured-gallery']) {
        this.setState(
          {
            galleryData: data['featured-gallery'],
            loading: false,
          },
          () => {},
        );
      }
    }
  };

  renderGalleryApi = () => {
    apiService(
      ApiPaths.ARTICLE_GALLERY + this.state.galleryId,
      ApiMethods.GET,
      this.onGallerySuccess,
      this.onGalleryFailure,
    );
  };

  onGallerySuccess = (response: any) => {
    if (response && response.data) {
      this.setState(
        { galleryData: response.data, isNetworkIssue: false, loading: false },
        () => {},
      );
    }
    const GalleryImages: any = [];
    if (response && response.data && response.data.items && response.data.items.length > 0) {
      response.data.items.map((gallery: any) => {
        if (gallery.crops.length > 0) {
          GalleryImages.push({
            url: gallery.crops[3].url + `&w=${Math.round(horizontalScale(375))}`,
          });
        }
      });
    }
    this.setState({ images: GalleryImages });
  };

  onGalleryFailure = (error: any) => {
    if (error === translate('no_internet')) {
      this.setState({ loading: false, isNetworkIssue: true });
    } else {
      this.setState({ loading: false, isNetworkIssue: false });
    }
  };

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

  renderItem = ({ item, index }) => {
    const { galleryData, postType, images } = this.state;
    const count =
      postType === 'pmc-gallery'
        ? galleryData && galleryData.items && galleryData.items.length
        : galleryData && galleryData.images && galleryData.images.length;
    const currentCount = index;
    const url = item && item.crops && item.crops[1].url;
    const photonUrl = url === undefined ? '' : url + `&w=${Math.round(horizontalScale(375))}`;
    const imagesData =
      postType === 'pmc-gallery'
        ? galleryData && galleryData.items
        : galleryData && galleryData.images;
    const title = item.title;
    const Images = this.props.navigation.getParam('Images');
    return (
      <View accessible={parentEnabled}>
        <ClickView
          accessible={parentEnabled}
          style={styles.imageContainer}
          onPress={() => {
            // const gallery = this.props.navigation.getParam('galleryData');

            const data =
              postType === 'pmc-gallery' ? '' : this.props.navigation.getParam('galleryData');
            const verticle =
              postType === 'pmc-gallery'
                ? galleryData && galleryData.vertical && galleryData.vertical.name
                : data && data.vertical && data.vertical.name;
            const category =
              postType === 'pmc-gallery'
                ? galleryData && galleryData.category && galleryData.category.name
                : data && data.category && data.category.name;

            const date =
              postType === 'pmc-gallery' ? galleryData['published-at'] : data['published-at'];
            let bdata = {
              category: verticle + '/' + category,
              publishedAt: date,
              id: currentCount,
            };
            console.log('****' + JSON.stringify(Images));
            this.props.navigation.navigate('ImageDetail', {
              galleryData: bdata,
              imageData: imagesData,
              count: count,
              currentCount: currentCount,
              Images: postType === 'pmc-gallery' ? images : Images,
              bookMarkShow: postType === 'pmc-gallery' ? false : true,
            });
          }}
        >
          <CustomImage
            accessible={childEnabled}
            accessibilityRole={'image'}
            accessibilityLabel={title + currentCount}
            testID={title + currentCount}
            url={photonUrl ? photonUrl : null}
            style={styles.imageStyle}
          />
        </ClickView>
        {(index + 1) % 3 === 0 && (
          <View style={styles.addView}>
            <ShowBannerView
              adSizes={['mediumRectangle']}
              adUnitID={'/8352/WWD_Mobile/app/gallery'}
            />
          </View>
        )}
      </View>
    );
  };

  renderHeader = () => {
    const { galleryData, postType } = this.state;
    const data = postType === 'pmc-gallery' ? '' : this.props.navigation.getParam('galleryData');
    const verticle =
      postType === 'pmc-gallery'
        ? galleryData && galleryData.vertical && galleryData.vertical.name
        : data && data.vertical && data.vertical.name;
    const category =
      postType === 'pmc-gallery'
        ? galleryData && galleryData.category && galleryData.category.name
        : data && data.category && data.category.name;
    const title =
      postType === 'pmc-gallery' ? galleryData && galleryData.headline : data && data.headline;
    const byline = galleryData && galleryData.byline;
    const date =
      postType === 'pmc-gallery'
        ? moment(galleryData['published-at']).format('hh:mm A - MMM DD, YYYY')
        : moment(data['published-at']).format('hh:mm A - MMM DD, YYYY');
    return (
      <View accessible={parentEnabled} style={{ paddingBottom: verticalScale(17) }}>
        <Text
          accessible={childEnabled}
          accessibilityLabel={verticle + '/' + category}
          testID={verticle + '/' + category}
          style={styles.categoryText}
        >
          {verticle} / {category}
        </Text>
        <Text
          accessible={childEnabled}
          accessibilityLabel={title}
          testID={title}
          style={styles.titleText}
        >
          {title}
        </Text>
        <View accessible={parentEnabled} style={styles.textView}>
          <Text
            accessible={childEnabled}
            accessibilityLabel={byline}
            testID={byline}
            style={styles.bylineText}
          >
            By {byline}
          </Text>
          <Text style={styles.bullet}>{translate('blackCircle')}</Text>
          <Text
            accessible={childEnabled}
            accessibilityLabel={date}
            testID={date}
            style={styles.date}
          >
            {date}
          </Text>
        </View>
      </View>
    );
  };

  renderImages = () => {
    const { galleryData, postType }: any = this.state;
    const data = postType === 'pmc-gallery' ? galleryData.items : galleryData.images;
    return (
      <View>
        {this.renderHeader()}
        <FlatList data={data} keyExtractor={(x, i) => i.toString()} renderItem={this.renderItem} />
      </View>
    );
  };

  render() {
    const { goBack }: any = this.props.navigation;
    const { isNetworkIssue, loading, postType }: any = this.state;
    const network = this.props.navigation.getParam('isNetworkIssue');
    if (isNetworkIssue || network) {
      return (
        <View>
          <GalleryHeader
            checkBookMark={this.state.checkBookMark}
            onBack={() => {
              goBack();
            }}
          />
          <View style={{ marginTop: horizontalScale(50) }}>
            <EmptyComponent
              onPress={() => this.renderData()}
              errorText={translate('internet_connection')}
            />
          </View>
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
        <ScrollView style={styles.container}>
          <NavigationEvents
            onWillFocus={async () => {
              await this.writeFile();
              const galleryData = this.props.navigation.getParam('galleryData');
              const id =
                galleryData &&
                galleryData['featured-gallery'] &&
                galleryData['featured-gallery'].id;
              this.props.checkSavedBookMark(id);
            }}
          />
          <GalleryHeader
            showBookMark={postType === 'pmc-gallery' ? false : true}
            checkBookMark={this.state.checkBookMark}
            onBack={() => {
              goBack();
            }}
            onBookmark={() => {
              const galleryData = this.props.navigation.getParam('galleryData');
              const Images = this.props.navigation.getParam('Images');
              const imagesData =
                postType === 'pmc-gallery'
                  ? galleryData && galleryData.items
                  : galleryData && galleryData.images;
              const verticle = galleryData && galleryData.vertical && galleryData.vertical.name;
              const category = galleryData && galleryData.category && galleryData.category.name;
              const id =
                galleryData &&
                galleryData['featured-gallery'] &&
                galleryData['featured-gallery'].id;
              const headline = galleryData && galleryData.headline;
              const publishedAt = galleryData && galleryData['published-at'];
              const images =
                galleryData &&
                galleryData['featured-gallery'] &&
                galleryData['featured-gallery'].images[0].crops[2];
              let data = {
                'item-type': 'gallery-images',
                data: {
                  id: id,
                  'post-title': headline,
                  'published-at': publishedAt,
                  category: verticle + '/' + category,
                  image: images,
                },
                galleryData: galleryData,
                imagesData: imagesData,
                Images: Images,
              };
              // console.log('****' + JSON.stringify(data));
              this.props.savedBookMark(data);
            }}
          />
          <View>{this.renderImages()}</View>
        </ScrollView>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.black,
  },
  textStyle: {
    padding: moderateScale(20),
    color: Colors.white,
  },
  imageStyle: {
    width: horizontalScale(375),
    height: verticalScale(562),
  },
  imageContainer: {
    width: horizontalScale(375),
    height: verticalScale(562),
    marginTop: verticalScale(33),
  },
  categoryText: {
    fontSize: moderateScale(13),
    lineHeight: moderateScale(16),
    fontFamily: FontFamily.fontFamilyBold,
    textAlign: 'center',
    color: Colors.backgroundRed,
    marginTop: verticalScale(24),
    textTransform: 'uppercase',
  },
  textView: {
    flexDirection: 'row',
    marginTop: verticalScale(13),
    alignSelf: 'center',
  },
  titleText: {
    fontSize: moderateScale(24),
    fontFamily: FontFamily.fontFamilyBold,
    lineHeight: moderateScale(27),
    color: Colors.white,
    textAlign: 'center',
    marginTop: verticalScale(13),
    marginHorizontal: horizontalScale(20),
  },
  bylineText: {
    fontSize: moderateScale(13),
    fontFamily: FontFamily.fontFamilyRegular,
    color: Colors.white,
    lineHeight: moderateScale(16),
    marginRight: horizontalScale(3),
  },
  bullet: {
    color: Colors.backgroundRed,
  },
  date: {
    fontSize: moderateScale(13),
    fontFamily: FontFamily.fontFamilyRegular,
    color: Colors.white,
    lineHeight: moderateScale(16),
    marginLeft: horizontalScale(3),
  },
  add: {
    width: horizontalScale(300),
    height: verticalScale(250),
    backgroundColor: Colors.greyMedium,
    alignSelf: 'center',
    marginTop: verticalScale(10),
  },
  addText: {
    fontSize: moderateScale(9),
    lineHeight: moderateScale(13),
    color: Colors.greyMedium,
    paddingTop: verticalScale(20),
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  addView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(20),
    height: 260,
  },
  loader: {
    marginTop: verticalScale(418),
  },
});
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

export default connect(mapStateToProps, mapDispatchToProps)(GalleryImages);
