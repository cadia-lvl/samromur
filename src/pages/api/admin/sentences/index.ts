import { NextApiRequest, NextApiResponse } from 'next';
import {
    SimpleSentenceBatch,
    SentenceBatchResponse,
    SentenceGroupInfo,
} from '../../../../types/sentences';

import Database, {
    getDatabaseInstance,
} from '../../../../server/database/database';

const db: Database = getDatabaseInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    if (method != 'GET') {
        res.status(400).send('Invalid method.');
    } else {
        const { body, headers } = req;
        const text = body as string;
        const name = decodeURIComponent(headers.name as string);
        const sentences: Array<string> = text.split('\n');
        const batch: SimpleSentenceBatch = {
            name,
            sentences,
        };
        return db.sentences
            .fetchAllSentencesInfo()
            .then((response: Array<SentenceGroupInfo>) => {
                res.status(200).json(response);
            })
            .catch((error: any) => {
                res.status(500).send(error.message);
            });
    }
};
