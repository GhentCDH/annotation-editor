import type { AxiosInstance } from 'axios';

let _api: AxiosInstance;

export const configureApi = (api: AxiosInstance) => {
  _api = api;
};
