import { NextApiRequest, NextApiResponse } from 'next';
import Database, {
    getDatabaseInstance,
} from '../../../server/database/database';
import { ClipVote } from '../../../types/samples';

const db: Database = getDatabaseInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { headers, method } = req;
    if (method != 'POST') {
        res.status(400).send('Invalid method.');
    } else {
        const clientId = decodeURIComponent(headers.client_id as string) || '';
        const clipId = parseInt(decodeURIComponent(headers.clip_id as string));
        const isSuper =
            decodeURIComponent(headers.is_super as string) == 'true';
        const vote = decodeURIComponent(headers.vote as string) as ClipVote;
        try {
            const voteId = await db.votes.saveVote(
                clientId,
                clipId,
                isSuper,
                vote
            );
            return res.status(200).send(voteId);
        } catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
    }
};
