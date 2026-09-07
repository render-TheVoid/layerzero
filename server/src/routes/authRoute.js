import express from 'express';
import { 
    loginUser, 
    logout, 
    registerUser, 
    resendVerification, 
    verifyEmail, 
    checkUser,
    updateAccount,
    deleteAccount 
} from '../controllers/auth.js';
import { protectRoute } from '../middlewares/authMiddleware.js';
import { rateLimit } from '../middlewares/rateLimiter.js';
import { authLimiter, resendLimiter } from '../middlewares/redisRateLimit.js';

const router = express.Router();

router.post(
    '/user/register',
    rateLimit(authLimiter),
    registerUser
);

router.get(
    '/user/check',
    rateLimit(authLimiter),
    protectRoute,
    checkUser
);

router.post(
    '/user/login',
    rateLimit(authLimiter),
    loginUser
);

router.post(
    '/user/resend',
    rateLimit(resendLimiter),
    resendVerification
);

router.get(
    '/user/verify/:token',
    rateLimit(authLimiter),
    verifyEmail
);

router.post('/user/logout', logout);

router.put(
    '/user/update',
    rateLimit(authLimiter),
    protectRoute,
    updateAccount
);

router.delete(
    '/user/delete',
    rateLimit(authLimiter),
    protectRoute,
    deleteAccount
);

export default router;