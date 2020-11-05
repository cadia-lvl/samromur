import { Request, Response, NextFunction } from 'express';

import { join } from 'path';

export default async (req: Request, res: Response, next: NextFunction) => {
    const { path } = req;
    if (path == '/sw.js' || path.startsWith('/workbox-')) {
        const filePath = join(__dirname, '.next', path);
        console.log(filePath);
        return res.sendFile(filePath);
    } else {
        next();
    }
};
