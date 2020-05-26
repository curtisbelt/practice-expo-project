import {
  SHOW_HEADER_FOR_YOU,
  FOR_YOU_SELECTED_CATEGORY,
  FOR_YOU_TAB_INDEX,
  SHOW_CUSTOMIZE_CATEGORY,
} from '../constants/actionTypes';

const initialState = {
  selected_category: [],
  showHeader: true,
  tabIndex: 0,
  showCustomizeCategory: false,
};

const ForYou_MyFeedReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case FOR_YOU_SELECTED_CATEGORY:
      return Object.assign({}, state, {
        selected_category: action.payload.selected_category,
      });
    case SHOW_HEADER_FOR_YOU:
      return Object.assign({}, state, {
        showHeader: action.payload.showHeader,
      });

    case FOR_YOU_TAB_INDEX:
      return Object.assign({}, state, {
        tabIndex: action.payload.tabIndex,
      });
    case SHOW_CUSTOMIZE_CATEGORY:
      return Object.assign({}, state, {
        showCustomizeCategory: action.payload.showCustomizeCategory,
      });

    default:
      return state;
  }
};

export default ForYou_MyFeedReducer;
