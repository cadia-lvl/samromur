import { NextApiRequest, NextApiResponse } from 'next';

import { v4 as uuid } from 'uuid';
import { saveTempBatch } from '../../../../utilities/filesystem';
import { Vote, WaitingVoteBatch } from '../../../../types/votes';
import Database, {
    getDatabaseInstance,
} from '../../../../server/database/database';

const db: Database = getDatabaseInstance();

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '30mb',
        },
    },
};

/**
 * Saves the votes batch to a temprorary file and returns the id of the file
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    if (method != 'POST') {
        res.status(400).send('Invalid method.');
    } else {
        try {
            const { body } = req;
            const text = body as string;
            const votes: Array<Vote> = JSON.parse(text) as Array<Vote>;

            // Create an id for the votes
            const id = uuid();

            const watingBatch: WaitingVoteBatch = {
                id,
                votes,
            };

            // Save batch to file
            await saveTempBatch(watingBatch);

            return res.status(200).send(id);
        } catch (error) {
            return res.status(500).send(error);
        }
    }
};
