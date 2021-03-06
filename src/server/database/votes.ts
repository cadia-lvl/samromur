import Sql from './sql';
import { ClipVote } from '../../types/samples';
import { Vote } from '../../types/votes';
import { generateGUID } from '../../utilities/id';

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
    };

    clipVoteToStatus = (vote: ClipVote): ClipStatus => {
        switch (vote) {
            case ClipVote.VALID:
                return ClipStatus.VALID;
            case ClipVote.INVALID:
                return ClipStatus.INVALID;
            default:
                return ClipStatus.UNFINISHED;
        }
    };

    updateClipStatus = async (
        clipId: number,
        isSuper: boolean,
        vote: ClipVote
    ): Promise<void> => {
        const status = isSuper
            ? this.clipVoteToStatus(vote)
            : await this.fetchStatus(clipId);
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
                status == ClipStatus.UNFINISHED
                    ? null
                    : status == ClipStatus.VALID
                    ? 1
                    : 0,
                clipId,
            ]
        );
    };

    saveVote = async (
        clientId: string,
        clipId: number,
        isSuper: boolean,
        vote: ClipVote
    ): Promise<number> => {
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
                    isSuper,
                    unsure,
                ]
            );
            const { insertId } = row;

            // If clip has enough votes or is from super user update it
            this.updateClipStatus(clipId, isSuper, vote);

            return Promise.resolve(insertId);
        } catch (error) {
            return Promise.reject(error);
        }
    };

    addVoteBatch = async (votes: Vote[]): Promise<number> => {
        try {
            // Find Marosijo user_client or create a new one if none exists
            const marosijo_client_id = await this.findMarosijoClientId();

            // Create a pool for adding many votes to increase performance
            // and avoid deadlocks
            // const pool = await this.sql.createPool();
            const results = await Promise.all(
                // votes.map(async (vote) => {
                //     const result = await pool.query(
                //         `
                //             INSERT INTO
                //                 votes (clip_id, client_id, is_valid, is_super, is_unsure)
                //             VALUES
                //                 (?, ?, ?, ?, ?)
                //             ON DUPLICATE KEY UPDATE
                //                 is_valid = VALUES(is_valid),
                //                 is_super = VALUES(is_super),
                //                 is_unsure = VALUES(is_unsure)
                //         `,
                //         [
                //             vote.clipId,
                //             marosijo_client_id,
                //             vote.vote == ClipVote.VALID ? true : false,
                //             false,
                //             false,
                //             false,
                //         ]
                //     );
                //     return Promise.resolve(result);
                // })
                votes.map(async (vote) => {
                    const saveVoteResult = await this.saveVote(
                        marosijo_client_id,
                        vote.clipId,
                        false,
                        vote.vote
                    );
                    return Promise.resolve(saveVoteResult);
                })
            );
            // pool.end().catch((e: any) => console.error(e));
            console.log('results length: ', results.length);
            return Promise.resolve(results.length);
        } catch (error) {
            return Promise.reject(error);
        } finally {
            this.sql.endConnection();
        }
    };

    MAROSIJO_CLIENT_ID = 'ef80dd7f-c13f-4302-92b6-628b56ef77e7';
    private findMarosijoClientId = async (): Promise<string> => {
        try {
            const [[row]] = await this.sql.query(
                `
                    SELECT 
                        client_id 
                    from 
                        user_clients
                    WHERE
                        client_id = ?
                `,
                [this.MAROSIJO_CLIENT_ID]
            );
            let { client_id } = row;
            if (client_id) {
                return Promise.resolve(client_id);
            }
            // No marosijo client found
            // create a new client for marosijo
            return await this.insertMarosijoClient();
        } catch (error) {
            return Promise.reject(error);
        }
    };

    insertMarosijoClient = async (): Promise<string> => {
        const id = this.MAROSIJO_CLIENT_ID;
        try {
            await this.sql.query(
                `
                    INSERT INTO
                        user_clients (client_id, email, username)
                    VALUES
                        (?,?,?)
                `,
                [id]
            );
            return Promise.resolve(id);
        } catch (error) {
            return Promise.reject(error);
        }
    };
}
