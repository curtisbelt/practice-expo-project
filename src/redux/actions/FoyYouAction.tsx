import {
  SHOW_HEADER_FOR_YOU,
  FOR_YOU_SELECTED_CATEGORY,
  FOR_YOU_TAB_INDEX,
  FOR_YOU_SAVED_BOOKMARK_CATEGORY,
  SAVED_BOOKMARK_ID,
  READ_SAVED_BOOKMARK_DATA,
  SAVED_BOOKMARK_RUNWAY_ID,
  SHOW_CUSTOMIZE_CATEGORY,
  SAVED_BOOKMARK_RUNWAY_TAB_ID,
  FOR_YOU_SAVED_BOOKMARK_RUNWAY_TAB,
} from '../constants/actionTypes';

export const forYouTabIndex = (data: any) => {
  return {
    type: FOR_YOU_TAB_INDEX,
    payload: {
      tabIndex: data,
    },
  };
};

export const onShowCustomizeCategory = (data: any) => {
  return {
    type: SHOW_CUSTOMIZE_CATEGORY,
    payload: {
      showCustomizeCategory: data,
    },
  };
};

export const onSelectedCategory = (data: any) => {
  return {
    type: FOR_YOU_SELECTED_CATEGORY,
    payload: {
      selected_category: data,
    },
  };
};
export const onShowHeaderForYou = (data: any) => {
  return {
    type: SHOW_HEADER_FOR_YOU,
    payload: {
      showHeader: data,
    },
  };
};
export const savedBookMark = (data: any) => {
  return {
    type: FOR_YOU_SAVED_BOOKMARK_CATEGORY,
    payload: {
      for_you_saved_bookmark: data,
    },
  };
};
export const savedBookMarkRunWayTab = (data: any) => {
  return {
    type: FOR_YOU_SAVED_BOOKMARK_RUNWAY_TAB,
    payload: {
      for_you_saved_bookmark_runway_tab: data,
    },
  };
};
export const checkSavedBookMark = (id: any) => {
  return {
    type: SAVED_BOOKMARK_ID,
    payload: {
      saved_bookmark_id: id,
    },
  };
};
export const checkRunWayTabsSavedBookMark = (data: any) => {
  return {
    type: SAVED_BOOKMARK_RUNWAY_TAB_ID,
    payload: {
      saved_bookmark_runway_tab_data: data,
    },
  };
};
export const checkRunWaySavedBookMark = (data: any) => {
  return {
    type: SAVED_BOOKMARK_RUNWAY_ID,
    payload: {
      saved_bookmark_runway_data: data,
    },
  };
};
export const readSavedBookMark = (data: any) => {
  return {
    type: READ_SAVED_BOOKMARK_DATA,
    payload: {
      saved_bookmark_data: data,
    },
  };
};
