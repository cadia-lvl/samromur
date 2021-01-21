import Sql from './sql';
import Bucket from './bucket';
import { Clip, ClipMetadata } from '../../types/samples';

interface Priority {
    priority: number;
    type: string;
    value: string;
}

interface TableClip {
    id: number;
    original_sentence_id: string;
    path: string;
    sentence: string;
}

export default class Clips {
    private sql: Sql;
    private bucket: Bucket;

    constructor(sql: Sql, bucket: Bucket) {
        this.sql = sql;
        this.bucket = bucket;
    }

    fetchPriorities = async (): Promise<any> => {
        const [priorities] = await this.sql.query(
            `
                SELECT
                    *
                FROM
                    vote_priorities
            `
        );
        return priorities as Priority[];
    };

    fetchPrioritizedClips = async (): Promise<any> => {
        const [clips] = await this.sql.query(
            `
                SELECT
                    *
                FROM
                    clips
                WHERE
                    sex LIKE 
            `,
            []
        );
    };

    fetchRandomClips = async (
        clientId: string,
        count: number,
        status: string
    ): Promise<TableClip[]> => {
        const [clips] = await this.sql.query(
            `
                SELECT
                    *
                FROM
                    clips
                WHERE
                    is_valid IS NULL
                AND
                    EMPTY = 0
                AND
                    NOT EXISTS
                        (
                            SELECT * FROM votes WHERE votes.clip_id = clips.id AND client_id = ?
                        )
                AND
                    client_id <> ?
                AND
                    status = ?
                ORDER BY
                    RAND()
                LIMIT ?
            `,
            [clientId, clientId, status ? status : 'samromur', count]
        );
        return clips as TableClip[];
    };

    fetchSpecificClips = async (): Promise<void> => {};

    findClip = async (id: number): Promise<boolean> => {
        const [[clip]] = await this.sql.query(
            `
                SELECT
                    *
                FROM
                    clips
                WHERE
                    id = ?
                LIMIT 1
            `,
            [id]
        );
        return Promise.resolve(!!clip);
    };

    fetchClips = async (
        clientId: string,
        count: number,
        batch: string
    ): Promise<Clip[]> => {
        try {
            const clips = await this.fetchRandomClips(clientId, count, batch);
            const withPublicUrls: Clip[] = await Promise.all(
                clips.map((clip: TableClip) => {
                    return {
                        id: clip.id,
                        recording: {
                            url: this.bucket.getPublicUrl(clip.path),
                        },
                        sentence: {
                            id: clip.original_sentence_id,
                            text: clip.sentence,
                        },
                    } as Clip;
                })
            );
            return Promise.resolve(withPublicUrls);
        } catch (error) {
            return Promise.reject(error);
        }
    };

    insertClip = async (
        clientId: string,
        clip: ClipMetadata,
        path: string,
        originalSentenceId: string
    ): Promise<number> => {
        const {
            sentence,
            gender,
            dialect,
            age,
            institution,
            nativeLanguage,
            userAgent,
            status,
            sampleRate,
            duration,
            size,
        } = clip;

        try {
            if (!!clip.id) {
                // If id is supplied the metadata is already in the database -> only update created at
                await this.sql.query(
                    `
                        UPDATE
                            clips
                        SET
                            created_at = NOW()
                        WHERE
                            id = ?;
                    `,
                    [clip.id]
                );
                return Promise.resolve(clip.id);
            }

            const [row] = await this.sql.query(
                `
                    INSERT INTO
                        clips (client_id, path, sentence, original_sentence_id, sex, age, native_language, institution, user_agent, status, sample_rate, duration, size, dialect)
                    VALUES
                        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                        created_at = NOW();
                `,
                [
                    clientId,
                    path,
                    sentence,
                    originalSentenceId,
                    gender,
                    age,
                    nativeLanguage,
                    institution ? institution : null,
                    userAgent,
                    status ? status : 'samromur',
                    sampleRate ? sampleRate : null,
                    duration ? duration : null,
                    size ? size : null,
                    dialect,
                ]
            );
            const { insertId } = row;
            return Promise.resolve(insertId);
        } catch (error) {
            return Promise.reject(error);
        }
    };

    uploadClip = async (
        clientId: string,
        clip: ClipMetadata,
        transcoder: any
    ): Promise<number> => {
        const { path, originalSentenceId } = await this.bucket.uploadClip(
            clientId,
            clip,
            transcoder
        );

        return this.insertClip(clientId, clip, path, originalSentenceId);
    };

    uploadBatchClip = async (
        clientId: string,
        clip: ClipMetadata,
        audioFile: Express.Multer.File
    ): Promise<number> => {
        const { path, originalSentenceId } = await this.bucket.uploadBatchClip(
            clientId,
            clip,
            audioFile
        );

        return this.insertClip(clientId, clip, path, originalSentenceId);
    };

    fetchVerificationLabels = async (): Promise<string[]> => {
        const [rows] = await this.sql.query(`
            SELECT DISTINCT status FROM clips
        `);
        const statuses = rows.map(({ status }: { status: string }) => status);
        return statuses;
    };
}
