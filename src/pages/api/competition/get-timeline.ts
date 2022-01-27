import { NextApiRequest, NextApiResponse } from 'next';
import Database, {
    getDatabaseInstance,
} from '../../../server/database/database';
import moment from 'moment';
import { gk2022timeline } from '../../../constants/competition';

const db: Database = getDatabaseInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;

    if (method != 'GET') {
        res.status(400).send('Invalid method.');
        return;
    }

    try {
        // const last = await db.competition.getLastDay();
        // const stat = {
        //     date: moment(last.date).format('YYYY-MM-DD'),
        //     count: last.count,
        // };
        const timelineStats = [...gk2022timeline];
        //const timeline = await db.competition.getTimeline();
        // const timelineStats = timeline.map((e) => {
        //     return {
        //         date: moment(e.date).format('YYYY-MM-DD'),
        //         count: e.count,
        //     };
        // });
        return res.status(200).json(timelineStats);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
