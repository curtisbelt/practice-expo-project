import React from 'react';
import { View, Text, StyleSheet, FlatList, Platform } from 'react-native';
import Colors from '../../constants/colors/colors';
import { moderateScale, verticalScale, horizontalScale } from '../../helpers/scale';
import FontFamily from '../../assets/fonts/fonts';
import translate from '../../assets/strings/strings';
import ClickView from '../widgets/clickView';
import CustomImage from '../widgets/CustomImage';
import { parentEnabled, childEnabled, useStaticLable } from '../../../appConfig';
import automationStaticLables from '../../constants/automationStaticLables';
import { changeCategoryIndex, setSubCategoryIndex } from '../../redux/actions/HomeAction';
import { connect } from 'react-redux';

class LatestVideos extends React.Component {
  _handleViewAll = () => {
    this.props.navigation.navigate('LatestVideo');
  };

  renderItem = ({ item }) => {
    const url = item && item.image && item.image.crops && item.image.crops[3].url;
    const photonUrl = url === undefined ? '' : url + `&w=${Math.round(horizontalScale(400))}`;
    return (
      <ClickView
        accessible={parentEnabled}
        style={styles.subContainer}
        onPress={() => {
          this.props.navigation.navigate('VideoDetail', {
            articleID: item.id,
            articleItem: item,
            articleLink: item.link,
          });
        }}
      >
        <View style={styles.imageView}>
          {Object.entries(item.image).length !== 0 ? (
            <CustomImage
              accessible={childEnabled}
              accessibilityRole={'image'}
              accessibilityLabel={
                useStaticLable ? automationStaticLables.latestVideosImage : item.image.alt
              }
              testID={useStaticLable ? automationStaticLables.latestVideosImage : item.image.alt}
              url={photonUrl ? photonUrl : null}
              style={styles.image}
            />
          ) : null}
        </View>

        {item['post-title'] && item['post-title'] !== '' ? (
          <View style={styles.titleView}>
            <Text
              accessible={childEnabled}
              accessibilityLabel={
                useStaticLable ? automationStaticLables.latestVideosPostTitle : item['post-title']
              }
              testID={
                useStaticLable ? automationStaticLables.latestVideosPostTitle : item['post-title']
              }
              numberOfLines={3}
              style={styles.title}
            >
              {item['post-title']}
            </Text>
          </View>
        ) : null}

        {item.category && item.category !== '' ? (
          <View style={styles.categoryView}>
            <Text
              accessible={childEnabled}
              accessibilityLabel={
                useStaticLable ? automationStaticLables.latestVideosCategory : item.category
              }
              testID={useStaticLable ? automationStaticLables.latestVideosCategory : item.category}
              style={styles.category}
            >
              {item.category}
            </Text>
          </View>
        ) : null}
      </ClickView>
    );
  };

  renderHeader = () => {
    return (
      <View style={styles.headerView}>
        <View accessible={parentEnabled} style={styles.headerTextView}>
          <Text
            accessible={childEnabled}
            accessibilityLabel="latest videos"
            testID="latest videos"
            style={styles.headerText}
          >
            {translate('latest_videos')}
          </Text>
        </View>
        <View style={styles.viewAllView}>
          <ClickView accessible={parentEnabled} onPress={() => this._handleViewAll()}>
            <Text
              accessible={childEnabled}
              accessibilityLabel="view all"
              testID="view all"
              style={styles.viewAll}
            >
              {translate('view_all')}
            </Text>
          </ClickView>
        </View>
      </View>
    );
  };

  render() {
    const { LatestVideosData }: any = this.props;
    return (
      <View style={styles.container}>
        {this.renderHeader()}

        {/* latest videos display */}
        {LatestVideosData.items && LatestVideosData.items.length > 0 ? (
          <View style={styles.flatListView}>
            <FlatList
              data={LatestVideosData.items}
              keyExtractor={(x, i) => i.toString()}
              renderItem={this.renderItem}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    height: Platform.OS === 'ios' ? moderateScale(250) : moderateScale(275),
    width: horizontalScale(377),
  },
  subContainer: {
    width: moderateScale(140),
    backgroundColor: 'white',
    marginLeft: moderateScale(9),
    borderColor: '#d3d3d3',
    borderWidth: 0.2,
  },
  flatListView: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? moderateScale(57) : moderateScale(70),
    shadowColor: Colors.black,
    shadowOpacity: 0.2,
    shadowOffset: { height: 1, width: 0 },
    elevation: 1,
  },
  category: {
    fontSize: moderateScale(12),
    fontFamily: FontFamily.fontFamilyRegular,
    textAlign: 'left',
    color: Colors.darkGrey,
  },
  imageView: {
    width: moderateScale(124),
    height: verticalScale(94),
    paddingTop: moderateScale(8),
    paddingHorizontal: moderateScale(8),
  },
  image: {
    width: moderateScale(124),
    height: verticalScale(94),
    resizeMode: 'cover',
  },
  title: {
    fontSize: moderateScale(14),
    fontFamily: FontFamily.fontFamilyBold,
    textAlign: 'left',
    color: Colors.black,
    width: moderateScale(124),
  },
  headerView: {
    flexDirection: 'row',
    backgroundColor: Colors.black,
    height: moderateScale(101),
    width: horizontalScale(377),
  },
  headerTextView: {
    marginLeft: moderateScale(11),
    paddingTop: moderateScale(10),
    flex: 1,
    alignSelf: 'flex-start',
  },
  headerText: {
    fontSize: moderateScale(32),
    fontFamily:
      Platform.OS === 'ios'
        ? FontFamily.publicoBannerMediumIos
        : FontFamily.publicoBannerMediumAndroid,
    color: Colors.white,
  },
  viewAllView: {
    marginRight: moderateScale(11),
    paddingTop: Platform.OS === 'ios' ? moderateScale(20) : moderateScale(35),
  },
  viewAll: {
    fontSize: moderateScale(10),
    color: Colors.torchRed,
    fontWeight: '500',
    fontFamily: FontFamily.fontFamilyMedium,
  },
  categoryView: {
    paddingHorizontal: moderateScale(8),
    paddingTop: moderateScale(5),
    marginBottom: moderateScale(10),
  },
  titleView: {
    marginTop: moderateScale(15),
    paddingRight: moderateScale(5),
    paddingHorizontal: moderateScale(8),
  },
  indexView: {
    position: 'absolute',
    bottom: 0,
    height: moderateScale(21),
    width: moderateScale(21),
    backgroundColor: Colors.backgroundRed,
  },
  indexText: {
    fontSize: moderateScale(13),
    textAlign: 'center',
    paddingTop: moderateScale(5),
    color: Colors.white,
    fontFamily:
      Platform.OS === 'ios'
        ? FontFamily.publicoBannerMediumIos
        : FontFamily.publicoBannerMediumAndroid,
  },
});

const mapDispatchToProps = (dispatch: any) => ({
  setCategoryIndex: (index: any) => dispatch(changeCategoryIndex(index)),
  setSubCategoryIndex: (index: any) => dispatch(setSubCategoryIndex(index)),
});

const mapStateToProps = (state: any) => ({
  menu_sections: state.home.menu_sections,
});

export default connect(mapStateToProps, mapDispatchToProps)(LatestVideos);
