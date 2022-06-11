import { useEffect } from 'react';
import Router from 'next/router';
import useSWR from 'swr';

import type { UserResponseType } from '../../pages/api/user';
import { fetcher } from '../lib/axios';

export default function useUser({ redirectTo = '', redirectIfFound = false } = {}) {
  const { data, mutate: mutateUser } = useSWR<UserResponseType>('/api/user', fetcher);

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !data) return;

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !data?.isLoggedIn) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && data?.isLoggedIn)
    ) {
      Router.push(redirectTo);
    }
  }, [data, redirectIfFound, redirectTo]);

  return { ...data, mutateUser };
}
