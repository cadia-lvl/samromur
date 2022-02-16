import { NextApiRequest, NextApiResponse } from 'next';
import Database, {
    getDatabaseInstance,
} from '../../../server/database/database';
import moment from 'moment';

const db: Database = getDatabaseInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;

    if (method != 'GET') {
        res.status(400).send('Invalid method.');
        return;
    }

    try {
        const timeline = await db.competition.getTimeline(true);
        const timelineStats = timeline.map((e) => {
            return {
                date: moment(e.date).format('YYYY-MM-DD'),
                count: e.count,
            };
        });
        return res.status(200).json(timelineStats);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
