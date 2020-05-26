import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

import { childEnabled, useStaticLable } from '../../../appConfig';
import automationStaticLables from '../../constants/automationStaticLables';
import { Images } from '../../assets/index';
import FontFamily from '../../assets/fonts/fonts';
import ClickedView from '../../components/widgets/clickView';
import Colors from '../../constants/colors/colors';
import { moderateScale, verticalScale } from '../../helpers/scale';
import apiService from '../../service/fetchContentService/FetchContentService';
import { ApiUrls, ApiMethods, ApiPaths } from '../../service/config/serviceConstants';
import CustomImage from '../../components/widgets/CustomImage';
import ClickView from '../../components/widgets/clickView';

class BreakinNews extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      showLatestNotification: false,
      breakingNewData: {},
    };
  }

  componentDidMount = async () => {
    await apiService(
      ApiUrls.PROD_BASE_URL + ApiPaths.BREAKING_NEWS,
      ApiMethods.GET,
      this.onSuccess,
      this.onFailure,
    );
  };

  onSuccess = async (response: any) => {
    if (response && response.data) {
      if (response.data.status === 'off') {
        this.setState({
          showLatestNotification: false,
        });
      } else {
        const url =
          response.data &&
          response.data.image &&
          response.data.image.crops &&
          response.data.image.crops[0].url;
        const photonUrl =
          url === undefined
            ? ''
            : url === ''
            ? ''
            : url + `?resize=${Math.round(moderateScale(42))},${Math.round(verticalScale(50))}`;
        let data = {
          title: response.data.title,
          image: photonUrl,
          link: response.data.link,
        };
        await this.setState({
          breakingNewData: data,
          showLatestNotification: true,
        });
      }
    }
  };

  onFailure = (error: any) => {
    console.log(error);
  };

  handleBreakinNewsVisibility = () => {
    this.setState({
      showLatestNotification: false,
    });
  };
  render() {
    const { breakingNewData }: any = this.state;
    return (
      <ClickView
        onPress={() => {
          this.props.navigation.navigate('SettingsWeb', {
            url: breakingNewData.link,
          });
        }}
      >
        {this.state.showLatestNotification ? (
          <View style={styles.bkNewsContainer}>
            <View style={styles.bkNewsChildContainer}>
              <View style={styles.bkNewsImage}>
                <CustomImage
                  accessible={childEnabled}
                  accessibilityRole={'image'}
                  accessibilityLabel={
                    useStaticLable
                      ? automationStaticLables.essentiaListImage
                      : breakingNewData.image.alt
                  }
                  testID={
                    useStaticLable
                      ? automationStaticLables.essentiaListImage
                      : breakingNewData.image.alt
                  }
                  url={breakingNewData.image ? breakingNewData.image : ''}
                  style={{ width: 50, height: 42 }}
                />
              </View>

              <View style={styles.bkNewsTextContainer}>
                <View style={styles.bkNewsHeaderContainer} accessible={true}>
                  <Text
                    style={styles.bkNewsHeaderText}
                    accessible={childEnabled}
                    accessibilityRole={'text'}
                    accessibilityLabel={
                      useStaticLable
                        ? automationStaticLables.breakinNewsHeader
                        : automationStaticLables.breakinNewsHeader
                    }
                    testID={
                      useStaticLable
                        ? automationStaticLables.breakinNewsHeader
                        : automationStaticLables.breakinNewsHeader
                    }
                  >
                    BREAKING NEWS
                  </Text>
                  <ClickedView
                    accessible={childEnabled}
                    onPress={() => this.handleBreakinNewsVisibility()}
                  >
                    <Image
                      accessible={childEnabled}
                      accessibilityLabel={'close breaking news'}
                      testID={'close breaking news'}
                      style={styles.bkNewsCloseIcon}
                      source={Images.close}
                    />
                  </ClickedView>
                </View>

                <Text
                  accessible={childEnabled}
                  accessibilityRole={'text'}
                  accessibilityLabel={
                    useStaticLable
                      ? automationStaticLables.breakinNewsTitle
                      : automationStaticLables.breakinNewsTitle
                  }
                  testID={
                    useStaticLable
                      ? automationStaticLables.breakinNewsTitle
                      : automationStaticLables.breakinNewsTitle
                  }
                  style={styles.bkNewsTitleText}
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                >
                  {breakingNewData.title}
                </Text>
              </View>
            </View>
          </View>
        ) : null}
      </ClickView>
    );
  }
}
const styles = StyleSheet.create({
  bkNewsContainer: {
    backgroundColor: Colors.red,
    height: 58,
  },
  bkNewsChildContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: moderateScale(6),
  },
  bkNewsTextContainer: {
    flex: 0.9,
    marginLeft: moderateScale(16),
  },
  bkNewsHeaderContainer: {
    flexDirection: 'row',
    marginTop: 3,
  },
  bkNewsImage: {
    flex: 0.15,
    height: 42,
    width: 50,
  },
  bkNewsCloseIcon: {
    tintColor: Colors.white,
    width: 10,
    height: 10,
  },
  bkNewsHeaderText: {
    fontFamily: FontFamily.fontFamilyBold,
    fontSize: moderateScale(10),
    textAlign: 'left',
    color: Colors.white,
    letterSpacing: 1.34,
    flex: 0.98,
  },
  bkNewsTitleText: {
    fontFamily: FontFamily.fontFamilyRegular,
    fontSize: moderateScale(15),
    textAlign: 'left',
    color: Colors.white,
    marginTop: moderateScale(2),
  },
});

export default BreakinNews;
