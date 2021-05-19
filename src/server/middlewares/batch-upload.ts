import { Request, Response, NextFunction } from 'express';
import { assert } from 'console';
import fs from 'fs';

import { generateGUID } from '../../utilities/id';
import {
    getSentenceFromFile,
    findMatchingAudioFile,
} from '../utilities/upload-helper';
import { ClipMetadata } from '../../types/samples';
import Database, { getDatabaseInstance } from '../database/database';

const db: Database = getDatabaseInstance();

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
                        isRepeated: false,
                    };

                    const audioFile = findMatchingAudioFile(audio, file);
                    return await db.clips
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
        } finally {
            db.sentences.closeConnection();
        }
    }
};
