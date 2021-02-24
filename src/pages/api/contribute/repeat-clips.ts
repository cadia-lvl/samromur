import { NextApiRequest, NextApiResponse } from 'next';
import Database, {
    getDatabaseInstance,
} from '../../../server/database/database';

import { Clip } from '../../../types/samples';

const db: Database = getDatabaseInstance();
/**
 * API endpoint for the repeat-clips call
 * Returns clips with sentences for the repeat contribute type
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    if (method != 'GET') {
        res.status(400).send('Invalid method.');
    } else {
        const count = parseInt(req.query.count as string, 10) || 5;
        const clientId =
            decodeURIComponent(req.headers.client_id as string) || '';
        return db.clips
            .fetchRepeatedClips(clientId, count)
            .then((response: Clip[]) => {
                res.status(200).json(response);
            })
            .catch((error: any) => {
                console.error(error);
                res.status(500).json(error);
            });
    }
};
