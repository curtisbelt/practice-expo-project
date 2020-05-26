import React from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  LayoutAnimation,
  Platform,
  NativeModules,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { Images } from '../../assets';
import { onShowHeaderDigitalDaily } from '../../redux/actions/DigitalDailyAction';
import { verticalScale, moderateScale } from '../../helpers/scale';
import FontFamily from '../../assets/fonts/fonts';
import Colors from '../../constants/colors/colors';
import { parentEnabled, childEnabled, useStaticLable } from '../../../appConfig';
import automationStaticLables from '../../constants/automationStaticLables';
import ActivityIndicatorView from '../../components/widgets/ActivityIndicator';
import {
  getCurrentMonth,
  getPreviousMonth,
  getNextMonth,
  getFormatedMonth,
} from '../../helpers/dateTimeFormats';
import DateFormats from '../../constants/dateFormats';
import EmptyComponent from '../../components/widgets/EmptyComponent';
import translate from '../../assets/strings/strings';
import ImageThumbnail from './ImageThumbnail';
import NetInfo from '@react-native-community/netinfo';
import ConsValues from '../../constants/consValue';
const { PageSuite } = NativeModules;
const { height } = Dimensions.get('screen');

class Issues extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      refreshing: false,
      isActionHeaderVisible: true,
      issuedData: [],
      publishedDates: [],
      monthDateYear: getCurrentMonth(DateFormats.mmmyyyy),
      isConnected: true,
    };

    this.getMonthlyEditions = this.getMonthlyEditions.bind(this);
    this.getPreviousMonthEditions = this.getPreviousMonthEditions.bind(this);
    this.getNextMonthEditions = this.getNextMonthEditions.bind(this);

    NetInfo.fetch().then((state) => {
      this.setState({ isConnected: state.isConnected });
    });
  }

  _listViewOffset = 0;

  async componentDidMount() {
    await NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        this.handleApiCall();
      }
      this.setState({ isConnected: state.isConnected });
    });
  }

  handleApiCall = () => {
    this.setState({ loading: true });
    const currentMonth = getCurrentMonth(DateFormats.ddmmyyyy);
    this.getMonthlyEditions(currentMonth);
  };

  getMonthlyEditions = async (month: any) => {
    try {
      if (Platform.OS === 'ios') {
        await NativeModules.Reader.getMonthlyEditions(month).then((response: any) =>
          this.setState({
            issuedData: response.EditionIDArray,
            publishedDates: response.publishedDates,
            loading: false,
            refreshing: false,
          }),
        );
      } else {
        await PageSuite.getIssuedEditions(getCurrentMonth(month), (data: any) => {
          this.setState({
            loading: false,
            issuedData: data.EditionIDArray,
            publishedDates: data.publishedDates,
            refreshing: false,
          });
        });
      }
    } catch (error) {
      // console.log('erro', error);
    }
  };

  getPreviousMonthEditions = () => {
    const prevMonth = getPreviousMonth(this.state.monthDateYear, DateFormats.ddmmyyyy);

    this.setState({
      monthDateYear: getPreviousMonth(this.state.monthDateYear, DateFormats.mmmyyyy),
      loading: true,
    });

    this.getMonthlyEditions(prevMonth);
  };

  getNextMonthEditions = () => {
    const nextMonth = getNextMonth(this.state.monthDateYear, DateFormats.ddmmyyyy);

    this.setState({
      monthDateYear: getNextMonth(this.state.monthDateYear, DateFormats.mmmyyyy),
      loading: true,
    });

    this.getMonthlyEditions(nextMonth);
  };

  renderItem = ({ item, index }: any) => {
    const { publishedDates }: any = this.state;

    return (
      <ImageThumbnail
        item={item}
        index={index}
        publishedDate={publishedDates.length > 0 ? publishedDates[index] : null}
      />
    );
  };

  isBookMark = async (guid) => {
    let result: any = '';
    try {
      await PageSuite.isEditionDownloaded(guid, (data: any) => {
        result = data.isDownloaded;
      });
    } catch (error) {
      result = 'false';
    }
    return result;
  };

  handleScroll = (event: Object) => {
    const CustomLayoutLinear = {
      duration: ConsValues.duration,
      create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
      delete: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
    };

    // Check if the user is scrolling up or down by confronting the new scroll position with your own one
    const change = event.nativeEvent.contentOffset.y - this._listViewOffset;
    if (Math.abs(change) > ConsValues.changeVal) {
      const currentOffset = event.nativeEvent.contentOffset.y;
      const direction = currentOffset > 0 && currentOffset > this._listViewOffset ? 'down' : 'up';
      // If the user is scrolling down (and the Header is still visible) hide it
      const isHeaderVisible = direction === 'up';
      if (isHeaderVisible !== this.props.showHeader) {
        LayoutAnimation.configureNext(CustomLayoutLinear);
        this.props.setShowHeaderDigitalDaily(isHeaderVisible);
      }
      // Update your scroll position
      this._listViewOffset = currentOffset;
    }
  };

  handleRefresh = () => {
    this.setState({ refreshing: true });
    const currentMonth = getFormatedMonth(this.state.monthDateYear);

    this.getMonthlyEditions(currentMonth);
  };

  handleReload = () => {
    this.setState({ loading: true });
    const currentMonth = getFormatedMonth(this.state.monthDateYear);

    this.getMonthlyEditions(currentMonth);
  };

  render() {
    const { issuedData, refreshing, loading, monthDateYear, isConnected }: any = this.state;

    if (!isConnected) {
      return (
        <SafeAreaView style={styles.container}>
          <EmptyComponent
            onPress={this.handleReload}
            errorText={translate('internet_connection')}
          />
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <View style={{ paddingHorizontal: moderateScale(22.5) }}>
            <View style={styles.readTodaysIssueView}>
              <TouchableOpacity
                accessible={parentEnabled}
                onPress={() =>
                  Platform.OS === 'ios'
                    ? this.getPreviousMonthEditions()
                    : this.getPreviousMonthEditions()
                }
                style={{ margin: verticalScale(10) }}
              >
                <Image
                  accessible={childEnabled}
                  accessibilityLabel="Previous month"
                  testID="Previous month"
                  source={Images.arrowLeft}
                />
              </TouchableOpacity>
              <Text
                accessible={childEnabled}
                accessibilityLabel={
                  useStaticLable ? automationStaticLables.editionMonth : monthDateYear
                }
                testID={useStaticLable ? automationStaticLables.editionMonth : monthDateYear}
                style={styles.readTodaysIssueTXT}
              >
                {monthDateYear}
              </Text>

              {getCurrentMonth(DateFormats.mmmyyyy) !== monthDateYear ? (
                <TouchableOpacity
                  accessible={parentEnabled}
                  onPress={() =>
                    Platform.OS === 'ios'
                      ? this.getNextMonthEditions()
                      : this.getNextMonthEditions()
                  }
                  style={{ margin: verticalScale(10) }}
                >
                  <Image
                    accessible={childEnabled}
                    accessibilityLabel="Next month"
                    testID="Next month"
                    style={styles.active_button}
                    source={Images.arrowLeft}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  accessible={parentEnabled}
                  onPress={() => {}}
                  style={{ margin: verticalScale(10) }}
                >
                  <Image
                    accessible={childEnabled}
                    accessibilityLabel="Next month"
                    testID="Next month"
                    source={Images.arrowRight}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ScrollView
            style={{ marginTop: moderateScale(5) }}
            scrollEventThrottle={1}
            onScroll={(event) => this.handleScroll(event)}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={this.handleRefresh} />
            }
          >
            <View style={styles.subContainer}>
              {loading ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicatorView />
                </View>
              ) : issuedData && issuedData.length === 0 ? (
                <EmptyComponent onPress={this.handleReload} errorText={translate('try_again')} />
              ) : (
                <FlatList
                  data={issuedData}
                  keyExtractor={(x, i) => i.toString()}
                  numColumns={2}
                  renderItem={this.renderItem}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                />
              )}
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
  subContainer: {
    paddingHorizontal: moderateScale(0),
    alignItems: 'center',
  },
  loaderContainer: {
    marginTop: Platform.OS === 'ios' ? '50%' : height / 5,
  },
  readTodaysIssueView: {
    height: moderateScale(41),
    width: '100%',
    borderRadius: 5,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: moderateScale(20),
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 7,
  },
  readTodaysIssueTXT: {
    flex: 1,
    color: Colors.black,
    fontFamily: FontFamily.fontFamilyRegular,
    fontSize: moderateScale(17),
    letterSpacing: moderateScale(0.8),
    textAlign: 'center',
  },
  active_button: {
    transform: [{ rotate: '180deg' }],
  },
});

const mapDispatchToProps = (dispatch: any) => ({
  setShowHeaderDigitalDaily: (show: any) => dispatch(onShowHeaderDigitalDaily(show)),
});

const mapStateToProps = (state: any) => ({
  showHeader: state.digitalDaily.showHeader,
});

export default connect(mapStateToProps, mapDispatchToProps)(Issues);
