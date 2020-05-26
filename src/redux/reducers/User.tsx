import { SAVE_TEXT_SIZE } from '../constants/actionTypes';

const initialState = {
  size: 'small',
};

const user = (state = initialState, action: any) => {
  switch (action.type) {
    case SAVE_TEXT_SIZE:
      return Object.assign({}, state, {
        size: action.payload.size,
      });
    default:
      return state;
  }
};

export default user;
