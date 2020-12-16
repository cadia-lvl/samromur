import { NextApiRequest, NextApiResponse } from 'next';
import { PassThrough } from 'stream';
import Database, {
    getDatabaseInstance,
} from '../../../server/database/database';
import { ClipMetadata } from '../../../types/samples';

const Transcoder = require('stream-transcoder');

const db: Database = getDatabaseInstance();

const base64ToBuffer = async (request: NextApiRequest): Promise<Buffer[]> => {
    let chunks: Buffer[] = [];
    await new Promise((resolve) => {
        request.on('data', (chunk: Buffer) => {
            chunks.push(chunk);
        });
        request.on('end', resolve);
    });
    return chunks;
};

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    if (method != 'POST') {
        res.status(400).send('Invalid method.');
    } else {
        const { headers } = req;
        const clientId =
            decodeURIComponent(req.headers.client_id as string) || '';
        if (!clientId) {
            return res.status(401);
        }
        const age = decodeURIComponent(headers.age as string);
        const clipId = parseInt(headers.clip_id as string) || undefined;
        const gender = decodeURIComponent(headers.gender as string);
        const sentence = decodeURIComponent(headers.sentence as string);
        const userAgent = decodeURIComponent(headers.user_agent as string);
        const nativeLanguage = decodeURIComponent(
            headers.native_language as string
        );
        const sampleRate = parseInt(headers.sample_rate as string) || undefined;
        const duration = parseFloat(headers.duration as string) || undefined;
        const size = parseFloat(headers.size as string) || undefined;

        const clip: ClipMetadata = {
            age,
            id: clipId && clipId,
            gender,
            nativeLanguage,
            sentence,
            userAgent,
            sampleRate: sampleRate && sampleRate,
            duration: duration && duration,
            size: size && size,
        };

        const contentType = headers['content-type'] as string;
        try {
            let transcoder;
            if (contentType.includes('base64')) {
                // If we were given base64, we'll need to concat it all first
                // So we can decode it in the next step.
                const chunks = await base64ToBuffer(req);
                const passThrough = new PassThrough();
                passThrough.end(
                    Buffer.from(Buffer.concat(chunks).toString(), 'base64')
                );
                transcoder = new Transcoder(passThrough);
            } else {
                transcoder = new Transcoder(req);
            }

            const clipId = await db.clips.uploadClip(
                clientId,
                clip,
                transcoder
            );
            return res.status(200).send(clipId);
        } catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
    }
};
