import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import SubSection from './SubSection';
import { connect } from 'react-redux';
import { moderateScale, horizontalScale } from '../../helpers/scale';
import { changeCategoryIndex, setSubCategoryIndex } from '../../redux/actions/HomeAction';
import Colors from '../../constants/colors/colors';
import FontFamily from '../../assets/fonts/fonts';
import AllList from './All/AllList';
import LatestNewsScreen from './LatestNewsScreen';
import Hero from '../../components/ArticleSections/Hero';
import LatestNews from '../../components/ArticleSections/LatestNews';
import apiService from '../../service/fetchContentService/FetchContentService';
import { ApiMethods } from '../../service/config/serviceConstants';
import { parentEnabled, childEnabled, useStaticLable } from '../../../appConfig';
import automationStaticLables from '../../constants/automationStaticLables';
import EmptyComponent from '../../components/widgets/EmptyComponent';
import translate from '../../assets/strings/strings';
import NetInfo from '@react-native-community/netinfo';

class Section extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      menu_data: props.menu_sections,
      isConnected: true,
    };

    NetInfo.fetch().then((state) => {
      this.setState({ isConnected: state.isConnected });
    });
  }

  getSnapshotBeforeUpdate(oldProps: any, _oldState: any) {
    if (oldProps.category_index !== this.props.category_index) {
      return true;
    } else {
      return false;
    }
  }

  componentDidUpdate(oldProps: any, oldState: any, snapShot: any) {
    if (snapShot) {
      this.scrollToIndex(this.props.category_index);
    }
  }

  renderItem = ({ item, index }: any) => {
    const { category_index }: any = this.props;
    return (
      <View style={styles.item} accessible={parentEnabled}>
        <Text
          accessible={childEnabled}
          accessibilityLabel={useStaticLable ? automationStaticLables.sectionsTitle : item.title}
          testID={useStaticLable ? automationStaticLables.sectionsTitle : item.title}
          style={[styles.label, category_index === index ? styles.active_label : null]}
          onPress={() => this._handleItemPress(item, index)}
        >
          {item.title}
        </Text>

        {category_index === index ? <View style={styles.active_border} /> : null}
      </View>
    );
  };

  scrollToIndex = (index: any) => {
    this.flatListRef.scrollToIndex({
      animated: true,
      index: index,
      viewOffset: horizontalScale(100),
    });
  };

  _handleItemPress = (item: any, index: Number) => {
    this.scrollToIndex(index);
    this.props.changeCategoryIndex(index);
    this.props.setSubCategoryIndex(0);

    this.handleApiCall(item);
  };

  handleApiCall = (item: any) => {
    if (this.state.isConnected && item.link.length > 2 && item.children.length === 0) {
      apiService(item.link, ApiMethods.GET, this.onSectionSuccess, this.onSectionFailure);
    }
  };

  onSectionSuccess = (response: any) => {
    if (response && response.data) {
      this.setState({ section_data: response.data, loading: false });
    }
  };

  onSectionFailure = (_error: any) => {
    this.setState({ loading: false });
  };

  renderSectionView = (data: any, category_index: any) => {
    const item = data[category_index];

    if (this.state.isConnected) {
      return (
        <View style={styles.subContainer}>
          {item.children && item.children.length > 0 ? (
            // eslint-disable-next-line react/no-children-prop
            <SubSection children={item.children} />
          ) : null}

          {item.children && item.children.length === 0 ? (
            item.title === 'All' ? (
              <AllList {...this.props} />
            ) : (
              <LatestNewsScreen {...this.props} />
            )
          ) : (
            <View accessible={parentEnabled}>
              {/* Rendering hero data */}
              {item.hero && item.hero !== null && item.hero.items && item.hero.items.length > 0 ? (
                <Hero HeroData={item.hero} {...this.props} />
              ) : null}
              {/* Rendering river data */}
              {item.river &&
              item.river !== null &&
              item.river.items &&
              item.river.items.length > 0 ? (
                <LatestNews LatestNewsData={item.river} {...this.props} />
              ) : null}
            </View>
          )}
        </View>
      );
    } else {
      return (
        <View accessible={parentEnabled} style={styles.subContainer}>
          {item.children && item.children.length > 0 ? (
            // eslint-disable-next-line react/no-children-prop
            <SubSection children={item.children} />
          ) : null}

          <EmptyComponent
            style={styles.noContentContainer}
            onPress={() => this.handleApiCall(item)}
            errorText={translate('try_again')}
          />
        </View>
      );
    }
  };

  render() {
    const { menu_data }: any = this.state;
    const { category_index }: any = this.props;
    return (
      <View style={styles.container}>
        {menu_data && menu_data && menu_data.length > 0 ? (
          <View style={styles.flatListView}>
            <FlatList
              data={menu_data}
              ref={(ref) => (this.flatListRef = ref)}
              renderItem={this.renderItem}
              keyExtractor={(item) => item.title}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        ) : null}

        {/* Display page */}
        {this.renderSectionView(menu_data, category_index)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListView: {
    height: moderateScale(44),
  },
  item: {
    paddingTop: moderateScale(5),
    marginRight: moderateScale(15),
    marginLeft: moderateScale(6),
    height: moderateScale(44),
    alignItems: 'center',
  },
  active_border: {
    width: moderateScale(30),
    backgroundColor: Colors.red,
    height: moderateScale(4),
  },
  label: {
    marginHorizontal: 0,
    fontSize: moderateScale(17),
    lineHeight: moderateScale(32),
    letterSpacing: moderateScale(1.32),
    fontFamily: FontFamily.fontFamilyBold,
    textTransform: 'uppercase',
    color: Colors.darkGrey,
  },
  active_label: {
    color: Colors.black,
  },
  noContentContainer: {
    marginTop: 0,
    flex: 1,
    justifyContent: 'center',
  },
});

const mapDispatchToProps = (dispatch: any) => ({
  changeCategoryIndex: (index: any) => dispatch(changeCategoryIndex(index)),
  setSubCategoryIndex: (index: any) => dispatch(setSubCategoryIndex(index)),
});

const mapStateToProps = (state: any) => ({
  category_index: state.home.category_index,
  menu_sections: state.home.menu_sections,
});

export default connect(mapStateToProps, mapDispatchToProps)(Section);
