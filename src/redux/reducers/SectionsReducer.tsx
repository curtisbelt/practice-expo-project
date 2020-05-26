import { SHOW_HEADER_SECTIONS, SUB_SECTIONS__INDEX } from '../constants/actionTypes';
const initialState = {
  showHeader: true,
  sub_sections_index: null,
};
const SectionsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SHOW_HEADER_SECTIONS:
      return Object.assign({}, state, {
        showHeader: action.payload.showHeader,
      });

    case SUB_SECTIONS__INDEX:
      return Object.assign({}, state, {
        sub_sections_index: action.payload.sub_sections_index,
      });
    default:
      return state;
  }
};

export default SectionsReducer;
