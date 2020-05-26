import axios from 'axios';
import { ApiUrls, Auth } from './serviceConstants';

export const WWDInstance1 = axios.create({
  baseURL: ApiUrls.PROD_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: Auth.AUTHORIZATION,
  },
});

export const WWDInstance3 = axios.create({
  baseURL: ApiUrls.PROD_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Authorization: Auth.AUTHORIZATION,
  },
});
