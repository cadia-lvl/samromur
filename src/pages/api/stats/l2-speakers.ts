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
            const l2SpeakerStats = await db.stats.fetchL2SpeakerStats();
            res.status(200).json(l2SpeakerStats);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
};
