import { NextApiRequest, NextApiResponse } from 'next';
import Database, {
    getDatabaseInstance,
} from '../../../../server/database/database';
import Cors from 'cors';
import { runMiddleware } from '../../../../utilities/cors-helper';

const db: Database = getDatabaseInstance();

const acceptedMethods = ['GET', 'OPTIONS'];
const cors = Cors({ methods: acceptedMethods });

export default async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors);

    const { method } = req;
    if (!method || !acceptedMethods.includes(method)) {
        return res.status(400).send('Invalid method.');
    } else {
        try {
            const count = await db.stats.fetchTotalClips();
            res.status(200).json(count);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
};
