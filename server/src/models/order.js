"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')
/* ------------------------------------------------------- */
const OrderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        pizzaId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pizza",
            required: true,
        },
        size: {
            type: String,
            enum: ["Small", "Medium", "Large", "XLarge"],
            required: true,
            trim: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0,
            default: function () {
                return this.price * this.quantity;
            }
        },
        status: {
            type: String,
            enum: ["Sipariş Alındı", "Hazırlanıyor", "Yolda", "Teslim Edildi", "İptal Edildi"],
            default: "Sipariş Alındı",
        },
        address: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: (phone) => {
                    return /^\d{10}$/.test(phone); // 10 haneli telefon numarası kontrolü
                },
                message: "Telefon numarası geçersiz!",
            },
        },
        paymentMethod: {
            type: String,
            enum: ["Kredi Kartı", "Kapıda Ödeme"],
            required: true,
            trim: true,
        },
        paymentStatus: {
            type: String,
            enum: ["Ödendi", "Ödenmedi"],
            default: "Ödenmedi",
        },
        deliveryTime: {
            type: Date,
            default: Date.now,
        },
        notes: {
            type: String,
            trim: true,
        }

    },
    { collection: "orders", timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);