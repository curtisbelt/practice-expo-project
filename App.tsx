import React, { useEffect } from 'react';
import { AppState, YellowBox, Platform } from 'react-native';
import { Provider } from 'react-redux';
import Store from './src/redux/store';
import Flurry from 'react-native-flurry-sdk';
import * as Application from 'expo-application';
import AsyncStorage from '@react-native-community/async-storage';
import { asynStoreKeys, setItem, getItem, removeKey } from './src/helpers/asyncStore';
import { getCurrentTodayDate, getDaysDifference } from './src/helpers/dateTimeFormats';
YellowBox.ignoreWarnings(['VirtualizedLists should never be nested']);
import Main from './src/main';
import { getHoursDifference } from './src/helpers/dateTimeFormats';
import * as RNIap from 'react-native-iap';
import {
  writeSubscriptionFileStream,
  readLoginFileStream,
  writeLoginFileStream,
} from './src/helpers/rn_fetch_blob/createDirectory';

const App = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
  const [show, setValue] = React.useState(true);
  useEffect(() => {
    Flurry.logEvent('Launch App');
    AsyncStorage.getItem('buildNumber').then((buildNumber) => {
      if (!buildNumber) {
        Flurry.logEvent('First Launch');
        AsyncStorage.setItem('buildNumber', JSON.stringify(Application.nativeBuildVersion));
        return;
      } else {
        AsyncStorage.getItem('buildNumber').then((buildNumber) => {
          let localBuildNumber = parseInt(JSON.parse(buildNumber));
          let originalBuildNumber = parseInt(Application.nativeBuildVersion);
          if (originalBuildNumber > localBuildNumber) {
            Flurry.logEvent('First Launch After Update');
            AsyncStorage.setItem('buildNumber', JSON.stringify(Application.nativeBuildVersion));
          }
        });
      }
    });

    handleLogout();

    // Validate subscription on app launch
    handleValidateSubscription();

    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
    // TODO: refactor this to avoid eslint error. possible solution - use callback pattern, see: https://stackoverflow.com/a/55566585
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('DigtalDailyTodayDate').then((data) => {
      if (data !== null) {
        data = JSON.parse(data);
        setValue(isAfterToday(data.statusDate));
      }
    });
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      Flurry.logEvent('Application Opened');
      Flurry.logEvent('Session Start', {
        sessionStartTime: new Date().getTime().toString(),
      });
      setItem(asynStoreKeys.SessionStartTime, new Date().getTime().toString());

      handleLogout();

      // Validate subscription on active
      handleValidateSubscription();
    }
    if (Platform.OS === 'ios' && nextAppState === 'inactive') {
      this.handleSessionEndTime();
    } else if (Platform.OS === 'android' && nextAppState === 'background') {
      this.handleSessionEndTime();
    }
  };

  // TODO: is this really not used?
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
  const handleSessionEndTime = async () => {
    let SessionStartTime = await getItem(asynStoreKeys.SessionStartTime);
    SessionStartTime = parseInt(SessionStartTime);
    let currentTime = new Date().getTime();
    let diff = currentTime - SessionStartTime;
    // converting to seconds
    let diffInSec = ((diff % 60000) / 1000).toFixed(0) + ' sec';
    Flurry.logEvent('Session End', { sessionEndTime: diffInSec });
    removeKey(asynStoreKeys.SessionStartTime);
  };

  const isAfterToday = (date) => {
    return date !== getCurrentTodayDate();
  };

  const handleLogout = async () => {
    let data = await readLoginFileStream();
    let loginDataResponse = JSON.parse(data);
    const loginDate = await getItem(asynStoreKeys.loginDate);
    if (loginDataResponse && loginDataResponse !== null && loginDataResponse !== '') {
      const dateDiff = getDaysDifference(Number(loginDate));
      if (dateDiff > 15) {
        let userData = null;
        writeLoginFileStream(userData);
      }
    }
  };

  // Validate subscription daily
  const handleValidateSubscription = async () => {
    await getItem(asynStoreKeys.lastSubscriptionValidated).then(async (response) => {
      if (response && response !== '' && response !== null) {
        var hourDiff = getHoursDifference(response);

        if (hourDiff > 24) {
          // Get available purchases and validate receipt
          await RNIap.getAvailablePurchases()
            .then(async (purchases) => {
              if (purchases && purchases.length > 0) {
                // iOS
                if (Platform.OS === 'ios') {
                  var receiptBody = {
                    'receipt-data': purchases[purchases.length - 1].transactionReceipt,
                    password: 'da5530df089845d99d22c8ff7298efce',
                  };

                  await RNIap.validateReceiptIos(receiptBody, true).then(async (receipt) => {
                    const renewalHistory = receipt.latest_receipt_info;

                    const sortedHistory = await renewalHistory.sort(function (a, b) {
                      return a.purchase_date_ms > b.purchase_date_ms;
                    });

                    const latestPurchase = sortedHistory[sortedHistory.length - 1];

                    if (latestPurchase.expires_date_ms <= Date.now()) {
                      writeSubscriptionFileStream(null);
                    }
                  });
                }

                //Android
                if (Platform.OS === 'android') {
                  const sortedResults = purchases.sort(function (a, b) {
                    return a.transactionDate > b.transactionDate;
                  });

                  if (sortedResults[sortedResults.length - 1].purchaseStateAndroid !== 1) {
                    writeSubscriptionFileStream(null);
                  }
                }
              } else {
                writeSubscriptionFileStream(null);
              }
            })
            .catch(() => {
              // Alert.alert(err.message);
            });

          // Set current date for subscription validated
          setItem(asynStoreKeys.lastSubscriptionValidated, Date.now().toString());
        }
      }
    });
  };

  return (
    <Provider store={Store}>
      <Main />
    </Provider>
  );
};

export default App;
