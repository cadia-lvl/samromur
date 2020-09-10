import { NextApiRequest, NextApiResponse } from 'next';
import Database, { getDatabaseInstance } from '../../../server/database/database';

const db: Database = getDatabaseInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, query } = req;
    if (method != 'GET') {
        res.status(400).send('Invalid method.');
    } else {
        const contributeType = query.type as string;
        try {
            const something = await db.stats.fetchWeeklyStats(contributeType);
            res.status(200).json(something);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
}