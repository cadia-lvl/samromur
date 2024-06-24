import Sql from './sql';
import {
    CaptiniStat,
    L2Stat,
    CompetitionIndividualStat,
    TimelineStat,
} from '../../types/stats';
import {
    FunromurIndividualStat,
    IndividualStat,
    SchoolStat,
    ScoreboardData,
} from '../../types/competition';
import lazyCache from '../lazy-cache';
import { ContributeType } from '../../types/contribute';
import {
    startTime,
    endTime,
    preStartTime,
    preEndTime,
} from '../../constants/competition';
import moment from 'moment';

const dbStartDate: string = moment(startTime).format('YYYY-MM-DD HH');
const dbEndDate: string = moment(endTime).format('YYYY-MM-DD');
const dbPreStartTime: string = moment(preStartTime).format('YYYY-MM-DD');
const dbPreEndTime: string = moment(preEndTime).format('YYYY-MM-DD');

const minute = 1000 * 60; // 1 minute
const fiveMinutes = 1000 * 60 * 5; // 5 minutes
const tenMinutes = 1000 * 60 * 10; // 10 minutes
const hour = 1000 * 60 * 60; // 1 hour

export default class Clips {
    private sql: Sql;

    constructor(sql: Sql) {
        this.sql = sql;
    }

    fetchWeeklyStats = lazyCache(async (contributeType: string): Promise<
        TimelineStat[]
    > => {
        const table = ['tala', 'herma'].includes(contributeType)
            ? 'clips'
            : 'votes';
        const [rows] = await this.sql.query(
            `
                SELECT
                    COUNT(res.id) as count,
                    DATE(cal.date) as date
                FROM (
                    SELECT SUBDATE(NOW(), INTERVAL 6 DAY) + INTERVAL xc DAY AS date
                    FROM (
                            SELECT @xi:=@xi+1 as xc from
                            (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) xc1,
                            (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) xc2,
                            (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) xc3,
                            (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) xc4,
                            (SELECT @xi:=-1) xc0
                        ) xxc1
                    ) cal
                LEFT JOIN
                    (select * from ${table} 
                    ${
                        contributeType == 'tala'
                            ? 'WHERE is_repeated = 0'
                            : contributeType == 'herma'
                            ? 'WHERE is_repeated = 1'
                            : ''
                    }) as res
                ON
                    DATE(res.created_at) = DATE(cal.date)
                WHERE
                    cal.date <= NOW()
                GROUP BY
                    cal.date
                ORDER BY
                    cal.date
                ASC
            `
        );
        return Promise.resolve(rows);
    }, tenMinutes);

    fetchTotalClipsTimeline = lazyCache(async () => {
        const [rows] = await this.sql.query(
            `
            SELECT
                SUM(t2.count) as sum,
                t1.date as date
            FROM (
                SELECT
                    COUNT(id) as count,
                    DATE(created_at) as date
                FROM
                    clips
                GROUP BY
                    date
            ) t1
            JOIN
            ( SELECT
                    COUNT(id) as count,
                    DATE(created_at) as date
                FROM
                    clips
                GROUP BY
                    date
            ) t2
            ON t1.date >= t2.date
            WHERE
                t1.date >= SUBDATE(NOW(), INTERVAL 1 MONTH)
            GROUP BY
                t1.date
            ORDER BY
                t1.date
            `
        );
        return Promise.resolve(rows);
    }, tenMinutes);

    fetchTotalClips = lazyCache(async (): Promise<number> => {
        const [[row]] = await this.sql.query(
            `
                SELECT
                    COUNT(*) as count
                FROM
                    clips
            `
        );
        return Promise.resolve(row.count);
    }, tenMinutes);

    fetchTotalValidatedClips = lazyCache(async (): Promise<number> => {
        const [[row]] = await this.sql.query(
            `
                SELECT
                    COUNT(*) as count
                FROM
                    clips
                WHERE
                    is_valid = 1
            `
        );
        return Promise.resolve(row.count);
    }, tenMinutes);

    fetchTotalVotes = lazyCache(async (): Promise<number> => {
        const [[row]] = await this.sql.query(
            `
                SELECT
                    COUNT(*) as count
                FROM
                    votes
            `
        );
        return Promise.resolve(row.count);
    }, minute);

    fetchTotalClipsClients = lazyCache(async (): Promise<number> => {
        const [[row]] = await this.sql.query(
            `
                SELECT
                    COUNT(DISTINCT client_id) as count
                FROM
                    clips
            `
        );
        return Promise.resolve(row.count);
    }, tenMinutes);

