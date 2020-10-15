import { NextApiRequest, NextApiResponse } from 'next';
import Database, { getDatabaseInstance } from '../../../server/database/database';

import {
    UserClient,
    TotalUserClips,
    TotalUserVotes
} from '../../../types/user';

const db: Database = getDatabaseInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    if (method != 'GET') {
        res.status(400).send('Invalid method.');
    } else {
        const clientId = decodeURIComponent(req.headers.client_id as string) || '';
        try {
            const clips: TotalUserClips = await db.userClients.fetchUserClipsStats(clientId);
            const votes: TotalUserVotes = await db.userClients.fetchUserVotesStats(clientId);
            const { isAdmin, isSuperUser } = await db.userClients.fetchUserAccess(clientId);

            const user: Partial<UserClient> = {
                id: clientId,
                isAdmin,
                isSuperUser,
                stats: {
                    clips,
                    votes
                },
            }
            res.status(200).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
}