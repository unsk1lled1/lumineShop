const mongoose = require('mongoose');

const DENOMINATIONS = [6000, 6400, 33500, 47000, 55000, 60000];

const accountSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        denomination: {
            type: Number,
            required: [true, 'Denomination is required'],
            enum: {
                values: DENOMINATIONS,
                message: 'Invalid denomination value',
            },
        },
        wishes: {
            type: Number,
            default: 0,
            min: 0,
        },
        primogems: {
            type: Number,
            required: [true, 'Primogems count is required'],
            min: 0,
        },

        server: {
            type: String,
            enum: ['Asia', 'Europe', 'America', 'TW/HK/MO'],
            required: [true, 'Server is required'],
        },
        stock: {
            type: Number,
            default: 0,
        },
        credentials: {
            type: [String],
            default: [],
        },
        description: {
            type: String,
            default: '',
        },
        images: {
            type: [String],
            default: [],
        },

        status: {
            type: String,
            enum: ['active', 'sold', 'hidden'],
            default: 'active',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Account', accountSchema);
module.exports.DENOMINATIONS = DENOMINATIONS;
