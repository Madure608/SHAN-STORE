const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

router.get('/', async (req, res) => {
    try {
        const alerts = await Alert.find({ status: 'active' }).sort({ createdAt: -1 });
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id/resolve', async (req, res) => {
    try {
        const alert = await Alert.findByIdAndUpdate(
            req.params.id,
            { status: 'resolved' },
            { new: true }
        );
        res.json(alert);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;