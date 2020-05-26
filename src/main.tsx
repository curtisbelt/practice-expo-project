import React, { useEffect } from 'react';

import AppNavigator from './navigation/Router';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { getCurrentTodayDate } from './helpers/dateTimeFormats';

const Main = (props: any) => {
  let readUnreadData = props.readUnread;
  const [show, setValue] = React.useState(true);

  useEffect(() => {
    if (readUnreadData !== null) {
      setValue(isAfterToday(readUnreadData));
    } else {
      AsyncStorage.getItem('DigtalDailyTodayDate').then((data) => {
        if (data !== null) {
          data = JSON.parse(data);
          setValue(isAfterToday(data.statusDate));
        }
      });
    }
  }, [readUnreadData]);

  const isAfterToday = (date) => {
    return date !== getCurrentTodayDate();
  };
  return <AppNavigator screenProps={{ visible: show }} />;
};
const mapStateToProps = (state: any) => ({
  readUnread: state.digitalDaily.digital_daily_read_unread,
});

export default connect(mapStateToProps, null)(Main);
//export default Main;
