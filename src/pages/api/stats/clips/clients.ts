import { NextApiRequest, NextApiResponse } from 'next';
import Database, {
    getDatabaseInstance,
} from '../../../../server/database/database';

const db: Database = getDatabaseInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, query } = req;
    if (method != 'GET') {
        res.status(400).send('Invalid method.');
    } else {
        try {
            const count = await db.stats.fetchTotalClipsClients();
            res.status(200).json(count);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
};
