import { generateGUID } from '../../utilities/id';
import Sql from './sql';
import { Institution } from '../../types/institution';
import { AgeStat, GenderStat, TimelineStat } from '../../types/competition';

// TODO: competition, actual dates
const startDate: string = '2021-10';
const endDate: string = '2021-11';

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
    getAgeStats = async (): Promise<AgeStat[]> => {
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
                [startDate, endDate]
            );
            return ageStats as AgeStat[];
        } catch (error) {
            return Promise.reject(error);
        }
    };

    getGenderStats = async (): Promise<GenderStat[]> => {
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
                [startDate, endDate]
            );

            return genderStats as GenderStat[];
        } catch (error) {
            return Promise.reject(error);
        }
    };

    // TODO: competition switch this for correct dates
    // Have some fake dates now to get some data
    fakeStartDate = '2021-09-12';
    fakeEndDate = '2021-09-18';
    getTimeline = async (): Promise<TimelineStat[]> => {
        try {
            const [timelineStats] = await this.sql.query(
                `
                SELECT 
                    DATE(cal.date) AS date, COUNT(res.id) AS count
                FROM
                    (SELECT 
                        SUBDATE( ? , INTERVAL 6 DAY) + INTERVAL xc DAY AS date
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
                            created_at >= SUBDATE(?, INTERVAL 6 DAY)) AS res ON DATE(res.created_at) = DATE(cal.date)
                WHERE
                    cal.date <= ?
                GROUP BY cal.date
                ORDER BY cal.date ASC
            `,
                [this.fakeEndDate, this.fakeStartDate, this.fakeEndDate]
            );
            return timelineStats as TimelineStat[];
        } catch (error) {
            return Promise.reject(error);
        }
    };
}
