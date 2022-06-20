import { NextApiRequest, NextApiResponse } from 'next';

import { Vote } from '../../../types/votes';
import Database, {
    getDatabaseInstance,
} from '../../../server/database/database';
import { ClipVote } from '../../../types/samples';
import Cors from 'cors';
import { runMiddleware } from '../../../utilities/cors-helper';
import validateEmail from '../../../utilities/validate-email';

const db: Database = getDatabaseInstance();

const acceptedMethods = ['POST', 'OPTIONS'];
const cors = Cors({ methods: acceptedMethods });

export default async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors);

    const { method } = req;
    if (!method || !acceptedMethods.includes(method)) {
        return res.status(400).send('Invalid method.');
    }

    try {
        const data = JSON.stringify(req.body);
        const parsed = JSON.parse(data);
        const votes: Array<Vote> = parsed.votes;
        const client = req.headers.client as string;

        if (!validClient(client)) {
            res.status(500).send('Client identifier is required.');
        }

        if (votes.length == 0) {
            res.status(500).send('At least one vote is required.');
        }

        if (!validVotes(votes)) {
            res.status(500).send('Vote are in the incorrect format.');
        }

        let results = undefined;
        try {
            const clientId = await db.userClients.getClientIdFromEmail(client);
            results = await db.votes.addVotes(clientId, votes);
        } catch (error) {
            res.status(500).send('A database issue occurred on the server.');
            return;
        }

        return res.status(200).send(`Votes added: ${results}/${votes.length}`);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};

const validClient = (client: string): boolean => {
    return validateEmail(client);
};

const validVotes = (votes: Vote[]): boolean => {
    for (const vote of votes) {
        if (vote.clipId == 0) return false;
        // Require vote to be in ClipVote
        if (!(vote.vote in ClipVote)) return false;
    }
    return true;
};
