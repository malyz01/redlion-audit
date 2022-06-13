import type { NextPage } from 'next';
import { Head, PageLoading } from '../components/1-common';
import useUser from '../src/hooks/useUser';

const Home: NextPage = () => {
  const { user, isLoggedIn } = useUser({ redirectTo: '/auth/login' });

  if (!isLoggedIn) return <PageLoading />;
  return (
    <div>
      <Head title="Home" description="Home page" />

      <div>HOMEPAGE</div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default Home;
