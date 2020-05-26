import {
  SHOW_HEADER_RUNWAY,
  RUNWAY_ID,
  RUNWAY_REVIEW,
  RUNWAY_SUCCESS,
} from '../constants/actionTypes';
export const onShowHeaderRunway = (data: any) => {
  return {
    type: SHOW_HEADER_RUNWAY,
    payload: {
      showHeader: data,
    },
  };
};
export const runwayId = (id: any) => {
  return {
    type: RUNWAY_ID,
    payload: {
      runway_id: id,
    },
  };
};

export const runwatReview = (RunwayReview: any) => {
  return {
    type: RUNWAY_REVIEW,
    payload: {
      runway_review: RunwayReview,
    },
  };
};
export const onGetRunwaySuccess = (data: any) => {
  return {
    type: RUNWAY_SUCCESS,
    payload: {
      runway_data: data,
    },
  };
};
