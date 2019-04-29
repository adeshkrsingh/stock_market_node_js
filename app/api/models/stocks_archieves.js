const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const StocksArchievesSchema = new Schema({
    date: {
        type: Date,
        required: true,
    },
    symbol: {
        type: String,
        trim: true,
        required: true,
    },
    open: {
        type: Number,
        required: true,
    },
    close: {
        type: Number,
        required: true,
    },
    low: {
        type: Number,
        required: true,
    },
    high: {
        type: Number,
        required: true,
    },
    volume: {
        type: Number,
        required: true,
    },
    deleted_at: { type: String, default: null },
    updated_at: { type: Date, default: Date.now }
});
module.exports = mongoose.model('stocks_archieves', StocksArchievesSchema)
