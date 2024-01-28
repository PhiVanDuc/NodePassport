const express = require('express');
const passport = require('passport');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const limitMiddleware = require('../middlewares/limit.middleware');

router.get('/login', authController.index);
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/login',
    failureFlash: true,
    badRequestMessage: "Vui lòng nhập email và password!",
    successRedirect: "/"
}));

router.get('/google/redirect', passport.authenticate('google'));

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/auth/login',
    failureFlash: true,
    successRedirect: "/"
}));

router.get('/confirm-email', authController.confirmEmail);
router.post('/confirm-email', authController.handleConfirmEmail);

router.get('/reset-password/:token', limitMiddleware, authController.resetPassword);
router.post('/reset-password/:token', authController.handleResetPassword);

router.get('/logout', authController.handleLogout);

module.exports = router;