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

interface SentenceWithClip {
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

    SHUFFLE_SIZE = 5000;
    fetchRandomClips = async (
        clientId: string,
        count: number,
        status: string
    ): Promise<TableClip[]> => {
        // If status is samromur or empty, search for clips that already has votes first
        if (status == '' || status == 'samromur') {
            const clips_needing_votes = await this.findClipsNeedingVotes(
                clientId,
                count
            );

            // If enough clips were found return them
            if (clips_needing_votes.length == count) {
                return clips_needing_votes;
            }
        }

        const [clips] = await this.sql.query(
            `
                SELECT * FROM (
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
                    LIMIT ?) as result
                ORDER BY
                    RAND()
                LIMIT ?
            `,
            [
                clientId,
                clientId,
                status ? status : 'samromur',
                this.SHUFFLE_SIZE,
                count,
            ]
        );
        return clips as TableClip[];
    };

    findClipsNeedingVotes = async (
        clientId: string,
        count: number
    ): Promise<TableClip[]> => {
        const [clips] = await this.sql.query(
            `
            SELECT 
                *
            FROM
                (SELECT 
                    *
                FROM
                    clips
                WHERE
                    EXISTS( SELECT 
                            *
                        FROM
                            votes
                        WHERE
                            votes.clip_id = clips.id
                                AND votes.client_id <> ?)
                        AND clips.is_valid IS NULL
                        AND client_id <> ?
                        AND empty = 0
                        AND status = 'samromur'
                LIMIT ?) AS c
            ORDER BY RAND()
            LIMIT ?;
            `,
            [clientId, clientId, this.SHUFFLE_SIZE, count]
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
            icelandicProficiency,
            institution,
            nativeLanguage,
            userAgent,
            status,
            sampleRate,
            duration,
            size,
            isRepeated,
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

            // find the speaker id
            const speaker_id = await this.findSpeakerId(
                clientId,
                gender,
                age,
                nativeLanguage
            );

            const [row] = await this.sql.query(
                `
                    INSERT INTO
                        clips (client_id, path, sentence, original_sentence_id, sex, age, native_language, icelandic_proficiency, institution, user_agent, status, sample_rate, duration, size, dialect, speaker_id, is_repeated)
                    VALUES
                        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                    icelandicProficiency ? icelandicProficiency : null,
                    institution ? institution : null,
                    userAgent,
                    status ? status : 'samromur',
                    sampleRate ? sampleRate : null,
                    duration ? duration : null,
                    size ? size : null,
                    dialect,
                    speaker_id,
                    isRepeated ? 1 : 0,
                ]
            );
            const { insertId } = row;
            this.increaseClipCountOnSentence(originalSentenceId);
            return Promise.resolve(insertId);
        } catch (error) {
            return Promise.reject(error);
        }
    };

    /**
     * Finds the speaker id for the input demographics
     * @param client_id the id of the client
     * @param gender the gender of user
     * @param age the age of the user
     * @param nativeLanguage the native language of the user
     */
    findSpeakerId = async (
        client_id: string | undefined,
        gender: string,
        age: string,
        nativeLanguage: string
    ): Promise<string> => {
        const [[row]] = await this.sql.query(
            `
                SELECT
                    speaker_id
                FROM
                    clips
                WHERE
                    client_id = ?
                AND
                    sex = ?
                AND
                    age = ?
                AND
                    native_language = ?
                AND 
                    speaker_id is not null
                LIMIT 1
            `,
            [client_id, gender, age, nativeLanguage]
        );

        // If not found, generate new speaker id
        if (!row) {
            const new_speaker_id = await this.generateNewSpeakerId();
            return new_speaker_id;
        }

        const { speaker_id } = row;
        return speaker_id;
    };

    /**
     * Counts how many speakers there are inte the db, and
     * returns the number + 1 as a new speaker id on a 6 character string
     * format, the number gets padded with zeros
     */
    generateNewSpeakerId = async (): Promise<string> => {
        const [[row]] = await this.sql.query(
            `
                SELECT 
                    speaker_id 
                FROM 
                    clips 
                ORDER BY 
                    speaker_id desc 
                LIMIT 1
            `
        );
        const { speaker_id } = row;
        const speaker_id_parsed = parseInt(speaker_id)
            ? parseInt(speaker_id)
            : 0;
        const new_speaker_id: string = (speaker_id_parsed + 1)
            .toString()
            .padStart(6, '0');
        return new_speaker_id;
    };

    /**
     * Counts the amounts of clips with the given sentence id
     * and updates the clips_count in the sentences table accordingly
     * @param sentenceId the sentence to update the count for
     */
    increaseClipCountOnSentence = async (sentenceId: string): Promise<void> => {
        await this.sql.query(
            `
            UPDATE
                sentences
            SET
                clips_count = (select count(*) from clips where original_sentence_id = ?)
            WHERE
                id = ?
        `,
            [sentenceId, sentenceId]
        );
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

    fetchVerificationLabelsNeedingVotes = async (
        clientId: string
    ): Promise<string[]> => {
        const [rows] = await this.sql.query(
            `
            SELECT 
                status
            FROM
                ( SELECT
                    status, COUNT(*) AS count
                FROM
                    clips
                WHERE
                    status not in ('pybossa', 'samromur', 'lobe_kids_25k', 'lobe_kids_25k_290621')
                AND
                    NOT EXISTS (
                        SELECT
                            *
                        FROM
                            votes
                        WHERE
                            votes.clip_id = clips.id
                        AND
                            client_id = ?)
                    AND
                        is_valid is null
                    AND
                        empty = 0
                    GROUP BY
                        status
                ) AS res
        `,
            [clientId]
        );
        const statuses = rows.map(({ status }: { status: string }) => status);
        return statuses;
    };

    SMALL_SHUFFLE_SIZE = 500;
    /**
     * Fetches the clips (with sentences) for the herma (repeat) contribution type
     * TEMPORARILY ALWAYS FETCHES IN ALPHABETICAL ORDER until db fixed
     * TODO: switch to fetchRandomClipsToRepeat
     * @param clientId
     * @param count
     */
    fetchRepeatedClips = async (
        clientId: string,
        count: number
    ): Promise<Clip[]> => {
        try {
            const repeatedClips = await this.fetchRandomClipsToRepeat(
                clientId,
                count
            );
            const withPublicUrls: Clip[] = await Promise.all(
                repeatedClips.map((clip: SentenceWithClip) => {
                    return {
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

    /**
     * Fetches the first count number of clips to repeat from the db
     * TODO: remove when db fixed
     * @param count
     */
    fetchOrderedClipsToRepeat = async (
        count: number
    ): Promise<SentenceWithClip[]> => {
        const [clips] = await this.sql.query(
            `
                SELECT
                    id as original_sentence_id, text as sentence, clip_path as path
                FROM
                    sentences
                WHERE
                    clip_path IS NOT NULL
                ORDER BY
                    clips_count asc
                LIMIT ?
            `,
            [count]
        );
        return clips as SentenceWithClip[];
    };

    /**
     * Fetches random clips with sentences for the user to repeat
     * @param clientId
     * @param count
     */
    fetchRandomClipsToRepeat = async (
        clientId: string,
        count: number
    ): Promise<SentenceWithClip[]> => {
        const [clips] = await this.sql.query(
            `
                SELECT * FROM (	
                    SELECT 
                        id as original_sentence_id, 
                        text as sentence, 
                        clip_path as path
	                FROM 
                        sentences 
	                WHERE 
                        is_used = ?
	                AND 
                        clip_path is not null 
                    AND NOT exists (
		                SELECT 
                            *
                        FROM 
                            clips
                        WHERE 
                            clips.original_sentence_id = sentences.id
                        AND 
                            clips.client_id = ?)
                    ORDER BY 
                        clips_count asc
                    LIMIT ?) as result
                ORDER BY 
                    RAND()
                LIMIT ?
            `,
            [true, clientId, this.SMALL_SHUFFLE_SIZE, count]
        );
        return clips as SentenceWithClip[];
    };
}
