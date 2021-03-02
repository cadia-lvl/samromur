/**
 * Takes in a list of files and verifies that for each audio file
 * there exists a text file to match it.
 * @param files
 */
export const verifyFiles = (files: FileList): File[] => {
    const audio = Array.from(files).filter((file: File) =>
        file.type.startsWith('audio')
    );
    const metadata = Array.from(files).filter(
        (file: File) => file.type == 'text/plain'
    );
    const verifiedMetadata = metadata.filter(async (metadataFile: File) => {
        const name = metadataFile.name.replace(/\.[^.]*$/, '');
        return audio.find(
            (file: File) => file.name.replace(/\.[^.]*$/, '') == name
        );
    });
    const verifiedAudio = audio.filter((audioFile: File) => {
        const name = audioFile.name.replace(/\.[^.]*$/, '');
        return verifiedMetadata.find(
            (file: File) => file.name.replace(/\.[^.]*$/, '') == name
        );
    });
    return verifiedMetadata.concat(verifiedAudio);
};

/**
 * Takes in a number of bytes and returns them in KB, MB, GB...
 * @param bytes
 * @param decimals the number of decimals to be included
 */
export const formatBytes = (bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const validateSentencePackageName = (packageName: string): boolean => {
    const re = /^[A-Za-z0-9._-]{1,32}$/;
    return re.test(packageName);
};
