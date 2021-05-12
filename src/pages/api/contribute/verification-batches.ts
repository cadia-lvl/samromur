import { NextApiRequest, NextApiResponse } from 'next';
import Database, {
    getDatabaseInstance,
} from '../../../server/database/database';

const db: Database = getDatabaseInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { headers, method } = req;
    if (method != 'GET') {
        res.status(400).send('Invalid method.');
    } else {
        const clientId = req.cookies.client_id as string;
        try {
            return db.clips
                .fetchVerificationLabelsNeedingVotes(clientId)
                .then((response) => {
                    return res.status(200).json(response);
                })
                .catch((error) => {
                    return res.status(500).json(error);
                });
        } catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
    }
};
