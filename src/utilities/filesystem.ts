import fs from 'fs';
import { join } from 'path';
import { WaitingVoteBatch } from '../types/votes';

export interface WaitingBatch {
    id: string;
    name: string;
    sentences: Array<string>;
}

const tmpDir = './src/tmp';

export const saveTempBatch = async (batch: WaitingBatch | WaitingVoteBatch) => {
    return new Promise<void>((resolve, reject) => {
        const obj = JSON.stringify(batch);
        const filename = batch.id + '.json';
        fs.writeFile(join(tmpDir, filename), obj, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
};

export const loadTempBatch = async (id: string): Promise<WaitingBatch> => {
    return new Promise((resolve, reject) => {
        const filename = id + '.json';
        fs.readFile(join(tmpDir, filename), 'utf8', (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
};

export const loadTempVotesBatch = async (
    id: string
): Promise<WaitingVoteBatch> => {
    return new Promise((resolve, reject) => {
        const filename = id + '.json';
        fs.readFile(join(tmpDir, filename), 'utf8', (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
};

export const removeTempBatch = async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const filename = id + '.json';
        fs.unlink(join(tmpDir, filename), (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
};
