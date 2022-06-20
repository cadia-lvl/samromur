import { NextApiRequest, NextApiResponse } from 'next';
import Database, {
    getDatabaseInstance,
} from '../../../server/database/database';
import { ClipVote } from '../../../types/samples';
import Cors from 'cors';
import { runMiddleware } from '../../../utilities/cors-helper';

const db: Database = getDatabaseInstance();

const acceptedMethods = ['POST', 'OPTIONS'];
const cors = Cors({ methods: acceptedMethods });

export default async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors);

    const { headers, method } = req;
    if (!method || !acceptedMethods.includes(method)) {
        return res.status(400).send('Invalid method.');
    }

    const client = decodeURIComponent(headers.client_id as string) || '';
    const clientId = await db.userClients.getClientIdFromEmail(client);
    const clipId = parseInt(decodeURIComponent(headers.clip_id as string));
    const isSuper = decodeURIComponent(headers.is_super as string) == 'true';
    const vote = decodeURIComponent(headers.vote as string) as ClipVote;
    try {
        const voteId = await db.votes.saveVote(clientId, clipId, isSuper, vote);
        return res.status(200).send(voteId);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
};
