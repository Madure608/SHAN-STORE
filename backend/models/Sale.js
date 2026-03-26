const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    invoiceNumber: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        productName: String,
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        total: { type: Number, required: true }
    }],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['Cash', 'Card', 'UPI', 'Credit'], required: true },
    saleDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sale', saleSchema);