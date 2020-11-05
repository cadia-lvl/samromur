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
        count: number
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
                    NOT EXISTS
                        (
                            SELECT * FROM votes WHERE votes.clip_id = clips.id AND client_id = ?
                        )
                AND
                    client_id <> ?
                ORDER BY
                    RAND()
                LIMIT ?
            `,
            [clientId, clientId, count]
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

    fetchClips = async (clientId: string, count: number): Promise<Clip[]> => {
        try {
            const clips = await this.fetchRandomClips(clientId, count);
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

    uploadClip = async (
        clientId: string,
        clip: ClipMetadata,
        transcoder: any
    ): Promise<number> => {
        const { sentence, gender, age, nativeLanguage, userAgent } = clip;

        try {
            const { path, originalSentenceId } = await this.bucket.uploadClip(
                clientId,
                clip,
                transcoder
            );

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
                        clips (client_id, path, sentence, original_sentence_id, sex, age, native_language, user_agent)
                    VALUES
                        (?, ?, ?, ?, ?, ?, ?, ?)
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
                    userAgent,
                ]
            );
            const { insertId } = row;
            return Promise.resolve(insertId);
        } catch (error) {
            return Promise.reject(error);
        }
    };
}
