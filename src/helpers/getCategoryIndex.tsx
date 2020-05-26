export const getCategoryIndex = (sections, title) => {
  var section_index = 0;
  title = title.replace("'", '');

  sections && sections.length > 0
    ? sections.map((section, index) => {
        if (title.includes(section.title.replace('’', ''))) {
          section_index = index;
        }
      })
    : null;

  return section_index;
};

export const getSubCategoryIndex = (sections, title) => {
  title = title.toLowerCase();
  var section_index = 0;
  var sub_section_index = 0;

  sections && sections.length > 0
    ? sections.map((section, index) => {
        section.children && section.children.length > 0
          ? section.children.map((sub_sec, sub_index) => {
              if (title.includes(sub_sec.title.toLowerCase())) {
                section_index = index;
                sub_section_index = sub_index;
              }
            })
          : null;
      })
    : null;

  return { section_index, sub_section_index };
};
