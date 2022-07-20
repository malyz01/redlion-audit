import { createContext, useContext, useEffect, useReducer } from 'react';
import useSWR, { KeyedMutator } from 'swr';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { fetcher } from '../lib/axios';
import { PageLoading } from '../../components/1-common';
import { ActionCreatorType, InitialStatePageType } from '../../typings/shared';
import { mkSWRPath } from '../util/swr';

enum Actions {
  SET_PAGE,
  SET_FILTER,
}

export enum FilterType {
  ADD,
  REMOVE,
}

export type AccountPageQueries = {
  name?: string;
  address?: string;
  country?: string;
  createdAt?: string;
  createdBy?: number;
};

type AccountData = {
  accessType: string;
  address: string;
  country: string;
  createdAt: string;
  id: number;
  name: string;
  sequence: number;
  updatedAt: string;
};

type ActionFunc = {
  actions: {
    setCurrentPage: (page: number) => void;
    setFilters: (type: FilterType, name: keyof AccountPageQueries, value?: string | number) => void;
    mutatePageAccount: Function;
  };
};

type InitialState = InitialStatePageType<AccountPageQueries, AccountData[]> & ActionFunc;

const initialValues: InitialState = {
  pagination: {
    currentPage: 1,
    pageSize: 20,
  },
  query: {},
  data: null,
  actions: {
    setCurrentPage(page) {},
    setFilters(type, name, value?) {},
    mutatePageAccount() {},
  },
};

// CONTEXT
export const AccountContext = createContext<InitialState>(initialValues);
AccountContext.displayName = 'AccountContext';

const reducer = (state: InitialState, { type, payload }: ActionCreatorType<Actions>) => {
  switch (type) {
    case Actions.SET_PAGE:
      return { ...state, pagination: { ...state.pagination, currentPage: payload as number } };
    case Actions.SET_FILTER:
      return { ...state, query: payload as AccountPageQueries };
    default:
      return state;
  }
};

export const AccountPageProvider = (Component: NextPage<Object, Object>) => {
  const Wrapper = (props: any) => {
    const { replace } = useRouter();
    const [state, dispatch] = useReducer(reducer, initialValues);
    const swrPath = mkSWRPath('/accounts', state.pagination, state.query);
    const { data, error, mutate: mutatePageAccount } = useSWR(swrPath, fetcher());

    useEffect(() => {
      if (error) replace('404');
    }, [error, replace]);

    if (!data) return <PageLoading />;

    const actions: ActionFunc['actions'] = {
      setCurrentPage: (page: number) => dispatch({ type: Actions.SET_PAGE, payload: page }),
      setFilters: (type: FilterType, name: keyof AccountPageQueries, value?: string | number) => {
        const payload: AccountPageQueries = { ...state.query };
        if (type === FilterType.ADD) Object.assign(payload, { [name]: value });
        if (type === FilterType.REMOVE) delete payload[name];
        dispatch({ type: Actions.SET_FILTER, payload });
      },
      mutatePageAccount,
    };

    const value = {
      pagination: {
        ...state.pagination,
        totalCount: data.totalCount,
      },
      query: null,
      data: state.data ?? (data.result as AccountData[]),
      actions, // immutable
    };

    return (
      <AccountContext.Provider value={value}>
        <Component {...props} />
      </AccountContext.Provider>
    );
  };
  return Wrapper;
};

export const useAccountContext = () => useContext(AccountContext);
