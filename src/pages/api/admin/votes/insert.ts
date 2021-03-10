import { NextApiRequest, NextApiResponse } from 'next';

import { SimpleSentenceBatch } from '../../../../types/sentences';
import {
    loadTempBatch,
    loadTempVotesBatch,
    removeTempBatch,
    WaitingVoteBatch,
} from '../../../../utilities/filesystem';
import Database, {
    getDatabaseInstance,
} from '../../../../server/database/database';
import { Vote } from '../../../../types/votes';

const db: Database = getDatabaseInstance();

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
            let insertedVotes = 0;

            // Loop through votes and add chunks from votes to the db
            for (let i = 0; i < votes.length; i += chunkSize) {
                // push into voteChunks a slice of votes
                const inserted = await db.votes.addVoteBatch(
                    votes.slice(i, i + chunkSize)
                );
                insertedVotes += inserted;
                console.log(`Inserterd: ${insertedVotes} votes`);
            }
            return res.status(200).json('success');
        } catch (error) {
            return res.status(500).json(`Error: ${error.code}`);
        }
    }
};
