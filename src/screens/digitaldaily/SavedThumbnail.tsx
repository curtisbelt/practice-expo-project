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
import { getFormattedPublishedDate } from '../../helpers/dateTimeFormats';
const { PageSuite } = NativeModules;

class SavedThumbnail extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      imageData: {},
      loading: false,
    };
    this.removeBookmark = this.removeBookmark.bind(this);
  }

  async componentDidMount() {
    if (Platform.OS === 'ios') {
      try {
        var params = {
          edition: this.props.item,
          width: horizontalScale(314),
          height: verticalScale(502),
        };

        var imageData = await NativeModules.Reader.getDownloadedImage(params);
        this.setState({
          loading: false,
          imageData: imageData,
        });
      } catch (error) {
        // console.log('erro', error);
      }
    }
  }

  async removeBookmark() {
    try {
      this.setState({ loading: true });
      await NativeModules.Reader.deleteDownload(this.props.item).then(() => {
        // Callback to parent component to reload data
        this.props.handleApiCall();
        this.setState({
          loading: false,
        });
      });
    } catch (error) {
      //console.log('Remove download error', error);
    }
  }

  removeBookmarkAndroid = async (pubId: any) => {
    try {
      this.setState({ loading: true });

      await PageSuite.deleteDownload(pubId, (data: any) => {
        // console.log('****deleteDownload***' + data.download);
        if (data.download === 'true') {
          this.props.handleApiCall();
          this.setState({ loading: false });
        } else {
          this.setState({ loading: false });
        }
      });
    } catch (error) {
      // console.log('erro', error);
    }
  };
  render() {
    const { item, publishedDate }: any = this.props;
    let date = new Date();
    if (Platform.OS === 'android') {
      date = new Date(item.editionDate + DateFormats.T100000);
    } else {
      date = new Date(publishedDate + DateFormats.T100000);
      var { imageData }: any = this.state;
    }

    var formatted = getFormattedPublishedDate(date, DateFormats.MMMMDYYYY);
    return (
      <View accessible={parentEnabled} style={styles.pdfViewContainer}>
        <TouchableOpacity
          accessible={parentEnabled}
          onPress={() => {
            if (Platform.OS === 'android') {
              PageSuite.openEdition(item.guid);
            } else {
              NativeModules.Reader.loadEdition(imageData.EditionID);
            }
          }}
          style={styles.pdfImgeContainer}
        >
          {Platform.OS === 'android' ? (
            <Image
              accessible={childEnabled}
              accessibilityLabel={formatted}
              testID={formatted}
              source={{ uri: item.url }}
              style={styles.pdf_image}
              resizeMode={'stretch'}
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
          <TouchableOpacity
            accessible={parentEnabled}
            onPress={() =>
              Platform.OS === 'ios'
                ? this.removeBookmark(imageData.EditionID)
                : this.removeBookmarkAndroid(item.guid)
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
                source={Images.savedWhite}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pageBottomView: {
    height: moderateScale(46),
    backgroundColor: Colors.grey,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pdf_image: {
    height: '100%',
    width: '100%',
  },
  dateView: {
    flex: 1,
    alignItems: 'flex-start',
  },
  dateTXT: {
    marginLeft: horizontalScale(12),
    color: Colors.white,
    fontFamily: FontFamily.fontFamilyMedium,
    fontSize: moderateScale(19),
    fontWeight: '500',
    textAlign: 'center',
  },
  bookmarkView: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginRight: horizontalScale(13),
  },
  pdfViewContainer: {
    height: verticalScale(502),
    width: horizontalScale(314),
    marginTop: verticalScale(30),
    backgroundColor: Colors.black,
  },
  pdfImgeContainer: {
    flex: 1,
    height: moderateScale(456),
    backgroundColor: Colors.white,
    elevation: moderateScale(9),
    shadowColor: '#000',
    shadowOffset: { width: moderateScale(2), height: moderateScale(2) },
    shadowOpacity: moderateScale(0.2),
    shadowRadius: moderateScale(7),
  },
});

export default SavedThumbnail;
