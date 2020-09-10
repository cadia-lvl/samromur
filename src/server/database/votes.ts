import Sql from './sql';
import { ClipVote } from '../../types/samples';

export enum ClipStatus {
    VALID = 'VALID',
    INVALID = 'INVALID',
    UNFINISHED = 'UNFINISHED',
}

export default class Votes {
    private sql: Sql;

    constructor(sql: Sql) {
        this.sql = sql;
    }

    fetchStatus = async (clipId: number): Promise<ClipStatus> => {
        try {
            const [[row]] = await this.sql.query(
                `
                    SELECT
                        CASE
                            WHEN invalid >= 2 THEN 'INVALID'
                            WHEN valid >= 2  THEN 'VALID'
                            ELSE 'UNFINISHED'
                        END status
                    FROM (
                        SELECT
                            SUM(is_valid = 0) as invalid,
                            SUM(is_valid = 1) as valid
                        FROM
                            votes
                        WHERE 
                            clip_id = ?
                        ) t
                `,
                [clipId]
            );
            return Promise.resolve(row['status'] as ClipStatus);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    updateClipStatus = async (clipId: number): Promise<void> => {
        const status = await this.fetchStatus(clipId);
        return this.sql.query(
            `
                UPDATE
                    clips
                SET
                    is_valid = ?
                WHERE
                    id = ?;
            `,
            [
                status == ClipStatus.UNFINISHED ? null : status == ClipStatus.VALID ? 1 : 0,
                clipId
            ]
        );
    }

    saveVote = async (clientId: string, clipId: number, vote: ClipVote): Promise<number> => {
        const unsure = ClipVote.UNSURE == vote;
        try {
            const [row] = await this.sql.query(
                `
                    INSERT INTO
                        votes (id, clip_id, client_id, is_valid, is_super, is_unsure)
                    VALUES
                        (?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                        is_valid = VALUES(is_valid),
                        is_unsure = VALUES(is_unsure)
                `,
                [
                    null,
                    clipId,
                    clientId,
                    unsure ? null : vote == ClipVote.VALID ? true : false,
                    false, //Is super
                    unsure
                ]
            );
            const { insertId } = row;

            // If clip has enough votes update it
            this.updateClipStatus(clipId);

            return Promise.resolve(insertId);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}