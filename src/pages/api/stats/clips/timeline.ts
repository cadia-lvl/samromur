import { NextApiRequest, NextApiResponse } from 'next';
import Database, { getDatabaseInstance } from '../../../../server/database/database';

const db: Database = getDatabaseInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, query } = req;
    if (method != 'GET') {
        res.status(400).send('Invalid method.');
    } else {
        try {
            const stats = await db.stats.fetchTotalClipsTimeline();
            res.status(200).json(stats);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
}