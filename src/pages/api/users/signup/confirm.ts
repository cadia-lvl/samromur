import { NextApiRequest, NextApiResponse } from 'next';
import Database, { getDatabaseInstance } from '../../../../server/database/database';
import { AuthError } from '../../../../types/auth';
import EmailClient, { getEmailInstance } from '../../../../server/email';

const db: Database = getDatabaseInstance();
const email: EmailClient = getEmailInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, query } = req;
    if (method != 'GET') {
        res.status(400).send('Invalid method.');
    } else {
        try {
            const confirmId = query.id as string;
            return db.userClients.confirmSignup(confirmId).then(() => {
                res.writeHead(301, {
                    'Location': '/innskraning'
                });
                return res.end();
            }).catch((error) => {
                console.error(error);
                return res.status(500).json(error);
            });
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
}