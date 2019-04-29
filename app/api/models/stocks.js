const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const StocksSchema = new Schema({
    Symbol: {
        type: String,
        trim: true,
        required: true,
    },
    Name: {
        type: String,
        trim: true,
        required: true,
    },
    MarketCap: {
        type: Number,
        required: true,
    },
    Sector: {
        type: String,
        trim: true,
        required: true,
    },
    Industry: {
        type: String,
        trim: true,
        required: true,
    },
    deleted_at: { type: String, default: null },
    updated_at: { type: Date, default: Date.now }
});
module.exports = mongoose.model('stocks', StocksSchema)