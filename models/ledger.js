const mongoose = require('mongoose');
const crypto = require('crypto');
const { ObjectId } = require('mongodb');


const ledgerSchema = new mongoose.Schema({
    Financial_Year: {
        type: String,
    },
    Assessment_Year: {
        type: String,
    },
    Account_Name: {
        type: String,
    },
    Debtors : [{
        type: ObjectId,
        ref : 'Debtor' 
    }],
    Creditors : [{
        type: ObjectId,
        ref : 'Creditor' 
    }],
    Account_Class : {
        type: String
    },
    Account_SubClass : {
        type: String
    },
    
    Type_of_Item: {
        type: String,
    },
    Rate_of_tax : {
        type: Number
    },
    Sub_Account_type : {
        type: String
    },
    Tax_Account_Type :{
        type: String
    },
    Head_Item_Type : {
        type:String
    },
    Opening_Balance :{
        type: Number
    },
    Balance : {
        type: Number
    },
    Account_Balance_Type: {
        type: String
    },
    created_on : {
        type: Date,
        default: Date.now()
    }
}, {timestamp: true})


module.exports = mongoose.model('Ledger', ledgerSchema);
