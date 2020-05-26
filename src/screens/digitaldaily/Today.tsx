import React from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  View,
  Image,
  NativeModules,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import {
  onShowHeaderDigitalDaily,
  setReadUnReadDigitalDaily,
} from '../../redux/actions/DigitalDailyAction';
import { horizontalScale, moderateScale, verticalScale } from '../../helpers/scale';
import FontFamily from '../../assets/fonts/fonts';
import Colors from '../../constants/colors/colors';
import { parentEnabled, childEnabled, useStaticLable } from '../../../appConfig';
import automationStaticLables from '../../constants/automationStaticLables';
import ActivityIndicatorView from '../../components/widgets/ActivityIndicator';
import {
  getFormattedPublishedDate,
  getCurrentMonth,
  getCurrentTodayDate,
} from '../../helpers/dateTimeFormats';
import DateFormats from '../../constants/dateFormats';
import translate from '../../assets/strings/strings';
import EmptyComponent from '../../components/widgets/EmptyComponent';
import NetInfo from '@react-native-community/netinfo';
import { setJSONItem, asynStoreKeys } from '../../helpers/asyncStore';
import { ScrollView } from 'react-native-gesture-handler';
const { PageSuite } = NativeModules;

class Today extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      imageData: {},
      loading: false,
      isConnected: true,
      pdfUrl: '',
      guid: '',
    };

    NetInfo.fetch().then((state) => {
      this.setState({ isConnected: state.isConnected });
    });
  }

  async componentDidMount() {
    await NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        this.getTodayEdition();
      }
      this.setState({ isConnected: state.isConnected });
    });
  }

  getTodayEdition = async () => {
    this.setState({ loading: true });
    try {
      if (Platform.OS === 'ios') {
        var params = {
          width: horizontalScale(314),
          height: verticalScale(456),
        };

        await NativeModules.Reader.getImageData(params).then((response: any) =>
          this.setState({ imageData: response, loading: false }),
        );
      } else {
        PageSuite.getTodayEditions(getCurrentMonth(DateFormats.ddmmyyyy), (data: any) => {
          if (data && data.pageUrl !== null) {
            //console.log('*****' + data.pageUrl + ':::' + data.guid);
            this.setState({
              pdfUrl: data.pageUrl,
              guid: data.guid,
              loading: false,
            });
          } else {
            this.setState({
              loading: false,
            });
          }
        });
      }
    } catch (error) {
      // console.log('Today edition error', error);
    }
  };

  handleReload = () => {
    this.getTodayEdition();
  };

  renderThumbinalView = () => {
    const { imageData, pdfUrl, guid }: any = this.state;

    return (
      <View accessible={parentEnabled} style={styles.pdfViewContainer}>
        <TouchableOpacity
          accessible={parentEnabled}
          onPress={async () => {
            let data = {
              statusDate: getCurrentTodayDate(),
              status: false,
            };
            this.props.setReadUnReadDigitalDaily(getCurrentTodayDate());
            await setJSONItem(asynStoreKeys.DigtalDailyTodayDate, data);
            Platform.OS === 'ios'
              ? NativeModules.Reader.loadEdition(imageData.EditionID)
              : PageSuite.openEdition(guid);
          }}
          style={styles.pdfImgeContainer}
        >
          <Image
            accessible={childEnabled}
            accessibilityLabel={translate('editionImage')}
            testID={translate('editionImage')}
            source={
              Platform.OS === 'ios'
                ? {
                    uri: `data:image/png;base64,${imageData.data}`,
                  }
                : {
                    uri: pdfUrl,
                  }
            }
            resizeMode={'contain'}
            style={styles.image}
          />
        </TouchableOpacity>
      </View>
    );
  };

  handleScroll = (event: Object) => {
    if (event.nativeEvent.contentOffset.y > 15 + 100) {
      this.props.onShowHeaderDigitalDaily(false);
    } else if (!this.props.showHeader) {
      this.props.onShowHeaderDigitalDaily(true);
    }
  };

  render() {
    const { imageData, loading, isConnected, pdfUrl }: any = this.state;

    if (!isConnected) {
      return (
        <SafeAreaView style={styles.container}>
          <EmptyComponent
            onPress={this.handleReload}
            errorText={translate('internet_connection')}
          />
        </SafeAreaView>
      );
    } else if (isConnected && loading) {
      return <ActivityIndicatorView />;
    } else if (Object.entries(imageData).length === 0 && pdfUrl === '') {
      return (
        <SafeAreaView style={styles.container}>
          {/* <View style={styles.titleContainer}> */}
          <EmptyComponent onPress={this.handleReload} errorText={translate('try_again')} />
          {/* </View> */}
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <View style={styles.titleContainer}>
              <Text
                accessible={childEnabled}
                accessibilityLabel={
                  useStaticLable
                    ? automationStaticLables.digitalDailyTitle
                    : translate('digitalDaily')
                }
                testID={
                  useStaticLable
                    ? automationStaticLables.digitalDailyTitle
                    : translate('digitalDaily')
                }
                style={styles.titleTXT}
              >
                {translate('digitalDaily')}
              </Text>
              <Text
                accessible={childEnabled}
                accessibilityLabel={
                  useStaticLable
                    ? automationStaticLables.currentMonth
                    : Object.entries(imageData).length > 0 && Platform.OS === 'ios'
                    ? getFormattedPublishedDate(imageData.EditionDate, DateFormats.ddddMMMMD)
                    : getCurrentMonth(DateFormats.ddddMMMMD)
                }
                testID={
                  useStaticLable
                    ? automationStaticLables.currentMonth
                    : Object.entries(imageData).length > 0 && Platform.OS === 'ios'
                    ? getFormattedPublishedDate(imageData.EditionDate, DateFormats.ddddMMMMD)
                    : getCurrentMonth(DateFormats.ddddMMMMD)
                }
                style={styles.dateTXT}
              >
                {Object.entries(imageData).length > 0 && Platform.OS === 'ios'
                  ? getFormattedPublishedDate(imageData.EditionDate, DateFormats.ddddMMMMD)
                  : getCurrentMonth(DateFormats.ddddMMMMD)}
              </Text>
            </View>

            <View accessible={parentEnabled}>
              {Object.entries(imageData).length > 0 || pdfUrl !== ''
                ? this.renderThumbinalView()
                : null}
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    marginTop: horizontalScale(20),
    alignItems: 'center',
  },
  titleTXT: {
    color: Colors.red,
    fontFamily: FontFamily.fontFamilyRegular,
    fontSize: moderateScale(18),
    letterSpacing: moderateScale(0.64),
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  dateTXT: {
    marginTop: horizontalScale(5),
    color: Colors.black,
    fontFamily:
      Platform.OS === 'ios'
        ? FontFamily.publicoBannerMediumIos
        : FontFamily.publicoBannerMediumAndroid,
    fontSize: moderateScale(28),
    textAlign: 'center',
  },
  pageTXT: {
    color: Colors.matterhorn,
    fontFamily: FontFamily.fontFamilyRegular,
    fontSize: moderateScale(15),
    letterSpacing: moderateScale(0.44),
    textAlign: 'center',
    marginTop: moderateScale(15),
  },
  pdfViewContainer: {
    height: verticalScale(456),
    width: horizontalScale(314),
    paddingHorizontal: moderateScale(2),
    margin: moderateScale(30),
    // backgroundColor: Colors.snow,
  },
  pdfImgeContainer: {
    backgroundColor: Colors.white,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    height: verticalScale(456),
    width: '100%',
  },
  pdf_image: {
    backgroundColor: Colors.white,
    height: '100%',
    width: '100%',
  },
  image: {
    height: '100%',
    width: '100%',
  },
});

const mapDispatchToProps = (dispatch: any) => ({
  onShowHeaderDigitalDaily: (show: any) => dispatch(onShowHeaderDigitalDaily(show)),
  setReadUnReadDigitalDaily: (data: any) => dispatch(setReadUnReadDigitalDaily(data)),
});

const mapStateToProps = (state: any) => ({
  showHeader: state.digitalDaily.showHeader,
});

export default connect(mapStateToProps, mapDispatchToProps)(Today);
