import { generateGUID } from '../../utilities/id';
import Sql from './sql';
import { Institution } from '../../types/institution';
import { AgeStat, GenderStat, TimelineStat } from '../../types/competition';
import moment from 'moment';
import {
    startTime,
    endTime,
    lastDay,
    preStartTime,
    preEndTime,
    preLastDay,
} from '../../constants/competition';

// TODO: competition, actual dates
const dbStartDate: string = moment(startTime).format('YYYY-MM-DD');
const dbEndDate: string = moment(endTime).format('YYYY-MM-DD');
const dbLastDay: string = moment(lastDay).format('YYYY-MM-DD');
const dbPreStartTime: string = moment(preStartTime).format('YYYY-MM-DD');
const dbPreEndTime: string = moment(preEndTime).format('YYYY-MM-DD');
const dbPreLastDay: string = moment(preLastDay).format('YYYY-MM-DD');

export default class Competition {
    private sql: Sql;

    constructor(sql: Sql) {
        this.sql = sql;
    }

    companyExists = async (company: string) => {
        const [[row]] = await this.sql.query(
            `
                SELECT
                    id
                FROM
                    institutions
                WHERE
                    name = ?
                LIMIT 1
            `,
            [company]
        );

        return !!row;
    };

    addCompany = async (
        company: string,
        size: string,
        contact: string,
        email: string
    ) => {
        const exists = await this.companyExists(company);

        if (exists) {
            return false;
        }

        const id = generateGUID();

        try {
            const [row] = await this.sql.query(
                `
                    INSERT INTO
                        institutions (id, name, size, contact, email)
                    VALUES
                        (?, ?, ?, ?, ?)
                `,
                [id, company, size, contact, email]
            );
            console.log(row);
            const { affectedRows } = row;
            return !!affectedRows;
        } catch (error) {
            return Promise.reject(error);
        }
    };

    getCompanies = async (): Promise<Institution[]> => {
        try {
            const [companies] = await this.sql.query(
                `
                    SELECT
                        id, name, size
                    FROM
                        institutions
                    WHERE
                        is_used = 1
                `
            );

            return companies as Institution[];
        } catch (error) {
            return Promise.reject(error);
        }
    };

    // TODO: add caching
    getAgeStats = async (pre: boolean = false): Promise<AgeStat[]> => {
        const start = pre ? dbPreStartTime : dbStartDate;
        const end = pre ? dbPreEndTime : dbEndDate;
        try {
            const [ageStats] = await this.sql.query(
                `
                SELECT 
                    agegroup as age, COUNT(*) as count
                FROM
                    (SELECT 
                        *,
                            CASE
                                    WHEN clips.age IN (1,2,3,4,5,6, 7, 8, 9) THEN '0-9 ára'
                                    WHEN clips.age IN (10, 11, 12,13,14,15,16,17, 'ungur_unglingur', 'unglingur') THEN '10-19 ára'
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
                        ) AS agegroups
                    WHERE
                        created_at > ?
                    AND 
                        created_at < ?
                GROUP BY agegroup
                `,
                [start, end]
            );

            return ageStats as AgeStat[];
        } catch (error) {
            return Promise.reject(error);
        }
    };

    getGenderStats = async (pre: boolean = false): Promise<GenderStat[]> => {
        const start = pre ? dbPreStartTime : dbStartDate;
        const end = pre ? dbPreEndTime : dbEndDate;
        try {
            const [genderStats] = await this.sql.query(
                `
                SELECT 
                    sex AS gender, COUNT(*) AS count
                FROM
                    clips
                WHERE
                    created_at > ?
                        AND created_at < ?
                GROUP BY sex
                `,
                [start, end]
            );

            return genderStats as GenderStat[];
        } catch (error) {
            return Promise.reject(error);
        }
    };

    getTimeline = async (pre: boolean = false): Promise<TimelineStat[]> => {
        const start = pre ? dbPreStartTime : dbStartDate;
        const last = pre ? dbPreLastDay : dbLastDay;
        const interval = pre ? 5 : 8;
        try {
            const [timelineStats] = await this.sql.query(
                `
                SELECT 
                    DATE(cal.date) AS date, COUNT(res.id) AS count
                FROM
                    (SELECT 
                        SUBDATE( ? , INTERVAL ? DAY) + INTERVAL xc DAY AS date
                    FROM
                        (SELECT 
                        @xi:=@xi + 1 AS xc
                    FROM
                        (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) xc1, (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) xc2, (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) xc3, (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) xc4, (SELECT @xi:=- 1) xc0) xxc1) cal
                        LEFT JOIN
                    (SELECT 
                        *
                    FROM
                        clips
                    WHERE
                            created_at >= SUBDATE(?, INTERVAL ? DAY)) AS res ON DATE(res.created_at) = DATE(cal.date)
                WHERE
                    cal.date <= ?
                GROUP BY cal.date
                ORDER BY cal.date ASC
            `,
                [last, interval, start, interval, last]
            );
            return timelineStats as TimelineStat[];
        } catch (error) {
            return Promise.reject(error);
        }
    };
}
