import { auditApi, mkPath } from '../config/axios';

export type SigninType = {
  email: string;
  password: string;
};

const path = mkPath('/auth');

export const authApi = {
  signin: (data: SigninType) => auditApi((api) => api.post(path('/signin'), data)),
};
