import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Image,
  Platform,
  SafeAreaView,
  FlatList,
} from 'react-native';
import CustomBackgroundImage from '../../components/widgets/CustomBackgroundImage';

import LinearGradient from 'react-native-linear-gradient';
import FontFamily from '../../assets/fonts/fonts';
import Colors from '../../constants/colors/colors';
import { Images } from '../../assets';
import { verticalScale, moderateScale, horizontalScale } from '../../helpers/scale';
import { ApiMethods, ApiPaths, ApiUrls } from '../../service/config/serviceConstants';
import EmptyComponent from '../../components/widgets/EmptyComponent';
import { asynStoreKeys, getJSONItem } from '../../helpers/asyncStore';
import apiService from '../../service/fetchContentService/FetchContentService';
import ActivityIndicatorView from '../../components/widgets/ActivityIndicator';
import translate from '../../assets/strings/strings';

class CategorySelectionList extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      seletedItems: [],
      dataSource: [],
      loading: true,
      isNetworkIssue: false,
      updatingSelection: this.props.updatingSelection,
    };
  }

  clearSelection = () => {
    let { dataSource } = this.state;
    dataSource.map(function (value) {
      value.isSelected = false;
    });
    this.setState({
      dataSource: dataSource,
      seletedItems: [],
    });
    this.props.handleToggle(0);
  };

  componentDidMount = async () => {
    await this.fetchCategories();
  };

  fetchCategories = async () => {
    await apiService(
      ApiUrls.PROD_BASE_URL + ApiPaths.PERSONALIZATION,
      ApiMethods.GET,
      this.onSuccess,
      this.onFailure,
    );
  };

  onSuccess = async (response: any) => {
    // Adding local key isSelected to manage the selection
    let { dataSource, updatingSelection } = this.state;
    dataSource = response.data.items;
    Object.keys(dataSource).map(function (value) {
      dataSource[value].isSelected = false;
    });
    // updatingSelection is when user try to update categories from Settings screen
    if (updatingSelection) {
      //Using seletedItems array fom state for handling enable/disable od clear text and item selection count.
      let { seletedItems } = this.state;
      //Fetching preSelected Categories from local Storage
      let selectedCategory = JSON.parse(await getJSONItem(asynStoreKeys.selectedCategory));

      //Comparing response array with local storage array and making isSelected key as true
      for (let i = 0; i < response.data.items.length; i++) {
        for (let j = 0; j < selectedCategory.length; j++) {
          if (response.data.items[i].id === selectedCategory[j].id) {
            response.data.items[i].isSelected = true;
            seletedItems.push(response.data.items[i]);
          }
        }
      }
      //Using handleToggle props we can manage enable/disable od clear text and item selection count.
      this.props.handleToggle(this.state.seletedItems);
      this.setState({
        loading: false,
        isNetworkIssue: false,
        dataSource: response.data.items,
      });
    } else {
      this.setState({
        loading: false,
        isNetworkIssue: false,
        dataSource: response.data.items,
      });
    }
  };

  onFailure = (error: any) => {
    if (error === translate('no_internet')) {
      this.setState({
        isNetworkIssue: true,
        loading: false,
      });
    } else {
      // console.log('Error is: ' + error);
    }
  };

  _updateSelection = (index, value, item) => {
    let items = this.state.dataSource;
    items[index].isSelected = value;
    let { seletedItems } = this.state;
    if (items[index].isSelected === true) {
      seletedItems.push(item);
    } else {
      seletedItems.splice(seletedItems.indexOf(item), 1);
    }

    this.setState({ dataSource: items });
    this.setState({ seletedItems: seletedItems });
    this.props.handleToggle(this.state.seletedItems);
  };

  _renderItems = ({ item, index }) => {
    const url = item && item.image;
    const photonUrl =
      url === undefined
        ? ''
        : url + `?resize=${Math.round(moderateScale(170))},${Math.round(moderateScale(250))}`;

    return (
      <View style={{ flex: 0.5 }}>
        <TouchableOpacity
          style={Styles.itemContainer}
          accessible={true}
          onPress={() => {
            this._updateSelection(index, !item.isSelected, item);
          }}
        >
          {item.isSelected ? (
            <CustomBackgroundImage
              source={{
                uri: photonUrl,
              }}
              style={Styles.backgroundImage}
            >
              <LinearGradient
                colors={['rgba(228,0,0,0.17)', 'rgba(209,20,20,0.5)']}
                locations={[0, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={Styles.bg_overlay}
              />
              <View style={Styles.itemInnerWhiteSpace} />
              <View style={[Styles.selectedIconBackground, Styles.selectedBackground]}>
                <Image
                  accessible={true}
                  accessibilityRole={'image'}
                  accessibilityLabel={item.category}
                  testID={item.category}
                  style={Styles.iconStyle}
                  source={Images.categorySelected}
                  onError={(_e) => {}}
                  resizeMode={'contain'}
                />
              </View>
              <Text
                accessible={true}
                accessibilityLabel={item.category}
                testID={item.category}
                style={Styles.categoryText}
              >
                {item.name}
              </Text>
            </CustomBackgroundImage>
          ) : (
            <CustomBackgroundImage
              source={{
                uri: photonUrl,
              }}
              style={Styles.backgroundImage}
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.17)', 'rgba(0,0,0,0.5)']}
                locations={[0, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={Styles.bg_overlay}
              />
              <View style={Styles.itemInnerWhiteSpace} />
              <View style={[Styles.selectedIconBackground, Styles.unSelectedBackground]}>
                <Image
                  style={Styles.iconStyle}
                  source={Images.categoryUnselected}
                  resizeMode={'contain'}
                />
              </View>
              <Text
                accessible={true}
                accessibilityLabel={item.category}
                testID={item.category}
                style={Styles.categoryText}
              >
                {item.name}
              </Text>
            </CustomBackgroundImage>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    if (this.state.loading) {
      return <ActivityIndicatorView />;
    } else if (this.state.isNetworkIssue) {
      return (
        <EmptyComponent
          onPress={() => this.fetchCategories()}
          errorText={translate('internet_connection')}
        />
      );
    } else {
      return (
        <SafeAreaView style={Styles.container}>
          <FlatList
            data={this.state.dataSource}
            extraData={this.state.selected}
            renderItem={this._renderItems}
            keyExtractor={(key) => key.id}
            contentContainerStyle={Styles.FlatListBottomSpace}
            numColumns={2}
            scrollEnabled={false}
          />
        </SafeAreaView>
      );
    }
  }
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: verticalScale(12),
    marginHorizontal: horizontalScale(15),
    backgroundColor: Colors.white,
  },
  itemContainer: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backgroundImage: {
    height: moderateScale(250),
    margin: moderateScale(3),
    width: moderateScale(164),
  },
  itemInnerWhiteSpace: {
    flex: 0.8,
  },
  selectedIconBackground: {
    alignSelf: 'center',
    justifyContent: 'center',
    height: verticalScale(25),
    width: verticalScale(25),
    borderRadius: 20,
  },
  selectedBackground: {
    backgroundColor: Colors.lightRed,
  },
  unSelectedBackground: {
    backgroundColor: Colors.black,
  },
  iconStyle: {
    width: verticalScale(15),
    height: verticalScale(15),
    tintColor: Colors.white,
    alignSelf: 'center',
  },
  categoryText: {
    flex: 0.2,
    textAlign: 'center',
    color: Colors.white,
    fontFamily: FontFamily.fontFamilyBold,
    fontSize: moderateScale(23),
    marginTop: moderateScale(8),
  },
  bg_overlay: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  FlatListBottomSpace: {
    paddingBottom: Platform.OS === 'ios' ? verticalScale(50) : verticalScale(90),
  },
});

export default CategorySelectionList;
