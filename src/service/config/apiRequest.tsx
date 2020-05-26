import { WWDInstance1 } from './network';

/**
 * Request Wrapper with default success/error actions
 */
export const ApiRequest = async function (options: any) {
  const onSuccess = await function (response: any) {
    if (response.status === 200) {
      // console.log(response);
      return response;
    } else {
      return Promise.reject(response);
    }
  };

  const onError = await function (_error: any) {};

  try {
    const response = await WWDInstance1(options);
    return onSuccess(response);
  } catch (error) {
    return onError(error);
  }
};
