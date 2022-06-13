import { auditApi, mkPath } from '../lib/axios';

export type CreateAccountType = {
  name: string;
  address: string;
  country: string;
  setDefault: boolean;
};

const path = mkPath('/accounts');

export const accountApi = {
  createAccount: (data: CreateAccountType) => {
    return auditApi((api) => api.post(path(), data));
  },
};
