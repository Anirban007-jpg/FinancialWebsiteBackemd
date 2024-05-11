const mongoose = require('mongoose');
const crypto = require('crypto');
const { ObjectId } = require('mongodb');


const creditorSchema = new mongoose.Schema({
    Creditor_name: {
        type: String,
        required: true
    },
    Creditor_adrress : {
        type : String,
        required: true
    },
    Creditor_contact_no : {
        type : String,
        required: true
    },
    Creditor_email : {
        type : String,
        required: true
    },
    Creditor_Balance : {
        type: Number
    }
    
    
}, {timestamp: true})


module.exports = mongoose.model('Creditor', creditorSchema);
