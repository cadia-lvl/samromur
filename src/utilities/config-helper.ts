import * as fs from 'fs';
import { S3 } from 'aws-sdk';

export type DatabaseOptions = {
    DB_ROOT_USER: string;
    DB_ROOT_PASSWORD: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_HOST: string;
    DB_PORT: number;
};

export type EmailOptions = {
    FROM_EMAIL: string;
    CONSENT_TEMPLATE_ID: string;
    CONSENT_SKEMA_TEMPLATE_ID: string;
    SIGNUP_TEMPLATE_ID: string;
    RESET_TEMPLATE_ID: string;
    SENDGRID_KEY: string;
    REDDUM_TEMPLATE_ID: string;
};

export type AmazonS3 = {
    BUCKET_NAME: string;
    CONFIG: S3.Types.ClientConfiguration;
};

type Spices = {
    SALT: string;
    PEPPER: string;
};

export type Config = {
    VERSION?: string;
    DATABASE: DatabaseOptions;
    SERVER_PORT: number;
    S3: AmazonS3;
    EMAIL: EmailOptions;
    SPICES: Spices;
};

const defaults: Config = {
    DATABASE: {
        DB_ROOT_USER: 'root',
        DB_ROOT_PASSWORD: '',
        DB_USER: 'samromur',
        DB_PASSWORD: '',
        DB_NAME: 'samromur-v2',
        DB_HOST: '127.0.0.1',
        DB_PORT: 3306,
    },
    SERVER_PORT: 3000,
    S3: {
        BUCKET_NAME: '',
        CONFIG: {},
    },
    EMAIL: {
        FROM_EMAIL: '',
        CONSENT_SKEMA_TEMPLATE_ID: '',
        CONSENT_TEMPLATE_ID: '',
        SIGNUP_TEMPLATE_ID: '',
        RESET_TEMPLATE_ID: '',
        SENDGRID_KEY: '',
        REDDUM_TEMPLATE_ID: '',
    },
    SPICES: {
        SALT: '',
        PEPPER: '',
    },
};

let loadedConfig: Config;

export const getConfig = (): Config => {
    if (loadedConfig) {
        return loadedConfig;
    }

    let config = null;
    try {
        let config_path = process.env.SERVER_CONFIG_PATH || './config.json';
        config = JSON.parse(fs.readFileSync(config_path, 'utf-8'));
    } catch (err) {
        console.error(err, 'Could not load config.json, using defaults');
    }
    loadedConfig = { ...defaults, ...config };

    return loadedConfig;
};

// To-do: better
export const verifyConfig = (config: Config): void => {
    if (!config.EMAIL.SENDGRID_KEY) {
        console.error('EMAIL API KEY MISSING');
    }

    if (!config.SPICES.PEPPER || config.SPICES.PEPPER == '') {
        console.error('Please add pepper to config!');
        throw new Error('Pepper is missing in config');
    }

    if (!config.SPICES.SALT || config.SPICES.SALT == '') {
        console.error('Please add salt to config!');
        throw new Error('Salt is missing in config');
    }
};
