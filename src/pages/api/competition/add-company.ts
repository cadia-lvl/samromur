import { NextApiRequest, NextApiResponse } from 'next';
import Database, {
    getDatabaseInstance,
} from '../../../server/database/database';
import EmailClient, { getEmailInstance } from '../../../server/email';

const db: Database = getDatabaseInstance();
const emailClient: EmailClient = getEmailInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { headers, method } = req;

    if (method != 'POST') {
        return res.status(400).send('Invalid method.');
    }

    const company = headers.company
        ? decodeURIComponent(headers.company as string)
        : '';
    const size = headers.size ? decodeURIComponent(headers.size as string) : '';
    const contact = headers.contact
        ? decodeURIComponent(headers.contact as string)
        : '';
    const email = headers.email
        ? decodeURIComponent(headers.email as string)
        : '';
    const kennitala = headers.kennitala
        ? decodeURIComponent(headers.kennitala as string)
        : '';

    // console.log(`Received: ${company}, ${size}, ${contact}, ${email}`);

    if (!company || !size || !contact || !email || !kennitala) {
        return res.status(417).send('Missing header information.');
    }

    try {
        const confirmId = await db.competition.addCompany(
            company,
            size,
            contact,
            email,
            kennitala
        );

        const host = req.headers.origin;
        const url = `${host}/api/competition/confirm-company?id=${confirmId}`;

        const result = await emailClient.sendSignupInstitutionConfirmEmail(
            email,
            url,
            company
        );
        return res.status(200).json('Success');
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
