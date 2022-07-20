import { auditApi, mkPath } from '../lib/axios';

export type DefaultAccountDto = {
  defaultAccountId: number;
};

const path = mkPath('/user-setting');

export const userSettingUrl = {
  switchable_accounts: path(`/switchable-accounts`),
};

export const userSettingApi = {
  updateDefaultAccount: (defaultAccountDto: DefaultAccountDto) =>
    auditApi((api) => api.patch(path('/default-account'), defaultAccountDto)),
  updatedSwitchableAccounts: (accountId: number) =>
    auditApi((api) => api.patch(path(`/switchable-accounts`), { accountId })),
};
