const mongoose = require('mongoose');
const Order_Schema = mongoose.Schema({
    items: [
        {
            id: Number,
            title: String,
            description: String,
            price: Number,
            category: String,
            photo: String,
            quantity: Number,
        },
    ],

    user: {
        _id: mongoose.Types.ObjectId,
        username: String,
        email: String,
    },
})

const Order = mongoose.model("Order", Order_Schema);
module.exports = Order;