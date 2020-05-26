import React from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Flurry from 'react-native-flurry-sdk';
import Colors from '../../constants/colors/colors';
import translate from '../../assets/strings/strings';
import FontFamily from '../../assets/fonts/fonts';
import CategorySelectionList from '../reusable/CategorySelectionList';
import { asynStoreKeys, setJSONItem, setItem } from '../../helpers/asyncStore';
import { horizontalScale, verticalScale, moderateScale } from '../../helpers/scale';
import { onShowCustomizeCategory } from '../../redux/actions/FoyYouAction';
import { connect } from 'react-redux';

class CategorySelection extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      toggleContinue: true,
      seletedItems: [],
      isConnected: false,
    };
  }

  componentDidMount = () => {
    Flurry.logEvent('Category Selection');
    setItem(asynStoreKeys.is_FirstTimeHomeScreen, 'category');
    NetInfo.addEventListener((state) => {
      this.setState({
        isConnected: state.isConnected,
      });
      //console.log('Inside: ' + this.state.isConnected);
    });
  };

  handleLocalStorageValues = (seletedItems) => {
    if (seletedItems.length > 0) {
      this.setState({
        toggleContinue: false,
        seletedItems: seletedItems,
      });
    } else {
      this.setState({
        toggleContinue: true,
        seletedItems: seletedItems,
      });
    }
  };

  render() {
    return (
      <SafeAreaView style={Styles.container}>
        <ScrollView>
          <View style={Styles.headerSection}>
            <Text
              style={Styles.headerTextStyle}
              accessible={true}
              accessibilityLabel={translate('category_header')}
              testID={translate('category_header')}
            >
              {translate('category_header')}
            </Text>

            <View>
              {this.state.toggleContinue ? (
                <TouchableOpacity
                  style={Styles.reduceTapableArea}
                  onPress={() => {
                    this.props.navigation.navigate('Home');
                    setItem('is_continued', '2');
                    this.props.onShowCustomizeCategory(true);
                  }}
                >
                  <Text
                    style={[Styles.skipStyle, Styles.visibleFontColor]}
                    accessible={true}
                    accessibilityLabel={translate('category_continue')}
                    testID={translate('category_continue')}
                  >
                    {translate('category_continue')}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity>
                  <Text
                    accessible={true}
                    accessibilityLabel={translate('category_continue') + 'disabled'}
                    testID={translate('category_continue') + 'disabled'}
                    style={[Styles.skipStyle, Styles.invisibleFontColor]}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={Styles.listSection}>
            <CategorySelectionList
              {...this.props}
              handleToggle={this.handleLocalStorageValues}
              updatingSelection={false}
            />
          </View>
        </ScrollView>
        {this.state.isConnected ? (
          <View>
            {this.state.seletedItems.length > 0 ? (
              <TouchableOpacity
                style={[Styles.bottomButton, Styles.buttonSelectedButton]}
                onPress={() => {
                  this.props.onShowCustomizeCategory(false);
                  this.props.navigation.navigate('Home');
                  setJSONItem(asynStoreKeys.selectedCategory, this.state.seletedItems);
                  setItem('is_continued', '2');
                }}
              >
                <Text
                  accessible={true}
                  accessibilityLabel={
                    this.state.seletedItems.length + 'categories SELECTED) GO TO APP'
                  }
                  testID={this.state.seletedItems.length + 'categories SELECTED) GO TO APP'}
                  style={Styles.selectedText}
                >
                  ({this.state.seletedItems.length} SELECTED) GO TO APP
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={[Styles.bottomButton, Styles.buttonUnselectedButton]}>
                <Text
                  accessible={true}
                  accessibilityLabel="0 categories selected"
                  testID="0 categories selected"
                  style={Styles.selectedText}
                >
                  (0 SELECTED)
                </Text>
              </View>
            )}
          </View>
        ) : null}
      </SafeAreaView>
    );
  }
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTextStyle: {
    fontFamily: FontFamily.fontFamilyRegular,
    fontSize: moderateScale(20),
    textAlign: 'center',
    marginTop: verticalScale(50),
    color: Colors.black,
  },
  headerSection: {
    flex: 0.2,
  },
  listSection: {
    flex: 0.8,
  },
  skipStyle: {
    marginTop: verticalScale(12),
    fontSize: moderateScale(18),
    fontFamily: FontFamily.fontFamilyRegular,
    textAlign: 'center',
    marginLeft: horizontalScale(18),
    marginRight: horizontalScale(14),
  },
  reduceTapableArea: {
    marginHorizontal: horizontalScale(100),
  },
  visibleFontColor: {
    color: Colors.semiLightGrey,
  },
  invisibleFontColor: {
    color: Colors.white,
  },
  bottomButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: moderateScale(44),
    marginHorizontal: horizontalScale(17),
    position: 'absolute',
    bottom: verticalScale(40),
    left: 0,
    right: 0,
    borderRadius: 2,
  },
  buttonSelectedButton: {
    backgroundColor: Colors.black,
  },
  buttonUnselectedButton: {
    backgroundColor: Colors.greyInactive,
  },
  selectedText: {
    fontSize: moderateScale(15),
    fontFamily: FontFamily.fontFamilyBold,
    textAlign: 'center',
    color: Colors.white,
    alignSelf: 'center',
  },
});

const matchDispatchToProps = (dispatch: any) => ({
  onShowCustomizeCategory: (data: any) => dispatch(onShowCustomizeCategory(data)),
});

export default connect(null, matchDispatchToProps)(CategorySelection);
