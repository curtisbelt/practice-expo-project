import React from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  LayoutAnimation,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import { readSavedBookMark } from '../../redux/actions/FoyYouAction';
import { moderateScale } from '../../helpers/scale';
import ActivityIndicatorView from '../../components/widgets/ActivityIndicator';
import SavedNews from '../../components/ArticleSections/SavedNews';
import Colors from '../../constants/colors/colors';
import FontFamily from '../../assets/fonts/fonts';
import { Images } from '../../assets';
import { readFileStream } from '../../helpers/rn_fetch_blob/createDirectory';
import ModalDropdown from 'react-native-modal-dropdown';
import ConsValues from '../../constants/consValue';
class Saved extends React.Component {
  constructor(props: any) {
    super(props);
    this.onEndReachedCalledDuringMomentum = true;
    this.readData();
    this.state = {
      saveedData: props.forYouSavedData,
      persistedData: props.forYouSavedData,
      loading: false,
      refreshing: false,
      filterSelectionModal: false,
      filterEmpty: false,
      filterText: 'ALL',
      filterOptions: ['ALL', 'ARTICLES', 'PHOTO GALLERIES', 'RUNWAY', 'VIDEO'],
      selectIndex: 0,
      totalPages: 50,
      initalPages: 10,
      show: false,
    };
  }

