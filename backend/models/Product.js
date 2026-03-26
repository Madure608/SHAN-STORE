const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ['Groceries', 'Beverages', 'Snacks', 'Dairy', 'Fresh Produce', 'Other'] },
    quantity: { type: Number, required: true, min: 0 },
    buyingPrice: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    expireDate: { type: Date, required: true },
    supplier: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now }
});

productSchema.virtual('profit').get(function() {
    return (this.sellingPrice - this.buyingPrice) * this.quantity;
});

module.exports = mongoose.model('Product', productSchema);