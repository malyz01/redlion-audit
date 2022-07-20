import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';

import { sessionOptions } from '../../src/lib/iron-session';
import { AccessTypeEnum, RoleEnum, TimeZoneEnum } from '../../typings/enum';

export type DefaultAccountType = {
  id: number;
  name: string;
  accessType: AccessTypeEnum;
};

export type UserSettingType = {
  id: number;
  timezone: TimeZoneEnum;
  defaultAccount: DefaultAccountType | null;
};

export type UserType = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: RoleEnum;
  setting: UserSettingType;
};

export type UserResponseType = {
  isLoggedIn: boolean;
  user?: UserType;
};

export default withIronSessionApiRoute(userRoute, sessionOptions);

async function userRoute(req: NextApiRequest, res: NextApiResponse<UserResponseType>) {
  const invalidUser = () => {
    req.session.destroy();
    res.json({ isLoggedIn: false });
  };

  if (req.session.accessToken) {
    const baseURL = process.env.NEXT_PUBLIC_AUDIT_SERVER_URL;

    try {
      const { data: user } = await axios.get(`${baseURL}/user/me`, {
        headers: { Authorization: `Bearer ${req.session.accessToken}` },
      });
      res.json({
        user,
        isLoggedIn: true,
      });
    } catch (error) {
      invalidUser();
    }
  } else {
    invalidUser();
  }
}
