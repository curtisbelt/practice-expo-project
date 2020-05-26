import { put, all } from 'redux-saga/effects';
import {
  CATEGORY_INDEX,
  SHOW_HEADER_DIGITAL_DAILY,
  SHOW_HEADER_HOME,
  SHOW_HEADER_FOR_YOU,
  SHOW_HEADER_RUNWAY,
  SHOW_HEADER_SECTIONS,
  DIGITAL_DAILY_INDEX,
  SUB_SECTIONS__INDEX,
  PN_STATUS,
  PN_CLOSE_STATUS,
  PN_BR_NEWS_STATUS,
  FOR_YOU_SAVED_BOOKMARK_CATEGORY,
  SAVED_BOOKMARK_ID,
  READ_SAVED_BOOKMARK_DATA,
  SAVED_BOOKMARK_RUNWAY_ID,
  SHOW_CUSTOMIZE_CATEGORY,
  DIGITAL_DAILY_READ_UNREAD,
  SAVED_BOOKMARK_RUNWAY_TAB_ID,
  FOR_YOU_SAVED_BOOKMARK_RUNWAY_TAB,
} from '../constants/actionTypes';
function* getCategoryIndex(action: any) {
  const { category_index } = action;

  try {
    yield put({
      type: CATEGORY_INDEX,
      value: category_index,
    });
  } catch (_e) {
    // do nothing
  }
}

function* onShowCustomizeCategory(action: any) {
  const { showCustomizeCategory } = action;

  try {
    yield put({
      type: SHOW_CUSTOMIZE_CATEGORY,
      value: showCustomizeCategory,
    });
  } catch (_e) {
    // do nothing
  }
}

