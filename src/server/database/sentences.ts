import Sql from './sql';
import { SimpleSentenceBatch } from '../../types/sentences';
import { sha256hash as hash } from '../../utilities/hash';

export default class Sentences {
    private sql: Sql;

    constructor(sql: Sql) {
        this.sql = sql;
    }

    insertBatch = async (batch: SimpleSentenceBatch): Promise<any> => {
        const pool = await this.sql.createPool();
        return Promise.all(batch.sentences.map((sentence: string) => {
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
        })).then(() => {
            pool.end().catch((e: any) => console.error(e));
        })
    }

    // TO-DO: Order by clips count
    fetchSentences = async (clientId: string, count: number): Promise<any> => {
        const [rows] = await this.sql.query(
            `
            SELECT 
                id, text
            FROM
                sentences
            WHERE is_used = 1
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
                RAND()
            LIMIT ?
            `,
            [clientId ? clientId : 'fakeid', count]
        );
        return rows;
    }

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
            `);
        return rows;
    }
}