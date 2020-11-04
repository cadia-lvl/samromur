import { NextApiRequest, NextApiResponse } from 'next';

import EmailClient, { getEmailInstance } from '../../../server/email';

const emailClient: EmailClient = getEmailInstance();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { headers, method } = req;
    if (method != 'POST') {
        res.status(400).send('Invalid method.');
    } else {
        const email = decodeURIComponent(headers.email as string);

        return emailClient
            .subscribeToNewsletter(email)
            .then(() => {
                return res.status(200).json('success');
            })
            .catch((error) => {
                console.error(error);
                return res.status(500).send(error);
            });
    }
};
