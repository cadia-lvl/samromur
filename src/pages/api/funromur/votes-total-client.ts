import { NextApiRequest, NextApiResponse } from 'next';
import Database, {
    getDatabaseInstance,
} from '../../../server/database/database';
import Cors from 'cors';
import { runMiddleware } from '../../../utilities/cors-helper';
import validateEmail from '../../../utilities/validate-email';

const db: Database = getDatabaseInstance();

const acceptedMethods = ['GET', 'OPTIONS'];
const cors = Cors({ methods: acceptedMethods });
/**
 * @swagger
 * /api/funromur/votes-total-client:
 *  get:
 *    summary: Gets the total amount of votes the client posted.
 *    tags:
 *      -  stats
 *    parameters:
 *       - in: header
 *         name: client
 *         type: string
 *    responses:
 *       200:
 *         description: The number of total votes.
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
    const email = decodeURIComponent(req.headers.client as string) || '';

    if (!method || !acceptedMethods.includes(method)) {
        return res.status(400).send('Invalid method.');
    }
    try {
        if (!validateEmail(email))
            return res.status(500).send('Invalid client.');

        const clientId = await db.userClients.getClientIdFromEmail(email);
        const { count } = await db.userClients.fetchUserVotesStats(clientId);

        res.status(200).json(count);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};
