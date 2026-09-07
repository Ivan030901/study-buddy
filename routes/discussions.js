const express = require('express');
const router = express.Router();
const Discussion = require('../models/Discussion');
const auth = require('../middleware/auth');

// Get all discussions
router.get('/', async (req, res) => {
    try {
        const discussions = await Discussion.find()
            .populate('userId', 'name email')
            .populate('replies.userId', 'name email')
            .sort({ createdAt: -1 });
        res.json(discussions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new discussion
router.post('/', auth, async (req, res) => {
    try {
        const { title, content } = req.body;
        
        const discussion = new Discussion({
            userId: req.userId,
            title,
            content,
            replies: []
        });

        await discussion.save();
        await discussion.populate('userId', 'name email');
        
        res.status(201).json(discussion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get a single discussion
router.get('/:id', async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.params.id)
            .populate('userId', 'name email')
            .populate('replies.userId', 'name email');
        
        if (!discussion) {
            return res.status(404).json({ message: 'Discussion not found' });
        }

        res.json(discussion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a reply to a discussion
router.post('/:id/reply', auth, async (req, res) => {
    try {
        const { content } = req.body;
        const discussion = await Discussion.findById(req.params.id);
        
        if (!discussion) {
            return res.status(404).json({ message: 'Discussion not found' });
        }

        const reply = {
            userId: req.userId,
            content
        };

        discussion.replies.push(reply);
        await discussion.save();
        await discussion.populate('userId', 'name email');
        await discussion.populate('replies.userId', 'name email');
        
        res.status(201).json(discussion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a discussion
router.delete('/:id', auth, async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.params.id);
        
        if (!discussion) {
            return res.status(404).json({ message: 'Discussion not found' });
        }

        if (discussion.userId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Discussion.findByIdAndDelete(req.params.id);
        res.json({ message: 'Discussion deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
