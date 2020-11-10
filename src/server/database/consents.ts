import Sql from './sql';
import { v4 as uuid } from 'uuid';

export default class Consents {
    private sql: Sql;

    constructor(sql: Sql) {
        this.sql = sql;
    }

    getConsent = async (kennitala: string): Promise<boolean> => {
        const [[row]] = await this.sql.query(
            `
                SELECT permission from consents WHERE kennitala = (?) AND permission = TRUE
            `,
            [kennitala]
        );
        return !!row;
    };

    createConsent = async (
        email: String,
        kennitala: string
    ): Promise<string> => {
        const id = uuid();
        await this.sql.query(
            `
                INSERT INTO consents (kennitala, email, uuid) VALUES (?, ?, ?)
            `,
            [kennitala, email, id]
        );
        return id;
    };

    addPermission = async (uuid: String): Promise<boolean> => {
        const [rows] = await this.sql.query(
            `
          UPDATE consents
              SET permission = (?)
              WHERE uuid = (?)
        `,
            [true, uuid]
        );
        return rows.affectedRows == 1;
    };
}
