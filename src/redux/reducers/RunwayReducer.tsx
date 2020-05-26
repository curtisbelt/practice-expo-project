import {
  SHOW_HEADER_RUNWAY,
  RUNWAY_ID,
  RUNWAY_REVIEW,
  RUNWAY_SUCCESS,
} from '../constants/actionTypes';
const initialState = {
  showHeader: true,
  runway_id: null,
  runway_review: '',
  runway_data: [],
};
const RunwayReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SHOW_HEADER_RUNWAY:
      return Object.assign({}, state, {
        showHeader: action.payload.showHeader,
      });

    case RUNWAY_ID:
      return Object.assign({}, state, {
        runway_id: action.payload.runway_id,
      });

    case RUNWAY_REVIEW:
      return Object.assign({}, state, {
        runway_review: action.payload.runway_review,
      });
    case RUNWAY_SUCCESS:
      return Object.assign({}, state, {
        runway_data: action.payload.runway_data,
      });

    default:
      return state;
  }
};

export default RunwayReducer;
