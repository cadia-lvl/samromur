import { NextApiRequest, NextApiResponse } from 'next';
import Database, { getDatabaseInstance } from '../../../server/database/database';
import EmailClient, { getEmailInstance } from '../../../server/email';

const db: Database = getDatabaseInstance();
const emailClient: EmailClient = getEmailInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { headers, method, query: { kennitala } } = req;
    if (method == 'GET') {
        return db.consents.getConsent(kennitala as string).then((consent: boolean) => {
            res.status(200).json(consent);
        }).catch((error: any) => {
            console.error(error);
            res.status(500).json(error);
        });
    } else {
        // For url in e-mail to work in development
        const host = headers.host?.includes('localhost') ? `http://${headers.host}` : `https://${headers.host}`;

        const email = decodeURIComponent(headers.email as string);
        const id = await db.consents.createConsent(email, kennitala as string);
        const url = `${host}/samthykki/${id}`;
        return emailClient.sendConsentEmail(email, kennitala as string, url).then(() => {
            res.status(200).json(true);
        }).catch((error) => {
            console.error(error);
            res.status(200).json(false);
        });
    }
}