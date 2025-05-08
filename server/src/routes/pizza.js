"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const router = require('express').Router()
const { list, create, read, update, deletePizza } = require('../controllers/pizza')
const upload = require("../middlewares/upload")/* ------------------------------------------------------- */
router.route('/')
    .get(list) // List Users
    .post(upload.single("image"), create) // Create User

router.route('/:id')
    .get(read) // Get User by ID
    .put(update) // Update User by ID
    .patch(update) // Update User by ID
    .delete(deletePizza) // Delete User by ID
/* ------------------------------------------------------- */
module.exports = router