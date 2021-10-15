import { generateGUID } from '../../utilities/id';
import Sql from './sql';
import { Institution } from '../../types/institution';

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
}
