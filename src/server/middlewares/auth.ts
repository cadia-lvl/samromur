import jwt from 'jsonwebtoken';

import { Request, Response, NextFunction } from 'express';

import { protectedPaths } from '../../constants/paths';

// To-do move secret to config
const jwtSecret = 'secret';

export default async (req: Request, res: Response, next: NextFunction) => {
    const { cookies, path } = req;
    const token = (cookies.token as string) || '';

    try {
        // Jwt verification
        jwt.verify(token, jwtSecret);
        const expiration = new Date(Date.now() + 120 * 60000); // 2 hours from now;
        const cookie = `token=${token}; expires=${expiration.toUTCString()}; SameSite=Lax; Path=/;`;
        res.setHeader('Cache-Control', 'private');
        res.setHeader('Set-Cookie', cookie);

        // Notify the frontend that the user is authenticated
        req.headers.is_authenticated = encodeURIComponent(true);

        // The user is trying to login but is already authenticated
        if (path == '/innskraning') {
            res.redirect(301, '/minar-sidur');
        }
        next();
    } catch (error) {
        // Notify the frontend that the user is NOT authenticated
        req.headers.is_authenticated = encodeURIComponent(false);

        // If it is a protected path, redirect to login
        const protectedPath = protectedPaths.find((x) => path.startsWith(x));
        if (!!!protectedPath) {
            return next();
        } else if (path.startsWith('/api')) {
            return res.status(401).send(error.message);
        } else {
            const expiration = new Date(Date.now() + 30000).toUTCString(); // 30 seconds from now;
            res.setHeader(
                'Set-Cookie',
                `redirect=${path}; expires=${expiration}; Path=/innskraning;`
            );
            return res.status(401).redirect('/innskraning');
        }
    }
};
