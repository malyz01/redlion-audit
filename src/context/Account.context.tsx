import { createContext, useContext, useEffect, useReducer } from 'react';
import useSWR from 'swr';

import { AccessTypeEnum } from '../../typings/enum';
import { ReactProps } from '../../typings/react';
import useUser from '../../src/hooks/useUser';
import { fetcher } from '../lib/axios';

enum Actions {
  SET_ACCOUNT,
}

type Accounts = {
  id: number;
  name: string;
  accessType: AccessTypeEnum;
};

type InitialState = {
  isLoaded: boolean;
  default?: Accounts | null;
  selected?: Accounts | null;
};

type ActionsTypes = {
  setDefault?: () => void;
};

type ActionCreator = {
  type: Actions;
  payload?: Object;
};

interface AccountContextType extends InitialState, ActionsTypes {}

const initialState: InitialState = {
  isLoaded: false,
  default: null,
  selected: null,
};

const reducer = (state: InitialState, { type, payload }: ActionCreator) => {
  switch (type) {
    case Actions.SET_ACCOUNT:
      return { ...state, ...payload };

    default:
      return state;
  }
};

const AccountContext = createContext<AccountContextType>(initialState);
AccountContext.displayName = 'AccountContext';

export const AccountProvider = ({ children }: ReactProps) => {
  const { data: accounts } = useSWR<Accounts[]>('/accounts', fetcher());
  const { user } = useUser();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (accounts && user && !state.isLoaded) {
      const defaultAccount = user?.defaultAccount ? {id: user.defaultAccount.id, name: user.defaultAccount.name, accessType:} as Accounts : null
      dispatch({type: Actions.SET_ACCOUNT, payload: {isLoaded: true, default: {}}})
    }
  }, [accounts, user, state.isLoaded])

  const actions = {};

  const value = {...state};

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
};

export const useAccount = () => {
  return useContext(AccountContext);
};
