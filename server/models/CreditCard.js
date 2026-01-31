const mongoose = require('mongoose');

const creditCardSchema = new mongoose.Schema({
    cardName: {
        type: String,
        required: true
    },
    cardType: {
        type: String,
        enum: ['Visa', 'Mastercard', 'Amex'],
        required: true
    },
    benefits: [String],
    annualFee: {
        type: Number,
        required: true
    },
    description: String,
    imageUrl: String
}, { timestamps: true });

module.exports = mongoose.model('CreditCard', creditCardSchema);
