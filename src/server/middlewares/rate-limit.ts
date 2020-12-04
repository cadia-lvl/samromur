import rateLimit from 'express-rate-limit';

/**
 * Create the settings of the rate limit middleware.
 * This limits the number of requests a user can make to the server
 * during the windowMs timeframe.
 */
const rateLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 min in milliseconds
    max: 120,
    headers: true,
});

export default rateLimiter;
