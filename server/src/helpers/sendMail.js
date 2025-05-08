"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const transporter = require("../configs/nodemailler")


module.exports = function sendMail(to, subject, tempFnc, data = null) {
    transporter.sendMail({
        from: process.env.ADMIN_EMAIL,
        to,
        subject,
        html: data ? tempFnc(data) : tempFnc(),
    }, function (error, success) {
        success ? console.log('SUCCESS:', success) : console.log('ERROR:', error);
    });
}
