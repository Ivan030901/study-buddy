const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const auth = require('../middleware/auth');

// Get all progress posts
router.get('/', async (req, res) => {
    try {
        const progress = await Progress.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a progress post
router.post('/', auth, async (req, res) => {
    try {
        const { content } = req.body;
        
        const progress = new Progress({
            userId: req.userId,
            content
        });

        await progress.save();
        await progress.populate('userId', 'name email');
        
        res.status(201).json(progress);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a progress post
router.delete('/:id', auth, async (req, res) => {
    try {
        const progress = await Progress.findById(req.params.id);
        
        if (!progress) {
            return res.status(404).json({ message: 'Progress post not found' });
        }

        if (progress.userId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Progress.findByIdAndDelete(req.params.id);
        res.json({ message: 'Progress post deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
