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
 * /api/funromur/votes-total:
 *  get:
 *    summary: Gets the total amount of votes from all clients.
 *    responses:
 *       200:
 *         description: The number of total votes.
 *         content:
 *           application/json:
 *             schema:
 *               type: number
 *               example: 8651
 *
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors);

    const { method } = req;

    if (!method || !acceptedMethods.includes(method)) {
        return res.status(400).send('Invalid method.');
    }
    try {
        const count = await db.stats.fetchTotalVotes();

        res.status(200).json(count);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};
