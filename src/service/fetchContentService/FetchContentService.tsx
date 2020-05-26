import { ApiRequest } from '../config';
import NetInfo from '@react-native-community/netinfo';
import translate from '../../assets/strings/strings';

let { isConnected } = false;

NetInfo.configure({
  reachabilityUrl: 'https://clients3.google.com/generate_204',
  reachabilityTest: async (response) => response.status === 204,
  reachabilityLongTimeout: 30 * 1000, // 30s
  reachabilityShortTimeout: 5 * 1000, // 5s
  reachabilityRequestTimeout: 15 * 1000, // 15s
});
NetInfo.addEventListener((state) => {
  isConnected = state.isConnected;
});

function apiService(apiPath: any, apiMethod: any, onSuccess: any, onFailure: any) {
  if (isConnected) {
    ApiRequest({
      url: apiPath,
      method: apiMethod,
    }).then(
      (response) => {
        onSuccess(response);
      },
      (error) => {
        onFailure(error);
      },
    );
  } else {
    ApiRequest({
      url: apiPath,
      method: apiMethod,
    }).then((_error) => {
      onFailure(translate('no_internet'));
    });
  }
}

export default apiService;
