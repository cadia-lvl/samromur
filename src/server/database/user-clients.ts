import { v4 as uuid } from 'uuid';

import Sql from './sql';
import { AuthError } from '../../types/auth';
import { sha512hash } from '../../utilities/hash';

import {
    TotalUserClips,
    UserClient
} from '../../types/user';

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

    changePassword = async (oldPassword: string, password: string, clientId: string): Promise<void> => {
        const [[row]] = await this.sql.query(
            `
                SELECT
                    *
                FROM
                    user_clients
                WHERE
                    client_id = ?
                AND
                    password = ?
            `,
            [clientId, sha512hash(oldPassword)]
        );
        if (!row) {
            return Promise.reject(AuthError.WRONG_PASSWORD);
        }

        return this.sql.query(
            `
                UPDATE
                    user_clients
                SET
                    password = ?
                WHERE
                    client_id = ?
            `,
            [sha512hash(password), clientId]
        ).then(() => {
            return Promise.resolve();
        }).catch((error) => {
            return Promise.reject();
        })
    }

    loginUser = async (email: string, password: string): Promise<string> => {
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
            const { client_id, email_confirmed } = row;
            if (!email_confirmed) {
                return Promise.reject(AuthError.EMAIL_NOT_CONFIRMED);
            }
            return Promise.resolve(client_id);
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

    fetchUserClipsStats = async (id: string): Promise<TotalUserClips> => {
        const [[row]] = await this.sql.query(
            `
                SELECT
                    count(*) AS count,
                    count(CASE is_valid WHEN 1 THEN 1 ELSE NULL END) AS valid,
                    count(CASE is_valid WHEN 0 THEN 1 ELSE NULL END) AS invalid
                FROM
                    clips
                WHERE 
                    client_id = ?
            `,
            [id]
        )

        return row;
    }

    fetchUserVoteCount = async (id: string): Promise<number> => {
        const [[row]] = await this.sql.query(
            `
                SELECT
                    COUNT(*) as votes
                FROM
                    votes
                WHERE
                    client_id = ?
            `,
            [id]
        );

        const { votes } = row;
        return votes;
    }

    fetchUserAccess = async (id: string): Promise<Partial<UserClient>> => {
        const [[row]] = await this.sql.query(
            `
                SELECT
                    is_admin,
                    is_super_user
                FROM
                    user_clients
                WHERE
                    client_id = ?
            `,
            [id]
        );
        const { is_admin, is_super_user } = row;
        return { isAdmin: is_admin, isSuperUser: is_super_user }
    }
}