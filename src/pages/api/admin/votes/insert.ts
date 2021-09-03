import { NextApiRequest, NextApiResponse } from 'next';
import {
    loadTempVotesBatch,
    removeTempBatch,
} from '../../../../utilities/filesystem';
import Database, {
    getDatabaseInstance,
} from '../../../../server/database/database';
import { BatchUploadResults } from '../../../../server/database/votes';

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

            const result = new BatchUploadResults();

            // Loop through votes and add chunks from votes to the db
            for (let i = 0; i < votes.length; i += chunkSize) {
                // add chunk to db
                const batchRes = await db.votes.addVoteBatch(
                    votes.slice(i, i + chunkSize)
                );

                result.add(batchRes);
                res.writeProcessing(); // let client know that it is processing
            }

            // Remove the temp file
            await removeTempBatch(id);

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json(`Error: ${error.code}`);
        }
    }
};
