import { NextApiRequest, NextApiResponse } from 'next';
import Database, { getDatabaseInstance } from '../../../../server/database/database';
import EmailClient, { getEmailInstance } from '../../../../server/email';

import { AuthError } from '../../../../types/auth';

const db: Database = getDatabaseInstance();
const emailClient: EmailClient = getEmailInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    if (method != 'POST') {
        res.status(400).send('Invalid method.');
    } else {
        try {
            const clientId = req.cookies.client_id as string;
            const data = req.headers.authorization || '';
            if (!data || !clientId) {
                return res.status(401).json(AuthError.FAILED.toString());
            }
            const auth = data.split(" ")[1];
            const decoded = Buffer.from(auth, 'base64').toString('utf8');
            const [email, password] = decoded.split(':');
            return db.userClients.signUpUser(email, password).then(async (confirmId: string) => {

                // Create email link from origin and id
                const host = req.headers.origin;
                const url = `${host}/api/users/signup/confirm?id=${confirmId}`;

                return emailClient.sendSignupConfirmEmail(email, url).then(() => {
                    return res.status(200).json('Success');
                }).catch((error) => {
                    console.error(error);
                    return res.status(500).json(AuthError.EMAIL_NOT_SENT.toString());
                });
            }).catch((error: AuthError) => {
                res.status(401).send(error.toString());
            })
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
}