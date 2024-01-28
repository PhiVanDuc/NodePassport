require('dotenv').config();

const sendMail = require('../utils/mail');
const jwt = require('jsonwebtoken');
const { string } = require('yup');
const { User, Provider } = require('../models/index');
const bcrypt = require('bcrypt');

module.exports = {
    index: (req, res) => {
        if (req.user) return res.redirect('/');

        const error = req.flash('error')[0];
        const changePass = req.flash('change-password')[0];
        return res.render('auth/login', {
            error,
            changePass
        });
    },

    handleLogout: async (req, res) => {
        req.logout((error) => {});
        return res.redirect('/auth/login');
    },

    confirmEmail: (req, res) => {
        const sended = req.flash('sended')[0];

        return res.render('auth/confirm_email', { sended });
    },

    handleConfirmEmail: async (req, res, next) => {
        const { email } = req.body;

        try {
            const user = await User.findOne({
                where: {
                    email,
                },
                include: {
                    model: Provider,
                    where: {
                        name: 'email',
                    }
                }
            });

            if (!user) req.flash('sended', "Email does not exist!");
            else {
                const token = jwt.sign({
                    email,
                    created_at: new Date(),
                }, process.env.SECRET_KEY, {
                    expiresIn: '15m'
                });
                
                const link = `<a href="https://node-passport.vercel.app/auth/reset-password/${ token }">Link reset password</a>`
                const info = await sendMail(email, 'Link reset password', link);

                if (info.accepted.length) req.flash('sended', "Password reset link will be sent to your gmail!");
                else req.flash('sended', "Failed send email!");
            }
        }
        catch(e) {
            return next(e);
        }
        return res.redirect('/auth/confirm-email');
    },

    resetPassword: (req, res) => {
        const { token } = req.params;
        return res.render('auth/reset_password', {
            token,
            req,
        });
    },

    handleResetPassword: async (req, res, next) => {
        const { token } = req.params;
        const { password } = req.body;

        const body = await req.validate(req.body, {
            password: string().min(10, 'At least 10 characters'),
            confirm_password: string().min(10, 'At least 10 characters').test('compare-password', "Not the same as the password above", (value) => {
                return password === value;
            }),
        });

        if (body) {
            jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
                if (err) req.flash("change-password", 'Password change time has expired!');
                else {
                    const { email } = decoded;
                    console.log(email, password);
                    
                    try {
                        const salt = bcrypt.genSaltSync(10);

                        await User.update(
                            {
                                password: bcrypt.hashSync(password, salt),
                            },
                            {
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
                            }
                        );

                        req.flash("change-password", 'Password change success!');
                    }
                    catch (e) {
                        return next(e);
                    }
                }
            });

            return res.redirect(`/auth/login`);
        }

        return res.redirect(`/auth/reset-password/${token}`);
    }
}