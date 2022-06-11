import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

type FuncApi = (api: AxiosInstance) => Promise<AxiosResponse>;

export const handleResponse = (response: AxiosResponse) => response.data;

export const handleAxiosError = (error: AxiosError) => {
  const formattedInfoError = `ERROR DETAILS:
  authorization: ${error?.config?.headers?.Authorization}
  content-type: ${error?.config?.headers?.['Content-Type']}
  body:`;

  const logEnabled = JSON.parse(process.env.NEXT_PUBLIC_LOGS || 'false');
  if (logEnabled) console.error(formattedInfoError, error?.config?.data);
  throw new Error('Something went wrong. Please contact support.');
};

export const auditApi = async (func: FuncApi) => {
  let token: string = '';

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('accessToken') || '';
  }

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_AUDIT_SERVER_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return func(api).then(handleResponse).catch(handleAxiosError);
};

export const mkPath = (basePath: string) => (path: string) => basePath + path;
