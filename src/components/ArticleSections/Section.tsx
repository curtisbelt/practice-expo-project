import React from 'react';
import { View, FlatList, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import Colors from '../../constants/colors/colors';
import FontFamily from '../../assets/fonts/fonts';
import { verticalScale, moderateScale, horizontalScale } from '../../helpers/scale';
import translate from '../../assets/strings/strings';
import { getFormattedDateTime } from './../../helpers/dateTimeFormats';
import CustomImage from '../widgets/CustomImage';
import { parentEnabled, childEnabled, useStaticLable } from '../../../appConfig';
import automationStaticLables from '../../constants/automationStaticLables';
import ClickView from '../widgets/clickView';
import { connect } from 'react-redux';
const { width } = Dimensions.get('window');
import { changeCategoryIndex, setSubCategoryIndex } from '../../redux/actions/HomeAction';
import { getCategoryIndex } from '../../helpers/getCategoryIndex';

class Section extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: Colors.black,
    };
  }

  componentDidMount = () => {
    const { SectionData } = this.props;
    if (SectionData.title === 'Fashion') {
      this.setState({ color: Colors.purple });
    } else if (SectionData.title === 'Business') {
      this.setState({ color: Colors.fernGreen });
    } else if (SectionData.title === 'Beauty') {
      this.setState({ color: Colors.backgroundRed });
    } else if (SectionData.title === "Men's") {
      this.setState({ color: Colors.paleSkyGrey });
    } else if (SectionData.title === 'Accessories') {
      this.setState({ color: Colors.carrotOrange });
    } else if (SectionData.title === 'Eye') {
      this.setState({ color: Colors.deepSkyBlue });
    }
  };

  _handleViewAll = (title) => {
    const index = getCategoryIndex(this.props.menu_sections, title);
    this.props.setCategoryIndex(index);
    this.props.setSubCategoryIndex(0);
  };

  renderHeader = () => {
    const { SectionData } = this.props;
    return (
      <View accessible={parentEnabled} style={styles.headerContainer}>
        <View style={styles.broadSeparator} />
        <View accessible={parentEnabled} style={styles.headerView}>
          <View accessible={parentEnabled}>
            <Text
              accessible={childEnabled}
              accessibilityLabel={SectionData.title}
              testID={SectionData.title}
              style={[styles.headerTitle, { color: this.state.color }]}
            >
              {SectionData.title}
            </Text>
          </View>
          <View accessible={parentEnabled} style={styles.viewAllView}>
            <ClickView onPress={() => this._handleViewAll(SectionData.title)}>
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
      </View>
    );
  };

  renderItems = ({ item, index }) => {
    if (index !== 0 && Object.entries(item).length > 0) {
      const publishedDate = getFormattedDateTime(item['published-at']);
      const url = item && item.image && item.image.crops && item.image.crops[3].url;
      const photonUrl = url === undefined ? '' : url + `&w=${Math.round(horizontalScale(172))}`;
      const postType = item && item['post-type'];
      return (
        <ClickView
          style={styles.subContainer}
          accessible={parentEnabled}
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
          {Object.entries(item.image).length >= 0 ? (
            <View style={styles.gridImageView}>
              <CustomImage
                accessible={childEnabled}
                accessibilityRole={'image'}
                accessibilityLabel={
                  useStaticLable ? automationStaticLables.sectionImage : item.image.alt
                }
                testID={useStaticLable ? automationStaticLables.sectionImage : item.image.alt}
                url={photonUrl ? photonUrl : null}
                style={styles.gridImage}
              />
            </View>
          ) : null}
          {item['post-title'] && item['post-title'] !== '' ? (
            <View style={styles.gridTitle}>
              <Text
                accessible={childEnabled}
                accessibilityLabel={
                  useStaticLable ? automationStaticLables.sectionPostTitle : item['post-title']
                }
                testID={
                  useStaticLable ? automationStaticLables.sectionPostTitle : item['post-title']
                }
                numberOfLines={3}
                style={styles.gridTitleText}
              >
                {item['post-title']}
              </Text>
            </View>
          ) : null}
          {publishedDate ? (
            <View>
              <Text
                accessible={childEnabled}
                accessibilityLabel={
                  useStaticLable ? automationStaticLables.sectionPublished : publishedDate
                }
                testID={useStaticLable ? automationStaticLables.sectionPublished : publishedDate}
                style={styles.time}
              >
                {publishedDate}
              </Text>
            </View>
          ) : null}
        </ClickView>
      );
    }
  };

  render() {
    const { SectionData } = this.props;
    let items = SectionData.items.length >= 1 ? SectionData.items[0] : {};
    const publishedDate = items ? getFormattedDateTime(items['published-at']) : '';
    const url = items && items.image && items.image.crops && items.image.crops[3].url;
    const photonUrl = url === undefined ? '' : url + `&w=${Math.round(horizontalScale(355))}`;
    const postType = items && items['post-type'];
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {SectionData.items.length > 0 ? (
          <ClickView
            accessible={parentEnabled}
            onPress={() => {
              if (postType === 'pmc-gallery') {
                this.props.navigation.navigate('GalleryImages', {
                  galleryID: items.id,
                  postType: postType,
                });
              } else if (postType === 'wwd_top_video') {
                this.props.navigation.navigate('VideoDetail', {
                  articleID: items.id,
                  articleItem: items,
                  articleLink: items.link,
                });
              } else {
                this.props.navigation.navigate('ArticleDetail', {
                  articleID: items.id,
                  articleItem: items,
                });
              }
            }}
          >
            {Object.entries(items.image).length > 0 ? (
              <View style={styles.bigImageContainer}>
                <CustomImage
                  accessible={childEnabled}
                  accessibilityRole={'image'}
                  accessibilityLabel={
                    useStaticLable ? automationStaticLables.sectionImage : items.image.alt
                  }
                  testID={useStaticLable ? automationStaticLables.sectionImage : items.image.alt}
                  url={photonUrl ? photonUrl : null}
                  style={styles.bigImage}
                />
              </View>
            ) : null}
            {items['post-title'] !== null && items['post-title'] !== '' ? (
              <View style={styles.titleTextView}>
                <Text
                  accessible={childEnabled}
                  accessibilityLabel={
                    useStaticLable ? automationStaticLables.sectionPostTitle : items['post-title']
                  }
                  testID={
                    useStaticLable ? automationStaticLables.sectionPostTitle : items['post-title']
                  }
                  numberOfLines={3}
                  style={styles.titleText}
                >
                  {items['post-title']}
                </Text>
              </View>
            ) : null}
            {publishedDate ? (
              <View style={styles.timeView}>
                <Text
                  accessible={childEnabled}
                  accessibilityLabel={
                    useStaticLable ? automationStaticLables.sectionPublished : publishedDate
                  }
                  testID={useStaticLable ? automationStaticLables.sectionPublished : publishedDate}
                  style={styles.time}
                >
                  {publishedDate}
                </Text>
              </View>
            ) : null}
          </ClickView>
        ) : null}
        {SectionData.items.length > 1 ? (
          SectionData.items[1] !== null ? (
            <View style={styles.FlatListView}>
              <FlatList
                data={SectionData.items}
                renderItem={this.renderItems}
                keyExtractor={(x, i) => i.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          ) : null
        ) : null}
        <View style={styles.separator} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: horizontalScale(10),
  },
  broadSeparator: {
    width: horizontalScale(355),
    height: moderateScale(8),
    backgroundColor: Colors.black,
    marginBottom: moderateScale(15),
  },
  headerView: {
    flexDirection: 'row',
  },
  headerTitle: {
    fontSize: moderateScale(43),
    fontFamily:
      Platform.OS === 'ios'
        ? FontFamily.publicoBannerMediumIos
        : FontFamily.publicoBannerMediumAndroid,
  },
  viewAllView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  viewAll: {
    fontSize: moderateScale(10),
    fontFamily: FontFamily.fontFamilyMedium,
    color: Colors.viewAllGrey,
  },
  bigImageContainer: {
    height: moderateScale(232),
    width: horizontalScale(355),
    alignSelf: 'center',
    backgroundColor: Colors.whisperGrey,
  },
  bigImage: {
    height: moderateScale(232),
    width: horizontalScale(355),
    resizeMode: 'contain',
  },
  titleTextView: {
    paddingHorizontal: moderateScale(10),
    marginTop: verticalScale(20),
  },
  titleText: {
    fontSize: moderateScale(27),
    fontWeight: 'bold',
    fontFamily: FontFamily.fontFamilyBold,
    width: horizontalScale(355),
    lineHeight: moderateScale(29),
    color: Colors.black,
  },
  timeView: {
    paddingHorizontal: moderateScale(10),
  },
  time: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(16),
    textAlign: 'left',
    color: Colors.dimGrey,
  },
  FlatListView: {
    marginTop: moderateScale(11),
    height: moderateScale(205),
  },
  subContainer: {
    marginLeft: moderateScale(10),
    width: width / 2 - moderateScale(15),
  },
  gridImage: {
    height: moderateScale(129),
    width: '100%',
    resizeMode: 'cover',
  },
  gridImageView: {
    height: moderateScale(129),
    width: '100%',
  },
  gridTitle: {
    marginTop: verticalScale(5),
  },
  gridTitleText: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(16),
    color: Colors.black,
    fontFamily: FontFamily.fontFamilyMedium,
    fontWeight: '500',
  },
  separator: {
    width: horizontalScale(350),
    height: verticalScale(1),
    backgroundColor: Colors.black,
    alignSelf: 'center',
  },
});

const mapDispatchToProps = (dispatch: any) => ({
  setCategoryIndex: (index: any) => dispatch(changeCategoryIndex(index)),
  setSubCategoryIndex: (index: any) => dispatch(setSubCategoryIndex(index)),
});

const mapStateToProps = (state: any) => ({
  menu_sections: state.home.menu_sections,
});

export default connect(mapStateToProps, mapDispatchToProps)(Section);
