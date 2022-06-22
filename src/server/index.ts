import express, {
    Application as ExpressApplication,
    Request,
    Response,
} from 'express';
import cookieParser from 'cookie-parser';

import * as next from 'next';
import { NextServer } from 'next/dist/server/next';
import nextI18NextMiddleWare from 'next-i18next/middleware';
import clientIdMiddleware from './middlewares/client-id';
import authMiddleware from './middlewares/auth';
import batchUploadMiddleware from './middlewares/batch-upload';
import uploadSentencesWithClipsMiddleware from './middlewares/sentences-with-clips-upload';
import rateLimiter from './middlewares/rate-limit';

import { nextI18next } from './i18n';
import { Config, getConfig, verifyConfig } from '../utilities/config-helper';
import Database, { getDatabaseInstance } from './database/database';
import { uploadHandler } from './utilities/upload-helper';

class Server {
    private app: NextServer;
    private server: ExpressApplication;
    private database: Database;

    constructor(app: NextServer, server: ExpressApplication) {
        this.app = app;
        this.server = server;
        this.database = getDatabaseInstance();
        this.setup();
    }

    private setup() {
        const handle = this.app.getRequestHandler();
        this.server.use(cookieParser());
        this.server.use(nextI18NextMiddleWare(nextI18next));
        this.server.use(clientIdMiddleware);
        this.server.use(authMiddleware);
        //this.server.use('/api/', rateLimiter);

        // Batch upload upload handler and api
        this.server.post(
            '/api/upload-batch',
            uploadHandler,
            batchUploadMiddleware
        );

        // Sentenes with clips upload handler and api
        this.server.post(
            '/api/upload-sentences-with-clips',
            uploadHandler,
            uploadSentencesWithClipsMiddleware
        );

        this.server.all('*', (req: Request, res: Response) => handle(req, res));
    }

    public static createServer = async (dev: boolean): Promise<Server> => {
        return new Promise(async (resolve, reject) => {
            try {
                const app = next.default({ dev });
                await app.prepare();
                const server = express();
                resolve(new Server(app, server));
            } catch (error) {
                reject(error);
            }
        });
    };

    listen = (port: number) => {
        return new Promise((resolve, reject) => {
            this.server.listen(port, (error?: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve('Success');
                }
            });
        });
    };

    // To-do: kill server
    kill = () => {
        console.log('KILLING');
    };

    run = async (config: Config): Promise<void> => {
        const { SERVER_PORT } = config;
        await this.listen(SERVER_PORT);
        await this.database.ensureDatabase();
        await this.database.performMaintenance();
    };
}

const env = process.env.NODE_ENV;
const dev = env ? env.replace(' ', '') != 'production' : true;

const config = getConfig();
verifyConfig(config);
Server.createServer(dev)
    .then((server: Server) => {
        server
            .run(config)
            .then(() => {
                console.log(
                    `> Ready on localhost:${config.SERVER_PORT} in ${
                        dev ? 'development' : 'production'
                    } mode`
                );
            })
            .catch((error) => {
                console.error('Error running server: ', error);
                process.exit(1);
            });
    })
    .catch((error) => {
        console.error('Error creating server: ', error);
        process.exit(1);
    });
