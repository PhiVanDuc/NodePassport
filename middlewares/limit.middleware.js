require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const { token } = req.params;

    jwt.verify(token, process.env.SECRET_KEY, (err) => {
        if (err) {
            req.flash("change-password", 'Password change time has expired!');
            return res.redirect('/auth/login');
        }
        return next();
    });
}