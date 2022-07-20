import { createContext, useContext, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { pick } from 'lodash';

import { ReactProps } from '../../typings/react';
import useUser from '../hooks/useUser';
import { fetcher } from '../lib/axios';
import { accountApi, CreateAccountType } from '../http/account';
import { userSettingApi, userSettingUrl } from '../http/userSetting';
import { ActionCreatorType } from '../../typings/shared';
import { AccessTypeEnum } from '../../typings/enum';

// =====
// TYPES
// =====
enum Actions {
  SET_ACCOUNT,
  LOG_OUT,
}

export enum ACCOUNT_CREATE_TYPE {
  create = 'CREATE',
  createAsDefault = 'CREATE AS DEFAULT',
}

export interface SwitchableAccountType {
  id: number;
  name: string;
  accessType: AccessTypeEnum;
  sequence: number;
  isDefault: boolean;
}

type InitialState = {
  isLoggedIn: boolean;
  default: SwitchableAccountType | null;
  selected: SwitchableAccountType | null;
  accounts: SwitchableAccountType[];
  actions: ActionsTypes;
};

type ActionsTypes = {
  setSelected: (account: SwitchableAccountType) => void;
  setDefaultAccount: (account: SwitchableAccountType | null) => void;
  createAccount: (val: CreateAccountType, type: ACCOUNT_CREATE_TYPE) => void;
  logout: () => void;
  mutateSwitchableAccount: Function;
};

interface NavContextType extends InitialState {
  actions: ActionsTypes;
}

// =========
// CONSTANTS
// =========
const { switchable_accounts } = userSettingUrl;

// =======
// HELPERS
// =======
const transformAccountName = (account: SwitchableAccountType, isDefault: boolean): SwitchableAccountType => ({
  ...account,
  name: `${account.name}${isDefault ? '*' : ''}`,
  isDefault,
});

const updateSelected = (currentSelected: SwitchableAccountType | null, selectedAccount: SwitchableAccountType) => {
  if (!currentSelected) return null;
  return transformAccountName(selectedAccount, true);
};

const updateAccounts = (defaultAccount: SwitchableAccountType, accounts: SwitchableAccountType[]) => {
  return accounts;
};

// refactor
const getUpdatedAccounts = (account: SwitchableAccountType, allAccounts: SwitchableAccountType[]) => {
  const updatedAccounts: SwitchableAccountType[] = [];

  for (const acc of allAccounts as SwitchableAccountType[]) {
    acc.id === account?.id ? updatedAccounts.push({ ...acc, name: `${acc.name}*` }) : acc;
  }
  return updatedAccounts;
};

// =====
// STATE
// =====
const initialState: InitialState = {
  isLoggedIn: false,
  default: null,
  selected: null,
  accounts: [],
  actions: {
    createAccount(val, type) {},
    setDefaultAccount(account?) {},
    setSelected(account) {},
    logout() {},
    mutateSwitchableAccount() {},
  },
};

const reducer = (state: InitialState, { type, payload }: ActionCreatorType<Actions>) => {
  switch (type) {
    case Actions.SET_ACCOUNT:
      return { ...state, ...(payload as Record<string, unknown>) };
    case Actions.LOG_OUT:
      return initialState;
    default:
      return state;
  }
};

// =======
// CONTEXT
// =======
const NavContext = createContext<NavContextType>(initialState);
NavContext.displayName = 'NavContext';

export const NavProvider = ({ children }: ReactProps) => {
  const { user, mutateUser } = useUser();
  const {
    data: switchableAccounts,
    isValidating,
    error,
    mutate: mutateSwitchableAccount,
  } = useSWR<SwitchableAccountType[]>(user ? switchable_accounts : null, fetcher(), {
    revalidateOnMount: true,
    revalidateIfStale: false,
    revalidateOnFocus: true,
    revalidateOnReconnect: false,
    errorRetryCount: 1,
    shouldRetryOnError(err) {
      return err.message !== 'Unauthorized';
    },
  });
  const { push } = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!error && switchableAccounts && user) {
      const accounts = switchableAccounts.map((account) => transformAccountName(account, account.isDefault));
      const defaultAccount = accounts.find((switchableAccount) => switchableAccount.isDefault) || null;

      dispatch({
        type: Actions.SET_ACCOUNT,
        payload: {
          isLoggedIn: true,
          default: defaultAccount,
          selected: defaultAccount, // set the defaultAccount as selected when the component first loads
          accounts,
        },
      });
    }
  }, [error, isValidating, switchableAccounts, user]);

  const actions = {
    setSelected: (account: SwitchableAccountType) => {
      const isDefault = state.default ? state.default.id === account.id : false;
      dispatch({ type: Actions.SET_ACCOUNT, payload: { selected: { ...account, isDefault } } });
    },
    setDefaultAccount: async (selectedAccount: SwitchableAccountType | null) => {
      if (!selectedAccount || !user) return;

      try {
        await userSettingApi.updateDefaultAccount({
          defaultAccountId: selectedAccount.id,
        });
        mutateUser();
        mutateSwitchableAccount();
      } catch (error) {
        console.log('if api fails, then show error alert');
      }
    },
    createAccount: async (val: CreateAccountType, type: ACCOUNT_CREATE_TYPE) => {
      const isSetDefault = type === ACCOUNT_CREATE_TYPE.createAsDefault;
      val.setDefault = isSetDefault;

      const account = await accountApi.createAccount(val);
      mutateSwitchableAccount();
      push(`/accounts/${account.id}`);
    },
    logout: () => {
      dispatch({ type: Actions.LOG_OUT });
    },
    mutateSwitchableAccount,
  };

  const value = { ...state, actions };

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
};

export const useNavContext = () => {
  return useContext(NavContext);
};
