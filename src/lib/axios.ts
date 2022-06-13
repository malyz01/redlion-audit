import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

export enum TokenName {
  na = 'n/a',
  audit = 'auditAccessToken',
}

type FuncApi = (api: AxiosInstance) => Promise<AxiosResponse>;

export const handleResponse = (response: AxiosResponse) => response.data;

export const handleAxiosError = (error: AxiosError) => {
  const formattedInfoError = `ERROR DETAILS:
  authorization: ${error?.config?.headers?.Authorization}
  content-type: ${error?.config?.headers?.['Content-Type']}
  response: ${(error?.response?.data as any).message}
  body:`;

  const logEnabled = JSON.parse(process.env.NEXT_PUBLIC_LOGS || 'false');
  if (logEnabled) console.error(formattedInfoError, error?.config?.data);
  throw new Error((error?.response?.data as any).message as string);
};

const getToken = (tokenName: TokenName) => {
  if (tokenName === TokenName.na) return '';
  return typeof window !== 'undefined' ? localStorage.getItem(tokenName) || '' : '';
};

export const auditApi = async (func: FuncApi) => {
  const token = getToken(TokenName.audit);
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_AUDIT_SERVER_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return func(api).then(handleResponse).catch(handleAxiosError);
};

export const mkPath =
  (basePath: string) =>
  (path = '') =>
    basePath + path;

export const fetcher =
  (tokenName: TokenName = TokenName.audit) =>
  async (endpoint: string, param?: string) => {
    const baseURL = tokenName === TokenName.na ? '' : process.env.NEXT_PUBLIC_AUDIT_SERVER_URL;
    const token = getToken(tokenName);
    const url = param ? baseURL + endpoint + '/' + param : baseURL + endpoint;
    return axios
      .get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(handleResponse)
      .catch(handleAxiosError);
  };
