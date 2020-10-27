import { NextApiRequest, NextApiResponse } from 'next';
import Database, { getDatabaseInstance } from '../../../../server/database/database';

const db: Database = getDatabaseInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, query: { id } } = req;
    if (method != 'POST') {
        res.status(400).send('Invalid method.');
    } else {
        try {
            const success = await db.consents.addPermission(id as string);
            res.status(200).json(success);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
}
