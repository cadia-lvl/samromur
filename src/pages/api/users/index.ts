import { NextApiRequest, NextApiResponse } from 'next';
import Database, { getDatabaseInstance } from '../../../server/database/database';

import {
    UserClient
} from '../../../types/user';

const db: Database = getDatabaseInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    if (method != 'GET') {
        res.status(400).send('Invalid method.');
    } else {
        const clientId = decodeURIComponent(req.headers.client_id as string) || '';
        try {
            const clips: number = await db.userClients.fetchUserClipCount(clientId);
            const user: Partial<UserClient> = {
                id: clientId,
                clips
            }
            res.status(200).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
}