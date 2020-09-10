import * as path from 'path';
const DBMigrate = require('db-migrate');

import Sql from './sql';
import { getConfig } from '../../utilities/config-helper';

export default class Schema {
    private name: string;
    private sql: Sql;

    constructor(sql: Sql) {
        this.sql = sql;
        this.name = sql.getMysqlOptions().database;
    }

    /**
     * Make sure the database structure (DB, DB USER, TABLES) is configured.
     */
    ensure = async (): Promise<void> => {
        await this.ensureDatabase();
        await this.ensureDatabaseUser();
    }

    /**
     * Make sure we have created the database, and are using it.
     */
    ensureDatabase = async (): Promise<void> => {
        await this.sql.rootQuery(`
            CREATE DATABASE IF NOT EXISTS ${this.name};
            USE ${this.name};
        `);
    }

    private ensureDatabaseUser = async () => {
        // Fetch the default username and password.
        const options = this.sql.getMysqlOptions();
        const username = options.user;
        const password = options.password;
        const host = options.host;
        const database = options.database;
        await this.sql.rootTransaction(`
            CREATE USER IF NOT EXISTS
                '${username}'@'%'
            IDENTIFIED WITH mysql_native_password BY
                '${password}';
            GRANT
                SELECT, INSERT, UPDATE, DELETE
            ON
                ${database}.*
            TO
                '${username}'@'%';
            FLUSH PRIVILEGES;
        `);

        // Have the new user use the database.
        await this.sql.query(`USE ${this.name};`);
    }

    upgrade = async (): Promise<void> => {
        const dbOptions = getConfig().DATABASE;
        const dbmigrate = DBMigrate.getInstance(true, {
            config: {
                dev: {
                    driver: 'mysql',
                    database: dbOptions.DB_NAME,
                    host: dbOptions.DB_HOST,
                    password: dbOptions.DB_ROOT_PASSWORD,
                    user: dbOptions.DB_ROOT_USER,
                    multipleStatements: true,
                },
            },
            cwd: path.isAbsolute(__dirname)
                ? __dirname
                : path.resolve(path.join('src', 'server', __dirname)), // ??
        });
        await dbmigrate.up();
    }
}