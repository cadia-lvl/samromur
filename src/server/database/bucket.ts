import { S3 } from 'aws-sdk';
import { getConfig } from '../../utilities/config-helper';
import { AWS } from './aws';
import fs from 'fs';
import { Request } from 'express';
import { ClipMetadata } from '../../types/samples';
import { sha256hash as hash } from '../../utilities/hash';

export interface UploadClipResponse {
    path: string;
    originalSentenceId: string;
}

export default class Bucket {
    private s3: S3;
    private bucketName: string;

    constructor() {
        this.s3 = AWS.getS3();
        this.bucketName = getConfig().S3.BUCKET_NAME;
    }

    private assertFolder = (folder: string): Promise<any> => {
        return this.s3
            .putObject({
                Bucket: this.bucketName,
                Key: folder,
            })
            .promise();
    };

    /**
     * Fetch a public url from path.
     */
    getPublicUrl(path: string) {
        return this.s3.getSignedUrl('getObject', {
            Bucket: getConfig().S3.BUCKET_NAME,
            Key: path,
            Expires: 24 * 60 * 30,
        });
    }

    /**
     * Upload clip to S3 and return the path and a hash of the sentence.
     */
    uploadClip = async (
        clientId: string,
        clip: ClipMetadata,
        transcoder: any
    ): Promise<UploadClipResponse> => {
        const folder = clientId + '/';

        // Create folder if it does not exist;
        await this.assertFolder(folder);

        // Filename is a hash of the sentence
        const filePrefix = hash(clip.sentence);
        const clipFileName = folder + filePrefix + '.wav';

        // Metadata file
        // const sentenceFileName = folder + filePrefix + '.txt';
        try {
            await this.s3
                .upload({
                    Bucket: this.bucketName,
                    Key: clipFileName,
                    Body: transcoder
                        .audioCodec('pcm_s16le')
                        .format('wav')
                        .stream(),
                    ContentType: 'audio/mpeg',
                })
                .promise();
            return Promise.resolve({
                path: clipFileName,
                originalSentenceId: filePrefix,
            });
        } catch (error) {
            return Promise.reject(error);
        }
    };

    /**
     * Upload batch clip from file and metadata to S3
     */
    uploadBatchClip = async (
        clientId: string,
        clip: ClipMetadata,
        audio: Express.Multer.File
    ): Promise<UploadClipResponse> => {
        const folder = clientId + '/';

        // Create folder if it does not exist;
        await this.assertFolder(folder);

        // Filename is a hash of the sentence
        const filePrefix = hash(clip.sentence);
        const clipFileName = folder + filePrefix + '.wav';

        // Metadata file
        // const sentenceFileName = folder + filePrefix + '.txt';

        try {
            await this.s3
                .upload({
                    Bucket: this.bucketName,
                    Key: clipFileName,
                    Body: fs.createReadStream(audio.path),
                    ContentType: 'audio/wav',
                })
                .promise();
            return Promise.resolve({
                path: clipFileName,
                originalSentenceId: filePrefix,
            });
        } catch (error) {
            return Promise.reject(error);
        }
    };
}
