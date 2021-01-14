import { NextApiRequest, NextApiResponse } from 'next';
import Database, {
    getDatabaseInstance,
} from '../../../server/database/database';
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
                const auth = data.split(' ')[1];
                const username = Buffer.from(auth, 'base64').toString('utf8');
                console.log(username);

                return db.userClients
                    .changeUserName(username, clientId)
                    .then(() => {
                        console.log('db success!');
                        return res.status(200).end();
                    })
                    .catch((error: AuthError) => {
                        console.log('db error!', error);
                        res.status(401).send(error.toString());
                    });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
};
