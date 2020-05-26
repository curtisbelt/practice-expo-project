import AsyncStorage from '@react-native-community/async-storage';

const asynStoreKeys = {
  is_continued: 'is_continued',
  selectedCategory: 'selectedCategory',
  myFeed_showSettings: 'showSettings',
  is_FirstTimeHomeScreen: 'is_FirstTimeHomeScreen',
  PN_Status: 'PN_Status',
  ForYou_Saved: 'ForYou_Saved',
  SplashScreenTime: 'SplashScreenTime',
  SessionStartTime: 'SessionStartTime',
  DigtalDailyTodayDate: 'DigtalDailyTodayDate',
  isPNActionPerformed: 'false',
  PN_BN_Status: 'PN_BN_Status',
  iOSPNInitialStatus: 'iOSPNInitialStatus',
  loginDate: 'loginDate',
  lastSubscriptionValidated: 'lastSubscriptionValidated',
};

const setItem = async (key: any, value: any) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (_error) {
    // do nothing
  }
};

const setJSONItem = async (key: any, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (_error) {
    // do nothing
  }
};

const getItem = async (key: any) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (_error) {
    // do nothing
  }
};

const getJSONItem = async (key: any) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (_error) {
    // do nothing
  }
};

const removeKey = async (key: any) => {
  try {
    return await AsyncStorage.removeItem(key);
  } catch (_error) {
    // do nothing
  }
};

export { asynStoreKeys, setItem, setJSONItem, getItem, getJSONItem, removeKey };
