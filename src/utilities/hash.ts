import * as crypto from 'crypto';
import md5 from 'js-md5';

import CryptoJS from 'crypto-js';
import bcrypt from 'bcryptjs';
import { getConfig } from './config-helper';

/**
 * NOT SAFE. Only use for fast hashing.
 * Hashes the input string with the sha256 hash
 * @param str
 * @returns hash with the Hmac method
 */
export const sha256hash = (str: string): string => {
    const salt = getConfig().SPICES.SALT;
    return crypto.createHmac('sha256', salt).update(str).digest('hex');
};

/**
 * Bcrypt is a really slow one-way hashing method with build in random salts
 * @param str string to be hashed
 * @returns hashed string with bcrypt methon
 */
export const bHash = (str: string): string => {
    const saltRounds = 14;
    const hash = bcrypt.hashSync(str, saltRounds);
    return hash;
};

/**
 * NOT SAFE. Only use for fast hashing.
 * Hashes the input string with the sha256 hash
 * @param str
 * @returns hash with the md5 method
 */
export const md5hash = (str: string): string => {
    const salt = getConfig().SPICES.PEPPER;
    return md5(str + salt);
};
