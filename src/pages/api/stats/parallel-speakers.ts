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
            const parallelSpeakerStats = await db.stats.fetchParallelSpeakerStats();
            res.status(200).json(parallelSpeakerStats);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
};
