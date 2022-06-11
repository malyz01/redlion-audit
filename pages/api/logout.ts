import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../src/lib/iron-session';
import { NextApiRequest, NextApiResponse } from 'next';
import type { UserResponseType } from '../../pages/api/user';

export default withIronSessionApiRoute(logoutRoute, sessionOptions);

function logoutRoute(req: NextApiRequest, res: NextApiResponse<UserResponseType>) {
  req.session.destroy();
  res.json({ isLoggedIn: false });
}
