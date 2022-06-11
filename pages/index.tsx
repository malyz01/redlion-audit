import type { NextPage } from 'next';
import { Head } from '../components/1-common';
import { useUser } from '../context/user.context';
import { Protected } from '../hoc/protected';

const Home: NextPage = () => {
  const { user } = useUser();

  return (
    <div>
      <Head title="Home" description="Home page" />

      <div>HOMEPAGE</div>
    </div>
  );
};

export default Protected(Home);
