import { Request, Response, NextFunction } from 'express';
import { assert } from 'console';
import fs from 'fs';
import Database, { getDatabaseInstance } from '../database/database';
import {
    getSentenceFromFile,
    findMatchingAudioFile,
} from '../utilities/upload-helper';

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
            const packageName = decodeURIComponent(
                headers.package_name as string
            );
            const files = req.files as {
                [fieldname: string]: Express.Multer.File[];
            };
            const { audio, metadata } = files;

            const sentenceIds: number[] = await Promise.all(
                metadata.map(async (file) => {
                    const sentence = await getSentenceFromFile(file);
                    const audioFile = findMatchingAudioFile(audio, file);
                    return db.sentences
                        .uploadSentenceWithClip(
                            sentence,
                            packageName,
                            audioFile as Express.Multer.File
                        )
                        .then((id: number) => {
                            return Promise.resolve(id);
                        })
                        .catch((error: any) => {
                            console.error(error);
                            return Promise.resolve(-1);
                        });
                })
            );

            // Delete the files
            audio.concat(metadata).forEach((file) => fs.unlinkSync(file.path));

            const count = sentenceIds.reduce(
                (total, value) => (value != -1 ? total + 1 : total),
                0
            );
            console.log(
                `${count}/${sentenceIds.length} sentences with clips uploaded with source label ${packageName}`
            );
            return res.status(200).json(count);
        } catch (error) {
            console.error(error);
            return res.status(500).json(error);
        } finally {
            // Test to see if connections close correctly
            db.sentences.closeConnection();
        }
    }
};
