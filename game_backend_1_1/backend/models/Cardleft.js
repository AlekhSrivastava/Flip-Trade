const mongoose = require('mongoose');

const cardLeftSchema = new mongoose.Schema({
    name: {
        type: 'string',
        default: 'cardsleft'
    },
    cardLeft: {
        type: Number,
        default: 0
    }
});

mongoose.model('Cardleft', cardLeftSchema);
