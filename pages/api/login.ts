import axios from 'axios';
import { withIronSessionApiRoute } from 'iron-session/next';

import { sessionOptions } from '../../src/lib/iron-session';
import { NextApiRequest, NextApiResponse } from 'next';
import { UserResponseType, UserType } from './user';

type SigninType = {
  email: string;
  password: string;
};

type ServerSigninResponseType = {
  accessToken: string;
  user: UserType;
};

export type LoginResponseType = UserResponseType & {
  accessToken: string | null;
  message?: string;
};

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req: NextApiRequest, res: NextApiResponse<LoginResponseType>) {
  const body = req.body as SigninType;
  const baseURL = process.env.NEXT_PUBLIC_AUDIT_SERVER_URL;

  try {
    const { data: auth } = await axios.post<ServerSigninResponseType>(`${baseURL}/auth/signin`, body);
    const { accessToken } = auth;
    req.session.accessToken = accessToken;
    await req.session.save();

    const { data: user } = await axios.get(`${baseURL}/user/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    res.json({ accessToken, user, isLoggedIn: true });
  } catch (error) {
    req.session.destroy();
    res.status(401).json({ message: 'Incorrect email/password', accessToken: null, isLoggedIn: false });
  }
}
