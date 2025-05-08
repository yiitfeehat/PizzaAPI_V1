"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
/*
    $ cp .env-sample .env
    $ npm init -y
    $ npm i express dotenv mongoose express-async-errors
    $ npm i morgan swagger-autogen swagger-ui-express redoc-express
    $ mkdir logs
    $ nodemon
*/
const express = require('express')
const app = express()
const fs = require('fs');

/* ------------------------------------------------------- */
// Required Modules:

// envVariables to process.env:
require('dotenv').config()
const PORT = process.env?.PORT || 8000

// query parse was "extended" with v5, it is using built in library which is "qs" qs(querystring)
// extended -> ?a[b]=1 {a : {b: 1}} & qs -> ?a[b]=1 {"a[b]" : b}

app.set('query parser', "extended");

/* -------------------------------------------------------------------------- */
// Logs klasörünü kontrol et ve yoksa oluştur
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

/* ------------------------------------------------------- */
// Configrations:

// Connect to DB:
const { dbConnection } = require('./src/configs/dbConnection')
dbConnection()

/* ------------------------------------------------------- */
// CORS

const cors = require("cors");

app.use(cors());

/* ------------------------------------------------------- */
// Middlewares:

// Accept JSON:
app.use(express.json())

// Logger:
app.use(require('./src/middlewares/logger'))

// Auhentication:
app.use(require('./src/middlewares/authentication'))

// findSearchSortPage / res.getModelList:
app.use(require('./src/middlewares/queryHandler'))

/* ------------------------------------------------------- */
// EMAİL
// npm i nodemailer

const nodemailer = require('nodemailer')
/* send email with ethereal */
// nodemailer.createTestAccount().then(email=> console.log(email))
// {
//     user: 'qmu26px4mff5r6qk@ethereal.email',
//     pass: 'bA6Tdec3y1F3QaKQSm',
//     smtp: { host: 'smtp.ethereal.email', port: 587, secure: false },
//     imap: { host: 'imap.ethereal.email', port: 993, secure: true },
//     pop3: { host: 'pop3.ethereal.email', port: 995, secure: true },
//     web: 'https://ethereal.email',
//         mxEnabled: false
// }

// Connect to MailServer / STMP:
// const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     secure: false,
//     auth: {
//         user: 'qmu26px4mff5r6qk@ethereal.email',
//         pass: 'bA6Tdec3y1F3QaKQSm',
//     }
// });

// // Send Mail:
// transporter.sendMail({
//     from: 'qmu26px4mff5r6qk@ethereal.email',
//     to: 'yiitferhat@gmail.com',
//     subject: 'Hi There',
//     html: "<p style='text-color:red' >Hello there, how are you <b>today</b> </p>",
//     text: "Hello there, \n how are you today"
// }, function (error, success) {
//     success ? console.log('SUCCESS:', success) : console.log('ERROR:', error);
// });


//? Send EMAİL WITH GMAIL SERVICE
// Google -> AccountHome -> Security -> Two-Step-Verify (make it on) -> App-Passwords (if not showing use this link: https://myaccount.google.com/apppasswords)

// eixo rcbk lcpn egsd
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: 'yiitferhat@gmail.com',
//         pass: '-deleted-',
//     }
// });

// // Send Mail:
// transporter.sendMail({
//     from: "yiitferhat@gmail.com",
//     to: 'yiitferhat@gmail.com',
//     subject: 'Hi There',
//     html: "<p style='text-color:red' >Hello there, how are you <b>today</b> </p>",
//     text: "Hello there, \n how are you today"
// }, function (error, success) {
//     success ? console.log('SUCCESS:', success) : console.log('ERROR:', error);
// });




//? Send EMAİL WITH GMAIL SERVICE
/* ------------------------------------------------------- */
// Routes:

// routes/index.js:
app.use('/', require('./src/routes/'))

// HomePath:
app.all('/', (req, res) => {
    res.send({
        error: false,
        message: 'Welcome to PIZZA API',
        docs: {
            swagger: "/documents/swagger",
            redoc: "/documents/redoc",
            json: "/documents/json",
        },
        user: req.user,
    })
});

// Static Route for images
const path = require('node:path');
app.use('/images', express.static(path.join(__dirname, 'uploads')));


/* ------------------------------------------------------- */

// errorHandler:
app.use(require('./src/middlewares/errorHandler'))

// RUN SERVER:
app.listen(PORT, () => console.log('http://127.0.0.1:' + PORT))

/* ------------------------------------------------------- */
// Syncronization (must be in commentLine):
// require('./src/helpers/sync')() // !!! It clear database.