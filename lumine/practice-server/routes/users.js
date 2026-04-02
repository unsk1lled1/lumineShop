const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.get('/', auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password -__v').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

router.delete('/:id', auth, isAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json({ message: 'User deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

router.post('/add-balance', auth, async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        req.user.balance += Number(amount);
        await req.user.save();

        res.json({ balance: req.user.balance, message: `Balance updated` });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
