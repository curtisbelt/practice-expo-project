const titleCase = (data: any) => {
  return data
    .split(' ')
    .map((w: any) => w[0].toUpperCase() + w.substr(1).toLowerCase())
    .join(' ');
};
export default titleCase;
