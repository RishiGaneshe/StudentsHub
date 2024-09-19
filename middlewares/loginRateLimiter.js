const rateLimit= require('express-rate-limit')


const loginLimiter= rateLimit({
    windowMs: 5 * 60 * 1000,                       // 15 minutes
    max: 20,                                       // Limit each IP to 20 login attempts per `window` (here, 15 minutes)
    message: 'Too many login attempts from this IP, please try again later.',
    standardHeaders: true,                      // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,                       // Disable the `X-RateLimit-*` headers
})


module.exports={
    loginLimiter
}