const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');

router.get('/daily', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const sales = await Sale.find({
            saleDate: { $gte: today, $lt: tomorrow }
        }).populate('customer', 'name');
        
        const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
        
        res.json({
            sales,
            totalSales,
            count: sales.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { items, customer, paymentMethod, discount, tax } = req.body;
        const invoiceNumber = `INV-${Date.now()}`;
        
        let subtotal = 0;
        const saleItems = [];
        
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) throw new Error(`Product not found`);
            
            if (product.quantity < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name}`);
            }
            
            const total = product.sellingPrice * item.quantity;
            subtotal += total;
            
            saleItems.push({
                product: product._id,
                productName: product.name,
                quantity: item.quantity,
                price: product.sellingPrice,
                total: total
            });
            
            product.quantity -= item.quantity;
            await product.save();
        }
        
        const total = subtotal - (discount || 0) + (tax || 0);
        
        const sale = new Sale({
            invoiceNumber,
            customer: customer || null,
            items: saleItems,
            subtotal,
            discount: discount || 0,
            tax: tax || 0,
            total,
            paymentMethod
        });
        
        await sale.save();
        res.status(201).json(sale);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;