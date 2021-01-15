import Sql from './sql';
import { TimelineStat } from '../../types/stats';
import { SchoolStat } from '../../types/competition';

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
          GROUP BY institution
          ORDER BY count DESC
        `
        );
        return rows;
    };

    async getAgeGenderStats(): Promise<any> {
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
    }
}
