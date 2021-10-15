import { NextApiRequest, NextApiResponse } from 'next';
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
        const companies = await db.competition.getCompanies();
        return res.status(200).json(companies);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
