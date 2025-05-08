"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const Order = require('../models/order')
const Pizza = require('../models/pizza');
module.exports = {
    list: async (req, res) => {
        /* 
          #swagger.tags = ['Orders']
          #swagger.summary = 'List Orders'
          #swagger.description = `
              You can send query with endpoint for filter[], search[], sort[], page, and limit.
              <ul> Examples usage:
                  <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                  <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                  <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                  <li>URL/?<b>page=2&limit=1</b></li>
              </ul>
          `
        */
        try {
            const result = await res.getModelList(Order);
            const details = await res.getModelListDetails(Order);

            res.status(200).send({
                error: false,
                details,
                result
            });
        } catch (error) {
            res.status(500).send({
                error: true,
                message: "An error occurred while fetching the orders.",
                details: error.message
            });
        }
    },

    create: async (req, res) => {
        /* 
         #swagger.tags = ['Orders']
         #swagger.summary = 'Create Order'
         */

        const pizza = await Pizza.findOne({ _id: req?.body?.pizzaId });
        if (!pizza) {
            return res.status(404).send({
                error: true,
                message: "Pizza not found!"
            });
        }
        req.body.price = pizza.price;

        try {
            const result = await Order.create(req.body);
            res.status(201).send({
                error: false,
                result
            });
        } catch (error) {
            res.status(500).send({
                error: true,
                message: "An error occurred while creating the order.",
                details: error.message
            });
        }
    },

    read: async (req, res) => {
        /* 
          #swagger.tags = ['Orders']
          #swagger.summary = 'Get Single Order'
        */
        try {
            const result = await Order.findOne({ _id: req.params.id }).populate('userId', 'pizzaId');
            if (!result) {
                return res.status(404).send({
                    error: true,
                    message: "Order not found."
                });
            }

            res.status(200).send({
                error: false,
                result
            });
        } catch (error) {
            res.status(500).send({
                error: true,
                message: "An error occurred while fetching the order.",
                details: error.message
            });
        }
    },

    update: async (req, res) => {
        /* 
          #swagger.tags = ['Orders']
          #swagger.summary = 'Update Order'
        */
        try {
            const result = await Order.updateOne({ _id: req.params.id }, req.body, { runValidators: true });
            const { acknowledged, matchedCount, modifiedCount } = result;

            if (!acknowledged) {
                return res.status(400).send({
                    error: true,
                    message: "Order update not acknowledged by the database."
                });
            }

            if (matchedCount === 0) {
                return res.status(404).send({
                    error: true,
                    message: "Order not found!"
                });
            }

            if (modifiedCount === 0) {
                return res.status(400).send({
                    error: true,
                    message: "No data was modified. Request might be invalid or redundant."
                });
            }

            res.status(200).send({
                error: false,
                message: "Order updated successfully.",
                result
            });

        } catch (error) {
            res.status(500).send({
                error: true,
                message: "An error occurred while updating the order.",
                details: error.message
            });
        }
    },

    deleteOrder: async (req, res) => {
        /* 
          #swagger.tags = ['Orders']
          #swagger.summary = 'Delete Order'
        */
        try {
            const result = await Order.deleteOne({ _id: req.params.id });
            if (result.deletedCount === 0) {
                return res.status(404).send({
                    error: true,
                    message: "Order not found!"
                });
            }

            res.status(200).send({
                error: false,
                message: "Order deleted successfully."
            });

        } catch (error) {
            res.status(500).send({
                error: true,
                message: "An error occurred while deleting the order.",
                details: error.message
            });
        }
    }
}
