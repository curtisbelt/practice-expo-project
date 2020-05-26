import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import Colors from '../../../constants/colors/colors';
import { horizontalScale, moderateScale, verticalScale } from '../../../helpers/scale';
import { parentEnabled, childEnabled } from '../../../../appConfig';
import { Images } from '../../../assets/images/';
import FontFamily from '../../../assets/fonts/fonts';
import ImageViewer from 'react-native-image-zoom-viewer';
import { writeFileStream } from '../../../helpers/rn_fetch_blob/createDirectory';
import { savedBookMark, checkRunWaySavedBookMark } from '../../../redux/actions/FoyYouAction';

class GalleryFullScreen extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      GalleryData: props.navigation.getParam('GalleryData'),
      CurrentCount: props.navigation.getParam('CurrentCount'),
      ImagesData: props.navigation.getParam('Images'),
      checkBookMark: props.checkBookMark,
      runwayId: props.navigation.getParam('runwayId'),
      publishedAt: props.navigation.getParam('publishedAt'),
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

  renderHeader = () => {
    const { navigation }: any = this.props;
    const { GalleryData, CurrentCount }: any = this.state;
    const { title, caption }: any = GalleryData[CurrentCount];

    return (
      <View style={styles.header_container}>
        <TouchableOpacity
          accessible={parentEnabled}
          onPress={() => navigation.goBack()}
          style={styles.backView}
        >
          <Image
            accessible={childEnabled}
            accessibilityRole="button"
            accessibilityLabel="Back"
            testID="Back"
            source={Images.backArrow}
            style={styles.backImg}
          />
        </TouchableOpacity>
        <View style={styles.title_container}>
          <Text
            accessible={childEnabled}
            accessibilityLabel={title}
            testID={title}
            style={styles.titleText}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text
            accessible={childEnabled}
            accessibilityLabel={caption}
            testID={caption}
            style={styles.previewText}
            numberOfLines={1}
          >
            {caption}
          </Text>
        </View>
      </View>
    );
  };

  renderLoader = () => {
    return <ActivityIndicator />;
  };

  /* Counter, Share and Bookmark */
  renderFooter = () => {
    const {
      GalleryData,
      CurrentCount,
      ImagesData,
      checkBookMark,
      runwayId,
      publishedAt,
    }: any = this.state;

    return (
      <View style={styles.footer_container}>
        <View accessible={parentEnabled}>
          <Text
            accessible={childEnabled}
            accessibilityLabel={'Gallery image ' + (CurrentCount + 1) + ' of ' + GalleryData.length}
            testID={'Gallery Image ' + (CurrentCount + 1)}
            style={styles.text}
          >
            <Text style={{ color: Colors.white }}>{CurrentCount + 1}</Text>
            {'/' + GalleryData.length}
          </Text>
        </View>
        <View style={styles.imgView}>
          <TouchableOpacity
            accessible={parentEnabled}
            style={styles.unBookmarkView}
            onPress={() => {
              const { title }: any = GalleryData[CurrentCount];
              let data = {
                'item-type': 'runway-Image',
                data: {
                  id: CurrentCount,
                  runwayId: runwayId,
                  'post-title': title,
                  'published-at': publishedAt,
                  category: 'Runway',
                  count: GalleryData.length,
                  currentCount: CurrentCount,
                  image: ImagesData[CurrentCount],
                },
                galleryData: GalleryData,
                ImagesData: ImagesData,
              };
              this.props.savedBookMark(data);
            }}
          >
            <Image
              accessible={childEnabled}
              accessibilityLabel="bookmark"
              testID="bookmark"
              source={checkBookMark ? Images.bookmark : Images.unBookmark}
              style={styles.bookmarkIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    const { GalleryData, CurrentCount, ImagesData }: any = this.state;

    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={async () => {
            await this.writeFile();

            const id = CurrentCount;
            let data = {
              id: id,
              runwayId: this.state.runwayId,
            };
            this.props.checkRunWaySavedBookMark(data);

            this.setState({
              checkBookMark: this.props.checkBookMark,
            });
          }}
        />
        {this.renderHeader()}

        {GalleryData && GalleryData.length > 0 ? (
          <View style={styles.image_container}>
            <ImageViewer
              enablePreload={true}
              imageUrls={ImagesData}
              index={CurrentCount}
              flipThreshold={100}
              pageAnimateTime={200}
              onChange={(index: any) => {
                let data = {
                  id: index,
                  runwayId: this.state.runwayId,
                };
                this.props.checkRunWaySavedBookMark(data);

                this.setState({ CurrentCount: index });
              }}
              loadingRender={this.renderLoader} // Loader for image loading
              renderIndicator={() => null} // Remove indicators
              saveToLocalByLongPress={false}
            />
            <Text style={styles.image_credit}>{GalleryData[CurrentCount].credit}</Text>
          </View>
        ) : null}

        {this.renderFooter()}
      </View>
    );
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
  checkRunWaySavedBookMark: (data: any) => dispatch(checkRunWaySavedBookMark(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GalleryFullScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  header_container: {
    width: horizontalScale(375),
    height: verticalScale(75),
    backgroundColor: Colors.black,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(51),
    paddingHorizontal: horizontalScale(13),
  },
  backView: {
    height: moderateScale(27),
    width: moderateScale(27),
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: moderateScale(13.5),
    alignSelf: 'center',
    justifyContent: 'center',
    padding: verticalScale(10),
  },
  backImg: { tintColor: Colors.white, alignSelf: 'center' },

  imgView: {
    flexDirection: 'row',
    backgroundColor: Colors.black,
  },
  title_container: {
    width: horizontalScale(340),
    height: verticalScale(75),
    alignItems: 'center',
    paddingHorizontal: horizontalScale(13),
    marginTop: moderateScale(-10),
  },
  titleText: {
    fontFamily: FontFamily.fontFamilyBold,
    fontSize: moderateScale(20),
    lineHeight: moderateScale(24),
    letterSpacing: moderateScale(0.63),
    color: Colors.white,
  },
  previewText: {
    fontFamily: FontFamily.fontFamilyRegular,
    fontSize: moderateScale(11),
    lineHeight: moderateScale(24),
    letterSpacing: moderateScale(0.34),
    color: Colors.white,
    textTransform: 'uppercase',
  },
  image_container: {
    width: '100%',
    height: verticalScale(584),
  },
  image_credit: {
    marginTop: verticalScale(6),
    marginHorizontal: horizontalScale(16),
    fontFamily: FontFamily.fontFamilyRegular,
    fontSize: moderateScale(12),
    lineHeight: moderateScale(15),
    letterSpacing: moderateScale(0.32),
    color: Colors.gray66,
  },
  footer_container: {
    width: horizontalScale(375),
    height: verticalScale(75),
    backgroundColor: Colors.black,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: verticalScale(25),
    paddingLeft: horizontalScale(16),
    paddingRight: horizontalScale(9),
    position: 'absolute',
    bottom: 0,
  },
  text: {
    fontSize: moderateScale(16),
    color: Colors.darkGrey,
  },
  bookmarkIcon: {
    height: moderateScale(21),
    width: moderateScale(15),
    tintColor: Colors.white,
  },
  shareIcon: {
    height: moderateScale(22),
    width: moderateScale(23),
    tintColor: Colors.white,
  },
  unBookmarkView: {
    marginRight: horizontalScale(24),
  },
});
