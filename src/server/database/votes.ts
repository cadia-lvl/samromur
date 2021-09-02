import Sql from './sql';
import { ClipVote } from '../../types/samples';
import { Vote } from '../../types/votes';
import { ResultSetHeader } from 'mysql2';

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
        const machine_verified = await this.isMachineVerified(clipId);
        return this.sql.query(
            `
                UPDATE
                    clips
                SET
                    is_valid = ?,
                    machine_verified = ?
                WHERE
                    id = ?
                AND
                    is_valid is null;
            `,
            [
                status == ClipStatus.UNFINISHED
                    ? null
                    : status == ClipStatus.VALID
                    ? 1
                    : 0,
                machine_verified,
                clipId,
            ]
        );
    };

    saveVote = async (
        clientId: string,
        clipId: number,
        isSuper: boolean,
        vote: ClipVote,
        updateClip: boolean = true
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
            if (updateClip) {
                this.updateClipStatus(clipId, isSuper, vote);
            }

            return Promise.resolve(insertId);
        } catch (error) {
            return Promise.reject(error);
        }
    };

    addVoteBatch = async (votes: Vote[]): Promise<BatchUploadResults> => {
        try {
            const output: BatchUploadResults = new BatchUploadResults();
            // Find Marosijo user_client or create a new one if none exists
            const marosijo_client_id = await this.findMarosijoClientId();
            const validatedIds = await this.getValidatedClips(votes);

            // Store for output
            output.foundValidatedClips = validatedIds.length;

            // Filter out clips that have been validated
            const toAdd = votes.filter((vote) => {
                return !validatedIds.some(
                    (validated) => validated == vote.clipId
                );
            });

            // Create an array for the VALUES that are to be added to the votes table
            const values: string[] = Array<string>();
            toAdd.forEach((vote) => {
                const unsure = ClipVote.UNSURE == vote.vote;
                const isValid = unsure
                    ? null
                    : vote.vote == ClipVote.VALID
                    ? true
                    : false;
                values.push(
                    `(null, ${vote.clipId}, '${marosijo_client_id}', ${isValid}, ${vote.isSuper}, ${unsure} )`
                );
            });

            // Add votes to votes table
            const res = await this.sql.query(`
                    INSERT INTO
                        votes (id, clip_id, client_id, is_valid, is_super, is_unsure)
                    VALUES
                        ${values.join(',')}
                    ON DUPLICATE KEY UPDATE
                        is_valid = VALUES(is_valid),
                        is_unsure = VALUES(is_unsure)

                        `);
            output.duplicateVotes = this.getDuplicates(res[0]);
            output.votesAdded = this.getNewRows(res[0]);

            // Update clips with super votes
            const supers = toAdd.filter((vote) => vote.isSuper);
            const clipsUpdatedSuper = await this.updateClipsFromMachineBatch(
                supers
            );

            // Update clips if needed where vote is not supervote
            const normalVotes = toAdd.filter((vote) => !vote.isSuper);
            const clipsUpdatedNormal = await this.updateFromBatchIfNeeded(
                normalVotes
            );

            // Update the output
            output.clipsUpdatedNormal = clipsUpdatedNormal;
            output.clipsUpdatedSuper = clipsUpdatedSuper;

            return Promise.resolve(output);
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
                        (?,"marosijo_has_no@email.com","marosijo_robot")
                `,
                [id]
            );
            return Promise.resolve(id);
        } catch (error) {
            return Promise.reject(error);
        }
    };

    isMachineVerified = async (clipId: number): Promise<boolean> => {
        const [[row]] = await this.sql.query(
            `
                SELECT 
                    count(*) as count
                FROM 
                    votes 
                WHERE
                    client_id = ?
                AND
                    clip_id = ?
            `,
            [this.MAROSIJO_CLIENT_ID, clipId]
        );
        return row['count'] > 0;
    };

    /**
     * Gets the clips that are already validated.
     * @param votes the votes array that we want to add
     * @returns the ids of the clips that are already validated
     */
    getValidatedClips = async (votes: Vote[]): Promise<number[]> => {
        const ids = votes.map((vote) => vote.clipId);

        const [rows] = await this.sql.query(
            `
                SELECT
                    id
                FROM
                    clips
                WHERE
                    id in (${ids})
                AND
                    is_valid is not null
            `
        );

        const output: number[] = new Array<number>();
        rows.forEach((row: ClipId) => {
            output.push(row.id);
        });

        return output;
    };

    /**
     * Updates the clips in the input votes array with the casting vote value
     * @param votes a list of votes that are casting the updating vote
     * @returns the amount of clips that were updated
     */
    updateClipsFromMachineBatch = async (votes: Vote[]): Promise<number> => {
        const validIds: number[] = votes
            .filter((vote) => {
                return vote.vote == ClipVote.VALID;
            })
            .map((vote) => vote.clipId);

        const invalidIds = votes
            .filter((vote) => {
                return vote.vote == ClipVote.INVALID;
            })
            .map((vote) => vote.clipId);

        let affectedRows = 0;

        if (validIds.length > 0) {
            const r = await this.sql.query(
                `
                    UPDATE
                        clips
                    SET
                        is_valid = 1,
                        machine_verified = 1
                    WHERE
                        id in (${validIds})
                `
            );
            affectedRows += r[0].affectedRows;
        }

        if (invalidIds.length > 0) {
            const r = await this.sql.query(
                `
                UPDATE
                    clips
                SET
                    is_valid = 0,
                    machine_verified = 1
                WHERE
                    id in (${invalidIds})
                `
            );
            affectedRows += r[0].affectedRows;
        }
        return affectedRows;
    };

    /**
     * Update the clips that needs updating after a vote batch has been added.
     * @param votes should be an array of normal votes (not super)
     */
    updateFromBatchIfNeeded = async (votes: Vote[]): Promise<number> => {
        const ids = votes.map((vote) => vote.clipId);

        const [rows] = await this.sql.query(
            `
            SELECT
                clip_id, 
                CASE
                    WHEN invalid_clips >= 2  THEN "INVALID"
                    WHEN valid_clips >= 2 THEN "VALID"
                END valid
            FROM
                (SELECT 
                    sum(is_valid=1) as valid_clips, sum(is_valid=0) as invalid_clips, clip_id
                FROM
                    votes
                WHERE
                    clip_id in (${ids})
                GROUP BY
                    clip_id
                    ) as s
            `
        );

        // Get the ids that will update
        const idsThatUpdate: number[] = rows.map(
            (row: { valid: string | undefined; clip_id: number }) => {
                if (row.valid) {
                    return row.clip_id;
                }
            }
        );

        // Get the votes that are casting the final vote
        const votesThatUpdate: Vote[] = votes.filter((vote) =>
            idsThatUpdate.some((element) => element == vote.clipId)
        );

        // Update the clips according to the vote
        const affectedRows = await this.updateClipsFromMachineBatch(
            votesThatUpdate
        );
        return affectedRows;
    };

    /**
     * Help function to get the duplicates value from the sql ResultSetHeader
     * @param r the ResultSetHeader from an sql call
     * @returns the number of duplicated values
     */
    private getDuplicates = (r: ResultSetHeader) => {
        return parseInt(r.info.split(/\s+/)[3]);
    };

    /**
     * Helper function to get amount of newly inserted rows
     * Should be the difference between duplicate and affected rows
     * @param r
     * @returns
     */
    private getNewRows = (r: ResultSetHeader) => {
        return r.affectedRows - this.getDuplicates(r);
    };
}
interface ClipId {
    id: number;
}

export class BatchUploadResults {
    clipsUpdatedNormal: number;
    clipsUpdatedSuper: number;
    votesAdded: number;
    duplicateVotes: number;
    foundValidatedClips: number;

    constructor() {
        this.clipsUpdatedNormal = 0;
        this.clipsUpdatedSuper = 0;
        this.votesAdded = 0;
        this.duplicateVotes = 0;
        this.foundValidatedClips = 0;
    }

    add = (r: BatchUploadResults) => {
        this.clipsUpdatedNormal += r.clipsUpdatedNormal;
        this.clipsUpdatedSuper += r.clipsUpdatedSuper;
        this.votesAdded += r.votesAdded;
        this.duplicateVotes += r.duplicateVotes;
        this.foundValidatedClips += r.foundValidatedClips;
    };
}
