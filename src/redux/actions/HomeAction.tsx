import {
  LATEST_NEWS_SUCCESS,
  CATEGORY_INDEX,
  SUBCATEGORY_INDEX,
  SHOW_HEADER_HOME,
  GET_MAIN_MENU,
  PN_STATUS,
  PN_CLOSE_STATUS,
  GET_HOME_CONTENT,
  PN_BR_NEWS_STATUS,
  LOAD_MORE,
} from '../constants/actionTypes';

export const onLoadMore = (data: any) => {
  return {
    type: LOAD_MORE,
    payload: {
      isLoadMore: data,
    },
  };
};

// Call latest news success action
export const onGetLatestNewsSuccess = (data: any) => {
  return {
    type: LATEST_NEWS_SUCCESS,
    payload: {
      latest_news: data,
    },
  };
};

export const changeCategoryIndex = (index: any) => {
  return {
    type: CATEGORY_INDEX,
    payload: {
      category_index: index,
    },
  };
};

export const setSubCategoryIndex = (index: any) => {
  return {
    type: SUBCATEGORY_INDEX,
    payload: {
      subcategory_index: index,
    },
  };
};

export const onShowHeaderHome = (data: any) => {
  return {
    type: SHOW_HEADER_HOME,
    payload: {
      showHeader: data,
    },
  };
};

export const onGetMainMenu = (data: any) => {
  return {
    type: GET_MAIN_MENU,
    payload: {
      data: data,
    },
  };
};

// Notifications
export const setPNotificationStatus = (data: any) => {
  return {
    type: PN_STATUS,
    payload: {
      pn_status: data.status,

      pn_close_status_date: data.statusDate,
      edit_settings: data.statusEdit,
    },
  };
};

export const setPNotificationBRNewsStatus = (status: any) => {
  return {
    type: PN_BR_NEWS_STATUS,
    payload: {
      pn_br_new_status: status,
    },
  };
};

export const closePNotificationStatus = (data: any) => {
  return {
    type: PN_CLOSE_STATUS,
    payload: {
      pn_close_status: data.status,
      pn_close_status_date: data.statusDate,
      edit_settings: data.statusEdit,
    },
  };
};

export const onGetHomeContent = (data: any) => {
  return {
    type: GET_HOME_CONTENT,
    payload: {
      home_content: data,
    },
  };
};
