const mongoose = require('mongoose');
const crypto = require('crypto');
const { ObjectId } = require('mongodb');


const creditorSchema = new mongoose.Schema({
    Creditor_name: {
        type: String,
    },
    Creditor_adrress : {
        type : String,
    },
    Creditor_contact_no : {
        type : String,
    },
    Creditor_email : {
        type : String,
    },
    Creditor_Balance : {
        type: Number
    },
    Creditor_Currency : {
        type: String
    }
    
    
}, {timestamp: true})


module.exports = mongoose.model('Creditor', creditorSchema);
