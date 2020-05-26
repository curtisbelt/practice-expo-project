import * as FileSystem from 'expo-file-system';
import { filePath } from './filePath';

const createDirectory = async () => {
  let result: boolean = false;
  let check = await checkDirectory(filePath);

  if (!check) {
    result = await FileSystem.makeDirectoryAsync(filePath)
      .then(() => {
        return true;
      })
      .catch((_err) => {
        //console.log('dirs' + _err);
        return false;
      });
  } else {
    result = true;
  }
  return result;
};

const checkDirectory = async (path: any) => {
  let result: boolean = false;
  result = await FileSystem.getInfoAsync(path)
    .then((info) => {
      return info.isDirectory && info.exists ? true : false;
    })
    .catch(() => {
      return false;
    });
  return result;
};

const writeFileStream = async (data: any) => {
  let currentData = readFileStream();

  try {
    await FileSystem.writeAsStringAsync(filePath + '/wwd.json', currentData + JSON.stringify(data));
  } catch {
    // do nothing
  }
};

const readFileStream = async () => {
  let result: any = '';
  await FileSystem.readAsStringAsync(filePath + '/wwd.json')
    .then((data) => {
      result = data;
    })
    .catch((_error) => {
      //'error', _error);
      result = null;
    });
  return result;
};

const writeLoginFileStream = async (data: any) => {
  let currentData = readLoginFileStream();
  try {
    await FileSystem.writeAsStringAsync(
      filePath + '/login.json',
      currentData + JSON.stringify(data),
    );
  } catch {
    // do nothing
  }
};

const readLoginFileStream = async () => {
  let result: any = '';
  await FileSystem.readAsStringAsync(filePath + '/login.json')
    .then((data) => {
      result = data;
    })
    .catch((_error) => {
      result = null;
      //console.log('error', _error);
    });
  return result;
};

const writeSubscriptionFileStream = async (data: any) => {
  let currentData = readSubscriptionFileStream();
  try {
    await FileSystem.writeAsStringAsync(
      filePath + '/subs.json',
      currentData + JSON.stringify(data),
    );
  } catch {
    // do nothing
  }
};

const readSubscriptionFileStream = async () => {
  let result: any = '';
  await FileSystem.readAsStringAsync(filePath + '/subs.json')
    .then((data) => {
      result = data;
    })
    .catch((_error) => {
      result = null;
      //console.log('error', _error);
    });
  return result;
};

export {
  createDirectory,
  writeFileStream,
  readFileStream,
  writeLoginFileStream,
  readLoginFileStream,
  writeSubscriptionFileStream,
  readSubscriptionFileStream,
};
