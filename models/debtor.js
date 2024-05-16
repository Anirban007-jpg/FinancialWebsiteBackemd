const mongoose = require('mongoose');
const crypto = require('crypto');
const { ObjectId } = require('mongodb');


const debtorSchema = new mongoose.Schema({
    Debtor_name: {
        type: String
    },
    Debtor_adrress : {
        type : String,
    },
    Debtor_contact_no : {
        type : String,
    },
    Debtor_email : {
        type : String,
    },
    Debtor_balance : {
        type: Number
    },
    Debtor_Currency : {
        type: String
    }
    
}, {timestamp: true})


module.exports = mongoose.model('Debtor', debtorSchema);
