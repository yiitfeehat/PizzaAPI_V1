"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')
/* ------------------------------------------------------- */
const PizzaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    image: {
        type: String, // single data
        // type : [ string], // multiple
        trim: true,
        default: "https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg"
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    // Birden fazla malzeme seçilebileceği için array yapısı kullanıyoruz.
    // Many to one olduğu için array yapısı kullanıyoruz. diyebiliriz sanırım.
    toppingsIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Topping"
        }

    ],

}, { collection: "pizzas", timestamps: true });

module.exports = mongoose.model("Pizza", PizzaSchema); 