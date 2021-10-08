import { NextApiRequest, NextApiResponse } from 'next';
import Database, {
    getDatabaseInstance,
} from '../../../server/database/database';
import { AuthError } from '../../../types/auth';

const db: Database = getDatabaseInstance();
/**
 * Receives the api request for reset password for a password recovery
 * Uses the db to reset the password and returns 200 on success
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, query } = req;
    if (method != 'POST') {
        res.status(400).send('Invalid method.');
    } else {
        try {
            const data = req.headers.authorization || '';
            if (data) {
                const auth = data.split(' ')[1];
                const decoded = Buffer.from(auth, 'base64').toString('utf8');
                const [email, resetPasswordToken, password] = decoded.split(
                    ':'
                );

                return db.userClients
                    .resetPassword(email, resetPasswordToken, password)
                    .then(() => {
                        return res.status(200).end();
                    })
                    .catch((error: AuthError) => {
                        res.status(401).send(error.toString());
                    });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
};
