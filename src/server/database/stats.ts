import Sql from './sql';
import { TimelineStat } from '../../types/stats';
import { IndividualStat, SchoolStat } from '../../types/competition';

export default class Clips {
    private sql: Sql;

    constructor(sql: Sql) {
        this.sql = sql;
    }

    fetchWeeklyStats = async (
        contributeType: string
    ): Promise<TimelineStat[]> => {
        const table = contributeType == 'tala' ? 'clips' : 'votes';
        const [rows] = await this.sql.query(
            `
                SELECT
                    COUNT(${table}.id) as count,
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
                    ${table}
                ON
                    DATE(${table}.created_at) = DATE(cal.date)
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
    };

    fetchTotalClipsTimeline = async () => {
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
    };

    fetchTotalClips = async (): Promise<number> => {
        const [[row]] = await this.sql.query(
            `
                SELECT
                    COUNT(*) as count
                FROM
                    clips
            `
        );
        return Promise.resolve(row.count);
    };

    fetchTotalValidatedClips = async (): Promise<number> => {
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
    };

    fetchTotalVotes = async (): Promise<number> => {
        const [[row]] = await this.sql.query(
            `
                SELECT
                    COUNT(*) as count
                FROM
                    votes
            `
        );
        return Promise.resolve(row.count);
    };

    fetchTotalClipsClients = async (): Promise<number> => {
        const [[row]] = await this.sql.query(
            `
                SELECT
                    COUNT(DISTINCT client_id) as count
                FROM
                    clips
            `
        );
        return Promise.resolve(row.count);
    };

    fetchTodayClips = async (): Promise<number> => {
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
    };

    fetchTodayVotes = async (): Promise<number> => {
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
    };

    fetchLeaderboard = async (): Promise<SchoolStat[]> => {
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
    };

    fetchIndividualLeaderboard = async (): Promise<IndividualStat[]> => {
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
    };
}