    fetchTodayClips = lazyCache(async (): Promise<number> => {
        const [[row]] = await this.sql.query(
            `
                SELECT
                    COUNT(*) as count
                FROM
                    clips
                WHERE
                    DATE(created_at) = DATE(NOW())
            `
        );
        return Promise.resolve(row.count);
    }, tenMinutes);

    fetchTodayVotes = lazyCache(async (): Promise<number> => {
        const [[row]] = await this.sql.query(
            `
                SELECT
                    COUNT(*) as count
                FROM
                    votes
                WHERE
                    DATE(created_at) = DATE(NOW())
            `
        );
        return Promise.resolve(row.count);
    }, tenMinutes);

    fetchLeaderboard = lazyCache(async (): Promise<SchoolStat[]> => {
        const [rows] = await this.sql.query(
            `
          SELECT
            institution,
              COUNT(*) as count,
              COUNT(DISTINCT client_id) as users,
              @curRank := @curRank + 1 AS rank
          FROM clips, (SELECT @curRank := 0) r
          WHERE institution IS NOT NULL
          AND institution != ''
          AND clips.created_at > '2021-01-18 15:00'
          AND clips.created_at < '2021-01-26 00:00'
          GROUP BY institution
          ORDER BY count DESC
        `
        );
        return rows;
    }, minute);

    getAgeGenderStats = lazyCache(async (): Promise<any> => {
        const [rows] = await this.sql.query(
            `
                SELECT
                    agegroup as age,
                    COUNT(
                    CASE
                    WHEN sex = 'karl' AND (is_valid = 0 OR is_valid IS NULL) THEN 1
                    ELSE NULL
                    End
                ) as karl,
                    COUNT(
                    CASE
                    WHEN sex = 'karl' AND is_valid = 1 THEN 1
                    ELSE NULL
                    End
                ) as karl_valid,
                    COUNT(
                    CASE
                    WHEN sex = 'kona' AND (is_valid = 0 OR is_valid IS NULL)  THEN 1
                    ELSE NULL
                    End
                ) as kona,
                    COUNT(
                    CASE
                    WHEN sex = 'kona' AND is_valid = 1 THEN 1
                    ELSE NULL
                    End
                ) as kona_valid,
                    COUNT(
                    CASE
                    WHEN is_valid = 0 or is_valid IS NULL THEN 1
                    END
                ) as total,
                    COUNT(
                    CASE
                    WHEN is_valid = 1 THEN 1
                    END
                ) as total_valid
                FROM
                (SELECT
                    *,
                    CASE
                    WHEN clips.age IN ('6', 7, 8, 9) THEN '06-9 ára'
                    WHEN clips.age IN (10, 11, 12) THEN '10-12 ára'
                    WHEN clips.age IN (13, 14, 15, 16, 17) THEN '13-17 ára'
                    WHEN clips.age = 'ungur_unglingur' THEN '13-17 ára'
                    WHEN clips.age = 'unglingur' THEN '18-19 ára'
                    WHEN clips.age = 'tvitugt' THEN '20-29 ára'
                    WHEN clips.age = 'thritugt' THEN '30-39 ára'
                    WHEN clips.age = 'fertugt' THEN '40-49 ára'
                    WHEN clips.age = 'fimmtugt' THEN '50-59 ára '
                    WHEN clips.age = 'sextugt' THEN '60-69 ára'
                    WHEN clips.age = 'sjotugt' THEN '70-79 ára'
                    WHEN clips.age = 'attraett' THEN '80-89 ára'
                    WHEN clips.age = 'niraett' THEN '90+ ára'
                    ELSE NULL
                END agegroup
                FROM
                    clips
                ) ages
                WHERE
                agegroup IS NOT NULL
                GROUP BY
                agegroup
            `,
            []
        );
        return rows;
    }, tenMinutes);

    fetchIndividualLeaderboard = lazyCache(async (): Promise<
        IndividualStat[]
    > => {
        const [rows] = await this.sql.query(
            `
                SELECT
                t2.username,
                t1.institution,
                t1.count
            FROM
                (
                    SELECT
                        client_id,
                        institution,
                        COUNT(*) as count
                    FROM
                        clips
                    WHERE
                        institution IS NOT NULL
                    AND clips.created_at > '2021-01-18 15:00'
                    AND clips.created_at < '2021-01-26 00:00'
                    GROUP BY
                        client_id,
                        institution
                ) t1
            JOIN
                (
                    SELECT
                        client_id,
                        username
                    FROM
                        user_clients
                    WHERE
                        username <> ''
                ) t2
            ON
                t1.client_id = t2.client_id
            `
        );
        return rows;
    }, minute);

