const mongoose = require('mongoose');
const crypto = require('crypto');
const { ObjectId } = require('mongodb');


const profitlosschema = new mongoose.Schema({
    Discount_Received: {
        type: Number,
        
    },
    Discount_allowed : {
        type : Number,
        
    },
    Profit_on_sale_of_asset : {
        type : Number,
        
    },
    Loss_on_sale_of_asset : {
        type : Number,

    },
    
    
}, {timestamp: true})


module.exports = mongoose.model('Profit&Loss', profitlosschema);
