import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../../constants/colors/colors';
import FontFamily from '../../assets/fonts/fonts';
import { moderateScale, horizontalScale, verticalScale } from '../../helpers/scale';

const width = Dimensions.get('screen').width;

const Styles = StyleSheet.create({
  flex_1: {
    flex: 1,
  },
  flex_4: {
    flex: 4,
  },
  flex_15: {
    flex: 15,
  },
  justify_end: {
    justifyContent: 'flex-end',
  },
  bg_dark: {
    backgroundColor: Colors.black,
  },
  bg_light: {
    backgroundColor: Colors.white,
  },
  show: {
    display: 'flex',
  },
  hide: {
    display: 'none',
  },
  bg_overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  slider_banner: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  slider_text: {
    marginTop: moderateScale(-20),
    paddingHorizontal: moderateScale(20),
  },
  slider_logo: {
    height: moderateScale(59),
    width: moderateScale(202),
  },
  slider_header: {
    fontSize: moderateScale(34),
    color: Colors.white,
    fontWeight: 'bold',
    lineHeight: moderateScale(33),
    marginTop: moderateScale(10),
  },
  slider_sub_header: {
    fontSize: moderateScale(26),
    color: Colors.white,
    fontWeight: 'bold',
    lineHeight: moderateScale(33),
    marginTop: moderateScale(10),
  },
  dot_container: {
    flexDirection: 'row',
  },
  dot: {
    marginHorizontal: horizontalScale(4),
    height: moderateScale(12),
    width: moderateScale(12),
    borderRadius: moderateScale(6),
  },

  dark_text: {
    color: Colors.greyDark,
  },
  light_text: {
    color: Colors.white,
  },
  light_slider: {
    backgroundColor: Colors.white,
    padding: moderateScale(20),
  },
  light_slider_header: {
    textAlign: 'center',
    lineHeight: moderateScale(36),
    fontSize: moderateScale(15),
    textTransform: 'uppercase',
    fontFamily: FontFamily.fontFamilyMedium,
    color: Colors.red,
  },
  light_slider_title: {
    color: Colors.black,
    textAlign: 'center',
    fontSize: moderateScale(36),
    lineHeight: moderateScale(36),
    fontFamily: FontFamily.fontFamilyBold,
  },
  light_slider_text: {
    marginTop: moderateScale(14),
    color: Colors.black,
    textAlign: 'center',
    fontFamily: FontFamily.fontFamilyRegular,
    fontSize: moderateScale(23),
    lineHeight: moderateScale(26),
  },
  dark_slider_text: {
    marginTop: moderateScale(14),
    marginHorizontal: moderateScale(10),
    color: Colors.white,
    textAlign: 'left',
    fontSize: moderateScale(23),
    lineHeight: moderateScale(26),
    fontFamily: FontFamily.fontFamilyMedium,
    letterSpacing: moderateScale(0.13),
  },
  slider_footer: {
    paddingVertical: verticalScale(10),
    backgroundColor: Colors.transparent,
    height: verticalScale(130),
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: verticalScale(20),
    position: 'absolute',
    bottom: 0,
    right: width / 2 - moderateScale(75),
    left: width / 2 - moderateScale(75),
  },
  skip_button: {
    height: verticalScale(130),
  },
  skip_button_text: {
    fontSize: moderateScale(18),
    lineHeight: moderateScale(24),
    fontFamily: FontFamily.fontFamilyMedium,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    paddingLeft: moderateScale(27),
    paddingRight: moderateScale(24),
    width: moderateScale(375),
  },
  privacyrespect: {
    fontSize: moderateScale(23),
    fontFamily: FontFamily.fontFamilyBold,
    color: Colors.black,
    marginTop: moderateScale(48),
  },
  initialPrivacydesc: {
    fontSize: moderateScale(15),
    fontFamily: FontFamily.fontFamilyRegular,
    color: Colors.black,
    marginTop: moderateScale(9),
  },
  button: {
    fontSize: moderateScale(15),
    fontFamily: FontFamily.fontFamilyBold,
    color: Colors.white,
    textAlign: 'center',
  },
  clickButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: moderateScale(30),
    marginBottom: moderateScale(63),
  },
  accept: {
    width: moderateScale(154),
    height: moderateScale(44),
    backgroundColor: Colors.black,
    justifyContent: 'center',
  },
  reject: {
    width: moderateScale(154),
    height: moderateScale(44),
    backgroundColor: Colors.backgroundRed,
    justifyContent: 'center',
  },
});

export default Styles;
