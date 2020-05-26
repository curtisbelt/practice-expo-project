import { Platform, NativeModules } from 'react-native';

const ClearSavedEditions = async () => {
  // Clear all Digital daily saved data
  if (Platform.OS === 'ios') {
    await NativeModules.Reader.getAllDownloads().then((response) => {
      if (response && response.downloadedEditions.length > 0) {
        response.downloadedEditions.map(async (editionID) => {
          await NativeModules.Reader.deleteDownload(editionID);
        });
      }
    });
  } else {
    await NativeModules.PageSuite.getAllDownloads(async (data) => {
      if (data) {
        for (let key in data) {
          let EditionData = data[key].split('/');
          await NativeModules.PageSuite.deleteDownload(EditionData[0], (_data: any) => {});
          // console.log('Downloads Android', EditionData[0]);
        }
      }
    });
  }
};

export default ClearSavedEditions;
