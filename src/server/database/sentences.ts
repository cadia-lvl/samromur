import Sql from './sql';
import { SimpleSentenceBatch } from '../../types/sentences';
import { sha256hash as hash } from '../../utilities/hash';
import {
    AgeGroups,
    AgeLimit,
    getAgeGroup,
    getAgeGroupFromString,
} from '../../utilities/demographics-age-helper';

export default class Sentences {
    private sql: Sql;

    constructor(sql: Sql) {
        this.sql = sql;
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
                return pool.query(
                    `
                    INSERT INTO
                        sentences
                    (id, text, is_used, source)
                    VALUES
                        (?, ?, ?, ?)
                        ON DUPLICATE KEY UPDATE
                    is_used = VALUES(is_used)
                `,
                    [hash(sentence), sentence, true, batch.name]
                );
            })
        ).then(() => {
            pool.end().catch((e: any) => console.error(e));
        });
    };

    // When getting new sentences we need to fetch a larger pool and shuffle it to make it less
    // likely that different users requesting at the same time get the same data
    SHUFFLE_SIZE = 5000;
    fetchSentences = async (
        clientId: string,
        count: number,
        age: string,
        nativeLanguage: string
    ): Promise<any> => {
        const ageGroup = getAgeGroup(age, nativeLanguage);
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
                    clips_count asc
                LIMIT ?) as result
            ORDER BY 
                RAND()
            LIMIT ?
            `,
            [ageGroup, clientId ? clientId : 'fakeid', this.SHUFFLE_SIZE, count]
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
}
