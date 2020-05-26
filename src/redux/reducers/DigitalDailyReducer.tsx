import {
  SHOW_HEADER_DIGITAL_DAILY,
  DIGITAL_DAILY_INDEX,
  DIGITAL_DAILY_READ_UNREAD,
  DD_DOWNLOAD_QUEUE,
} from '../constants/actionTypes';

const initialState = {
  showHeader: true,
  digital_daily_index: 0,
  digital_daily_read_unread: null,
  downloadQueue: [],
};

const DigitalDailyReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SHOW_HEADER_DIGITAL_DAILY:
      return Object.assign({}, state, {
        showHeader: action.payload.showHeader,
      });

    case DIGITAL_DAILY_INDEX:
      return Object.assign({}, state, {
        digital_daily_index: action.payload.digital_daily_index,
        showHeader: true,
      });

    case DIGITAL_DAILY_READ_UNREAD:
      return Object.assign({}, state, {
        digital_daily_read_unread: action.payload.digital_daily_read_unread,
      });

    case DD_DOWNLOAD_QUEUE:
      return Object.assign({}, state, {
        downloadQueue: action.payload.downloadQueue,
      });

    default:
      return state;
  }
};

export default DigitalDailyReducer;
