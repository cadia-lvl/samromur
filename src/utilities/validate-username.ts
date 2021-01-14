/**
 * Small function that uses regex to validate that the username
 * is on a valid form
 * @param username the email string to validate
 */
const validateUsername = (username: string): boolean => {
    // 5-30 charcters
    // icelandic alphabet ok
    // - and _ ok
    const re = /^[A-ZÁÐÉÍÓÚÝÞÆÖa-záðéíóúýþæö][A-ZÁÐÉÍÓÚÝÞÆÖa-záðéíóúýþæö_-]{4,29}$/;
    return re.test(username);
};

export default validateUsername;
