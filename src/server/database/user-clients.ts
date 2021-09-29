import { v4 as uuid } from 'uuid';

import Sql from './sql';
import { AuthError } from '../../types/auth';
import { generateGUID } from '../../utilities/id';
import { bHash } from '../../utilities/hash';
import bcrypt from 'bcryptjs';

import {
    SuperUserStat,
    TotalUserClips,
    TotalUserVotes,
    UserClient,
} from '../../types/user';
import { query } from 'express';

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
    };

    signUpUserWithoutUsername = async (
        email: string,
        password: string
    ): Promise<string> => {
        if (await this.hasAccount(email)) {
            return Promise.reject(AuthError.HAS_ACCOUNT);
        }
        const confirmId = uuid();
        const clientId = generateGUID();

        return this.sql
            .query(
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
                [clientId, email, confirmId, bHash(password), true]
            )
            .then(() => {
                return Promise.resolve(confirmId);
            })
            .catch((error) => {
                console.error(error);
                return Promise.reject(AuthError.FAILED);
            });
    };

    signUpUser = async (
        email: string,
        username: string,
        password: string
    ): Promise<string> => {
        if (!username) {
            return await this.signUpUserWithoutUsername(email, password);
        }
        if (await this.hasAccount(email)) {
            return Promise.reject(AuthError.HAS_ACCOUNT);
        }
        if (await this.userNameExists(username)) {
            return Promise.reject(AuthError.USERNAME_USED);
        }

        const confirmId = uuid();
        const clientId = generateGUID();

        return this.sql
            .query(
                `
                INSERT INTO
                    user_clients (client_id, email, username,confirm_id, password, has_login)
                VALUES
                    (?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    email = VALUES(email),
                    username = VALUES(username),
                    confirm_id = VALUES(confirm_id),
                    password = VALUES(password),
                    has_login = VALUES(has_login)
                `,
                [clientId, email, username, confirmId, bHash(password), true]
            )
            .then(() => {
                return Promise.resolve(confirmId);
            })
            .catch((error) => {
                console.error(error);
                return Promise.reject(AuthError.FAILED);
            });
    };

    userNameExists = async (username: string): Promise<boolean> => {
        const [[row]] = await this.sql.query(
            `
                SELECT
                    *
                FROM
                    user_clients
                WHERE
                    username = ?
            `,
            [username]
        );
        return !!row;
    };

    userHasUsername = async (clientId: string): Promise<boolean> => {
        const [[row]] = await this.sql.query(
            `
                SELECT
                    username
                FROM
                    user_clients
                WHERE
                    client_id = ?
            `,
            [clientId]
        );
        const { username } = row;
        return !!username;
    };

    changeUserName = async (
        username: string,
        clientId: string
    ): Promise<void> => {
        if (await this.userNameExists(username)) {
            return Promise.reject(AuthError.USERNAME_USED);
        }
        if (await this.userHasUsername(clientId)) {
            return Promise.reject(AuthError.FAILED);
        }

        return this.sql
            .query(
                `
                    UPDATE
                        user_clients
                    SET
                        username = ?
                    WHERE
                        client_id = ?
                `,
                [username, clientId]
            )
            .then(() => {
                return Promise.resolve();
            })
            .catch((error) => {
                return Promise.reject();
            });
    };

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
    };

    changePassword = async (
        oldPassword: string,
        password: string,
        clientId: string
    ): Promise<void> => {
        const [[row]] = await this.sql.query(
            `
                SELECT
                    *
                FROM
                    user_clients
                WHERE
                    client_id = ?
            `,
            [clientId]
        );
        if (!row) {
            return Promise.reject(AuthError.USER_NOT_FOUND);
        }
        const oldPasswordHash = row.password;
        const match = !!oldPasswordHash
            ? bcrypt.compare(oldPassword, oldPasswordHash)
            : false;

        if (!match) {
            return Promise.reject(AuthError.WRONG_PASSWORD);
        }

        return this.sql
            .query(
                `
                UPDATE
                    user_clients
                SET
                    password = ?
                WHERE
                    client_id = ?
            `,
                [bHash(password), clientId]
            )
            .then(() => {
                return Promise.resolve();
            })
            .catch((error) => {
                return Promise.reject();
            });
    };

    loginUser = async (email: string, password: string): Promise<string> => {
        const [[row]] = await this.sql.query(
            `
                SELECT
                    password, client_id, email_confirmed
                FROM
                    user_clients
                WHERE
                    email = ?
            `,
            [email]
        );
        const passwordHash = row?.password;
        const match = !!passwordHash
            ? bcrypt.compareSync(password, passwordHash)
            : false;
        if (!match) {
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
    };

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
    };

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
    };

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
        );

        return row;
    };

    fetchUserVotesStats = async (id: string): Promise<TotalUserVotes> => {
        const [[row]] = await this.sql.query(
            `
                SELECT
                    COUNT(*) as count,
                    COUNT(case is_super WHEN 1 THEN 1 ELSE NULL END) super
                FROM
                    votes
                WHERE
                    client_id = ?
            `,
            [id]
        );

        return row;
    };

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
        const is_admin = row ? row['is_admin'] : false;
        const is_super_user = row ? row['is_super_user'] : false;
        return { isAdmin: !!is_admin, isSuperUser: !!is_super_user };
    };

    fetchUserClient = async (id: string): Promise<Partial<UserClient>> => {
        const [[row]] = await this.sql.query(
            `
                SELECT
                    is_admin,
                    is_super_user,
                    username
                FROM
                    user_clients
                WHERE
                    client_id = ?
            `,
            [id]
        );
        const is_admin = row ? row['is_admin'] : false;
        const is_super_user = row ? row['is_super_user'] : false;
        const username = row ? row['username'] : '';
        return { isAdmin: !!is_admin, isSuperUser: !!is_super_user, username };
    };

    makeSuperUser = async (email: string): Promise<void> => {
        return this.sql
            .query(
                `
                UPDATE
                    user_clients
                SET
                    is_super_user = ?
                WHERE
                    email = ?
            `,
                [true, email]
            )
            .then(([{ affectedRows }]) => {
                return !!affectedRows ? Promise.resolve() : Promise.reject();
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    };

    fetchSuperUserStats = async (id: string): Promise<number> => {
        const [[row]] = await this.sql.query(
            `
                SELECT
                    COUNT(case is_super WHEN 1 THEN 1 ELSE NULL END) as count
                FROM
                    votes
                WHERE
                    client_id = ?
            `,
            [id]
        );
        const { count } = row;
        return count;
    };

    fetchSuperUsers = async (): Promise<SuperUserStat[]> => {
        const [rows] = await this.sql.query(
            `
            SELECT
                client_id,
                email
            FROM
                user_clients
            WHERE
                is_super_user = true
            `
        );

        return Promise.all(
            rows.map(
                async (row: { client_id: string; email: string }) =>
                    new Promise(async (resolve) => {
                        const count = await this.fetchSuperUserStats(
                            row.client_id
                        );
                        resolve({
                            email: row.email,
                            count,
                        });
                    })
            )
        );
    };

    /**
     * Creates the reset password token for the user of the input email.
     * Returns an error if the user is not found.
     * @param email the email of the user
     */
    createResetPasswordToken = async (email: string): Promise<string> => {
        if (!(await this.hasAccount(email))) {
            return Promise.reject(AuthError.USER_NOT_FOUND);
        }
        const resetPasswordToken = uuid();
        const resetPasswordTokenExpire = (Date.now() + 3600000).toString();

        return this.sql
            .query(
                `
                UPDATE
                    user_clients
                SET
                    reset_password_token = ?,
                    reset_password_token_expires = ?
                WHERE
                    email = ?
            `,
                [bHash(resetPasswordToken), resetPasswordTokenExpire, email]
            )
            .then(([{ affectedRows }]) => {
                return !!affectedRows
                    ? Promise.resolve(resetPasswordToken)
                    : Promise.reject(AuthError.USER_NOT_FOUND);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    };

    /**
     * Resets the password of the user that has the input reset password token
     * @param resetPasswordToken reset password token to look for
     * @param password the new password
     */
    resetPassword = async (
        email: string,
        resetPasswordToken: string,
        password: string
    ): Promise<void> => {
        try {
            const validToken = await this.validateToken(
                email,
                resetPasswordToken
            );
            if (validToken) {
                const result = await this.sql.query(
                    `
                    UPDATE
                        user_clients
                    SET 
                        password = ?,
                        reset_password_token = ?,
                        reset_password_token_expires = ?
                    WHERE
                        email = ?
                `,
                    [bHash(password), null, null, email]
                );
                return Promise.resolve();
            }
            return Promise.reject(AuthError.FAILED);
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * Validates that the reset password token exists in the db and has not expired
     * @param token the reset password token to search for
     */
    private validateToken = async (
        email: string,
        token: string
    ): Promise<boolean> => {
        const [[row]] = await this.sql.query(
            `
                SELECT
                    reset_password_token, reset_password_token_expires
                FROM
                    user_clients
                WHERE
                    email = ?
            `,
            [email]
        );
        if (!!row) {
            try {
                const hash = row['reset_password_token'];
                const expires = row['reset_password_token_expires'];
                const expired = Date.now() > parseInt(expires);
                const match = bcrypt.compareSync(token, hash);

                // If token match and not expired return true (SUCCESS)
                if (match && !expired) {
                    return true;
                }
            } catch (err) {
                console.error(err);
                return false;
            }
        }
        return false;
    };
}
