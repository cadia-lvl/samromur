import { NextApiRequest, NextApiResponse } from 'next';
import Database, {
    getDatabaseInstance,
} from '../../../server/database/database';
import Cors from 'cors';

import { Clip } from '../../../types/samples';
import { runMiddleware } from '../../../utilities/cors-helper';

const cors = Cors({ methods: ['GET'] });

const db: Database = getDatabaseInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    if (method != 'GET') {
        res.status(400).send('Invalid method.');
    } else {
        // Cors texting

        await runMiddleware(req, res, cors);

        const count = parseInt(req.query.count as string, 10) || 5;
        const batch = decodeURIComponent(req.headers.batch as string) || '';
        const clientId =
            decodeURIComponent(req.headers.client_id as string) || '';
        return db.clips
            .fetchClips(clientId, count, batch)
            .then((response: Clip[]) => {
                res.status(200).json(response);
            })
            .catch((error: any) => {
                console.error(error);
                res.status(500).json(error);
            });
    }
};
