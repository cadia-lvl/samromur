import { NextApiRequest, NextApiResponse } from 'next';
import {
    SimpleSentenceBatch,
    SentenceBatchResponse,
} from '../../../../types/sentences';

import { v4 as uuid } from 'uuid';
import {
    saveTempBatch,
    WaitingVoteBatch,
} from '../../../../utilities/filesystem';
import { Vote, VoteBatch } from '../../../../types/votes';
import Database, {
    getDatabaseInstance,
} from '../../../../server/database/database';
import { ClipVote } from '../../../../types/samples';

const marosijoVotesName = 'MarosijoVotes';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '30mb',
        },
    },
};

const db: Database = getDatabaseInstance();

/**
 * Saves the
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    if (method != 'POST') {
        res.status(400).send('Invalid method.');
    } else {
        const { body } = req;
        const text = body as string;
        const votesArray: Array<string> = text.split('\n');

        const votes: Array<Vote> = votesArray.map((item) => {
            const clipVote =
                parseInt(item.split(',')[1]) == 1
                    ? ClipVote.VALID
                    : ClipVote.INVALID;
            const vote: Vote = {
                clipId: parseInt(item.split(',')[0]),
                vote: clipVote,
            };
            return vote;
        });
        const id = uuid();
        const waitingBatch: WaitingVoteBatch = {
            id,
            name: marosijoVotesName,
            votes,
        };

        const result = await db.votes.addVoteBatch(votes);

        return saveTempBatch(waitingBatch)
            .then(() => {
                return res.status(200).json({
                    id: id,
                    count: votes.length,
                    valid: true,
                });
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send(error);
            });
    }
};
