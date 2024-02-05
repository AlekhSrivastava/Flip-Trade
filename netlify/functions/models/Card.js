const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
    value: {
        type: Number,
        default: 0
    },
    state: {
        type: Boolean,
        default: true
    }
});

mongoose.model('Card', cardSchema);