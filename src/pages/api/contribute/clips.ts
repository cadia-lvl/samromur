import { NextApiRequest, NextApiResponse } from 'next';
import Database, {
    getDatabaseInstance,
} from '../../../server/database/database';
import Cors from 'cors';

import { Clip } from '../../../types/samples';
import { runMiddleware } from '../../../utilities/cors-helper';

const cors = Cors({ methods: ['GET', 'OPTIONS'] });

const db: Database = getDatabaseInstance();

/**
 * @swagger
 * /api/contribute/clips:
 *   get:
 *     summary: Gets count amount of unverified clips. Requires client id.
 *     parameters:
 *       - in: query
 *         name: count
 *         schema:
 *           type: integer
 *         example: 20
 *       - in: header
 *         name: client_id
 *         type: string
 *       - in: header
 *         name: batch
 *         schema:
 *         type: string
 *
 *     responses:
 *       200:
 *         description: Array of unverified clips and corresponding sentence.
 *         content:
 *           text/plain:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   recording:
 *                     type: object
 *                     properties:
 *                       url:
 *                         type: string
 *                   sentence:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       text:
 *                         type: string
 *
 *
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    let m = method ? method : '';
    if (!['GET', 'OPTIONS'].includes(m)) {
        res.status(400).send('Invalid method.');
    } else {
        // Cors texting

        await runMiddleware(req, res, cors);

        const count = parseInt(req.query.count as string, 10) || 5;
        const batch =
            decodeURIComponent(req.headers.batch as string) != undefined
                ? decodeURIComponent(req.headers.batch as string)
                : '';

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
