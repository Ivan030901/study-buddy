const express = require('express');
const router = express.Router();
const Tracking = require('../models/Tracking');
const auth = require('../middleware/auth');

// Get tracking data for a user
router.get('/', auth, async (req, res) => {
    try {
        const tracking = await Tracking.find({ userId: req.userId }).sort({ date: -1 });
        res.json(tracking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add tracking record
router.post('/', auth, async (req, res) => {
    try {
        const { date, pagesRead, timeSpent } = req.body;
        
        const tracking = new Tracking({
            userId: req.userId,
            date: date || new Date(),
            pagesRead: pagesRead || 0,
            timeSpent: timeSpent || 0
        });

        await tracking.save();
        res.status(201).json(tracking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update tracking record
router.put('/:id', auth, async (req, res) => {
    try {
        const tracking = await Tracking.findById(req.params.id);
        
        if (!tracking) {
            return res.status(404).json({ message: 'Tracking record not found' });
        }

        if (tracking.userId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        Object.assign(tracking, req.body);
        await tracking.save();
        res.json(tracking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete tracking record
router.delete('/:id', auth, async (req, res) => {
    try {
        const tracking = await Tracking.findById(req.params.id);
        
        if (!tracking) {
            return res.status(404).json({ message: 'Tracking record not found' });
        }

        if (tracking.userId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Tracking.findByIdAndDelete(req.params.id);
        res.json({ message: 'Tracking record deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
