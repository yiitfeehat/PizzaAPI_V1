"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const Topping = require('../models/topping')

module.exports = {

    // List all toppings
    list: async (req, res) => {
        /*
          #swagger.tags = ['Toppings']
          #swagger.summary = 'List all toppings'
          #swagger.description = `
              Supports query params: filter[], search[], sort[], page, limit
              <ul> Examples:
                  <li>?filter[name]=Margherita</li>
                  <li>?search[name]=cheese</li>
                  <li>?sort[price]=-1</li>
                  <li>?page=2&limit=5</li>
              </ul>
          `
        */
        try {
            const result = await res.getModelList(Topping)
            // Populate the toppingsIds field with the corresponding topping documents
            const details = await res.getModelListDetails(Topping)
            // Send the response with the populated toppingsIds field

            res.status(200).send({ error: false, details, result })
        } catch (error) {
            res.status(500).send({
                error: true,
                message: "An error occurred while fetching the toppings.",
                details: error.message
            })
        }
    },

    // Create a new topping
    create: async (req, res) => {
        /*
          #swagger.tags = ['Toppings']
          #swagger.summary = 'Create a new topping'
        */

        
        try {
            const result = await Topping.create(req.body)
            res.status(201).send({ error: false, result })
        } catch (error) {
            res.status(500).send({
                error: true,
                message: "An error occurred while creating the topping.",
                details: error.message
            })
        }
    },

    // Get a single topping by ID
    read: async (req, res) => {
        /*
          #swagger.tags = ['Toppings']
          #swagger.summary = 'Get a topping by ID'
        */
        try {
            const result = await Topping.findById(req.params.id)
            if (!result) {
                return res.status(404).send({ error: true, message: "Topping not found." })
            }

            res.status(200).send({ error: false, result })
        } catch (error) {
            res.status(500).send({
                error: true,
                message: "An error occurred while fetching the topping.",
                details: error.message
            })
        }
    },

    // Update a topping
    update: async (req, res) => {
        /*
          #swagger.tags = ['Toppings']
          #swagger.summary = 'Update a topping'
        */
        try {
            const result = await Topping.updateOne({ _id: req.params.id }, req.body, {
                runValidators: true
            })

            if (!result.acknowledged) {
                return res.status(400).send({ error: true, message: "Update not acknowledged by database." })
            }
            if (result.matchedCount === 0) {
                return res.status(404).send({ error: true, message: "Topping not found." })
            }
            if (result.modifiedCount === 0) {
                return res.status(400).send({ error: true, message: "No changes made to the topping." })
            }

            res.status(200).send({ error: false, message: "Topping updated successfully." })
        } catch (error) {
            res.status(500).send({
                error: true,
                message: "An error occurred while updating the topping.",
                details: error.message
            })
        }
    },

    // Delete a topping
    deleteTopping: async (req, res) => {
        /*
          #swagger.tags = ['Toppings']
          #swagger.summary = 'Delete a topping'
        */
        try {
            const result = await Topping.deleteOne({ _id: req.params.id })
            if (result.deletedCount === 0) {
                return res.status(404).send({ error: true, message: "Topping not found!" })
            }

            res.status(200).send({ error: false, message: "Topping deleted successfully." })
        } catch (error) {
            res.status(500).send({
                error: true,
                message: "An error occurred while deleting the topping.",
                details: error.message
            })
        }
    }

}
