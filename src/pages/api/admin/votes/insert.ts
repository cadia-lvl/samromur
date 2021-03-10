import { NextApiRequest, NextApiResponse } from 'next';
import {
    loadTempVotesBatch,
    removeTempBatch,
} from '../../../../utilities/filesystem';
import Database, {
    getDatabaseInstance,
} from '../../../../server/database/database';

const db: Database = getDatabaseInstance();

/**
 * Inserts the batch of votes from the file named id.json where
 * id should be present in the header.
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    if (method != 'POST') {
        res.status(400).send('Invalid method.');
    } else {
        const { headers } = req;
        const id = decodeURIComponent(headers.id as string);

        try {
            // Load votes from temp file
            const waitingVotesBatch = await loadTempVotesBatch(id);
            const votes = waitingVotesBatch.votes;

            // Set chunksize
            const chunkSize = 500;

            // Loop through votes and add chunks from votes to the db
            for (let i = 0; i < votes.length; i += chunkSize) {
                // add chunk to db
                await db.votes.addVoteBatch(votes.slice(i, i + chunkSize));
            }

            // Remove the temp file
            await removeTempBatch(id);

            return res.status(200).json('success');
        } catch (error) {
            return res.status(500).json(`Error: ${error.code}`);
        }
    }
};
