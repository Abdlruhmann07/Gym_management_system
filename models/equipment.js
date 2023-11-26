const { model, Schema } = require('mongoose');
const equipmentsSchema = new Schema({
    name: {
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
    quantity: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['available', 'out-of-stock', 'maintenance'],
        default: 'available',
    },
    brand: {
        // type: Schema.Types.ObjectId,
        // ref: 'brand',
        type: String,
        
    }

}, { timestamps: true });

const Equipment = new model('Equipment', equipmentsSchema);
module.exports = Equipment