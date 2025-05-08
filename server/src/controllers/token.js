"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const Token = require('../models/token')

module.exports = {
    list: async (req, res) => {
        /* 
          #swagger.ignore = true
      */
        try {
            const result = await res.getModelList(Token);
            const details = await res.getModelListDetails(Token);

            res.status(200).send({
                error: false,
                details,
                result
            });
        } catch (error) {
            res.status(500).send({
                error: true,
                message: "An error occurred while fetching the tokens.",
                details: error.message
            });
        }
    },

    create: async (req, res) => {
       /* 
          #swagger.ignore = true
      */

        try {
            const result = await Token.create(req.body);
            res.status(200).send({
                error: false,
                result
            });
        } catch (error) {
            res.status(500).send({
                error: true,
                message: "An error occurred while creating the token.",
                details: error.message
            });
        }
    },

    read: async (req, res) => {
       /* 
          #swagger.ignore = true
      */
        try {
            const result = await Token.findOne({ _id: req.params.id });
            if (!result) {
                return res.status(404).send({
                    error: true,
                    message: "Token not found."
                });
            }

            res.status(200).send({
                error: false,
                result
            });
        } catch (error) {
            res.status(500).send({
                error: true,
                message: "An error occurred while fetching the token.",
                details: error.message
            });
        }
    },

    

    deletee: async (req, res) => {
        /* 
          #swagger.ignore = true
      */

        try {
            const result = await Token.deleteOne({ _id: req.params.id });
            if (result.deletedCount === 0) {
                return res.status(404).send({
                    error: true,
                    message: "Token not found!"
                });
            }

            res.status(204).send({
                error: false,
                message: "Token deleted successfully."
            });

        } catch (error) {
            res.status(500).send({
                error: true,
                message: "An error occurred while deleting the token.",
                details: error.message
            });
        }
    }
}
