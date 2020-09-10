import { NextApiResponse } from "next";
import { Response } from 'express';

export const setUserCookie = (id: string) => {
    const expiration = new Date(Date.now() + 10 * 365 * 24 * 3600 * 1000); // 10 years from now
    const cookie = `client_id=${id}; expires=${expiration.toUTCString()}; SameSite=Lax;`;
    document.cookie = cookie;
}

export const setRefreshTokenCookie = (res: NextApiResponse | Response, token: string) => {
    const expiration = new Date(Date.now() + 2 * 3600 * 1000); // 2 hours from now;
    const cookie = `token=${token}; expires=${expiration.toUTCString()}; SameSite=Lax; Path=/`;
    res.setHeader('Cache-Control', 'private');
    res.setHeader('Set-Cookie', cookie);
    return res;
}