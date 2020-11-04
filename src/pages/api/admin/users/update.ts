import { assert } from 'console';
import { NextApiRequest, NextApiResponse } from 'next';
import Database, {
    getDatabaseInstance,
} from '../../../../server/database/database';

const db: Database = getDatabaseInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { headers, method } = req;
    if (method != 'POST') {
        res.status(400).send('Invalid method.');
    } else {
        const clientId = req.cookies.client_id as string;
        const email = decodeURIComponent(headers.email as string);
        try {
            const { isAdmin } = await db.userClients.fetchUserAccess(clientId);
            assert(isAdmin);
        } catch (error) {
            console.error(error);
            return res.status(403).json(error);
        }

        try {
            return db.userClients
                .makeSuperUser(email)
                .then(() => {
                    return res.status(200).json('success');
                })
                .catch((error) => {
                    return res.status(500).json(error);
                });
        } catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
    }
};
