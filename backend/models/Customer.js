const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, trim: true, lowercase: true },
    address: { type: String, trim: true },
    totalPurchases: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', customerSchema);