export const ageFromKennitala = (kennitala: string): number => {
    const day = parseInt(kennitala[0] + kennitala[1]);
    const month = parseInt(kennitala[2] + kennitala[3]);
    const year = parseInt('20' + kennitala[4] + kennitala[5]);
    const birthday = new Date(year, month - 1, day, 0, 0, 0, 0);
    const diffMs = Date.now() - birthday.getTime();
    const ageDate = new Date(diffMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return age;
};
