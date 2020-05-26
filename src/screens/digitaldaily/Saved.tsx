import React from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  ScrollView,
  Platform,
  RefreshControl,
  TouchableOpacity,
  LayoutAnimation,
  NativeModules,
} from 'react-native';
import { connect } from 'react-redux';
import ActivityIndicatorView from '../../components/widgets/ActivityIndicator';
import { onShowHeaderDigitalDaily } from '../../redux/actions/DigitalDailyAction';
import { moderateScale } from '../../helpers/scale';
import FontFamily from '../../assets/fonts/fonts';
import Colors from '../../constants/colors/colors';
import { parentEnabled, childEnabled } from '../../../appConfig';
import translate from '../../assets/strings/strings';
import SavedThumbnail from './SavedThumbnail';
import moment from 'moment';
import ConsValues from '../../constants/consValue';
const { PageSuite } = NativeModules;

class Saved extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      todayNewsData: [],
      isActionHeaderVisible: true,
      savedEditions: [],
      publishedDates: [],
      refreshing: false,
      loading: false,
    };
  }

  _listViewOffset = 0;

  componentDidMount() {
    this.handleApiCall();
  }

  handleApiCall = async () => {
    if (Platform.OS === 'ios') {
      try {
        this.setState({ loading: true });

        await NativeModules.Reader.getAllDownloads().then((downloads: any) => {
          this.setState({
            savedEditions: downloads.downloadedEditions,
            publishedDates: downloads.publishedDates,
            loading: false,
          });
        });
      } catch (error) {
        // console.log('erro', error);
      }
    } else {
      this.getSavedData();
    }
  };

  getSavedData = async () => {
    this.setState({ loading: true });
    await PageSuite.getAllDownloads((data: any) => {
      if (data.getDownload && data.getDownload === '0') {
        this.setState({
          loading: false,
          savedEditions: [],
        });
      } else {
        let todayNewsData: any = [];
        let tempData = data;
        let obj: any = null;

        for (let key in tempData) {
          let guid = tempData[key].split('/');
          PageSuite.getReaderEditionUrl(guid[0], (data) => {
            obj = {
              url: data.pageUrl,
              guid: guid[0],
              id: guid[1],
              editionDate: guid[3] + '-' + guid[1] + '-' + guid[2],
            };
            todayNewsData.push(obj);
            let result = [...todayNewsData];
            result.sort(function (left, right) {
              return moment(right.id).diff(moment(left.id));
            });
            this.setState({
              loading: false,
              savedEditions: result,
            });
          });
        }
      }
    });
  };

  renderItem = ({ item, index }: any) => {
    const { publishedDates } = this.state;
    return (
      <SavedThumbnail
        item={item}
        publishedDate={publishedDates.length > 0 ? publishedDates[index] : null}
        handleApiCall={this.handleApiCall}
      />
    );
  };

  handleRefresh = async () => {
    this.setState({ refreshing: true });

    if (Platform.OS === 'ios') {
      try {
        var downloads = await NativeModules.Reader.getAllDownloads();

        this.setState({
          savedEditions: downloads.downloadedEditions,
          publishedDates: downloads.publishedDates,
          refreshing: false,
        });
      } catch (error) {
        // console.log('erro', error);
      }
    }
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
        this.props.onShowHeaderDigitalDaily(isHeaderVisible);
      }
      // Update your scroll position
      this._listViewOffset = currentOffset;
    }
  };

  render() {
    const { savedEditions, loading, refreshing }: any = this.state;

    if (loading) {
      return <ActivityIndicatorView />;
    } else {
      return (
        <SafeAreaView style={styles.container}>
          {savedEditions.length === 0 ? (
            <View style={styles.savedEmptyContainer}>
              <Text
                accessible={childEnabled}
                accessibilityLabel={translate('digitalDailyDSavedText')}
                testID={translate('digitalDailyDSavedText')}
                style={styles.titleTXT}
              >
                {translate('digitalDailyDSavedText')}
              </Text>
              <TouchableOpacity
                accessible={parentEnabled}
                onPress={() => {
                  this.props.updateSectionIndex(0);
                }}
                style={styles.readTodaysIssueView}
              >
                <Text
                  accessible={childEnabled}
                  accessibilityLabel={translate('readTodayIssues')}
                  testID={translate('readTodayIssues')}
                  accessibilityRole={'button'}
                  style={styles.readTodaysIssueTXT}
                >
                  {translate('readTodayIssues')}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView
              scrollEventThrottle={16}
              onScroll={(event) => this.handleScroll(event)}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={this.handleRefresh} />
              }
            >
              <View style={styles.flatListContainer} accessible={parentEnabled}>
                <FlatList
                  data={savedEditions}
                  renderItem={this.renderItem}
                  keyExtractor={(x, i) => i.toString()}
                  scrollEnabled={false}
                />
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  savedEmptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  titleTXT: {
    color: Colors.black,
    fontFamily: FontFamily.fontFamilyRegular,
    fontStyle: 'italic',
    fontSize: moderateScale(15),
    letterSpacing: moderateScale(0.8),
    textAlign: 'center',
  },
  flatListContainer: {
    flex: 1,
    alignItems: 'center',
  },
  readTodaysIssueView: {
    height: moderateScale(44),
    width: moderateScale(260),
    borderRadius: moderateScale(2),
    backgroundColor: '#D0021A',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: moderateScale(20),
  },
  readTodaysIssueTXT: {
    color: Colors.white,
    fontFamily: FontFamily.fontFamilyBold,
    fontSize: moderateScale(15),
    fontWeight: 'bold',
    letterSpacing: moderateScale(0.8),
    textAlign: 'center',
  },
});

const mapDispatchToProps = (dispatch: any) => ({
  onShowHeaderDigitalDaily: (show: any) => dispatch(onShowHeaderDigitalDaily(show)),
});

const mapStateToProps = (state: any) => ({
  showHeader: state.digitalDaily.showHeader,
});

export default connect(mapStateToProps, mapDispatchToProps)(Saved);
