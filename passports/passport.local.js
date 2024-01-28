const LocalStrategy = require("passport-local").Strategy;
const { User, Provider } = require("../models/index");
const bcrypt = require("bcrypt");

module.exports = new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        const user = await User.findOne({
            where: {
                email,
            },
            include: [
                {
                    model: Provider,
                    where: {
                        name: "email"
                    }
                }
            ]
        });

        if (!user) return done(null, false, { message: 'Tài khoản không tồn tại!' });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return done(null, false, { message: 'Mật khẩu không chính xác!' });

        return done(null, user);
    }
);