import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';

import { sessionOptions } from '../../src/lib/iron-session';
import { RoleEnum, TimeZoneEnum } from '../../typings/enum';

export type UserType = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: RoleEnum;
  timezone: TimeZoneEnum;
  defaultAccount: number;
};

export type UserResponseType = {
  isLoggedIn: boolean;
  user?: UserType;
};

export default withIronSessionApiRoute(userRoute, sessionOptions);

async function userRoute(req: NextApiRequest, res: NextApiResponse<UserResponseType>) {
  if (req.session.accessToken) {
    const baseURL = process.env.NEXT_PUBLIC_AUDIT_SERVER_URL;
    const { data: user } = await axios.get(`${baseURL}/user/me`, {
      headers: { Authorization: `Bearer ${req.session.accessToken}` },
    });

    res.json({
      user,
      isLoggedIn: true,
    });
  } else {
    res.json({
      isLoggedIn: false,
    });
  }
}
