const express = require('express');
const router = express.Router();
const CreditCard = require('../models/CreditCard');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/cards
// @desc    Get all credit cards
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
    try {
        const cards = await CreditCard.find();
        res.json(cards);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/cards/:id
// @desc    Get card by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const card = await CreditCard.findById(req.params.id);
        if (!card) return res.status(404).json({ msg: 'Card not found' });
        res.json(card);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
