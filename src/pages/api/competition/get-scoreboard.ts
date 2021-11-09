import { NextApiRequest, NextApiResponse } from 'next';
import Database, {
    getDatabaseInstance,
} from '../../../server/database/database';
import { ScoreboardData } from '../../../types/competition';

const db: Database = getDatabaseInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;

    if (method != 'GET') {
        res.status(400).send('Invalid method.');
        return;
    }

    try {
        const scores = await db.stats.fetchScoreboard();
        const companies = await db.competition.getCompanies();
        const sorted = companies.sort((a, b) =>
            a.name.localeCompare(b.name, 'is-IS')
        );

        sorted.forEach((c) => {
            if (!scores.some((s) => s.name == c.name)) {
                const toAdd: ScoreboardData = {
                    name: c.name,
                    size: c.size,
                    count: 0,
                    users: 0,
                    rank: scores.length + 1,
                };
                scores.push(toAdd);
            }
        });
        return res.status(200).json(scores);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
