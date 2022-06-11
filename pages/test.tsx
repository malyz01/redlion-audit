import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";

const Test = () => {
  const { user } = useUser();
  return (
    <main>
      <div>test</div>
      <a href="/api/auth/login">Login</a>
      <a href="/api/auth/logout">Logout</a>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </main>
  );
};

export default Test;
