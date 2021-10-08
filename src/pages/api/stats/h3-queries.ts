import { NextApiRequest, NextApiResponse } from 'next';
import Database, {
    getDatabaseInstance,
} from '../../../server/database/database';

const db: Database = getDatabaseInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, query } = req;
    if (method != 'GET') {
        res.status(400).send('Invalid method.');
    } else {
        try {
            const h3QueriesStats = await db.stats.fetchH3QueriesStats();
            res.status(200).json(h3QueriesStats);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
};
