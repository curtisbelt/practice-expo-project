import { SHOW_HEADER_SECTIONS, SUB_SECTIONS__INDEX } from '../constants/actionTypes';

export const onShowHeaderSections = (data: any) => {
  return {
    type: SHOW_HEADER_SECTIONS,
    payload: {
      showHeader: data,
    },
  };
};
export const setSubSectionsIndex = (index: any) => {
  return {
    type: SUB_SECTIONS__INDEX,
    payload: {
      sub_sections_index: index,
    },
  };
};
