import axios from 'axios';
import { LoginResponseType } from '../../pages/api/login';
import { handleAxiosError, handleResponse } from '../lib/axios';

export type SigninType = {
  email: string;
  password: string;
};

export const authApi = {
  login: (data: SigninType): Promise<LoginResponseType> =>
    axios.post(`/api/login`, data).then(handleResponse).catch(handleAxiosError),
  logout: () => axios.get('/api/logout').then(handleResponse).catch(handleAxiosError),
};