function* getSubSectionsIndex(action: any) {
  const { sub_sections_index } = action;
  try {
    yield put({
      type: SUB_SECTIONS__INDEX,
      value: sub_sections_index,
    });
  } catch (_e) {
    // do nothing
  }
}
function* getDigitalDailyIndex(action: any) {
  const { digital_daily_index } = action;
  try {
    yield put({
      type: DIGITAL_DAILY_INDEX,
      value: digital_daily_index,
    });
  } catch (_e) {
    // do nothing
  }
}
function* onShowHeaderDigitalDaily(action: any) {
  const { showHeader } = action;
  try {
    yield put({
      type: SHOW_HEADER_DIGITAL_DAILY,
      value: showHeader,
    });
  } catch (_e) {
    // do nothing
  }
}
function* onShowHeaderHome(action: any) {
  const { showHeader } = action;
  try {
    yield put({
      type: SHOW_HEADER_HOME,
      value: showHeader,
    });
  } catch (_e) {
    // do nothing
  }
}
function* onShowHeaderForYou(action: any) {
  const { showHeader } = action;
  try {
    yield put({
      type: SHOW_HEADER_FOR_YOU,
      value: showHeader,
    });
  } catch (_e) {
    // do nothing
  }
}
function* onShowHeaderRunway(action: any) {
  const { showHeader } = action;
  try {
    yield put({
      type: SHOW_HEADER_RUNWAY,
      value: showHeader,
    });
  } catch (_e) {
    // do nothing
  }
}
function* onShowHeaderSections(action: any) {
  const { showHeader } = action;
  try {
    yield put({
      type: SHOW_HEADER_SECTIONS,
      value: showHeader,
    });
  } catch (_e) {
    // do nothing
  }
}
function* setPNotificationStatus(action: any) {
  const { data } = action;
  try {
    yield put({
      type: PN_STATUS,
      value: data,
    });
  } catch (_e) {
    // do nothing
  }
}
function* closePNotificationStatus(action: any) {
  const { data } = action;
  try {
    yield put({
      type: PN_CLOSE_STATUS,
      value: data,
    });
  } catch (_e) {
    // do nothing
  }
}
function* setPNotificationBRNewsStatus(action: any) {
  const { status } = action;
  try {
    yield put({
      type: PN_BR_NEWS_STATUS,
      value: status,
    });
  } catch (_e) {
    // do nothing
  }
}
function* savedBookMark(action: any) {
  const { data } = action;
  // console.log('savedBookMark' + data);
  try {
    yield put({
      type: FOR_YOU_SAVED_BOOKMARK_CATEGORY,
      value: data,
    });
  } catch (e) {
    // console.log('savedBookMark Error:****\n' + e);
  }
}
function* savedBookMarkRunWayTab(action: any) {
  const { data } = action;
  // console.log('savedBookMark' + data);
  try {
    yield put({
      type: FOR_YOU_SAVED_BOOKMARK_RUNWAY_TAB,
      value: data,
    });
  } catch (e) {
    // console.log('savedBookMark Error:****\n' + e);
  }
}
function* checkSavedBookMark(action: any) {
  const { id } = action;
  // console.log('checkSavedBookMark' + id);
  try {
    yield put({
      type: SAVED_BOOKMARK_ID,
      value: id,
    });
  } catch (e) {
    // console.log('checkSavedBookMark Error:****\n' + e);
  }
}
function* checkRunWaySavedBookMark(action: any) {
  const { data } = action;
  // console.log('checkRunWaySavedBookMark' + data);
  try {
    yield put({
      type: SAVED_BOOKMARK_RUNWAY_ID,
      value: data,
    });
  } catch (e) {
    // console.log('checkRunWaySavedBookMark Error:****\n' + e);
  }
}
function* checkRunWayTabSavedBookMark(action: any) {
  const { data } = action;
  try {
    yield put({
      type: SAVED_BOOKMARK_RUNWAY_TAB_ID,
      value: data,
    });
  } catch (_e) {
    // do nothing
  }
}
function* readSavedBookMarkData(action: any) {
  const { data } = action;
  // console.log('readSavedBookMarkData' + data);
  try {
    yield put({
      type: READ_SAVED_BOOKMARK_DATA,
      value: data,
    });
  } catch (e) {
    // console.log('readSavedBookMarkData Error:****\n' + e);
  }
}
function* setReadUnReadDigitalDaily(action: any) {
  const { data } = action;
  // console.log('readSavedBookMarkData' + data);
  try {
    yield put({
      type: DIGITAL_DAILY_READ_UNREAD,
      value: data,
    });
  } catch (e) {
    // console.log('readSavedBookMarkData Error:****\n' + e);
  }
}
export default function* root() {
  yield all([
    getCategoryIndex(CATEGORY_INDEX),
    onShowHeaderDigitalDaily(SHOW_HEADER_DIGITAL_DAILY),
    onShowHeaderHome(SHOW_HEADER_HOME),
    onShowHeaderForYou(SHOW_HEADER_FOR_YOU),
    onShowHeaderRunway(SHOW_HEADER_RUNWAY),
    onShowHeaderSections(SHOW_HEADER_SECTIONS),
    getDigitalDailyIndex(DIGITAL_DAILY_INDEX),
    getSubSectionsIndex(SUB_SECTIONS__INDEX),
    setPNotificationStatus(PN_STATUS),
    closePNotificationStatus(PN_CLOSE_STATUS),
    setPNotificationBRNewsStatus(PN_BR_NEWS_STATUS),
    savedBookMark(FOR_YOU_SAVED_BOOKMARK_CATEGORY),
    checkSavedBookMark(SAVED_BOOKMARK_ID),
    readSavedBookMarkData(READ_SAVED_BOOKMARK_DATA),
    checkRunWaySavedBookMark(SAVED_BOOKMARK_RUNWAY_ID),
    onShowCustomizeCategory(SHOW_CUSTOMIZE_CATEGORY),
    setReadUnReadDigitalDaily(DIGITAL_DAILY_READ_UNREAD),
    checkRunWayTabSavedBookMark(SAVED_BOOKMARK_RUNWAY_TAB_ID),
    savedBookMarkRunWayTab(FOR_YOU_SAVED_BOOKMARK_RUNWAY_TAB),
  ]);
}
