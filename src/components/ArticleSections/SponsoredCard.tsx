import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, FlatList } from 'react-native';
import { horizontalScale, moderateScale, verticalScale } from '../../helpers/scale';
import Colors from '../../constants/colors/colors';
import FontFamily from '../../assets/fonts/fonts';
import CustomImage from '../widgets/CustomImage';
import { parentEnabled, childEnabled, useStaticLable } from '../../../appConfig';
import automationStaticLables from '../../constants/automationStaticLables';
import ClickView from '../widgets/clickView';

class SponsoredCard extends React.Component {
  renderItem = ({ item }) => {
    const url = item && item.image && item.image.crops && item.image.crops[3].url;
    const photonUrl = url === undefined ? '' : url + `&w=${Math.round(moderateScale(300))}`;
    const postType = item && item['post-type'];
    return (
      <SafeAreaView style={styles.sub_container}>
        <ClickView
          accessible={parentEnabled}
          style={styles.sponsoredCardContainer}
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
          <View style={styles.sponsoredImageContainer}>
            {Object.entries(item.image).length !== 0 ? (
              <CustomImage
                accessible={childEnabled}
                accessibilityRole={'image'}
                accessibilityLabel={
                  useStaticLable ? automationStaticLables.sponsoredCardImage : item.image.alt
                }
                testID={useStaticLable ? automationStaticLables.sponsoredCardImage : item.image.alt}
                url={photonUrl ? photonUrl : null}
                style={styles.sponsoredImage}
              />
            ) : null}
          </View>
          <View accessible={parentEnabled} style={styles.sponsoredTextContainer}>
            <Text
              accessible={childEnabled}
              accessibilityRole={'text'}
              accessibilityLabel={'SPONSORED'}
              testID={'SPONSORED'}
              style={styles.sponsoredTextTag1}
            >
              {'SPONSORED'}
            </Text>
            <Text
              accessible={childEnabled}
              accessibilityRole={'text'}
              accessibilityLabel={
                useStaticLable ? automationStaticLables.sponsoredCardPostTitle : item['post-title']
              }
              testID={
                useStaticLable ? automationStaticLables.sponsoredCardPostTitle : item['post-title']
              }
              numberOfLines={2}
              style={styles.sponsoredTextTag2}
            >
              {item['post-title']}
            </Text>
          </View>
        </ClickView>
      </SafeAreaView>
    );
  };

  render() {
    const { SponsoredData } = this.props;
    return (
      <View style={styles.container}>
        {SponsoredData.items && SponsoredData.items.length > 0 ? (
          <FlatList
            data={SponsoredData.items}
            renderItem={this.renderItem}
            keyExtractor={(x, i) => i.toString()}
            style={{}}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  sub_container: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: horizontalScale(355),
    borderWidth: moderateScale(0.4),
  },
  sponsoredCardContainer: {
    backgroundColor: Colors.white,
    height: moderateScale(101),
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  sponsoredImageContainer: {
    height: verticalScale(79),
    width: moderateScale(138),
    marginLeft: moderateScale(10),
    alignItems: 'center',
  },
  sponsoredImage: {
    height: '100%',
    width: '100%',
  },
  sponsoredTextContainer: {
    margin: moderateScale(15),
    width: moderateScale(355 / 2),
  },
  sponsoredTextTag: {
    textAlign: 'center',
    color: Colors.black,
    fontFamily: FontFamily.fontFamilyRegular,
    fontSize: moderateScale(14),
    letterSpacing: moderateScale(0.89),
    lineHeight: moderateScale(13),
  },
  sponsoredTextTag1: {
    color: '#4D4D4D',
    fontFamily: FontFamily.fontFamilyRegular,
    fontSize: moderateScale(11),
    letterSpacing: moderateScale(0.89),
    lineHeight: moderateScale(13),
  },
  sponsoredTextTag2: {
    marginTop: moderateScale(6),
    color: Colors.black,
    fontFamily: FontFamily.fontFamilyBold,
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    letterSpacing: moderateScale(0.37),
    lineHeight: moderateScale(16),
  },
});

export default SponsoredCard;