    getMileStoneGroups = lazyCache(async (): Promise<any> => {
        const [rows] = await this.sql.query(
            `
            SELECT
                groups as hopur,
                    COUNT(
                    CASE
                        WHEN sex = 'karl' AND (is_valid = 0 OR is_valid IS NULL) THEN 1
                        ELSE NULL
                    End
                ) as karl,
                COUNT(
                CASE
                    WHEN sex = 'karl' AND is_valid = 1 THEN 1
                    ELSE NULL
                End
                ) as karl_valid,
                    COUNT(
                    CASE
                        WHEN sex = 'kona' AND (is_valid = 0 OR is_valid IS NULL)  THEN 1
                        ELSE NULL
                    End
                ) as kona,
                    COUNT(
                    CASE
                        WHEN sex = 'kona' AND is_valid = 1 THEN 1
                        ELSE NULL
                    End
                ) as kona_valid,
                    COUNT(
                    CASE
                        WHEN is_valid = 0 or is_valid IS NULL THEN 1
                    END
                ) as total,
                    COUNT(
                    CASE
                        WHEN is_valid = 1 THEN 1
                    END
                ) as total_valid
            FROM
                (SELECT
                    *,
                    CASE
                        WHEN
                            clips.age IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 'ungur_unglingur')
                            AND native_language = 'islenska'
                        THEN 'child'
                    WHEN
                        native_language = 'islenska'
                    AND
                        clips.age IN ('unglingur', 'tvitugt', 'thritugt', 'fertugt', 'fimmtugt', 'sextugt', 'sjotugt', 'attraett', 'niraett')
                    THEN 'adult'
                    WHEN
                        native_language != 'islenska'
                    AND
                        native_language != ''
                    AND
                        clips.age IN ('unglingur', 'tvitugt', 'thritugt', 'fertugt', 'fimmtugt', 'sextugt', 'sjotugt', 'attraett', 'niraett')
                    THEN 'l2_adult'
                    WHEN
                        native_language != 'islenska'
                    AND
                        native_language != ''
                    AND
                        clips.age IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 'ungur_unglingur')
                    THEN 'l2_child'
                    ELSE NULL
                    END groups
                FROM
                    clips
                ) ages
                WHERE
                    groups IS NOT NULL
                GROUP BY
                    groups
                ORDER BY
                    groups
                ASC
            `,
            []
        );
        return rows;
    }, hour);

    fetchRepeatStats = async () => {
        const [rows] = await this.sql.query(`
        SELECT 
            agegroup,
            COUNT(*) as total,
            COUNT(CASE
                WHEN is_valid = 1 THEN 'valid'
                ELSE NULL
            END) AS valid,
            COUNT(CASE
                WHEN is_valid = 0 THEN 'invalid'
                ELSE NULL
            END) AS invalid
        FROM
            (SELECT 
                *,
                    CASE
                        WHEN clips.age IN (1 , 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 'ungur_unglingur') THEN 'children'
                        WHEN clips.age IN ('unglingur' , 'tvitugt', 'thritugt', 'fertugt', 'fimmtugt', 'sextugt', 'sjotugt', 'attraett', 'niraett') THEN 'adults'
                        ELSE NULL
                    END agegroup
            FROM
                clips
            WHERE
                is_repeated = 1) AS agegroups
        GROUP BY agegroup
        `);
        return rows;
    };

    fetchL2SpeakerStats = async () => {
        const [[row]] = await this.sql.query(
            `
                SELECT 
                    COUNT(*) AS total,
                    SUM(is_valid = 1) AS valid,
                    SUM(is_valid = 0) AS invalid
                FROM
                    clips
                WHERE
                    native_language != 'islenska'
                        AND native_language != 'null'
            `
        );
        return row;
    };

    fetchH3QueriesStats = async () => {
        const [rows] = await this.sql.query(
            `
            SELECT 
                is_valid, COUNT(*) AS amount, SUM(duration) / 3600 AS hours
            FROM
                clips
            WHERE
                status = 'h3_queries'
            GROUP BY is_valid        
            `
        );
        return rows;
    };

