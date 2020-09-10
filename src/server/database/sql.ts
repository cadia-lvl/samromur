import mysql2 from 'mysql2/promise';
import { getConfig } from '../../utilities/config-helper';
import { md5hash } from '../../utilities/hash';

export type MysqlOptions = {
    user: string;
    database: string;
    password: string;
    host: string;
    port: number;
    connectTimeout: number;
    multipleStatements: boolean;
    namedPlaceholders: boolean;
};

export default class Sql {
    private mysqlOptions: MysqlOptions;
    private rootConnection: any;
    private pool: mysql2.Pool | null;

    constructor() {
        this.mysqlOptions = this.getMysqlOptions();
        this.rootConnection = null;
        this.pool = null;
    }

    getMysqlOptions(): MysqlOptions {
        const dbOptions = getConfig().DATABASE;
        return {
            user: dbOptions.DB_USER,
            database: dbOptions.DB_NAME,
            password: dbOptions.DB_PASSWORD,
            host: dbOptions.DB_HOST,
            port: dbOptions.DB_PORT,
            connectTimeout: 30000,
            multipleStatements: true,
            namedPlaceholders: true
        }
    }

    async getConnection(options: MysqlOptions): Promise<mysql2.Connection> {
        return mysql2.createConnection(options);
    }

    async createPool(): Promise<mysql2.Pool> {
        return mysql2.createPool(this.mysqlOptions);
    }

    async getPool(): Promise<any> {
        if (this.pool) return this.pool;
        return new Promise(async resolve => {
            this.pool = await this.createPool();
            resolve(this.pool);
        }
        );
    }

    async query(...args: any[]) {
        return (await this.getPool()).query(...args);
    }

    async escape(...args: any[]) {
        return (await this.getPool()).escape(...args);
    }

    async ensureRootConnection(): Promise<void> {
        // Check if we already have the connection we want.
        if (this.rootConnection) {
            return;
        }

        // Copy options
        const options: MysqlOptions = Object.assign({}, this.mysqlOptions);

        // Do not specify the database name when connecting.
        delete options.database;

        // Overwrite root values.
        const dbOptions = getConfig().DATABASE;
        options.user = dbOptions.DB_ROOT_USER;
        options.password = dbOptions.DB_ROOT_PASSWORD;
        options.multipleStatements = true;

        const connection = await this.getConnection(options);
        connection.on('error', this.handleError.bind(this));

        this.rootConnection = connection;
        return;
    }

    private handleError(error: any) {
        console.error('Unhandled mysql error', error.message);
    }

    private getProcedureName(body: string): string {
        return 'F_' + md5hash(body);
    }

    /**
     * Call a stored procedure by procedure name generated in getProcedureName.
     */
    async callProc(name: string): Promise<any> {
        return this.rootConnection.query(`CALL \`${name}\``);
    }

    /**
     * Create and execute a stored procedure as root.
     */
    async rootTransaction(body: string): Promise<void> {
        // Hash proc body to get a unique proc name.
        // This makes sure we have a unique name for each proc operation.
        const name = this.getProcedureName(body);
        const transactionQuery = `
            CREATE PROCEDURE \`${name}\`()
            BEGIN
                DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
                BEGIN
                    ROLLBACK;
                    RESIGNAL;
                END;
                START TRANSACTION;
                ${body}
                COMMIT;
            END;
        `;

        // Ensure root.
        await this.ensureRootConnection();

        // Here we'll try to create the proc, but if the proc name
        // already exists we can be sure it's the same operation
        // so we will trap the error and call the pre-defined proc.
        try {
            await this.rootConnection.query(transactionQuery);
        } catch (error) {
            // If proc already exists, we are good to go.
            if (error.code !== 'ER_SP_ALREADY_EXISTS') {
                throw error;
            }
        }

        // Attempting to call proc.
        await this.callProc(name);
    }

    /**
     * Execute a prepared statement on the root connection.
     */
    async rootExec(sql: string, values?: any[]): Promise<any> {
        values = values || [];
        await this.ensureRootConnection();
        return this.rootConnection.execute(sql, values);

    }

    /**
     * Execute a regular query on the root connection.
     */
    async rootQuery(sql: string): Promise<any> {
        await this.ensureRootConnection();
        return this.rootConnection.query(sql);
    }

    /**
     * Close all connections to the database.
     */
    endConnection(): void {
        if (this.pool) {
            this.pool.end().catch((e: any) => console.error(e));
            this.pool = null;
        }
        if (this.rootConnection) {
            this.rootConnection.destroy();
            this.rootConnection = null;
        }
    }
}

let instance: Sql;

export function getSQLInstance() {
    return instance || (instance = new Sql());
}