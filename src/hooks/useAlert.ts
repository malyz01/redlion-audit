import { useReducer } from 'react';

enum Actions {
  SET_OPEN,
  ON_CLOSE,
}

type InitialState = {
  open: boolean;
  message: string;
};

type ActionCreator = {
  type: Actions;
  payload?: Object;
};

const initialState: InitialState = {
  open: false,
  message: '',
};

const reducer = (state: InitialState, { type, payload }: ActionCreator) => {
  switch (type) {
    case Actions.SET_OPEN:
      return { ...state, ...payload };
    case Actions.ON_CLOSE:
      return { ...state, open: false };
    default:
      return state;
  }
};

export const useAlert = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = {
    setOpen: (open: boolean, message: string) => {
      dispatch({ type: Actions.SET_OPEN, payload: { open, message } });
    },
  };

  const alertProps = {
    ...state,
    onClose: () => {
      dispatch({ type: Actions.ON_CLOSE });
    },
  };

  return { alertProps, actions };
};
