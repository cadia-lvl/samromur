import { NextApiRequest, NextApiResponse } from 'next';
import Database, {
    getDatabaseInstance,
} from '../../../server/database/database';

import { SimpleSentence } from '../../../types/sentences';

const db: Database = getDatabaseInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    if (method != 'GET') {
        res.status(400).send('Invalid method.');
    } else {
        const count = parseInt(req.query.count as string, 10) || 5;
        const clientId =
            decodeURIComponent(req.headers.client_id as string) || '';
        const age = decodeURIComponent(req.headers.age as string) || '';
        return db.sentences
            .fetchSentences(clientId, count, age)
            .then((response: Array<SimpleSentence>) => {
                res.status(200).json(response);
            })
            .catch((error: any) => {
                console.error(error);
                res.status(500).json(error);
            });
    }
};
