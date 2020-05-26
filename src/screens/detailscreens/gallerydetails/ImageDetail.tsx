import React, { Component } from 'react';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import { savedBookMark, checkSavedBookMark } from '../../../redux/actions/FoyYouAction';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import GalleryHeader from '../../../components/header/deatailheader/GalleryHeader';
import Colors from '../../../constants/colors/colors';
import { horizontalScale, moderateScale, verticalScale } from '../../../helpers/scale';
import FontFamily from '../../../assets/fonts/fonts';
import { parentEnabled, childEnabled } from '../../../../appConfig';
import { writeFileStream } from '../../../helpers/rn_fetch_blob/createDirectory';
import ImageViewer from 'react-native-image-zoom-viewer';
class ImageDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageData: props.navigation.getParam('imageData'),
      count: props.navigation.getParam('count'),
      currentCount: props.navigation.getParam('currentCount'),
      checkBookMark: props.checkBookMark,
      Images: props.navigation.getParam('Images'),
      bookMarkShow: props.navigation.getParam('bookMarkShow'),
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
  renderLoader = () => {
    return <ActivityIndicator />;
  };
  renderImage = () => {
    const { currentCount, Images }: any = this.state;
    return (
      <View accessible={parentEnabled} style={styles.imgView}>
        <ImageViewer
          enablePreload={true}
          imageUrls={Images}
          index={currentCount}
          onChange={(index: any) => {
            this.props.checkSavedBookMark(index);
            this.setState({ currentCount: index });
          }}
          loadingRender={this.renderLoader} // Loader for image loading
          renderIndicator={() => null} // Remove indicators
          saveToLocalByLongPress={false}
        />
      </View>
    );
  };

  renderText = () => {
    const { imageData, currentCount }: any = this.state;
    return (
      <View accessible={parentEnabled}>
        <Text
          accessible={childEnabled}
          accessibilityLabel={imageData[currentCount].credit}
          testID={imageData[currentCount].credit}
          style={styles.creditText}
        >
          {imageData[currentCount].credit}
        </Text>
        <Text
          accessible={childEnabled}
          accessibilityLabel={imageData[currentCount].title}
          testID={imageData[currentCount].title}
          style={styles.titleText}
        >
          {imageData[currentCount].title}
        </Text>
        <Text
          accessible={childEnabled}
          accessibilityLabel={imageData[currentCount].caption}
          testID={imageData[currentCount].caption}
          style={styles.previewText}
        >
          {imageData[currentCount].caption}
        </Text>
      </View>
    );
  };

  render() {
    const { goBack }: any = this.props.navigation;
    const { count, currentCount, imageData, Images, bookMarkShow }: any = this.state;
    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={async () => {
            await this.writeFile();
            const galleryData = this.props.navigation.getParam('galleryData');
            const id = galleryData.id;
            this.props.checkSavedBookMark(id);
          }}
        />
        <GalleryHeader
          checkBookMark={this.state.checkBookMark}
          showBookMark={bookMarkShow ? true : false}
          onBack={() => goBack()}
          count={currentCount + 1 + `${'/'}` + count}
          onBookmark={() => {
            const galleryData = this.props.navigation.getParam('galleryData');
            const category = galleryData && galleryData.category;
            const publishedAt = galleryData && galleryData.publishedAt;

            let data = {
              'item-type': 'images-details',
              data: {
                id: currentCount,
                'post-title': imageData[currentCount].title,
                'published-at': publishedAt,
                category: category,
                count: count,
                currentCount: currentCount,
                image: imageData[currentCount].crops[2],
              },
              galleryData: imageData,
              ImagesData: Images,
            };
            //console.log('****galleryData**' + JSON.stringify(galleryData));
            // console.log('****imageData**' + JSON.stringify(imageData));
            // console.log('****data**' + JSON.stringify(data));
            this.props.savedBookMark(data);
          }}
        />
        {imageData && imageData.length > 0 ? (
          <View>
            {this.renderImage()}
            {this.renderText()}
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  image: {
    width: horizontalScale(375),
    height: verticalScale(360),
  },
  imgView: {
    width: horizontalScale(375),
    height: verticalScale(360),
    // marginTop: verticalScale(150),
  },
  titleText: {
    fontSize: moderateScale(23),
    lineHeight: moderateScale(28),
    color: Colors.white,
    fontFamily: FontFamily.fontFamilyBold,
    paddingHorizontal: horizontalScale(10),
    textAlign: 'center',
    marginTop: verticalScale(24),
  },
  previewText: {
    fontSize: moderateScale(15),
    lineHeight: moderateScale(20),
    color: Colors.white,
    fontFamily: FontFamily.fontFamilyMedium,
    paddingHorizontal: horizontalScale(10),
    textAlign: 'center',
    marginTop: verticalScale(8),
  },
  creditText: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(15),
    color: Colors.gray66,
    fontFamily: FontFamily.fontFamilyRegular,
    paddingHorizontal: horizontalScale(15),
    textAlign: 'center',
    marginTop: verticalScale(8),
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

export default connect(mapStateToProps, mapDispatchToProps)(ImageDetail);
