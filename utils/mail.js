"use strict";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "phivanduc325@gmail.com",
    pass: "qvsr aclx ulfn yleh",
  },
});

module.exports = async (to, subject, message) => {
    return await transporter.sendMail({
        from: '"System Login" <phivanduc325@gmail.com>',
        to,
        subject,
        html: `Note: The password reset link is only effective for 15 minutes ` + message,
    });
}