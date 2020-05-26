import { Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
const dirs = RNFetchBlob.fs.dirs;
export const filePath =
  Platform.OS === 'ios' ? dirs.DocumentDir + '/wwd_data' : dirs.MainBundleDir + '/wwd_data';
