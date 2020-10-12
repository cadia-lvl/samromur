import Sql from './sql';
import { TimelineStat } from '../../types/stats';

export default class Clips {
    private sql: Sql;

    constructor(sql: Sql) {
        this.sql = sql;
    }

    fetchWeeklyStats = async (contributeType: string): Promise<TimelineStat[]> => {
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
    }

    fetchTotalClipsTimeline = async () => {
        const [rows] = await this.sql.query(
            `
            SELECT
                SUM(t2.count) as count,
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
    }

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
    }

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
    }

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
    }

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
    }

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
    }

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
    }
}