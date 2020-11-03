import * as crypto from 'crypto';
import md5 from 'js-md5';

import CryptoJS from 'crypto-js';

//TO-DO move our salts out of the repository !!!
export const sha256hash = (str: string): string => {
    const salt = '8hd3e8sddFSdfj';
    return crypto.createHmac('sha256', salt).update(str).digest('hex');
};

export const sha512hash = (str: string): string => {
    const salt = '8hd3e8sddFSdfj';
    return CryptoJS.SHA512(salt + str).toString();
};

export const md5hash = (str: string): string => {
    const salt = 'hbads8fh49hgfls';
    return md5(str + salt);
};
