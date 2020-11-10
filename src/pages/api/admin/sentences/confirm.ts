import { NextApiRequest, NextApiResponse } from 'next';

import { SimpleSentenceBatch } from '../../../../types/sentences';
import {
    loadTempBatch,
    removeTempBatch,
} from '../../../../utilities/filesystem';
import Database, {
    getDatabaseInstance,
} from '../../../../server/database/database';

const db: Database = getDatabaseInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    if (method != 'POST') {
        res.status(400).send('Invalid method.');
    } else {
        const { headers } = req;
        const id = decodeURIComponent(headers.id as string);
        return loadTempBatch(id)
            .then((waitingBatch) => {
                const batch: SimpleSentenceBatch = {
                    name: waitingBatch.name,
                    sentences: waitingBatch.sentences,
                };
                removeTempBatch(id);
                return db.sentences.insertBatch(batch);
            })
            .catch((error) => {
                console.error(error);
                return Promise.reject(error);
            })
            .then(() => {
                res.status(200).json('Success!');
            })
            .catch((error: any) => {
                res.status(500).json('Error');
            });
    }
};
