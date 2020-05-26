import React, { Component } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  FlatList,
  ScrollView,
  RefreshControl,
  Text,
} from 'react-native';
import CustomImage from '../../../components/widgets/CustomImage';
import ActivityIndicatorView from '../../../components/widgets/ActivityIndicator';
import { verticalScale, horizontalScale, moderateScale } from '../../../helpers/scale';
import ClickView from '../../../components/widgets/clickView';
import EmptyComponent from '../../../components/widgets/EmptyComponent';
import apiService from '../../../service/fetchContentService/FetchContentService';
import { ApiPaths, ApiMethods } from '../../../service/config/serviceConstants';
import translate from '../../../assets/strings/strings';
import FontFamily from '../../../assets/fonts/fonts';
import { runwayId } from '../../../redux/actions/RunwayAction';
import { connect } from 'react-redux';
class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      galleryData: [],
      loading: true,
      runwayId: props.runway_id,
      refreshing: false,
      Images: [],
      publishedAt: props.navigation.getParam('publishedAt'),
      review: props.runway_review,
      isNetworkIssue: false,
    };
  }
  componentDidMount() {
    this.handleApiRequest();
  }
  onPull = () => {
    this.setState({ refreshing: true }, () => {
      this.handleApiRequest();
    });
  };

  UNSAFE_componentWillReceiveProps(nextprops: any) {
    if (this.props.runway_id != nextprops.runway_id) {
      this.setState({ loading: true });
      this.handleApiRequest();
    }
  }

  handleApiRequest = () => {
    const { review } = this.state;
    if (review === 'runway-review') {
      apiService(
        `${ApiPaths.RUNWAY_REVIEW}` + `${this.props.runway_id}`,
        ApiMethods.GET,
        this.onSuccess,
        this.onFailure,
      );
    } else {
      apiService(
        `${ApiPaths.RUNWAY_GALLERY}` + `${this.props.runway_id}`,
        ApiMethods.GET,
        this.onSuccess,
        this.onFailure,
      );
    }
  };
  onRefresh = () => {
    this.setState({ loading: true }, () => {
      this.handleApiRequest();
    });
  };
  onSuccess = (response: any) => {
    this.setState({
      galleryData: response.data,
      loading: false,
      refreshing: false,
      isNetworkIssue: false,
    });
    const { review } = this.state;
    const Images = [];
    if (review === 'runway-review') {
      if (response.data && response.data.gallery.images.length > 0) {
        response.data.gallery.images.map((gallery) => {
          if (gallery.crops.length > 0) {
            Images.push({
              url: gallery.crops[3].url + `&w=${Math.round(horizontalScale(375))}`,
            });
          }
        });
      }
    } else {
      if (response.data && response.data.items.length > 0) {
        response.data.items.map((gallery) => {
          if (gallery.crops.length > 0) {
            Images.push({
              url:
                gallery.crops[0].url +
                `?resize=${Math.round(horizontalScale(375))},${Math.round(verticalScale(584))}`,
            });
          }
        });
      }
    }
    this.setState({ Images: Images }, () => {});
  };
  onFailure = (error: any) => {
    if (error === translate('no_internet')) {
      this.setState({ loading: false, isNetworkIssue: true });
    } else {
      this.setState({ loading: false, isNetworkIssue: false });
    }
  };
  renderItem = ({ item, index }) => {
    const { galleryData, Images, publishedAt } = this.state;
    const url = item && item.crops && item.crops[1].url;
    const photonUrl = url === undefined ? '' : url + `&w=${Math.round(horizontalScale(500))}`;
    return (
      <ClickView
        onPress={() =>
          this.props.navigation.navigate('GalleryFullScreen', {
            GalleryData: galleryData.items || galleryData.gallery.images,
            CurrentCount: index,
            Images: Images,
            runwayId: this.state.runwayId,
            publishedAt: publishedAt,
          })
        }
        style={styles.renderView}
      >
        <View>
          <CustomImage url={photonUrl} style={styles.imageStyle} />
        </View>
      </ClickView>
    );
  };
  render() {
    const { loading, galleryData, refreshing, isNetworkIssue }: any = this.state;
    if (isNetworkIssue) {
      return (
        <View>
          <EmptyComponent
            onPress={() => this.handleApiRequest()}
            errorText={translate('internet_connection')}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          {loading ? (
            <View style={styles.activityIndicatorContainer}>
              <ActivityIndicatorView style={styles.activityIndicatorStyle} />
            </View>
          ) : (
            <ScrollView
              bounces={
                galleryData && galleryData.items && galleryData.items.length === 0 ? false : true
              }
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={this.onPull.bind(this)} />
              }
            >
              {galleryData && galleryData.items && galleryData.items.length === 0 && (
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
              <View>
                <FlatList
                  data={
                    (galleryData && galleryData.items) ||
                    (galleryData && galleryData.gallery && galleryData.gallery.images)
                  }
                  numColumns={3}
                  style={styles.flatlistView}
                  showsVerticalScrollIndicator={false}
                  renderItem={this.renderItem}
                  keyExtractor={(item, index) => `${index}`}
                />
              </View>
            </ScrollView>
          )}
        </View>
      );
    }
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
export default connect(mapStateToProps, mapDispatchToProps)(Gallery);
const styles = StyleSheet.create({
  container: {},
  imageStyle: {
    width: horizontalScale(124),
    height: verticalScale(193),
  },
  activityIndicatorContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIndicatorStyle: { width: '100%', height: '100%' },
  flatlistView: {
    marginTop: verticalScale(10),
    marginBottom: verticalScale(94),
  },
  renderView: {
    marginRight: horizontalScale(2),
    marginBottom: verticalScale(3),
  },
  emptyView: {
    marginTop: verticalScale(250),
    alignSelf: 'center',
  },
});
