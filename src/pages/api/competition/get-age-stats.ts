import { NextApiRequest, NextApiResponse } from 'next';
import { defaultAgeStats } from '../../../constants/competition';
import Database, {
    getDatabaseInstance,
} from '../../../server/database/database';

const db: Database = getDatabaseInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;

    if (method != 'GET') {
        res.status(400).send('Invalid method.');
        return;
    }

    try {
        const ageStats = await db.competition.getAgeStats();
        const stats = defaultAgeStats;

        // Fill in the stats
        // this is to make sure that even if the db call returns 2 out of 3
        // results, a 0 is added to the third.
        ageStats.forEach((e) => {
            const index = stats.findIndex((o) => o.age == e.age);

            if (index != -1) {
                stats[index].count = e.count;
            }
        });
        return res.status(200).json(stats);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
