import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser } from '../context/user.context';

export const Protected = (Component: any) => {
  const Wrapper = (props: any) => {
    const { user } = useUser();
    const { replace } = useRouter();

    useEffect(() => {
      if (!user) replace('/auth/login');
    });

    return <Component {...props} />;
  };

  return Wrapper;
};
