import React from 'react';
import {
  Text,
  StyleSheet,
  Platform,
  View,
  Image,
  NativeModules,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { verticalScale, moderateScale, horizontalScale } from '../../helpers/scale';
import { Images } from '../../assets';
import FontFamily from '../../assets/fonts/fonts';
import Colors from '../../constants/colors/colors';
import { parentEnabled, childEnabled, useStaticLable } from '../../../appConfig';
import automationStaticLables from '../../constants/automationStaticLables';
import DateFormats from '../../constants/dateFormats';
import CustomImage from '../../components/widgets/CustomImage';
import { getFormattedPublishedDate, getCurrentTodayDate } from '../../helpers/dateTimeFormats';
import { connect } from 'react-redux';
import {
  updateDownloadQueue,
  setReadUnReadDigitalDaily,
} from '../../redux/actions/DigitalDailyAction';

const { PageSuite } = NativeModules;
import { setJSONItem, asynStoreKeys } from '../../helpers/asyncStore';

class ImageThumbnail extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      imageData: {},
      isSaved: 'false',
      loading: props.downloadQueue.includes(props.item) ? true : false,
      downloadQueue: props.downloadQueue,
    };

    this.handleBookmark = this.handleBookmark.bind(this);
  }

  async componentDidMount() {
    if (Platform.OS === 'ios') {
      try {
        var params = {
          edition: this.props.item,
          width: horizontalScale(164),
          height: verticalScale(265),
        };

        await NativeModules.Reader.getEditionThumbnail(params).then((response: any) => {
          this.setState({
            imageData: response,
          });
        });

        var bookmarkStatus = await NativeModules.Reader.isEditionDownloaded(this.props.item).then(
          (response: any) => {
            // Remove item from download queue if downloaded
            if (this.props.downloadQueue.includes(this.props.item)) {
              if (bookmarkStatus.isDownloaded === 'true') {
                this.changeQueueStatus(this.props.item);
              }
            }

            this.setState({
              isSaved: response.isDownloaded,
            });
          },
        );
      } catch (error) {
        // console.log('erro', error);
      }
    } else {
      try {
        await PageSuite.getReaderEditionUrl(this.props.item, (data) => {
          //this.isBookMark(guid[0]);
          let obj = {
            url: data.pageUrl,
          };

          this.setState({
            imageData: obj,
          });
        });
        await PageSuite.isEditionDownloaded(this.props.item, (data: any) => {
          // console.log('*****' + data.isDownloaded);
          if (data !== null && data.isDownloaded !== null) {
            if (this.props.downloadQueue.includes(this.props.item)) {
              if (data.isDownloaded === 'true') {
                this.changeQueueStatus(this.props.item);
              }
            }
            this.setState({
              isSaved: data.isDownloaded,
            });
          }
        });
      } catch (error) {
        // console.log('erro', error);
      }
    }
  }

  changeQueueStatus = (editionID: any) => {
    var { downloadQueue }: any = this.props;

    if (downloadQueue.includes(editionID)) {
      downloadQueue.splice(editionID, 1);
    } else {
      downloadQueue.push(editionID);
    }

    this.props.updateDownloadQueue(downloadQueue);
  };

  async handleBookmark() {
    const editionID = this.props.item;

    this.changeQueueStatus(editionID);

    try {
      this.setState({ loading: true });

      // Download if not done already
      if (this.state.isSaved === 'false') {
        await NativeModules.Reader.downloadEdition(editionID)
          .then((response: any) => {
            this.setState({
              loading: false,
              isSaved: response.downloadStatus,
            });
            this.changeQueueStatus(response.EditionID);
          })
          .catch((_error: any) => {
            // console.log('Download error', _error);
          });
      }
      // Delete if downloaded already
      else {
        await NativeModules.Reader.deleteDownload(editionID)
          .then((_response) => {
            this.setState({ loading: false, isSaved: 'false' });
          })
          .catch((_error: any) => {
            // console.log('Delete download error', _error);
          });
      }
    } catch (_error) {
      // console.log('Download catch error', _error);
    }
  }

  handleBookmarkAndroid = async (pubId: any) => {
    await this.changeQueueStatus(pubId);
    try {
      this.setState({ loading: true });
      if (this.state.isSaved === 'false') {
        await PageSuite.downloadEdition(pubId, (data: any) => {
          if (data.download === 'true') {
            this.setState({ loading: false, isSaved: 'true' });
            this.changeQueueStatus(pubId);
          } else {
            this.setState({ loading: false, isSaved: 'false' });
          }
        });
      }
      // Delet if downloaded already
      else {
        await PageSuite.deleteDownload(pubId, (data: any) => {
          if (data.download === 'true') {
            this.setState({ loading: false, isSaved: 'false' });
          } else {
            this.setState({ loading: false });
          }
        });
      }
    } catch (error) {
      // console.log('erro', error);
    }
  };
  render() {
    const { item, publishedDate, index }: any = this.props;
    //console.log('publishedDate' + publishedDate);
    const { isSaved, imageData }: any = this.state;
    let date = new Date();
    if (Platform.OS === 'android') {
      let getDate = publishedDate.split('/');
      let published = getDate[2] + '-' + getDate[1] + '-' + getDate[0];
      date = new Date(published + DateFormats.T100000);
    } else {
      date = new Date(publishedDate + DateFormats.T100000);
    }

    var formatted = getFormattedPublishedDate(date, DateFormats.MMMMDYYYY);
    return (
      <View accessible={parentEnabled} style={styles.pdfViewContainer}>
        <TouchableOpacity
          accessible={parentEnabled}
          onPress={async () => {
            if (index === 0) {
              let data = {
                statusDate: getCurrentTodayDate(),
                status: false,
              };
              this.props.setReadUnReadDigitalDaily(getCurrentTodayDate());
              await setJSONItem(asynStoreKeys.DigtalDailyTodayDate, data);
            }
            if (Platform.OS === 'android') {
              PageSuite.openEdition(item);
            } else {
              NativeModules.Reader.loadEdition(imageData.EditionID);
            }
          }}
          style={styles.pdfImgeContainer}
        >
          {Platform.OS === 'android' ? (
            <CustomImage
              accessible={childEnabled}
              accessibilityLabel={formatted}
              testID={formatted}
              url={imageData.url}
              resizeMode={'contain'}
              style={styles.editionImage}
            />
          ) : (
            <Image
              accessible={childEnabled}
              accessibilityLabel={formatted}
              testID={formatted}
              source={{
                uri: `data:image/png;base64,${imageData.data}`,
              }}
              style={styles.pdf_image}
              resizeMode={'contain'}
            />
          )}

          <TouchableOpacity
            accessible={parentEnabled}
            onPress={() =>
              Platform.OS === 'ios'
                ? this.handleBookmark(imageData.EditionID)
                : this.handleBookmarkAndroid(item)
            }
            style={styles.bookmarkView}
          >
            {this.state.loading ? (
              <ActivityIndicator />
            ) : (
              <Image
                accessible={childEnabled}
                accessibilityLabel="Bookmark"
                testID="Bookmark"
                source={isSaved === 'true' ? Images.bookmark : Images.unBookmark}
                style={styles.bookmarkImage}
              />
            )}
          </TouchableOpacity>
        </TouchableOpacity>

        <View accessible={false} style={styles.pageBottomView}>
          <View accessible={false} style={styles.dateView}>
            <Text
              accessible={false}
              accessibilityLabel={
                useStaticLable ? automationStaticLables.digitalDailyPublished : formatted
              }
              testID={useStaticLable ? automationStaticLables.digitalDailyPublished : formatted}
              style={styles.dateTXT}
            >
              {formatted}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  editionImage: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  pdf_image: {
    height: '100%',
    width: '100%',
  },
  pageBottomView: {
    alignItems: 'center',
  },
  dateView: {
    marginTop: moderateScale(15),
    alignItems: 'flex-start',
  },
  dateTXT: {
    color: Colors.black,
    fontFamily: FontFamily.fontFamilyRegular,
    fontSize: moderateScale(15),
    textAlign: 'center',
  },
  bookmarkView: {
    width: moderateScale(34),
    height: moderateScale(34),
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray38,
    borderRadius: moderateScale(50),
    bottom: 0,
    right: 0,
    margin: moderateScale(10),
  },
  bookmarkImage: {
    height: moderateScale(17),
    width: moderateScale(12),
    tintColor: Colors.white,
  },
  pdfViewContainer: {
    width: horizontalScale(164),
    height: verticalScale(265),
    margin: moderateScale(7.5),
    backgroundColor: Colors.snow,
  },
  pdfImgeContainer: {
    flex: 1,
    height: verticalScale(265),
    backgroundColor: Colors.white,
    elevation: moderateScale(9),
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    paddingTop: moderateScale(10),
    paddingBottom: moderateScale(10),
  },
});

const mapStatesToProps = (state: any) => {
  return {
    downloadQueue: state.digitalDaily.downloadQueue,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  updateDownloadQueue: (data: any) => dispatch(updateDownloadQueue(data)),
  setReadUnReadDigitalDaily: (data: any) => dispatch(setReadUnReadDigitalDaily(data)),
});

export default connect(mapStatesToProps, mapDispatchToProps)(ImageThumbnail);
