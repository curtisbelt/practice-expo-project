import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { moderateScale } from '../helpers/scale';
import Colors from '../constants/colors/colors';
import { Images } from '../assets/images';
import FontFamily from '../assets/fonts/fonts';
import { parentEnabled, childEnabled, useStaticLable } from '../../appConfig';
import automationStaticLables from '../constants/automationStaticLables';
import { connect } from 'react-redux';
import { changeCategoryIndex, setSubCategoryIndex } from '../redux/actions/HomeAction';
import titleCase from '../helpers/titleCase';

class SectionsExpandableView extends Component {
  //Custom Component for the Expandable List
  constructor(props: any) {
    super(props);
    this.state = {
      layoutHeight: 0,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (nextProps.item.isExpanded) {
      this.setState(() => {
        return {
          layoutHeight: null,
        };
      });
    } else {
      this.setState(() => {
        return {
          layoutHeight: 0,
        };
      });
    }
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    let { layoutHeight }: any = this.state;
    if (layoutHeight !== nextState.layoutHeight) {
      return true;
    }
    return false;
  }

  render() {
    let { layoutHeight }: any = this.state;
    let {
      item,
      onClickFunction,
      menuIndex,
      navigation,
      changeCategoryIndex,
      setSubCategoryIndex,
    }: any = this.props;
    return (
      <View accessible={parentEnabled} style={{ backgroundColor: Colors.white }}>
        <TouchableOpacity activeOpacity={0.8} onPress={onClickFunction} style={styles.menuItemView}>
          <View style={styles.menuItemTextView}>
            <Text
              accessible={childEnabled}
              accessibilityRole={'text'}
              accessibilityLabel={
                useStaticLable ? automationStaticLables.sectionsTitle : item.title
              }
              testID={useStaticLable ? automationStaticLables.heroCategory : item.title}
              style={styles.menuItemText}
            >
              {item.title}
            </Text>
          </View>
          <TouchableOpacity
            accessible={parentEnabled}
            activeOpacity={0.8}
            onPress={onClickFunction}
            style={styles.menuItemIconView}
          >
            <Image
              accessible={childEnabled}
              accessibilityRole={'image'}
              accessibilityLabel={layoutHeight !== 0 ? 'Collapse icon' : 'Expand icon '}
              testID={layoutHeight !== 0 ? 'Collapse icon ' : 'Expand icon '}
              source={layoutHeight !== 0 ? Images.upArrow : Images.downArrow}
            />
          </TouchableOpacity>
        </TouchableOpacity>

        <View
          accessible={parentEnabled}
          style={[
            styles.subMenuItemView,
            {
              height: layoutHeight,
            },
          ]}
        >
          {/*Content under the header of the Expandable List Item*/}
          {item.children.map((childItem: any, key: any) => (
            <TouchableOpacity
              accessible={parentEnabled}
              key={key}
              style={styles.content}
              onPress={() => {
                navigation.navigate('Home');
                changeCategoryIndex(menuIndex);
                setSubCategoryIndex(key);
              }}
            >
              <Text
                accessible={childEnabled}
                accessibilityRole={'text'}
                accessibilityLabel={
                  useStaticLable ? automationStaticLables.sectionsSubTitle : childItem.title
                }
                testID={useStaticLable ? automationStaticLables.heroCategory : childItem.title}
                style={styles.submenuItemText}
              >
                {titleCase(childItem.title)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
}
const mapDispatchToProps = (dispatch: any) => ({
  changeCategoryIndex: (index: any) => dispatch(changeCategoryIndex(index)),
  setSubCategoryIndex: (index: any) => dispatch(setSubCategoryIndex(index)),
});

const mapStateToProps = (state: any) => ({
  category_index: state.home.category_index,
  subcategory_index: state.home.subcategory_index,
});

export default connect(mapStateToProps, mapDispatchToProps)(SectionsExpandableView);

const styles = StyleSheet.create({
  menuItemView: {
    flex: 1,
    backgroundColor: Colors.white,
    margin: moderateScale(13),
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTextView: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  menuItemText: {
    color: Colors.black,
    fontFamily: FontFamily.fontFamilyBold,

    fontSize: moderateScale(21),
    marginLeft: moderateScale(10),
  },
  menuItemIconView: {
    padding: 5,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  subMenuItemView: {
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    marginLeft: moderateScale(43),
    marginBottom: moderateScale(10),
  },
  childView: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  submenuItemText: {
    color: Colors.black,
    fontFamily: FontFamily.fontFamilyRegular,
    fontSize: moderateScale(16),
    letterSpacing: moderateScale(0.56),
    margin: moderateScale(5),
  },
});
