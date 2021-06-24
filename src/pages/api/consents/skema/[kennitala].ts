import { NextApiRequest, NextApiResponse } from 'next';
import Database, {
    getDatabaseInstance,
} from '../../../../server/database/database';
import EmailClient, { getEmailInstance } from '../../../../server/email';

const db: Database = getDatabaseInstance();
const emailClient: EmailClient = getEmailInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const {
        headers,
        method,
        query: { kennitala },
    } = req;
    if (method == 'POST') {
        const email = decodeURIComponent(headers.email as string);
        const id = await db.consents.createConsent(email, kennitala as string);
        const url = `https://samromur.is/samthykki/${id}`;
        return emailClient
            .sendConsentEmailSkema(email, kennitala as string, url)
            .then(() => {
                res.status(200).json(true);
            })
            .catch((error: any) => {
                console.error(error);
                res.status(200).json(false);
            });
    } else {
        res.status(400).send('Invalid method.');
    }
};
