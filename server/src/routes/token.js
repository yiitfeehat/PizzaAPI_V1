"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const router = require('express').Router()
const { list, create, read, deletee} = require('../controllers/token')
/* ------------------------------------------------------- */
router.route('/')
    .get(list) // List Users
    .post(create) // Create User

router.route('/:id')
    .get(read) // Get User by ID
    .delete(deletee) // Delete User by ID
/* ------------------------------------------------------- */
module.exports = router