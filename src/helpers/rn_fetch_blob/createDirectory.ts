import RNFetchBlob from 'rn-fetch-blob';
import { filePath } from './filePath';

const createDirectory = async () => {
  let result: boolean = false;
  let check = await checkDirectory(filePath);

  if (!check) {
    result = await RNFetchBlob.fs
      .mkdir(filePath)
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
  result = await RNFetchBlob.fs
    .exists(path)
    .then((exist) => {
      return exist ? true : false;
    })
    .catch(() => {
      return false;
    });
  return result;
};

const writeFileStream = async (data: any) => {
  try {
    await RNFetchBlob.fs.writeStream(filePath + '/wwd.json', 'utf8').then((stream) => {
      stream.write(JSON.stringify(data));
      return stream.close();
    });
  } catch {
    // do nothing
  }
};

const readFileStream = async () => {
  let result: any = '';
  await RNFetchBlob.fs
    .readFile(filePath + '/wwd.json', 'utf8')
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
  try {
    await RNFetchBlob.fs.writeStream(filePath + '/login.json', 'utf8').then((stream) => {
      stream.write(JSON.stringify(data));
      return stream.close();
    });
  } catch {
    // do nothing
  }
};

const readLoginFileStream = async () => {
  let result: any = '';
  await RNFetchBlob.fs
    .readFile(filePath + '/login.json', 'utf8')
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
  try {
    await RNFetchBlob.fs.writeStream(filePath + '/subs.json', 'utf8').then((stream) => {
      stream.write(JSON.stringify(data));
      return stream.close();
    });
  } catch {
    // do nothing
  }
};

const readSubscriptionFileStream = async () => {
  let result: any = '';
  await RNFetchBlob.fs
    .readFile(filePath + '/subs.json', 'utf8')
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
