import { Platform } from 'react-native';
const checkIOSPlatForm = () => {
  return Platform.OS === 'ios' ? true : false;
};
export default checkIOSPlatForm;
