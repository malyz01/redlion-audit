import { auditApi, mkPath } from '../config/axios';

export type SigninType = {
  email: string;
  password: string;
};

const path = mkPath('/user');

export const userApi = {
  me: () => auditApi((api) => api.get(path('/me'))),
};
