import React from 'react';
import { View, Text, Image } from 'react-native';
import Styles from './Styles';
import LinearGradient from 'react-native-linear-gradient';
import { Images } from '../../assets/images';
import Colors from '../../constants/colors/colors';
import { readLoginFileStream } from '../../helpers/rn_fetch_blob/createDirectory';
import { withNavigation } from 'react-navigation';
import { parentEnabled } from '../../../appConfig';

class EducationSlide extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginData: '',
    };
  }

  componentDidMount() {
    this.readData();
  }

  readData = async () => {
    let data = await readLoginFileStream();
    this.setState({
      loginData: data,
    });
  };

  render() {
    const { index, item }: any = this.props;

    return (
      <View style={[Styles.flex_1, { margin: 0 }]}>
        {index === 0 ? (
          <View accessible={parentEnabled} style={Styles.flex_4}>
            <Image style={Styles.slider_banner} source={item.image} />

            <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)', Colors.black]}
              locations={[0, 0.5, 0.7, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={Styles.bg_overlay}
            >
              <View style={[Styles.flex_4, Styles.justify_end, Styles.slider_text]}>
                <Image
                  accessibilityLabel="WWD"
                  testID="WWD"
                  source={Images.whiteLogo}
                  style={Styles.slider_logo}
                />
                <Text
                  accessibilityLabel={item.text}
                  testID={item.text}
                  style={Styles.dark_slider_text}
                >
                  {item.text}
                </Text>
              </View>
            </LinearGradient>
          </View>
        ) : (
          <View accessible={true} style={[Styles.flex_4, Styles.justify_end]}>
            <View style={Styles.light_slider}>
              <Text
                accessibilityLabel={item.header}
                testID={item.header}
                style={Styles.light_slider_header}
              >
                {item.header}
              </Text>
              <Text
                accessibilityLabel={item.title}
                testID={item.title}
                style={Styles.light_slider_title}
              >
                {item.title}
              </Text>
              <Text
                accessibilityLabel={item.text}
                testID={item.text}
                style={Styles.light_slider_text}
              >
                {item.text}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default withNavigation(EducationSlide);
