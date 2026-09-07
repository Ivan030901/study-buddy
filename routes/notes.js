const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const auth = require('../middleware/auth');

// Get all notes for a user
router.get('/', auth, async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.userId });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new note
router.post('/', auth, async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        
        const note = new Note({
            userId: req.userId,
            title,
            content,
            tags: tags || []
        });

        await note.save();
        res.status(201).json(note);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get a single note
router.get('/:id', auth, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        if (note.userId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a note
router.put('/:id', auth, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        if (note.userId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        Object.assign(note, req.body);
        note.updatedAt = Date.now();
        
        await note.save();
        res.json(note);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a note
router.delete('/:id', auth, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        if (note.userId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Note.findByIdAndDelete(req.params.id);
        res.json({ message: 'Note deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
