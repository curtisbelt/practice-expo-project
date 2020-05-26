import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, SectionList, TouchableOpacity } from 'react-native';
import Colors from '../constants/colors/colors';
import FontFamily from '../assets/fonts/fonts';
import { moderateScale } from '../helpers/scale';
import { parentEnabled, childEnabled, useStaticLable } from '../../appConfig';
import automationStaticLables from '../constants/automationStaticLables';

const NotificationsLayout = (props: any) => {
  let { PNData, markedAllRed } = props;
  const [PNDataList] = React.useState(PNData);
  React.useEffect(() => {
    PNData;
  }, [PNData]);
  const Item = ({ data }: any) => {
    return (
      <TouchableOpacity
        accessible={parentEnabled}
        style={styles.item}
        onPress={() => {
          props.navigation.navigate('ArticleDetail', {
            articleID: 1202539154,
          });
        }}
      >
        <View accessible={parentEnabled} style={styles.categoryItem1}>
          <Text
            accessible={childEnabled}
            accessibilityLabel={
              useStaticLable ? automationStaticLables.notificationsHeaderTitle : data.title
            }
            testID={useStaticLable ? automationStaticLables.notificationsHeaderTitle : data.title}
            style={[
              styles.categorytTitleTxt,
              {
                fontFamily: data.read ? FontFamily.fontFamilyRegular : FontFamily.fontFamilyMedium,
              },
            ]}
          >
            {data.title}
          </Text>
          <Text
            accessible={childEnabled}
            accessibilityLabel={
              useStaticLable ? automationStaticLables.notificationsDateTime : '1 m ago'
            }
            testID={useStaticLable ? automationStaticLables.notificationsDateTime : '1m ago'}
            style={[
              styles.categorytDateTimeTxt,
              {
                fontFamily: data.read ? FontFamily.fontFamilyRegular : FontFamily.fontFamilyMedium,
              },
            ]}
          >
            1 m ago
          </Text>
        </View>
        <View accessible={parentEnabled}>
          <Text
            accessible={childEnabled}
            accessibilityLabel={
              useStaticLable ? automationStaticLables.notificationsCategoryTitle : data.dis
            }
            testID={useStaticLable ? automationStaticLables.notificationsCategoryTitle : data.dis}
            style={[
              styles.categorytDiscriptionTxt,
              {
                fontFamily: data.read ? FontFamily.fontFamilyRegular : FontFamily.fontFamilyBold,
              },
            ]}
          >
            {data.dis}
          </Text>
        </View>
        <View style={styles.separator} />
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={PNDataList}
        scrollEnabled={false}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => <Item data={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <View accessible={parentEnabled} style={styles.header}>
            <View style={styles.headerViewTxt1}>
              <Text
                accessible={childEnabled}
                accessibilityLabel={
                  useStaticLable ? automationStaticLables.notificationsHeaderTitle : title
                }
                testID={useStaticLable ? automationStaticLables.notificationsHeaderTitle : title}
                style={styles.headerTxt1}
              >
                {title}
              </Text>
            </View>
            {title === 'Today' ? (
              <TouchableOpacity
                accessible={parentEnabled}
                style={styles.headerViewTxt2}
                onPress={markedAllRed()}
              >
                <Text
                  accessible={childEnabled}
                  accessibilityLabel={'Mark All Read'}
                  testID={'Mark All Read'}
                  style={styles.headerTxt2}
                >
                  Mark All Read
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  item: {
    backgroundColor: Colors.white,
    marginLeft: moderateScale(16),
    marginRight: moderateScale(16),
    marginTop: moderateScale(10),
    marginBottom: moderateScale(10),
  },
  header: {
    flex: 1,
    height: moderateScale(30),
    marginTop: moderateScale(13),
    marginLeft: moderateScale(16),
    marginRight: moderateScale(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
  },
  headerViewTxt1: {
    flex: 1,
    justifyContent: 'center',
  },
  headerTxt1: {
    color: Colors.black,
    fontFamily: FontFamily.fontFamilyBold,
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
  headerViewTxt2: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerTxt2: {
    color: Colors.red,
    fontFamily: FontFamily.fontFamilyRegular,
    fontSize: moderateScale(14),
  },
  categoryItem1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  categorytTitleTxt: {
    color: Colors.viewAllGrey,
    fontSize: moderateScale(14),
  },
  categorytDateTimeTxt: {
    color: Colors.viewAllGrey,
    fontSize: moderateScale(13),
  },
  categorytDiscriptionTxt: {
    marginTop: moderateScale(8),
    color: Colors.black,
    fontSize: moderateScale(17),
  },
  separator: {
    height: 1,
    marginTop: moderateScale(16),
    justifyContent: 'center',
    backgroundColor: Colors.whisperGrey,
  },
});
export default NotificationsLayout;
