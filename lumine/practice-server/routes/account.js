const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
const { DENOMINATIONS } = require('../models/Account');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.get('/denominations', async (req, res) => {
    try {
        const summary = await Account.aggregate([
            { $match: { status: 'active' } },
            {
                $group: {
                    _id: '$denomination',
                    totalStock: { $sum: '$stock' },
                    minPrice: { $min: '$price' },
                    maxWishes: { $max: '$wishes' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const result = DENOMINATIONS.map((d) => {
            const found = summary.find((s) => s._id === d);
            return {
                denomination: d,
                totalStock: found ? found.totalStock : 0,
                minPrice: found ? found.minPrice : null,
                maxWishes: found ? found.maxWishes : 0,
                count: found ? found.count : 0,
            };
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

router.get('/', async (req, res) => {
    try {
        const { server, denomination, minPrice, maxPrice, search, page = 1, limit = 12 } = req.query;

        const filter = { status: 'active' };

        if (server) filter.server = server;
        if (denomination) filter.denomination = Number(denomination);
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }

        const skip = (Number(page) - 1) * Number(limit);
        const total = await Account.countDocuments(filter);
        const accounts = await Account.find(filter)
            .sort({ denomination: 1, createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .select('-__v');

        res.json({
            accounts,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const account = await Account.findById(req.params.id).select('-__v');
        if (!account) {
            return res.status(404).json({ message: 'Account not found.' });
        }
        res.json(account);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({ message: 'Account not found.' });
        }
        res.status(500).json({ message: 'Server error.' });
    }
});

router.post('/:id/buy', auth, async (req, res) => {
    try {
        const account = await Account.findById(req.params.id);
        if (!account || account.status !== 'active') {
            return res.status(404).json({ message: 'Account not found or inactive' });
        }

        if (account.credentials.length === 0) {
            return res.status(400).json({ message: 'Out of stock' });
        }

        if (req.user.balance < account.price) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        req.user.balance -= account.price;

        const cred = account.credentials.shift();
        account.stock = account.credentials.length;

        const [login, ...passParts] = cred.split(':');
        const pass = passParts.join(':');

        const purchaseRecord = {
            title: account.title,
            login: login || 'Unknown',
            pass: pass || 'Unknown',
            price: account.price,
            date: new Date()
        };

        req.user.purchases.push(purchaseRecord);

        await account.save();
        await req.user.save();

        res.json({ message: 'Purchase successful', purchase: purchaseRecord, balance: req.user.balance });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

router.post('/', auth, isAdmin, async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.credentials) {
            data.stock = data.credentials.length;
        }
        const account = await Account.create(data);
        res.status(201).json(account);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ message: messages[0] });
        }
        res.status(500).json({ message: 'Server error.' });
    }
});

router.put('/:id', auth, isAdmin, async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.credentials) {
            data.stock = data.credentials.length;
        }
        const account = await Account.findByIdAndUpdate(req.params.id, data, {
            new: true,
            runValidators: true,
        });
        if (!account) {
            return res.status(404).json({ message: 'Account not found.' });
        }
        res.json(account);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ message: messages[0] });
        }
        res.status(500).json({ message: 'Server error.' });
    }
});

router.delete('/:id', auth, isAdmin, async (req, res) => {
    try {
        const account = await Account.findByIdAndDelete(req.params.id);
        if (!account) {
            return res.status(404).json({ message: 'Account not found.' });
        }
        res.json({ message: 'Account deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

router.patch('/:id/status', auth, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['active', 'sold', 'hidden'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value.' });
        }
        const account = await Account.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!account) {
            return res.status(404).json({ message: 'Account not found.' });
        }
        res.json(account);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

router.patch('/:id/stock', auth, isAdmin, async (req, res) => {
    try {
        const { stock } = req.body;
        if (typeof stock !== 'number' || stock < 0) {
            return res.status(400).json({ message: 'Invalid stock value.' });
        }
        const account = await Account.findByIdAndUpdate(
            req.params.id,
            { stock },
            { new: true }
        );
        if (!account) {
            return res.status(404).json({ message: 'Account not found.' });
        }
        res.json(account);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
