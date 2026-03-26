const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: String,
    type: { type: String, enum: ['low_stock', 'expiring_soon', 'expired'], required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['active', 'resolved'], default: 'active' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', alertSchema);