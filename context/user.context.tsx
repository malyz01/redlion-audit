import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { userApi } from '../api/user';
import { ReactProps } from '../typings/react';
import { ErrorToast } from '../components/2-compound';

enum Actions {
  SIGN_IN,
  SET_USER,
  SET_PROFILE,
  CLEAR_USER,
}

type InitialState = {
  user: any;
  profile: any;
};

type UserContextType = InitialState & {
  actions?: {
    signIn: (accessToken: string, profile: any) => void;
    reFetchProfile: (profile: any) => void;
    clearUser: () => void;
  };
};

let accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

const initialState: InitialState = {
  user: accessToken ? jwt.decode(accessToken) : null,
  profile: null,
};

const reducer = (state: InitialState, { type, payload }: { type: Actions; payload?: Object }) => {
  switch (type) {
    case Actions.SIGN_IN:
      return { ...state, ...payload };
    case Actions.SET_USER:
      return { ...state, user: payload };
    case Actions.SET_PROFILE:
      return { ...state, profile: payload };
    case Actions.CLEAR_USER:
      return { ...initialState, user: null };
    default:
      return state;
  }
};

const UserContext = createContext<UserContextType>(initialState);
UserContext.displayName = 'UserContext';

export const UserProvider = ({ children }: ReactProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!state.user && accessToken) {
      const decoded = jwt.decode(accessToken as string);
      dispatch({
        type: Actions.SET_USER,
        payload: decoded as JwtPayload,
      });
    }
  }, [state.user]);

  useEffect(() => {
    if (accessToken && state.user && !state.profile) {
      const fetchProfile = async () => {
        try {
          const profile = await userApi.me();
          dispatch({ type: Actions.SET_PROFILE, payload: profile });
        } catch (error) {
          setOpen(true);
        }
      };
      fetchProfile();
    }
  }, [state]);

  const actions: UserContextType['actions'] = {
    signIn: (accessToken: string, profile?: any) => {
      const decoded = jwt.decode(accessToken);
      dispatch({
        type: Actions.SIGN_IN,
        payload: { user: decoded, profile },
      });
      window.localStorage.setItem('accessToken', accessToken);
    },
    reFetchProfile: async () => {
      const profile = await userApi.me();
      dispatch({ type: Actions.SET_PROFILE, payload: profile });
    },
    clearUser: async () => {
      window.localStorage.removeItem('accessToken');
      accessToken = null;
      dispatch({ type: Actions.CLEAR_USER });
    },
  };

  return (
    <UserContext.Provider value={{ ...state, actions }}>
      <ErrorToast open={open} setOpen={setOpen} />
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
