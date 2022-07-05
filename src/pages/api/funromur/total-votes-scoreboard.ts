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
 * /api/funromur/total-votes-scoreboard:
 *  get:
 *    summary: Gets the all time votes per client in an array
 *    tags:
 *      -  scoreboards
 *    responses:
 *       200:
 *         description: The votes per clients array
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   client:
 *                       type: string
 *                   count:
 *                       type: integer
 *
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors);

    const { method } = req;

    if (!method || !acceptedMethods.includes(method)) {
        return res.status(400).send('Invalid method.');
    }
    try {
        const count = await db.stats.fetchUserScoreboard();

        res.status(200).json(count);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};
