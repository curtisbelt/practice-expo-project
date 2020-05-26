import React from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  RefreshControl,
  LayoutAnimation,
  Platform,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import { onShowHeaderForYou, onShowCustomizeCategory } from '../../redux/actions/FoyYouAction';
import { verticalScale, moderateScale, horizontalScale } from '../../helpers/scale';
import {
  asynStoreKeys,
  setItem,
  setJSONItem,
  getItem,
  getJSONItem,
} from '../../helpers/asyncStore';
import CategorySelectionList from '../reusable/CategorySelectionList';
import FontFamily from '../../assets/fonts/fonts';
import translate from '../../assets/strings/strings';
import Colors from '../../constants/colors/colors';
import MyFeedContent from './MyFeedContent';
import NetInfo from '@react-native-community/netinfo';
import ActivityIndicator from '../../components/widgets/ActivityIndicator';
import ConsValues from '../../constants/consValue';
let items = null;

class MyFeed extends React.Component {
  constructor(props: any) {
    super(props);
    this.child = React.createRef();
    this.state = {
      selectedCategory: [],
      showSettings: 'false',
      selectedItemCount: '',
      clearSelected: 'false',
      refreshing: false,
      isActionHeaderVisible: true,
      loading: true,
      isConnected: false,
    };
    NetInfo.addEventListener((state) => {
      this.setState({
        isConnected: state.isConnected,
      });
    });
  }
  _listViewOffset = 0;
  componentDidMount = async () => {
    this.setState({
      selectedCategory: JSON.parse(await getJSONItem(asynStoreKeys.selectedCategory)),
      loading: false,
    });
    if ((await getItem(asynStoreKeys.myFeed_showSettings)) !== null) {
      this.setState({
        showSettings: await getItem(asynStoreKeys.myFeed_showSettings),
      });
    }
  };

  handleLocalStorageValues = (selectedItems: any) => {
    items = selectedItems;
    if (selectedItems.length > 0) {
      this.setState({
        clearSelected: 'true',
        selectedItemCount: selectedItems.length,
      });
    } else {
      this.setState({
        clearSelected: 'false',
        selectedItemCount: selectedItems.length,
      });
    }
  };

