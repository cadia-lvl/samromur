import { NextApiRequest, NextApiResponse } from 'next';
import {
    SimpleSentenceBatch,
    SentenceBatchResponse,
} from '../../../../types/sentences';

import { v4 as uuid } from 'uuid';
import { saveTempBatch } from '../../../../utilities/filesystem';

interface WaitingBatch {
    id: string;
    name: string;
    sentences: Array<string>;
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '30mb',
        }
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    if (method != 'POST') {
        res.status(400).send('Invalid method.');
    } else {
        const { body, headers } = req;
        const text = body as string;
        const name = decodeURIComponent(headers.name as string);
        const sentences: Array<string> = text.split('\n');
        const batch: SimpleSentenceBatch = {
            name,
            sentences,
        }
        const id = uuid();
        const waitingBatch: WaitingBatch = {
            id,
            name: batch.name,
            sentences: batch.sentences,
        }

        return saveTempBatch(waitingBatch).then(() => {
            return res.status(200).json({
                id: id,
                count: batch.sentences.length,
                valid: true,
            });
        }).catch((error) => {
            console.error(error);
            res.status(500).send(error);
        })
    }
}