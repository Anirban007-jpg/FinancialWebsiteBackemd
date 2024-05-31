const mongoose = require('mongoose');
const crypto = require('crypto');


const journalSchema = new mongoose.Schema({
    Financial_Year: {
        type: String,
    },
    Assessment_Year: {
        type: String,
    },
    Document_Date: {
        type: String,
    },
    Posting_Date: {
        type: String
    },
    Document_No: {
        type: String
    },
    Document_Header: {
        type: String,
    },
    Document_id : {
        type: String
    },
    Debit_item : {
        type: String
    },
    Debit_Item_balance : {
        type: Number
    },
    Debit_Item_Currency : {
        type: String
    },
    Debit_Item_Balance_Type : {
        type: String
    },
    Credit_item : {
        type: String
    },
    Credit_Item_balance : {
        type: Number
    },
    Credit_Item_Currency : {
        type: String
    },
    Credit_Item_Balance_Type : {
        type: String
    },
    Narration : {
        type: String
    }
}, { timestamp: true })


module.exports = mongoose.model('Journal', journalSchema);