  // Handling filter item with index.
  handleFilterIndex = async (index: number) => {
    let { filterOptions }: any = this.state;
    let SelectedValue = filterOptions[index];
    this.setState({
      filterText: SelectedValue,
      selectIndex: index,
    });
    let { saveedData }: any = this.state;
    if (SelectedValue.toString().toLocaleLowerCase() === 'all') {
      if (saveedData && saveedData.length > 0) {
        this.setState({
          persistedData: saveedData,
          filterEmpty: false,
        });
      } else {
        this.setState({
          filterEmpty: true,
        });
      }
    } else {
      if (saveedData && saveedData.length > 0) {
        let filteredData = await saveedData.filter((item: any) => {
          let type: any = item['item-type'];
          let selectType: any = SelectedValue.toString().toLocaleLowerCase();
          type =
            type === 'article'
              ? 'articles'
              : type === 'article-video'
              ? 'video'
              : type === 'video-detail'
              ? 'video'
              : type === 'images-details'
              ? 'photo galleries'
              : type === 'gallery-images'
              ? 'photo galleries'
              : type === 'article-gallery'
              ? 'photo galleries'
              : type === 'runway-Image'
              ? 'runway'
              : type === 'runway-tabs'
              ? 'runway'
              : '';
          return type.toString().toLocaleLowerCase() === selectType;
        });

        if (filteredData.length > 0) {
          this.setState({
            persistedData: filteredData,
            filterEmpty: false,
          });
        } else {
          this.setState({
            persistedData: filteredData,
            filterEmpty: true,
          });
        }
      }
    }
  };
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.forYouSavedData !== nextProps.forYouSavedData) {
      this.setState({
        persistedData: nextProps.forYouSavedData,
        saveedData: nextProps.forYouSavedData,
      });
      this.handleFilterIndex(this.state.selectIndex);
    }
  }
  readData = async () => {
    let data = await readFileStream();
    let temp = JSON.parse(data);
    if (temp !== null) {
      this.props.readSavedBookMark(temp);
      this.setState({
        saveedData: temp,
      });
    }
  };
  onRefresh = () => {
    this.setState({ loading: false });
  };

  renderItem = (item: any) => {
    return <SavedNews item={item} {...this.props} />;
  };
  renderSeparator = () => {
    return <View style={styles.itemSeparator} />;
  };
  dropDownLineSeperator = () => {
    return <View style={styles.renderSeparator} />;
  };
  renderNoBookMarkView = () => {
    return (
      <View style={styles.emptyView}>
        <Text
          style={{
            fontFamily: FontFamily.fontFamilyBold,
            fontSize: moderateScale(18),
          }}
        >
          No bookmarked items
        </Text>
      </View>
    );
  };
  pageLimit = (array, index, size) => {
    // transform values
    if (array !== null) {
      index = Math.abs(parseInt(index));
      index = index > 0 ? index - 1 : index;
      size = parseInt(size);
      size = size < 1 ? 1 : size;
      // filter
      return [
        ...array.filter((value, n) => {
          return n >= index * size && n < (index + 1) * size;
        }),
      ];
    } else {
      return [];
    }
  };
  onScrollPagesHandler = async () => {
    const { initalPages, totalPages, persistedData }: any = this.state;
    if (!this.onEndReachedCalledDuringMomentum && initalPages < totalPages) {
      let resultData = this.pageLimit(persistedData, 0, initalPages + 10);
      this.setState({
        persistedData: [...resultData],
        initalPages: initalPages + 10,
      });
      this.onEndReachedCalledDuringMomentum = true;
    }
  };
  _listViewOffset = 0;
  handleScroll = async (event: Object) => {
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
      const isHeaderVisible = direction === 'down';
      if (isHeaderVisible !== this.state.show) {
        LayoutAnimation.configureNext(CustomLayoutLinear);
        this.setState({ show: isHeaderVisible });
      }
      // Update your scroll position
      this._listViewOffset = currentOffset;
    }
  };
  render() {
    const { loading, saveedData, filterOptions, filterText, persistedData, show }: any = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <NavigationEvents
          onWillFocus={async () => {
            await this.readData();
            //this.handleFilterIndex(0);
          }}
          onDidFocus={async () => {
            await this.readData();
            //this.handleFilterIndex(0);
          }}
        />
        {loading ? <ActivityIndicatorView /> : null}
        {saveedData && saveedData.length === 0 ? (
          this.renderNoBookMarkView()
        ) : (
          <View style={styles.container}>
            <View
              style={{
                margin: moderateScale(10),
              }}
            >
              <View style={styles.filterView}>
                <View>
                  <Text
                    style={{
                      fontFamily: FontFamily.fontFamilyBold,
                      fontSize: moderateScale(14),
                    }}
                  >
                    FILTER BY
                  </Text>
                </View>
                <ModalDropdown
                  showsVerticalScrollIndicator={false}
                  accessible={true}
                  //defaultValue={filterText}
                  defaultIndex={0}
                  options={filterOptions}
                  renderSeparator={() => this.dropDownLineSeperator()}
                  onSelect={(index: number) => this.handleFilterIndex(index)}
                  dropdownTextStyle={styles.dropdownTextStyle}
                  dropdownStyle={styles.dropdownStyle}
                >
                  <View style={styles.dropDownInnerView}>
                    <Text
                      style={{
                        fontFamily: FontFamily.fontFamilyBold,
                        fontSize: moderateScale(14),
                        marginRight: moderateScale(6),
                      }}
                    >
                      {filterText}
                    </Text>
                    <Image source={Images.downArrow} />
                  </View>
                </ModalDropdown>
              </View>
              <View style={styles.filterViewLine} />
            </View>
            {persistedData && persistedData.length === 0 ? (
              this.renderNoBookMarkView()
            ) : (
              <FlatList
                bounces={false}
                data={persistedData}
                style={{ marginTop: moderateScale(20) }}
                renderItem={this.renderItem}
                keyExtractor={(x, i) => i.toString()}
                ItemSeparatorComponent={this.renderSeparator}
                // onMomentumScrollBegin={() => {
                //   this.onEndReachedCalledDuringMomentum = false;
                // }}
                // onEndReached={this.onScrollPagesHandler}
                // onEndReachedThreshold={0.7}
                // onScroll={event => {
                //   this.handleScroll(event);
                // }}
              />
            )}

            {show ? (
              <View>
                <View style={[styles.lineSeparator]} />
                <View style={styles.scrollDownView}>
                  <Text>Scroll down for more content</Text>
                  <TouchableOpacity style={styles.scrollIconView} onPress={() => {}}>
                    <Image
                      accessible={true}
                      accessibilityLabel="down"
                      testID="down"
                      source={Images.downArrow}
                      style={styles.downIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </View>
        )}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: moderateScale(24),
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  dropdownTextStyle: {
    textAlign: 'right',
    fontFamily: FontFamily.fontFamilyBold,
    fontSize: moderateScale(14),
    marginRight: moderateScale(15),
  },
  dropdownStyle: {
    flex: 1,
    width: Dimensions.get('window').width - 15,
    marginLeft: 20,
    height: moderateScale(190),
    elevation: 6,
    marginTop: moderateScale(12),
  },
  dropDownInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  renderSeparator: {
    height: moderateScale(1),
    backgroundColor: '#E9E9E9',
    marginLeft: moderateScale(11),
    marginRight: moderateScale(11),
  },
  filterView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: moderateScale(10),
  },
  filterViewLine: {
    height: 1,
    backgroundColor: Colors.black,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: Colors.whisperGrey,
    marginLeft: moderateScale(10),
    marginRight: moderateScale(10),
    marginTop: moderateScale(20),
  },
  lineSeparator: {
    height: 1,
    backgroundColor: Colors.whisperGrey,
    marginLeft: moderateScale(10),
    marginRight: moderateScale(10),
  },
  scrollDownView: {
    alignItems: 'center',
    margin: moderateScale(10),
  },
  scrollIconView: {
    alignItems: 'center',
    marginTop: moderateScale(10),
  },
  downIcon: {},
});
const mapStatesToProps = (state: any) => {
  return {
    forYouSavedData: state.foryou.forYouSavedData,
  };
};
const mapDispatchToProps = (dispatch: any) => ({
  readSavedBookMark: (data: any) => dispatch(readSavedBookMark(data)),
});
export default connect(mapStatesToProps, mapDispatchToProps)(Saved);
