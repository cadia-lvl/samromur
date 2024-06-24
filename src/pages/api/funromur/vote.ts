import { NextApiRequest, NextApiResponse } from 'next';
import Database, {
    getDatabaseInstance,
} from '../../../server/database/database';
import { ClipVote } from '../../../types/samples';
import Cors from 'cors';
import { runMiddleware } from '../../../utilities/cors-helper';
import validateEmail from '../../../utilities/validate-email';

const db: Database = getDatabaseInstance();

const acceptedMethods = ['POST', 'OPTIONS'];
const cors = Cors({ methods: acceptedMethods });
/**
 * @swagger
 * /api/funromur/vote:
 *   post:
 *     summary: Posts a vote to the database
 *     tags:
 *      -  funromur
 *     parameters:
 *       - in: header
 *         name: client
 *         schema:
 *           type: string
 *       - in: header
 *         name: clip_id
 *         schema:
 *           type: integer
 *       - in: header
 *         name: vote
 *         schema:
 *           type: string
 *           example: "VALID"
 *       - in: header
 *         name: is_super
 *         schema:
 *           type: boolean
 *
 *     responses:
 *       200:
 *         description: The vote id.
 *         content:
 *           application/json:
 *             schema:
 *               type: integer
 *               example: 123
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors);

    const { headers, method } = req;
    if (!method || !acceptedMethods.includes(method)) {
        return res.status(400).send('Invalid method.');
    }

    const client = decodeURIComponent(headers.client as string) || '';
    const clipId = parseInt(decodeURIComponent(headers.clip_id as string));
    const isSuper = decodeURIComponent(headers.is_super as string) == 'true';
    const vote = decodeURIComponent(headers.vote as string) as ClipVote;

    if (!validateEmail(client)) return res.status(500).send('Invalid client.');
    if (!clipId) return res.status(500).send('Clip id required.');
    if (!(vote in ClipVote)) return res.status(500).send('Invalid vote.');

    const clientId = await db.userClients.getClientIdFromEmail(client);
    try {
        const voteId = await db.votes.saveVote(clientId, clipId, false, vote);
        return res.status(200).send(voteId);
    } catch (error) {
        console.error(error);
        return res.status(500).json('A db error occurred');
    }
};
