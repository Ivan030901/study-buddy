const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const auth = require('../middleware/auth');

// Get all plans for a user
router.get('/', auth, async (req, res) => {
    try {
        const plans = await Plan.find({ userId: req.userId });
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new plan
router.post('/', auth, async (req, res) => {
    try {
        const { name, description, dueDate, priority } = req.body;
        
        const plan = new Plan({
            userId: req.userId,
            name,
            description,
            dueDate,
            priority
        });

        await plan.save();
        res.status(201).json(plan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a plan
router.put('/:id', auth, async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);
        
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        if (plan.userId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        Object.assign(plan, req.body);
        plan.updatedAt = Date.now();
        
        await plan.save();
        res.json(plan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a plan
router.delete('/:id', auth, async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);
        
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        if (plan.userId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Plan.findByIdAndDelete(req.params.id);
        res.json({ message: 'Plan deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
