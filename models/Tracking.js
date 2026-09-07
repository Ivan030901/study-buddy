const mongoose = require('mongoose');

const trackingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    pagesRead: {
        type: Number,
        default: 0
    },
    timeSpent: {
        type: Number,
        default: 0,
        description: 'Time spent in minutes'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Tracking', trackingSchema);
