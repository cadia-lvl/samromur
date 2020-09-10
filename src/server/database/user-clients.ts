import { v4 as uuid } from 'uuid';

import Sql from './sql';
import { AuthError } from '../../types/auth';
import { sha512hash } from '../../utilities/hash';

export default class UserClients {
    private sql: Sql;

    constructor(sql: Sql) {
        this.sql = sql;
    }

    insertUserClient = async (id: string): Promise<void> => {
        return this.sql.query(
            `
                INSERT INTO
                    user_clients (client_id)
                VALUES
                    (?)
                ON DUPLICATE KEY UPDATE client_id = VALUES(client_id)
            `,
            [id]
        );
    }

    signUpUser = async (email: string, password: string, clientId: string): Promise<string> => {
        if (await this.hasAccount(email)) {
            return Promise.reject(AuthError.HAS_ACCOUNT);
        }
        const confirmId = uuid();
        return this.sql.query(
            `
                INSERT INTO
                    user_clients (client_id, email, confirm_id, password, has_login)
                VALUES
                    (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    email = VALUES(email),
                    confirm_id = VALUES(confirm_id),
                    password = VALUES(password),
                    has_login = VALUES(has_login)
            `,
            [clientId, email, confirmId, sha512hash(password), true]
        ).then(() => {
            return Promise.resolve(confirmId);
        }).catch((error) => {
            console.error(error);
            return Promise.reject(AuthError.FAILED);
        })
    }

    confirmSignup = async (confirmId: string): Promise<void> => {
        return this.sql.query(
            `
                UPDATE
                    user_clients
                SET
                    email_confirmed = ?
                WHERE
                    confirm_id = ?
                
            `,
            [true, confirmId]
        );
    }

    loginUser = async (email: string, password: string, clientId: string): Promise<void> => {
        const [[row]] = await this.sql.query(
            `
                SELECT
                    *
                FROM
                    user_clients
                WHERE
                    email = ?
                AND
                    password = ?
            `,
            [email, sha512hash(password)]
        );
        if (!row) {
            if (await this.hasAccount(email)) {
                return Promise.reject(AuthError.WRONG_PASSWORD);
            } else {
                return Promise.reject(AuthError.USER_NOT_FOUND);
            }
        } else {
            const { email_confirmed } = row;
            if (!email_confirmed) {
                return Promise.reject(AuthError.EMAIL_NOT_CONFIRMED);
            }
            return Promise.resolve();
        }
    }

    hasAccount = async (email: string): Promise<boolean> => {
        const [[row]] = await this.sql.query(
            `
                SELECT
                    *
                FROM
                    user_clients
                WHERE
                    email = ?
            `,
            [email]
        );
        return !!row;
    }

    fetchUserClipCount = async (id: string): Promise<number> => {
        const [[row]] = await this.sql.query(
            `
                SELECT
                    COUNT(*) as clips
                FROM
                    clips
                WHERE
                    client_id = ?
            `,
            [id]
        );

        const { clips } = row;
        return clips;
    }
}