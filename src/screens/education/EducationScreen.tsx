import React from 'react';
import { View, Dimensions, TouchableOpacity, Text, NativeModules, Platform } from 'react-native';
import Styles from './Styles';
import { Images } from '../../assets/images';
import { asynStoreKeys, setItem } from '../../helpers/asyncStore';
import Colors from '../../constants/colors/colors';
import translate from '../../assets/strings/strings';
import EducationSlide from './EducationSlide';
import Flurry from 'react-native-flurry-sdk';
import { FlatList } from 'react-native-gesture-handler';
import { parentEnabled, childEnabled } from '../../../appConfig';
import { ModalView } from '../../components/widgets/ModalView';
import ClickView from '../../components/widgets/clickView';
import { PUBLISHER_ID } from '../../service/config/serviceConstants';
const { EUConsent, RNAdConsent } = NativeModules;

const width = Dimensions.get('screen').width;

const slides = [
  {
    key: '1',
    header: '',
    title: '',
    text: translate('slide_1_text'),
    image: Images.onboarding,
  },
  {
    key: '2',
    header: translate('new_look'),
    title: translate('digital_daily'),
    text: translate('slide_2_text'),
    image: '',
  },
  {
    key: '3',
    header: '',
    title: translate('personalize_feed'),
    text: translate('slide_3_text'),
    image: '',
  },
  {
    key: '4',
    header: translate('save_articles'),
    title: translate('read_later'),
    text: translate('slide_4_text'),
    image: '',
  },
];

