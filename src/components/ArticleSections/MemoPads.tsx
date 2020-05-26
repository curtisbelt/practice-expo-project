import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { horizontalScale, verticalScale, moderateScale } from '../../helpers/scale';
import Colors from '../../constants/colors/colors';
import translate from '../../assets/strings/strings';
import FontFamily from '../../assets/fonts/fonts';
import ClickView from '../widgets/clickView';
import CustomImage from '../widgets/CustomImage';
import { parentEnabled, childEnabled, useStaticLable } from '../../../appConfig';
import automationStaticLables from '../../constants/automationStaticLables';
import { changeCategoryIndex, setSubCategoryIndex } from '../../redux/actions/HomeAction';

import { getSubCategoryIndex } from '../../helpers/getCategoryIndex';
import { connect } from 'react-redux';

class MemoPads extends React.Component {
  _handleViewAll = (title) => {
    const index = getSubCategoryIndex(this.props.menu_sections, title);
    this.props.setCategoryIndex(index.section_index);
    this.props.setSubCategoryIndex(index.sub_section_index);
  };

  renderItem = ({ item }) => {
    if (item && Object.entries(item).length > 0) {
      const url = item && item.image && item.image.crops && item.image.crops[3].url;
      const photonUrl = url === undefined ? '' : url + `&w=${Math.round(horizontalScale(300))}`;
      const postType = item && item['post-type'];
      return (
        <ClickView
          accessible={parentEnabled}
          style={styles.subContainer}
          onPress={() => {
            if (postType === 'pmc-gallery') {
              this.props.navigation.navigate('GalleryImages', {
                galleryID: item.id,
                postType: postType,
              });
            } else if (postType === 'wwd_top_video') {
              this.props.navigation.navigate('VideoDetail', {
                articleID: item.id,
                articleItem: item,
                articleLink: item.link,
              });
            } else {
              this.props.navigation.navigate('ArticleDetail', {
                articleID: item.id,
                articleItem: item,
              });
            }
          }}
        >
          <View style={styles.imageView}>
            {Object.entries(item.image).length !== 0 ? (
              <CustomImage
                accessible={childEnabled}
                accessibilityRole={'image'}
                accessibilityLabel={
                  useStaticLable ? automationStaticLables.memoPadsImage : item.image.alt
                }
                testID={useStaticLable ? automationStaticLables.memoPadsImage : item.image.alt}
                url={photonUrl ? photonUrl : null}
                style={styles.image}
              />
            ) : null}
          </View>
          <View style={styles.textView}>
            {item['post-title'] ? (
              <View style={styles.titleTextView}>
                <Text
                  accessible={childEnabled}
                  accessibilityLabel={
                    useStaticLable ? automationStaticLables.memoPadsPostTitle : item['post-title']
                  }
                  testID={
                    useStaticLable ? automationStaticLables.memoPadsPostTitle : item['post-title']
                  }
                  numberOfLines={3}
                  style={styles.titleText}
                >
                  {item['post-title']}
                </Text>
              </View>
            ) : null}

            {item['body-preview'] ? (
              <View style={styles.subTextView}>
                <Text
                  accessible={childEnabled}
                  accessibilityLabel={
                    useStaticLable
                      ? automationStaticLables.memoPadsBodyPreview
                      : item['body-preview']
                  }
                  testID={
                    useStaticLable
                      ? automationStaticLables.memoPadsBodyPreview
                      : item['body-preview']
                  }
                  numberOfLines={3}
                  style={styles.subText}
                >
                  {item['body-preview']}
                </Text>
              </View>
            ) : null}
          </View>
        </ClickView>
      );
    }
  };

  renderHeader = () => {
    return (
      <View accessible={parentEnabled}>
        <View style={styles.headerView}>
          <View style={styles.headerTitle}>
            <View style={styles.bulletView}>
              <View style={styles.bullet} />
            </View>
            <Text
              accessible={childEnabled}
              accessibilityLabel="memo pad"
              testID="memo pad"
              style={styles.headerText}
            >
              {translate('memo_pad')}
            </Text>
          </View>
          <View style={styles.viewAllView}>
            <ClickView onPress={() => this._handleViewAll('Media')}>
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
        <View style={styles.thickBorder} />
      </View>
    );
  };

  renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  render() {
    const { MemoPadsData } = this.props;
    return (
      <View style={styles.container}>
        {MemoPadsData.items && MemoPadsData.items.length > 0 ? (
          <FlatList
            data={MemoPadsData.items}
            renderItem={this.renderItem}
            keyExtractor={(x, i) => i.toString()}
            ListHeaderComponent={this.renderHeader}
            ItemSeparatorComponent={this.renderSeparator}
            style={{}}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  subContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: horizontalScale(355),
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitle: {
    flexDirection: 'row',
  },
  bulletView: {
    justifyContent: 'center',
  },
  bullet: {
    height: moderateScale(12),
    width: moderateScale(12),
    borderRadius: moderateScale(6),
    backgroundColor: Colors.backgroundRed,
  },
  headerText: {
    fontSize: moderateScale(27),
    fontWeight: 'bold',
    marginLeft: 14,
    color: Colors.black,
    fontFamily: FontFamily.fontFamilyBold,
  },
  viewAllView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  viewAll: {
    fontSize: moderateScale(10),
    fontFamily: FontFamily.fontFamilyMedium,
    color: Colors.red,
  },
  image: {
    height: verticalScale(111),
    width: moderateScale(111),
  },
  separator: {
    height: moderateScale(1),
    width: horizontalScale(353),
    alignSelf: 'center',
    backgroundColor: Colors.grey,
    marginVertical: moderateScale(15),
  },
  thickBorder: {
    width: horizontalScale(355),
    height: moderateScale(8),
    backgroundColor: Colors.black,
    marginBottom: moderateScale(15),
  },
  textView: {
    flexDirection: 'column',
    width: horizontalScale(233),
    marginLeft: moderateScale(10),
  },
  titleTextView: {},
  subTextView: {
    marginTop: moderateScale(5),
  },
  subText: {
    fontSize: moderateScale(12),
    fontWeight: 'normal',
    color: Colors.textGrey,
    fontFamily: FontFamily.fontFamilyRegular,
  },
  titleText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: Colors.black,
    fontFamily: FontFamily.fontFamilyBold,
    paddingTop: 10,
  },
  imageView: {
    height: verticalScale(111),
    width: moderateScale(111),
    backgroundColor: Colors.greyLight,
  },
});

const mapDispatchToProps = (dispatch: any) => ({
  setCategoryIndex: (index: any) => dispatch(changeCategoryIndex(index)),
  setSubCategoryIndex: (index: any) => dispatch(setSubCategoryIndex(index)),
});

const mapStateToProps = (state: any) => ({
  menu_sections: state.home.menu_sections,
});

export default connect(mapStateToProps, mapDispatchToProps)(MemoPads);
