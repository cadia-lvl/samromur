import { Request, Response, NextFunction } from 'express';

import Database, { getDatabaseInstance } from '../database/database';

const database: Database = getDatabaseInstance();

export default async (req: Request, res: Response, next: NextFunction) => {
    const clientId = (req.cookies.client_id as string) || '';
    if (!!clientId) {
        await database.userClients.insertUserClient(clientId);
        req.headers.client_id = clientId;
    }
    next();
};