class EducationScreen extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      active_slide: 0,
      modalVisible: false,
    };
  }

  componentDidMount = async () => {
    Flurry.logEvent('Educational screen invoked');
    if (Platform.OS === 'android') {
      await EUConsent.getConsentStatus((res) => {
        if (res !== undefined && res !== null && res.status === 'UNKNOWN') {
          this.setState({
            modalVisible: true,
          });
        }
      });
    }
    if (Platform.OS === 'ios') {
      const consentStatus = await RNAdConsent.requestConsentInfoUpdate({
        publisherId: PUBLISHER_ID,
      });
      if (consentStatus === 'unknown') {
        const isRequestLocationInEeaOrUnknown = await RNAdConsent.isRequestLocationInEeaOrUnknown();
        if (isRequestLocationInEeaOrUnknown === true) {
          this.setState({
            modalVisible: true,
          });
        }
      }
    }
  };

  accept = async () => {
    if (Platform.OS === 'android') {
      await EUConsent.setConsentStatus('accept').then((response: any) => {
        if (response) {
          this.setState({ modalVisible: false });
        }
      });
    }
    if (Platform.OS === 'ios') {
      RNAdConsent.setConsentStatus(RNAdConsent.PERSONALIZED);
    }
    this.setState({ modalVisible: false });
  };

  reject = async () => {
    if (Platform.OS === 'android') {
      await EUConsent.setConsentStatus('reject').then((response: any) => {
        if (response) {
          this.setState({ modalVisible: false });
        }
      });
    }
    if (Platform.OS === 'ios') {
      RNAdConsent.setConsentStatus(RNAdConsent.NON_PERSONALIZED);
    }
    this.setState({ modalVisible: false });
  };

  renderPrivacyModal = () => {
    const { modalVisible }: any = this.state;
    return (
      <ModalView isVisible={modalVisible} transparent={true} style={Styles.bottomModal}>
        <View style={Styles.content}>
          <Text
            accessible={childEnabled}
            accessibilityLabel={translate('privacyrespect')}
            testID={translate('privacyrespect')}
            style={Styles.privacyrespect}
          >
            {translate('privacyrespect')}
          </Text>
          <Text
            accessible={childEnabled}
            accessibilityLabel={translate('initialPrivacydesc')}
            testID={translate('initialPrivacydesc')}
            style={Styles.initialPrivacydesc}
          >
            {translate('initialPrivacydesc')}
          </Text>
          <View style={Styles.clickButtons}>
            <ClickView
              onPress={() => {
                this.accept();
              }}
              style={Styles.accept}
            >
              <Text
                accessible={childEnabled}
                accessibilityLabel={translate('accept')}
                testID={translate('accept')}
                style={Styles.button}
              >
                {translate('accept')}
              </Text>
            </ClickView>
            <ClickView
              onPress={() => {
                this.reject();
              }}
              style={Styles.reject}
            >
              <Text
                accessible={childEnabled}
                accessibilityLabel={translate('reject')}
                testID={translate('reject')}
                style={Styles.button}
              >
                {translate('reject')}
              </Text>
            </ClickView>
          </View>
        </View>
      </ModalView>
    );
  };

  _renderItem = ({ item, index }: any) => {
    return (
      <View
        accessible={parentEnabled}
        style={[Styles.flex_1, index === 0 ? Styles.bg_dark : Styles.bg_light, { width: width }]}
      >
        <EducationSlide index={index} item={item} />
        <View accessible={parentEnabled} style={Styles.skip_button} />
      </View>
    );
  };

  _handleSlideChange = (index: any) => {
    this.flatListRef.scrollToIndex({
      animated: true,
      index: index,
    });
  };

  _handleContinue = () => {
    setItem(asynStoreKeys.is_continued, '1');
    this.props.navigation.navigate('Category');
  };

  onViewableItemsChanged = ({ viewableItems }: any) => {
    this.setState({ active_slide: viewableItems[0].index });
  };

  render() {
    const { active_slide }: any = this.state;

    const active_dot = {
      backgroundColor: active_slide === 0 ? Colors.white : Colors.black,
    };
    const inactive_dot = {
      backgroundColor: active_slide === 0 ? Colors.grey : Colors.lightGrey,
    };

    return (
      <View style={Styles.flex_1}>
        <FlatList
          data={slides}
          renderItem={this._renderItem}
          ref={(ref) => (this.flatListRef = ref)}
          horizontal
          pagingEnabled
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={this.onViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
          }}
        />

        <View style={[Styles.slider_footer]}>
          <View style={Styles.dot_container}>
            <TouchableOpacity accessible={parentEnabled} onPress={() => this._handleSlideChange(0)}>
              <View
                accessible={childEnabled}
                accessibilityLabel={translate('sliderIndicator')}
                testID={translate('sliderIndicator')}
                style={[Styles.dot, active_slide === 0 ? active_dot : inactive_dot]}
              />
            </TouchableOpacity>

            <TouchableOpacity accessible={parentEnabled} onPress={() => this._handleSlideChange(1)}>
              <View
                accessible={childEnabled}
                accessibilityLabel={translate('sliderIndicator')}
                testID={translate('sliderIndicator')}
                style={[Styles.dot, active_slide === 1 ? active_dot : inactive_dot]}
              />
            </TouchableOpacity>

            <TouchableOpacity accessible={parentEnabled} onPress={() => this._handleSlideChange(2)}>
              <View
                accessible={childEnabled}
                accessibilityLabel={translate('sliderIndicator')}
                testID={translate('sliderIndicator')}
                style={[Styles.dot, active_slide === 2 ? active_dot : inactive_dot]}
              />
            </TouchableOpacity>

            <TouchableOpacity accessible={parentEnabled} onPress={() => this._handleSlideChange(3)}>
              <View
                accessible={childEnabled}
                accessibilityLabel={translate('sliderIndicator')}
                testID={translate('sliderIndicator')}
                style={[Styles.dot, active_slide === 3 ? active_dot : inactive_dot]}
              />
            </TouchableOpacity>
          </View>

          <Text
            onPress={() => this._handleContinue()}
            accessible={childEnabled}
            accessibilityLabel={translate('go_to_app')}
            testID={translate('go_to_app')}
            accessibilityRole={'button'}
            style={[
              Styles.skip_button_text,
              { color: active_slide !== 0 ? Colors.lighterGrey : Colors.white },
            ]}
          >
            {translate('go_to_app')}
          </Text>
        </View>
        {this.renderPrivacyModal()}
      </View>
    );
  }
}

export default EducationScreen;
