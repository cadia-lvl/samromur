import { NextApiRequest, NextApiResponse } from 'next';
import Database, {
    getDatabaseInstance,
} from '../../../server/database/database';

const db: Database = getDatabaseInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    if (method != 'GET') {
        res.status(400).send('Invalid method.');
    } else {
        const clientId =
            decodeURIComponent(req.headers.client_id as string) || '';
        if (!clientId) {
            return res.status(400).send('Missing header.');
        }
        try {
            const something = await db.stats.fetchCaptiniStatsForClient(
                clientId
            );
            res.status(200).json(something);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
};
