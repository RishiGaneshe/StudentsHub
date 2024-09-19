const rateLimit= require('express-rate-limit')

const loginLimiter= rateLimit({
    windowMs: 5 * 60 * 1000,                       // 5 minutes
    max: 20,                                       // Limit each IP to 20 login attempts per `window` (here, 15 minutes)
    message: 'Too many login attempts from this Device, please try again later.',
    standardHeaders: true,                      // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,                       // Disable the `X-RateLimit-*` headers
})

const requestLimiter= rateLimit({
    windowMs: 5 * 60 * 1000,                       // 5 minutes
    max: 1200,                                     // Limit each Device 1200 request per `window` (here, 5 minutes)
    message: 'Too many request in short time from this Device, please try after some time.',
    standardHeaders: true,                      // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,                       // Disable the `X-RateLimit-*` headers
})

module.exports={
    loginLimiter,
    requestLimiter
}
