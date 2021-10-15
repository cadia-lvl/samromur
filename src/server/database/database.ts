import Sql, { getSQLInstance } from './sql';
import Schema from './schema';
import Bucket from './bucket';
import Clips from './clips';
import Consents from './consents';
import Stats from './stats';
import Sentences from './sentences';
import UserClients from './user-clients';
import Votes from './votes';
import Competition from './competition';

export default class Database {
    private sql: Sql;
    private schema: Schema;
    private bucket: Bucket;

    clips: Clips;
    consents: Consents;
    sentences: Sentences;
    stats: Stats;
    userClients: UserClients;
    votes: Votes;
    competition: Competition;

    constructor() {
        this.sql = getSQLInstance();
        this.schema = new Schema(this.sql);
        this.bucket = new Bucket();
        this.clips = new Clips(this.sql, this.bucket);
        this.consents = new Consents(this.sql);
        this.sentences = new Sentences(this.sql, this.bucket);
        this.stats = new Stats(this.sql);
        this.userClients = new UserClients(this.sql);
        this.votes = new Votes(this.sql);
        this.competition = new Competition(this.sql);
    }

    // Ensure the database is set up properly
    ensureDatabase = async (): Promise<void> => {
        await this.schema.ensure();
    };

    // Run migrations
    performMaintenance = async (): Promise<void> => {
        await this.schema.upgrade();
    };
}

let instance: Database;

export function getDatabaseInstance() {
    return instance || (instance = new Database());
}
