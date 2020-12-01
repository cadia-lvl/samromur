import { NextApiRequest, NextApiResponse } from 'next';
import Database, {
    getDatabaseInstance,
} from '../../../server/database/database';
import { AuthError } from '../../../types/auth';
import EmailClient, { getEmailInstance } from '../../../server/email';

const db: Database = getDatabaseInstance();
const emailClient: EmailClient = getEmailInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    if (method != 'POST') {
        res.status(400).send('Invalid method.');
    } else {
        try {
            // Check if email in db.userClients
            // If not return som fail message
            const data = req.headers.authorization || '';
            if (data) {
                const auth = data.split(' ')[1];
                const email = Buffer.from(auth, 'base64').toString('utf8');
                const host = req.headers.origin;

                return db.userClients
                    .createResetPasswordToken(email)
                    .then(async (token: string) => {
                        const url = `${host}/tyntlykilord?token=${token}`;
                        return emailClient
                            .sendResetPasswordEmail(email, url)
                            .then(() => {
                                return res.status(200).end();
                            })
                            .catch((error) => {
                                return res
                                    .status(500)
                                    .json(AuthError.EMAIL_NOT_SENT.toString());
                            });
                    })
                    .catch((error: AuthError) => {
                        // To-do: Log this attempt to a log file

                        // Send back OK regardless, if user not found to avoid
                        // attack trying to find user emails
                        res.status(200).end();
                    });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
};
