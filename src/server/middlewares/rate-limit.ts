import rateLimit from 'express-rate-limit';

const rateLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 min in milliseconds
    max: 120,
    headers: true,
});

export default rateLimiter;
