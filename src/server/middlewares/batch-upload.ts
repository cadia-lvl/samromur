import { Request, Response, NextFunction } from 'express';
import { assert } from 'console';
import fs from 'fs';
import multer from 'multer';

import { generateGUID } from '../../utilities/id';
import { ClipMetadata } from '../../types/samples';
import Database, { getDatabaseInstance } from '../database/database';

const db: Database = getDatabaseInstance();

const storage = multer.diskStorage({
destination: (req, file, cb) => {
    cb(null, './uploads/');
},
filename: (req, file, cb) => {
    if (file.fieldname == 'audio') {
        cb(null, file.originalname);
    } else if (file.fieldname) {
        cb(null, file.originalname);
        }
    },
});

const getSentenceFromFile = (file: Express.Multer.File): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(file.path, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data.toString());
            }
        });
    });
};

const findMatchingAudioFile = (
    audio: Express.Multer.File[],
    metadata: Express.Multer.File
): Express.Multer.File | undefined => {
    const withoutExtension = metadata.originalname.replace(/\.[^.]*$/, '');
    return audio.find((file) => file.originalname.startsWith(withoutExtension));
};

export const uploadHandler = multer({ storage: storage }).fields([
    { name: 'audio' },
    { name: 'metadata' },
]);

export default async (req: Request, res: Response, next: NextFunction) => {
    const { headers, method } = req;

    if (method != 'POST') {
        return res.status(400).send('Invalid method.');
    } else {
        const clientId = req.cookies.client_id as string;
        try {
            const { isAdmin } = await db.userClients.fetchUserAccess(clientId);
            assert(isAdmin);
        } catch (error) {
            console.error(error);
            return res.status(403).json(error);
        }

        try {
            const newClientId = generateGUID();

            await db.userClients.insertUserClient(newClientId);

            const age = decodeURIComponent(headers.age as string);
            const dialect = decodeURIComponent(headers.dialect as string);
            const gender = decodeURIComponent(headers.gender as string);
            const nativeLanguage = decodeURIComponent(
                headers.native_language as string
            );
            const status = decodeURIComponent(headers.status as string);

            const files = req.files as {
                [fieldname: string]: Express.Multer.File[];
            };
            const { audio, metadata } = files;

            const clipIds = await Promise.all(
                metadata.map(async (file) => {
                    const sentence = await getSentenceFromFile(file);
                    await db.sentences.insertBatchSentence(sentence, status);
                    const clip: ClipMetadata = {
                        age,
                        dialect,
                        gender,
                        nativeLanguage,
                        status,
                        sentence,
                        userAgent: 'undefined',
                    };

                    const audioFile = findMatchingAudioFile(audio, file);
                    return db.clips
                        .uploadBatchClip(
                            newClientId,
                            clip,
                            audioFile as Express.Multer.File
                        )
                        .then((id: number) => {
                            return Promise.resolve(id);
                        })
                        .catch((error) => {
                            console.error(error);
                            return Promise.resolve(-1);
                        });
                })
            );

            audio.concat(metadata).forEach((file) => fs.unlinkSync(file.path));

            const count = clipIds.reduce(
                (total, value) => (value != -1 ? total + 1 : total),
                0
            );
            console.log(
                `${count} clips uploaded under ${newClientId} with batch label ${status}`
            );
            return res.status(200).json(count);
        } catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
    }
};
