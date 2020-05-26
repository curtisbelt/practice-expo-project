import React from 'react';
import { View, Text, StyleSheet, BackHandler, Platform } from 'react-native';
import { connect } from 'react-redux';
import { moderateScale, verticalScale } from '../../helpers/scale';
import { onShowHeaderDigitalDaily } from '../../redux/actions/DigitalDailyAction';
import {
  handleAndroidBackButton,
  removeAndroidBackButtonHandler,
} from '../../helpers/androidBackButton';
import TopBarHeader from '../../components/header/TopBarHeader';
import { NavigationEvents } from 'react-navigation';
import Colors from '../../constants/colors/colors';
import FontFamily from '../../assets/fonts/fonts';
import Today from './Today';
import Issues from './Issues';
import Saved from './Saved';
import { parentEnabled, childEnabled, useStaticLable } from '../../../appConfig';
import Flurry from 'react-native-flurry-sdk';
import automationStaticLables from '../../constants/automationStaticLables';
import SubscribeLogin from '../../components/widgets/SubscribeLogin';
import translate from '../../assets/strings/strings';
import {
  readLoginFileStream,
  readSubscriptionFileStream,
} from '../../helpers/rn_fetch_blob/createDirectory';
import { DEV_AUTH } from '../../service/config/serviceConstants';

class DigitalDailyScreen extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      loginData: '',
      subsData: '',
      menu_data: [{ title: 'Today' }, { title: 'Issues' }, { title: 'Saved' }],
      section_index: 0,
    };
  }

  componentDidMount() {
    Flurry.logEvent('Digital daily invoked');
    handleAndroidBackButton(() => {
      BackHandler.exitApp();
    });
  }

  updateSectionIndex = (index) => {
    this.setState({ section_index: index });
  };

  readData = async () => {
    let data = await readLoginFileStream();
    let jsonData = JSON.parse(data);
    let subsdata = await readSubscriptionFileStream();
    let jsonSubsData = JSON.parse(subsdata);
    this.setState({
      loginData: jsonData,
      subsData: jsonSubsData,
    });
  };

  renderItem = (item: any, index: any) => {
    const { section_index }: any = this.state;
    return (
      <View key={index} accessible={parentEnabled} style={styles.item}>
        <Text
          accessible={childEnabled}
          accessibilityLabel={useStaticLable ? automationStaticLables.sectionsTitle : item.title}
          testID={useStaticLable ? automationStaticLables.sectionsTitle : item.title}
          style={[styles.label, section_index === index ? styles.active_label : null]}
          onPress={() => this.updateSectionIndex(index)}
        >
          {item.title}
        </Text>
        {section_index === index ? <View style={styles.active_border} /> : null}
      </View>
    );
  };

  renderSectionView = (data: any, section_index: any) => {
    const item = data[section_index];
    return (
      <View style={styles.sub_container}>
        {item.title === 'Today' ? <Today {...this.props} /> : null}
        {item.title === 'Issues' ? <Issues {...this.props} /> : null}
        {item.title === 'Saved' ? (
          <Saved {...this.props} updateSectionIndex={this.updateSectionIndex} />
        ) : null}
      </View>
    );
  };

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }

  render() {
    const { menu_data, section_index, loginData, subsData }: any = this.state;
    const { showHeader }: any = this.props;

    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <View style={styles.statusBar} />}

        {showHeader ? <TopBarHeader navigationany={this.props.navigation} /> : null}

        <NavigationEvents
          onWillFocus={() => {
            this.readData(); //Check for user login or subscribe
            this.props.onShowHeaderDigitalDaily(true);
          }}
        />

        <View style={styles.main_container}>
          <View style={styles.tabs_container}>
            {menu_data && menu_data && menu_data.length > 0
              ? menu_data.map((item, index) => {
                  return this.renderItem(item, index);
                })
              : null}
          </View>

          {(loginData &&
            loginData[DEV_AUTH] &&
            loginData[DEV_AUTH].ent &&
            loginData[DEV_AUTH].ent.length != 0) ||
          subsData !== null ? null : (
            <View style={styles.loginContainer}>
              <SubscribeLogin subscribeText={translate('subscribeToDD')} {...this.props} />
            </View>
          )}

          {/* Display page */}
          {this.renderSectionView(menu_data, section_index)}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.snow,
  },
  main_container: {
    flex: 1,
  },
  sub_container: {
    flex: 1,
    justifyContent: 'center',
  },
  statusBar: {
    backgroundColor: Colors.white,
    height: moderateScale(30),
    width: '100%',
    zIndex: 2,
  },
  tabs_container: {
    marginTop: verticalScale(6),
    flexDirection: 'row',
    height: moderateScale(44),
    justifyContent: 'space-around',
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
  loginContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 99,
    backgroundColor: 'rgba(255,255,255,0.85)',
    flex: 1,
    justifyContent: 'center',
  },
});

const mapDispatchToProps = (dispatch: any) => ({
  onShowHeaderDigitalDaily: (show: any) => dispatch(onShowHeaderDigitalDaily(show)),
});

const mapStateToProps = (state: any) => ({
  showHeader: state.digitalDaily.showHeader,
});

export default connect(mapStateToProps, mapDispatchToProps)(DigitalDailyScreen);
