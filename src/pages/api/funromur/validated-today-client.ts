import { NextApiRequest, NextApiResponse } from 'next';
import Database, {
    getDatabaseInstance,
} from '../../../server/database/database';
import Cors from 'cors';
import { runMiddleware } from '../../../utilities/cors-helper';

const db: Database = getDatabaseInstance();

const acceptedMethods = ['GET', 'OPTIONS'];
const cors = Cors({ methods: acceptedMethods });
/**
 * @swagger
 * /api/funromur/validated-today-client:
 *  get:
 *    summary: Gets the amount of votes the client posted today.
 *    tags:
 *      -  stats
 *    parameters:
 *       - in: header
 *         name: client
 *         type: string
 *    responses:
 *       200:
 *         description: The amount of votes for the client today.
 *         content:
 *           application/json:
 *             schema:
 *               type: number
 *               example: 1337
 *
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors);

    const { method } = req;
    const client = decodeURIComponent(req.headers.client as string) || '';

    if (!method || !acceptedMethods.includes(method)) {
        return res.status(400).send('Invalid method.');
    } else {
        try {
            const clientId = await db.userClients.getClientIdFromEmail(client);
            const count = await db.stats.fetchTodayVotesClient(clientId);
            res.status(200).json(count);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
};