  invalidateSelection = () => {
    this.child.current.clearSelection();
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
        this.props.onShowHeaderForYou(isHeaderVisible);
      }
      // Update your scroll position
      this._listViewOffset = currentOffset;
    }
  };

  renderCustomizeCategory = () => {
    return (
      <SafeAreaView style={Styles.container}>
        <NavigationEvents
          onWillFocus={() => {
            console.log('renderCustomizeCategory');
            if (this.state.selectedCategory !== null) {
              this.props.onShowCustomizeCategory(false);
            } else {
              this.invalidateSelection();
            }
          }}
        />
        <ScrollView
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingBottom: Platform.OS === 'ios' ? moderateScale(70) : moderateScale(43),
          }}
          onScroll={(event) => this.handleScroll(event)}
        >
          <View style={Styles.headerSection}>
            <Text
              accessible={true}
              accessibilityLabel={translate('category_header')}
              testID={translate('category_header')}
              style={Styles.headerTextStyle}
            >
              {translate('category_header')}
            </Text>
            {this.state.clearSelected === 'true' ? (
              <TouchableOpacity style={Styles.reduceTapableArea} onPress={this.invalidateSelection}>
                <Text
                  accessible={true}
                  accessibilityLabel={translate('myfeed_clear_selected')}
                  testID={translate('myfeed_clear_selected')}
                  style={Styles.clearSelectedTextStyle}
                >
                  {translate('myfeed_clear_selected')}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <View style={Styles.categoryList}>
            <CategorySelectionList
              ref={this.child}
              handleToggle={this.handleLocalStorageValues}
              updatingSelection={false}
            />
          </View>
        </ScrollView>

        <View>
          {this.state.selectedItemCount > 0 ? (
            <TouchableOpacity
              style={[Styles.bottomButton, Styles.buttonSelectedButton]}
              onPress={() => {
                setJSONItem(asynStoreKeys.selectedCategory, items);
                this.props.onShowCustomizeCategory(false);
                this.setState({
                  selectedCategory: items,
                });
              }}
            >
              <Text
                accessible={true}
                accessibilityLabel={this.state.selectedItemCount + 'Selected save categories'}
                testID={this.state.selectedItemCount + 'Selected save categories'}
                style={[Styles.selectedText, Styles.selectedTextColor]}
              >
                ({this.state.selectedItemCount} SELECTED) SAVE CATEGORIES
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={[Styles.bottomButton, Styles.buttonUnselectedButton]}>
              <Text
                accessible={true}
                accessibilityLabel="0 selected"
                testID="0 selected"
                style={[Styles.selectedText, Styles.unSelectedTextColor]}
              >
                (0 SELECTED)
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  };

  updateCategory = () => {
    return (
      <SafeAreaView style={Styles.container}>
        <NavigationEvents
          onDidBlur={() => {
            this.props.onShowCustomizeCategory(false);
          }}
        />
        <ScrollView
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingBottom: Platform.OS === 'ios' ? moderateScale(70) : moderateScale(43),
          }}
          onScroll={(event) => this.handleScroll(event)}
        >
          <View style={Styles.headerSection}>
            <Text
              accessible={true}
              accessibilityLabel={translate('category_header')}
              testID={translate('category_header')}
              style={Styles.headerTextStyle}
            >
              {translate('category_header')}
            </Text>
            {this.state.clearSelected === 'true' ? (
              <TouchableOpacity style={Styles.reduceTapableArea} onPress={this.invalidateSelection}>
                <Text
                  accessible={true}
                  accessibilityLabel={translate('myfeed_clear_selected')}
                  testID={translate('myfeed_clear_selected')}
                  style={Styles.clearSelectedTextStyle}
                >
                  {translate('myfeed_clear_selected')}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <View style={Styles.categoryList}>
            <CategorySelectionList
              ref={this.child}
              handleToggle={this.handleLocalStorageValues}
              updatingSelection={true}
            />
          </View>
        </ScrollView>

        <View>
          {this.state.selectedItemCount > 0 ? (
            <TouchableOpacity
              style={[Styles.bottomButton, Styles.buttonSelectedButton]}
              onPress={() => {
                setJSONItem(asynStoreKeys.selectedCategory, items);
                this.props.onShowCustomizeCategory(false);
                this.setState({
                  selectedCategory: items,
                });
              }}
            >
              <Text
                accessible={true}
                accessibilityLabel={this.state.selectedItemCount + 'Selected save categories'}
                testID={this.state.selectedItemCount + 'Selected save categories'}
                style={[Styles.selectedText, Styles.selectedTextColor]}
              >
                ({this.state.selectedItemCount} SELECTED) SAVE CATEGORIES
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={[Styles.bottomButton, Styles.buttonUnselectedButton]}>
              <Text
                accessible={true}
                accessibilityLabel="0 selected"
                testID="0 selected"
                style={[Styles.selectedText, Styles.unSelectedTextColor]}
              >
                (0 SELECTED)
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  };

  renderFeedContent = () => {
    return (
      <SafeAreaView style={Styles.container}>
        {this.state.showSettings === 'false' ? (
          <View style={Styles.container}>
            <View style={Styles.settingsHeader}>
              <View style={Styles.headerContainer}>
                <View style={Styles.iconTextContainer}>
                  <TouchableOpacity
                    style={Styles.dismissContainer}
                    onPress={() => {
                      setItem(asynStoreKeys.myFeed_showSettings, 'true');
                      this.setState({ showSettings: 'true' });
                    }}
                  >
                    <Text
                      accessible={true}
                      accessibilityLabel="Dismiss"
                      testID="Dismiss"
                      style={Styles.dismissText}
                    >
                      X
                    </Text>
                  </TouchableOpacity>
                  <Text
                    accessible={true}
                    accessibilityLabel="Customize your feed in your settings"
                    testID="Customize your feed in your settings"
                    style={Styles.customiseLabel}
                  >
                    Customize your feed in your settings
                  </Text>
                </View>
                <TouchableOpacity
                  style={Styles.settingsContainer}
                  onPress={() => this.props.onShowCustomizeCategory(true)}
                >
                  <Text
                    accessible={true}
                    accessibilityLabel="Settings"
                    testID="Settings"
                    style={Styles.settingsLabel}
                  >
                    SETTINGS
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={Styles.latestNewsContainer}>
              <ScrollView
                scrollEventThrottle={16}
                onScroll={(event) => this.handleScroll(event)}
                contentContainerStyle={{ paddingBottom: 10 }}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={() => {
                      this.setState({
                        refreshing: true,
                      });
                      setTimeout(() => {
                        this.setState({
                          refreshing: false,
                        });
                      }, 500);
                    }}
                  />
                }
              >
                <MyFeedContent {...this.props} />
              </ScrollView>
            </View>
          </View>
        ) : (
          <View style={Styles.latestNewsContainer}>
            <ScrollView
              scrollEventThrottle={16}
              contentContainerStyle={{ paddingBottom: 10 }}
              onScroll={(event) => this.handleScroll(event)}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={() => {
                    this.setState({
                      refreshing: true,
                    });
                    setTimeout(() => {
                      this.setState({
                        refreshing: false,
                      });
                    }, 500);
                  }}
                />
              }
            >
              <MyFeedContent {...this.props} />
            </ScrollView>
          </View>
        )}
      </SafeAreaView>
    );
  };

  render() {
    return (
      <View style={Styles.container}>
        {this.state.loading ? (
          <ActivityIndicator />
        ) : this.props.showCustomizeCategory && this.state.selectedCategory === null ? (
          this.renderCustomizeCategory()
        ) : !this.props.showCustomizeCategory &&
          this.state.selectedCategory !== null &&
          this.state.selectedCategory.length > 0 ? (
          this.renderFeedContent()
        ) : this.props.showCustomizeCategory ? (
          this.updateCategory()
        ) : (
          this.renderCustomizeCategory()
        )}
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: moderateScale(5),
  },
  settingsHeader: {
    flex: 0.1,
  },
  latestNewsContainer: {
    flex: 1,
  },
  headerSection: {
    flex: 0.2,
  },
  categoryList: {
    flex: 0.8,
  },
  headerTextStyle: {
    fontFamily: FontFamily.fontFamilyRegular,
    fontSize: moderateScale(20),
    textAlign: 'center',
    marginTop: verticalScale(16),
    color: Colors.black,
  },
  clearSelectedTextStyle: {
    fontFamily: FontFamily.fontFamilyRegular,
    fontSize: moderateScale(16),
    textAlign: 'center',
    marginTop: verticalScale(23),
    color: Colors.backgroundRed,
  },
  clearInvisibleSelectedTextStyle: {
    fontFamily: FontFamily.fontFamilyRegular,
    fontSize: moderateScale(16),
    textAlign: 'center',
    marginTop: verticalScale(23),
    color: Colors.white,
  },
  reduceTapableArea: {
    marginHorizontal: horizontalScale(100),
  },
  headerContainer: {
    flex: 0.8,
    flexDirection: 'row',
    backgroundColor: '#F8F7F7',
    alignItems: 'center',
    marginLeft: moderateScale(15),
    marginRight: moderateScale(15),
  },
  iconTextContainer: {
    flex: 0.8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  dismissContainer: {
    width: moderateScale(15),
    height: moderateScale(15),
    marginLeft: moderateScale(2),
  },
  dismissText: {
    textAlign: 'center',
    color: Colors.black,
    fontFamily: FontFamily.fontFamilyRegular,
  },
  customiseLabel: {
    textAlign: 'center',
    fontSize: moderateScale(14),
    color: Colors.black,
    marginLeft: moderateScale(8),
    flexWrap: 'wrap',
    flexShrink: 1,
    fontFamily: FontFamily.fontFamilyRegular,
  },
  settingsContainer: {
    flex: 0.2,
    paddingVertical: moderateScale(5),
    paddingHorizontal: moderateScale(10),
    marginRight: 8,
    backgroundColor: Colors.red,
  },
  settingsLabel: {
    textAlign: 'center',
    fontSize: moderateScale(10),
    color: Colors.white,
    fontFamily: FontFamily.fontFamilyBold,
    marginHorizontal: verticalScale(5),
  },
  bottomButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: moderateScale(44),
    marginHorizontal: 20,
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    borderRadius: 2,
  },
  buttonSelectedButton: {
    backgroundColor: Colors.black,
  },
  buttonUnselectedButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  unSelectedTextColor: {
    color: 'rgba(255,255,255,0.6)',
  },
  selectedTextColor: {
    color: Colors.white,
  },
  selectedText: {
    fontSize: moderateScale(15),
    fontFamily: FontFamily.fontFamilyBold,
    textAlign: 'center',
    alignSelf: 'center',
  },
});
const mapDispatchToProps = (dispatch: any) => ({
  onShowHeaderForYou: (show: any) => dispatch(onShowHeaderForYou(show)),
  onShowCustomizeCategory: (data: any) => dispatch(onShowCustomizeCategory(data)),
});

const mapStateToProps = (state: any) => ({
  showHeader: state.myfeed.showHeader,
  showCustomizeCategory: state.myfeed.showCustomizeCategory,
  tabIndex: state.myfeed.tabIndex,
});
export default connect(mapStateToProps, mapDispatchToProps)(MyFeed);
