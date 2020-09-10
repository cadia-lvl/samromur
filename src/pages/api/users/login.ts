import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import Database, { getDatabaseInstance } from '../../../server/database/database';
import { AuthError } from '../../../types/auth';

const db: Database = getDatabaseInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    if (method != 'POST') {
        res.status(400).send('Invalid method.');
    } else {
        try {
            const clientId = req.cookies.client_id as string;
            const data = req.headers.authorization || '';
            if (data && clientId) {
                const auth = data.split(" ")[1];
                const decoded = Buffer.from(auth, 'base64').toString('utf8');
                const [email, password] = decoded.split(':');
                return db.userClients.loginUser(email, password, clientId).then(() => {
                    const user = { username: email }
                    const token = jwt.sign(
                        user,
                        'secret',
                        { expiresIn: '7 days' }
                    );
                    const expiration = new Date(Date.now() + 120 * 60000); // 2 hours from now;
                    const cookie = `token=${token}; expires=${expiration.toUTCString()}; SameSite=Lax; Path=/`;
                    res.setHeader('Cache-Control', 'private');
                    res.setHeader('Set-Cookie', cookie);
                    return res.status(200).end();
                }).catch((error: AuthError) => {
                    res.status(401).send(error.toString());
                });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
}