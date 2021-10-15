import { NextApiRequest, NextApiResponse } from 'next';
import Database, {
    getDatabaseInstance,
} from '../../../server/database/database';

const db: Database = getDatabaseInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { headers, method } = req;

    if (method != 'GET') {
        res.status(400).send('Invalid method.');
        return;
    }

    const company = (headers.company || '') as string;

    if (company == '') {
        res.status(417).send('Missing header information.');
        return;
    }

    try {
        const companyExists = await db.competition.companyExists(company);
        return res.status(200).json(companyExists);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};
