import {
  SHOW_HEADER_DIGITAL_DAILY,
  DIGITAL_DAILY_INDEX,
  DIGITAL_DAILY_READ_UNREAD,
  DD_DOWNLOAD_QUEUE,
} from '../constants/actionTypes';

export const onShowHeaderDigitalDaily = (data: any) => {
  return {
    type: SHOW_HEADER_DIGITAL_DAILY,
    payload: {
      showHeader: data,
    },
  };
};

export const changeDigitalDailyIndex = (index: any) => {
  return {
    type: DIGITAL_DAILY_INDEX,
    payload: {
      digital_daily_index: index,
    },
  };
};

export const setReadUnReadDigitalDaily = (data: any) => {
  return {
    type: DIGITAL_DAILY_READ_UNREAD,
    payload: {
      digital_daily_read_unread: data,
    },
  };
};

export const updateDownloadQueue = (data: any) => {
  return {
    type: DD_DOWNLOAD_QUEUE,
    payload: {
      downloadQueue: data,
    },
  };
};
