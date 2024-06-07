import Sql from './sql';
import { SimpleSentence, SimpleSentenceBatch } from '../../types/sentences';
import { sha256hash as hash } from '../../utilities/hash';
import {
    AgeGroups,
    AgeLimit,
    getAgeGroup,
    getAgeGroupFromString,
} from '../../utilities/demographics-age-helper';
import Bucket from './bucket';

export default class Sentences {
    private sql: Sql;
    private bucket: Bucket;

    constructor(sql: Sql, bucket: Bucket) {
        this.sql = sql;
        this.bucket = bucket;
    }

    insertBatchSentence = async (
        sentence: string,
        label: string
    ): Promise<void> => {
        return this.sql
            .query(
                `
                INSERT INTO
                    sentences (id, text, is_used, source, clips_count)
                VALUES
                    (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    is_used = VALUES(is_used),
                    source = VALUES(source),
                    clips_count = clips_count + 1
            `,
                [hash(sentence), sentence, true, label, 1]
            )
            .then(([{ affectedRows }]) => {
                return !!affectedRows ? Promise.resolve() : Promise.reject();
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    };

    insertBatch = async (batch: SimpleSentenceBatch): Promise<any> => {
        const pool = await this.sql.createPool();
        return Promise.all(
            batch.sentences.map((sentence: string) => {
                const items = sentence.split('\t');
                // handle files with text, source, age
                const text = items[0];

                // if empty sentence text throw error
                // TODO: upgrade this to return a success count when adding sentences to admin page
                if (text.length === 0) {
                    console.error('Empty sentence in sentence list');
                    return;
                }
                const source = items[1] ? items[1] : batch.name;
                const age = items[2] ? items[2] : 'adult';

                return pool.query(
                    `
                    INSERT INTO
                        sentences
                    (id, text, is_used, source, age)
                    VALUES
                        (?, ?, ?, ?, ?)
                        ON DUPLICATE KEY UPDATE
                    is_used = VALUES(is_used)
                `,
                    [hash(text), text, true, source, age]
                );
            })
        ).then(() => {
            pool.end().catch((e: any) => console.error(e));
        });
    };

    // When getting new sentences we need to fetch a larger pool and shuffle it to make it less
    // likely that different users requesting at the same time get the same data
    SHUFFLE_SIZE = 500;
    fetchSentences = async (
        clientId: string,
        count: number,
        age: string,
        nativeLanguage: string,
        source?: string
    ): Promise<any> => {
        const ageGroup = getAgeGroup(age, nativeLanguage);
        if (source) {
            if (source == "l2") {
                const sentencesBySource: Array<SimpleSentence> = await this.fetchUniqueSentencesFromSource(
                    clientId,
                    count,
                    source
                );
                return sentencesBySource;
            } else {
                const sentencesBySource: Array<SimpleSentence> = await this.fetchSentencesFromSourceOrdered(
                    clientId,
                    count,
                    source
                );
                return sentencesBySource;
            }
        }
        const [rows] = await this.sql.query(
            `
            SELECT 
                * 
            FROM
                (SELECT 
                    id, text
                FROM
                    sentences
                WHERE is_used = 1
                AND age = ?
                AND clips_count < 10
                AND
                    NOT EXISTS (
                        SELECT
                            *
                        FROM
                            clips
                        WHERE
                            clips.original_sentence_id = sentences.id
                        AND
                            clips.client_id = ?
                    )
                ORDER BY
                    clips_count desc
                LIMIT ?) as result
            ORDER BY 
                RAND()
            LIMIT ?
            `,
            [ageGroup, clientId ? clientId : 'fakeid', this.SHUFFLE_SIZE, count]
        );
        return rows;
    };

    /**
     * This method was implemented specifically for the captini project
     * to get 100 sentences from a specific source, disregarding age and
     * native language in the request
     * @param clientId client id to filter away already uttered sentences
     * @param count amount of sentences to get
     * @param source source to get sentences from
     * @returns
     */
    fetchSentencesFromSourceOrdered = async (
        clientId: string,
        count: number,
        source: string
    ): Promise<Array<SimpleSentence>> => {
        const [rows] = await this.sql.query(
            `
            SELECT 
                id, text
            FROM
                sentences
            WHERE 
                source = ?
            AND
                is_used = 1
            AND
                NOT EXISTS (
                    SELECT
                        *
                    FROM
                        clips
                    WHERE
                        clips.original_sentence_id = sentences.id
                    AND
                        clips.client_id = ?
                )
            ORDER BY created_at
            LIMIT ?
            `,
            [source, clientId ? clientId : 'fakeid', count]
        );
        return rows;
    };

    /**
     * This method was implemented specifically for the H17-L2 project
     * to get unique sentences from a specific source, disregarding age and
     * native language in the request
     * @param clientId client id to filter away already uttered sentences
     * @param count amount of sentences to get
     * @param source source to get sentences from
     * @returns
     */
    fetchUniqueSentencesFromSource = async (
        clientId: string,
        count: number,
        source: string
    ): Promise<Array<SimpleSentence>> => {
        const [rows] = await this.sql.query(
            `
            SELECT 
                id, text
            FROM
                sentences
            WHERE 
                source = ?
            AND
                is_used = 1
            AND
                NOT EXISTS (
                    SELECT
                        *
                    FROM
                        clips
                    WHERE
                        clips.original_sentence_id = sentences.id
                )
            LIMIT ?
            `,
            [source, count]
        );
        return rows;
    };

    fetchAllAgeGroupsSentences = async (
        clientId: string,
        count: number
    ): Promise<any> => {
        const adultRows = await this.fetchSentences(
            clientId,
            count,
            AgeLimit.ADULT,
            ''
        );
        const teenRows = await this.fetchSentences(
            clientId,
            count,
            AgeLimit.TEENS,
            ''
        );
        const kidsRows = await this.fetchSentences(
            clientId,
            count,
            AgeLimit.KIDS,
            ''
        );
        return [adultRows, teenRows, kidsRows];
    };

    fetchAllSentencesInfo = async (): Promise<any> => {
        const [rows] = await this.sql.query(
            `
                SELECT
                    batch,
                    COUNT(*) as count
                FROM
                    sentences
                GROUP BY
                    batch
            `
        );
        return rows;
    };

    /**
     * Uploads a sentence with clip (for repeating purposes) to the db and s3 bucket.
     * @param sentence the sentence to add to the db
     * @param packageName the source of the sentence package
     * @param audioFile the audio file to upload to the bucket
     */
    uploadSentenceWithClip = async (
        sentence: string,
        packageName: string,
        audioFile: Express.Multer.File
    ): Promise<number> => {
        const {
            path,
            originalSentenceId,
        } = await this.bucket.uploadRepeatSentenceClip(sentence, audioFile);

        return this.insertSentenceWithClip(
            sentence,
            originalSentenceId,
            packageName,
            path
        );
    };

    /**
     * Inserts a sentence that has a clip for repeating purposes into the db
     * @param sentence the sentence
     * @param originalSentenceId the id of the sentence
     * @param packageName the source/package name of the sentence
     * @param path the path of the sentence clip
     */
    insertSentenceWithClip = async (
        sentence: string,
        originalSentenceId: string,
        packageName: string,
        path: string
    ): Promise<number> => {
        try {
            const [row] = await this.sql.query(
                `
                    INSERT INTO
                        sentences (id, text, is_used, source, clip_path)
                    VALUES
                        (?, ?, ?, ?, ?)
                `,
                [originalSentenceId, sentence, true, packageName, path]
            );
            const { insertId } = row; // 0 if all ok
            return Promise.resolve(insertId);
        } catch (error) {
            return Promise.reject(error);
        }
    };

    closeConnection = async () => {
        this.sql.endConnection();
    };
}
