import { NextApiRequest, NextApiResponse } from 'next';
import Database, {
    getDatabaseInstance,
} from '../../../server/database/database';

const db: Database = getDatabaseInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    if (method != 'POST') {
        res.status(400).send('Invalid method.');
    } else {
        const { headers } = req;
        const clientId = decodeURIComponent(headers.clientId as string);
        try {
            await db.userClients.insertUserClient(clientId);
            res.status(200).json({});
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
};