    fetchScoreboard = lazyCache(async (pre: boolean = false): Promise<
        ScoreboardData[]
    > => {
        const start = pre ? dbPreStartTime : dbStartDate;
        const end = pre ? dbPreEndTime : dbEndDate;

        //     const [rows] = await this.sql.query(
        //         `
        //     SELECT
        //         institutions.name,
        //         institutions.size,
        //         COUNT(DISTINCT (client_id)) AS users,
        //         COUNT(*) AS count
        //     FROM
        //         institutions
        //             JOIN
        //         clips ON clips.institution = institutions.id
        //     WHERE
        //         clips.created_at > ?
        //             AND
        //                 clips.created_at < ?
        //             AND institutions.is_used = 1
        //             AND institutions.is_primary_school = 1
        //     GROUP BY institutions.name
        //     ORDER BY count DESC
        // `,
        //         [start, end]
        //     );
        const [rows] = await this.sql.query(
            `
            SELECT 
                name, size, users, count
            FROM
                (SELECT 
                    institution,
                        COUNT(*) AS count,
                        COUNT(DISTINCT client_id) AS users
                FROM
                    clips
                WHERE
                    institution IS NOT NULL
                        AND institution != ''
                        AND created_at > ?
                        AND created_at < ?
                GROUP BY institution
                ORDER BY count DESC) AS schools
                    JOIN
                institutions ON institutions.id = schools.institution
            WHERE
                institutions.is_primary_school = 1
            ORDER BY count DESC
            `,
            [start, end]
        );
        // Add rank
        const data = rows as ScoreboardData[];

        data.forEach((e, i) => {
            data[i].rank = i + 1;
        });

        return data;
    }, fiveMinutes);

    fetchCaptiniStatsForClient = async (clientId: string) => {
        const [[row]] = await this.sql.query(
            `
            SELECT 
                SUM(client_id = ?) as client_total,
                COUNT(DISTINCT (sentences.id)) as total
            FROM
                sentences
                    LEFT JOIN
                clips ON clips.original_sentence_id = sentences.id
            WHERE
                sentences.is_used = 1
                    AND sentences.source = 'captini'
            `,
            [clientId]
        );

        return row as CaptiniStat;
    };

    fetchL2StatsForClient = async (clientId: string) => {
        const [[row]] = await this.sql.query(
            `
            SELECT 
                SUM(client_id = ?) as client_total,
                COUNT(DISTINCT (sentences.id)) as total
            FROM
                sentences
                    LEFT JOIN
                clips ON clips.original_sentence_id = sentences.id
            WHERE
                sentences.is_used = 1
                    AND sentences.source = 'l2'
            `,
            [clientId]
        );

        return row as L2Stat;
    };

    fetchGk2022IndividualStats = async (clientId: string) => {
        const start = dbStartDate;
        const end = dbEndDate;

        const [[row]] = await this.sql.query(
            `
            SELECT 
                COUNT(*) AS client_total
            FROM
                clips
            WHERE
                client_id = ?
                    AND institution IS NOT NULL
                    AND created_at > ?
                    AND created_at < ?
            `,
            [clientId, start, end]
        );

        return row as CompetitionIndividualStat;
    };

    fetchTodayVotesClient = async (client: string): Promise<number> => {
        const [[row]] = await this.sql.query(
            `
                SELECT
                    COUNT(*) as count
                FROM
                    votes
                WHERE
                    DATE(created_at) = DATE(NOW())
                AND
                    client_id = ?
            `,
            [client]
        );
        return Promise.resolve(row.count);
    };
    fetchUserScoreboard = lazyCache(
        async (
            startDate: string | undefined
        ): Promise<FunromurIndividualStat[]> => {
            const [rows] = await this.sql.query(
                `
                SELECT 
                    email, COUNT(*) as count
                FROM
                    votes
                        JOIN
                    user_clients ON votes.client_id = user_clients.client_id
                WHERE
                    email <> ''
                AND
                    votes.created_at >= date(?)
                GROUP BY email
                order by count desc
                `,
                [startDate ? startDate : '2000-01-01']
            );
            return rows;
        },
        minute
    );

    fetchMonthlyUserScoreboard = lazyCache(
        async (): Promise<FunromurIndividualStat[]> => {
            const [rows] = await this.sql.query(
                `
                SELECT 
                    email, COUNT(*) as count
                FROM
                    votes
                        JOIN
                    user_clients ON votes.client_id = user_clients.client_id
                WHERE
                    email <> ''
                AND
                    MONTH(votes.created_at) >= MONTH(CURRENT_DATE())
                AND
                    YEAR(votes.created_at) = YEAR(CURRENT_DATE())
                GROUP BY email
                order by count desc
                `
            );
            return rows;
        },
        minute
    );
}
