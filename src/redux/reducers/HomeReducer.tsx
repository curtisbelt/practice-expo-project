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

const initialState = {
  latest_news: [],
  category_index: 0,
  subcategory_index: 0,
  showHeader: true,
  menu_sections: [],
  pn_status: 'hide',
  pn_close_status: 'show',
  pn_close_status_date: null,
  edit_settings: true,
  home_content: [],
  pn_br_new_status: false,
  isLoadMore: false,
};

const HomeReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case LATEST_NEWS_SUCCESS:
      return Object.assign({}, state, {
        latest_news: action.payload.latest_news,
      });
    case LOAD_MORE:
      return Object.assign({}, state, {
        isLoadMore: action.payload.isLoadMore,
      });

    case CATEGORY_INDEX:
      return Object.assign({}, state, {
        category_index: action.payload.category_index,
        showHeader: true,
      });

    case SUBCATEGORY_INDEX:
      return Object.assign({}, state, {
        subcategory_index: action.payload.subcategory_index,
      });

    case SHOW_HEADER_HOME:
      return Object.assign({}, state, {
        showHeader: action.payload.showHeader,
      });

    case GET_MAIN_MENU:
      return Object.assign({}, state, {
        menu_sections: action.payload.data,
      });

    case PN_STATUS:
      return Object.assign({}, state, {
        pn_status: action.payload.pn_status,
        pn_close_status_date: action.payload.pn_close_status_date,
        edit_settings: action.payload.edit_settings,
      });

    case PN_CLOSE_STATUS:
      return Object.assign({}, state, {
        pn_close_status: action.payload.pn_close_status,
        pn_close_status_date: action.payload.pn_close_status_date,
        edit_settings: action.payload.edit_settings,
      });

    case PN_BR_NEWS_STATUS:
      return Object.assign({}, state, {
        pn_br_new_status: action.payload.pn_br_new_status,
      });

    case GET_HOME_CONTENT:
      return Object.assign({}, state, {
        home_content: action.payload.home_content,
      });

    default:
      return state;
  }
};

export default HomeReducer;
