"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
// UPLOAD (Multer Middleware)
// npm i multer 

const multer = require("multer");

/* -------------------------------------------------------------------------- */

module.exports= multer({
    // dest: "./uploads" // destination of images
    storage: multer.diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
            console.log("req", req)
            console.log("file", file)
            // cb(null, file.originalname) // original name of image
            cb(null, Date.now() + "-" + file.originalname) // original name of image
        }
    })
})

