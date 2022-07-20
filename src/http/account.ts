import { auditApi, mkPath } from '../lib/axios';

export type CreateAccountType = {
  name: string;
  address: string;
  country: string;
  setDefault: boolean;
};

const path = mkPath('/accounts');

export const accountUrl = {
  id: (id: number | string) => path(`/${id}`),
  id_moderators: (id: number | string) => path(`/${id}/moderators`),
};

export const accountApi = {
  createAccount: (data: CreateAccountType) => auditApi((api) => api.post(path(), data)),
};
