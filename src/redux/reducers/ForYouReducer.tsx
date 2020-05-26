import {
  FOR_YOU_SAVED_BOOKMARK_CATEGORY,
  SAVED_BOOKMARK_ID,
  READ_SAVED_BOOKMARK_DATA,
  SAVED_BOOKMARK_RUNWAY_ID,
  SAVED_BOOKMARK_RUNWAY_TAB_ID,
  FOR_YOU_SAVED_BOOKMARK_RUNWAY_TAB,
} from '../constants/actionTypes';

const initialState = {
  forYouSavedData: [],
  checkBookMark: false,
};

const ForYouReducer = (state = initialState, action: any) => {
  let index;

  switch (action.type) {
    case FOR_YOU_SAVED_BOOKMARK_CATEGORY:
      try {
        if (state.forYouSavedData.length > 0) {
          index = state.forYouSavedData.findIndex(
            (x) => x.data.id == action.payload.for_you_saved_bookmark.data.id,
          );
          // here you can check specific property for an object whether it exist in your array or not
          if (index === -1) {
            state.forYouSavedData.unshift(action.payload.for_you_saved_bookmark);
            state.checkBookMark = true;
          } else {
            state.forYouSavedData.splice(index, 1);
            state.checkBookMark = false;
          }
        } else {
          state.forYouSavedData.push(action.payload.for_you_saved_bookmark);
          state.checkBookMark = true;
        }
      } catch {
        // do nothing
      }
      return Object.assign({}, state);
    case FOR_YOU_SAVED_BOOKMARK_RUNWAY_TAB:
      try {
        var runwatindex = state.forYouSavedData.findIndex(
          (x) =>
            x.data.id == action.payload.for_you_saved_bookmark_runway_tab.data.id &&
            x.data.tabIndex == action.payload.for_you_saved_bookmark_runway_tab.data.tabIndex,
        );
        // here you can check specific property for an object whether it exist in your array or not
        if (runwatindex === -1) {
          state.forYouSavedData.unshift(action.payload.for_you_saved_bookmark_runway_tab);
          state.checkBookMark = true;
        } else {
          state.forYouSavedData.splice(runwatindex, 1);
          state.checkBookMark = false;
        }
      } catch {
        // do nothing
      }
      return Object.assign({}, state);
    case SAVED_BOOKMARK_ID:
      index = state.forYouSavedData.findIndex(
        (x) => x.data.id === action.payload.saved_bookmark_id,
      );
      if (index === -1) {
        state.checkBookMark = false;
      } else {
        state.checkBookMark = true;
      }

      return Object.assign({}, state);
    case SAVED_BOOKMARK_RUNWAY_ID:
      var data = action.payload.saved_bookmark_runway_data;
      index = state.forYouSavedData.findIndex(
        (x) => x.data.id === data.id && x.data.runwayId === data.runwayId,
      );
      if (index === -1) {
        state.checkBookMark = false;
      } else {
        state.checkBookMark = true;
      }

      return Object.assign({}, state);
    case SAVED_BOOKMARK_RUNWAY_TAB_ID:
      var tabdata = action.payload.saved_bookmark_runway_tab_data;
      index = state.forYouSavedData.findIndex(
        (x) => x.data.id === tabdata.id && x.data.tabIndex === tabdata.tabIndex,
      );
      if (index === -1) {
        state.checkBookMark = false;
      } else {
        state.checkBookMark = true;
      }

      return Object.assign({}, state);
    case READ_SAVED_BOOKMARK_DATA:
      return Object.assign({}, state, {
        forYouSavedData: action.payload.saved_bookmark_data,
      });

    default:
      return state;
  }
};

export default ForYouReducer;
