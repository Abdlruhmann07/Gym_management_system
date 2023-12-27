
const { Schema, model } = require('mongoose');

const productSchema = new Schema({
	id: Number,
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	photo: {
		type: String,
	},
	quantity: {
		type: Number,
		default: 1,
	},
	status: {
		type: String,
		enum: ['out-of-stock', 'available'],
		default: 'available'
	}
}, { timestamps: true });

productSchema.pre('save', function (next) {
	if (this.isNew) {
		this.id = Math.floor(1000 + Math.random() * 1000000);
	}
	next();
})
const Product = new model('Product', productSchema);
module.exports = Product;