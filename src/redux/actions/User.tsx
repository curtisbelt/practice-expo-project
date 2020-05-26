import { SAVE_TEXT_SIZE } from '../constants/actionTypes';

export const saveTextSize = (size: any) => {
  return {
    type: SAVE_TEXT_SIZE,
    payload: {
      size: size,
    },
  };
};
