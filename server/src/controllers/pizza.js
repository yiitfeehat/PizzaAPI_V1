"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const Pizza = require('../models/pizza')

module.exports = {

    // List all pizzas
    list: async (req, res) => {
        try {
            const result = await res.getModelList(Pizza, {}, "toppingsIds");
            const details = await res.getModelListDetails(Pizza);
            res.status(200).send({ error: false, details, result });
        } catch (error) {
            res.status(500).send({
                error: true,
                message: "An error occurred while fetching the pizzas.",
                details: error.message
            });
        }
    },

    // Create a new pizza
    create: async (req, res) => {
        /*
          #swagger.tags = ['Pizzas']
          #swagger.summary = 'Create a new pizza'
        */

        try {
            // Eğer dosya yüklenmişse, dosya yolunu req.body.image'e ekle
            if (req.file) {
                req.body.image = req.file.path; // Yüklenen dosyanın yolu
            }

            // toppingsIds'deki duplicate'leri kaldır
            if (req.body.toppingsIds) {
                req.body.toppingsIds = [...new Set(req.body.toppingsIds)];
            }

            // Pizza oluştur
            const result = await Pizza.create(req.body);
            res.status(201).send({ error: false, result });
        } catch (error) {
            res.status(500).send({
                error: true,
                message: "An error occurred while creating the pizza.",
                details: error.message
            });
        }
    },

    // Get a single pizza by ID
    read: async (req, res) => {
        /*
        #swagger.tags = ['Pizzas']
        #swagger.summary = 'Get a pizza by ID'
        */
        try {
            const result = await Pizza.findById(req.params.id).populate('toppingsIds')
            if (!result) {
                return res.status(404).send({ error: true, message: "Pizza not found." })
            }

            res.status(200).send({ error: false, result })
        } catch (error) {
            res.status(500).send({
                error: true,
                message: "An error occurred while fetching the pizza.",
                details: error.message
            })
        }
    },

    // Update a pizza
    update: async (req, res) => {
        /*
          #swagger.tags = ['Pizzas']
          #swagger.summary = 'Update a pizza'
        */
        try {
            const result = await Pizza.updateOne({ _id: req.params.id }, req.body, {
                runValidators: true
            })

            if (!result.acknowledged) {
                return res.status(400).send({ error: true, message: "Update not acknowledged by database." })
            }
            if (result.matchedCount === 0) {
                return res.status(404).send({ error: true, message: "Pizza not found." })
            }
            if (result.modifiedCount === 0) {
                return res.status(400).send({ error: true, message: "No changes made to the pizza." })
            }

            res.status(200).send({ error: false, message: "Pizza updated successfully." })
        } catch (error) {
            res.status(500).send({
                error: true,
                message: "An error occurred while updating the pizza.",
                details: error.message
            })
        }
    },

    // Delete a pizza
    deletePizza: async (req, res) => {
        /*
          #swagger.tags = ['Pizzas']
          #swagger.summary = 'Delete a pizza'
        */
        try {
            const result = await Pizza.deleteOne({ _id: req.params.id })
            if (result.deletedCount === 0) {
                return res.status(404).send({ error: true, message: "Pizza not found!" })
            }

            res.status(200).send({ error: false, message: "Pizza deleted successfully." })
        } catch (error) {
            res.status(500).send({
                error: true,
                message: "An error occurred while deleting the pizza.",
                details: error.message
            })
        }
    }

}
