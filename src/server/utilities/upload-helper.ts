import multer from 'multer';
import fs from 'fs';

/**
 * Creates the multer storage
 */
export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        if (file.fieldname == 'audio') {
            cb(null, file.originalname);
        } else if (file.fieldname) {
            cb(null, file.originalname);
        }
    },
});

/**
 * Returns the sentence (first line) of the input file
 * @param file
 */
export const getSentenceFromFile = (
    file: Express.Multer.File
): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(file.path, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data.toString());
            }
        });
    });
};

/**
 * Takes in a metadata file and an array of audio files and returns
 * the audio file that matches the metadata file
 * @param audio
 * @param metadata
 */
export const findMatchingAudioFile = (
    audio: Express.Multer.File[],
    metadata: Express.Multer.File
): Express.Multer.File | undefined => {
    const withoutExtension = metadata.originalname.replace(/\.[^.]*$/, '');
    return audio.find((file) => file.originalname.startsWith(withoutExtension));
};

/**
 * Creates the upload handler for file uploads
 */
export const uploadHandler = multer({ storage: storage }).fields([
    { name: 'audio' },
    { name: 'metadata' },
]);
