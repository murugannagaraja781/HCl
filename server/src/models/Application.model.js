const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
    date: { type: String, required: true },
    action: { type: String, required: true },
    actor: { type: String, required: true }
}, { _id: false });

const ApplicationSchema = new mongoose.Schema({
    applicationNumber: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    pan: { type: String, required: true, uppercase: true },
    annualIncome: { type: Number, required: true },
    address: { type: String, required: true },
    creditScore: { type: Number, required: true },

    // Status tracking as used in frontend
    limitStatus: {
        type: String,
        enum: ['Pending', 'Limit Set', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    finalStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },

    approvedLimit: { type: Number, default: 0 },
    cardName: { type: String },

    history: [HistorySchema]
}, { timestamps: true });

ApplicationSchema.index({ pan: 1 });
ApplicationSchema.index({ applicationNumber: 1 });

module.exports = mongoose.model('Application', ApplicationSchema);
