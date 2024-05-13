const { Mongoose } = require("mongoose");
const Debtor = require("../models/debtor");
const Ledger = require("../models/ledger");
const Creditor = require("../models/creditor");
const _ = require('lodash');
const math = require("mathjs");


exports.createDebtor = (req, res) => {

    const { Debtor_name, Debtor_address, Debtor_contact_no, Debtor_email, Debtor_balance } = req.body;

    let newDebtor = new Debtor({ Debtor_name, Debtor_address, Debtor_contact_no, Debtor_email, Debtor_balance });


    newDebtor.save((err, success) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }


        Ledger.findOneAndUpdate({ Account_Name: 'Debtor A/C' }, { $push: { Debtors: success._id } }, { upsert: true }).exec((err, success) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }

            res.status(200).json({
                message: `Your Debtor is created`
            })
        });



    })
}

exports.createLedger = (req, res) => {

    Ledger.findOne({ Account_Name: req.body.Account_Name }).exec((err, ledger) => {
        if (ledger) {
            return res.status(400).json({
                error: "Ledger already exsist"
            })
        }

        const { Financial_Year, Assessment_Year, Account_Name, Type_of_Item, Rate_of_tax,Account_Group, Head_Item_Group, Account_Balance_Type,Tax_Account_Type,Account_Class,Currency, Opening_Balance, Account_SubClass } = req.body;

        let Balance = Opening_Balance;
        let newledger = new Ledger({ Financial_Year, Assessment_Year, Account_Name, Rate_of_tax,Type_of_Item, Account_Group, Head_Item_Group,Tax_Account_Type, Currency,Account_Class,Opening_Balance, Balance: Balance, Account_SubClass, Account_Balance_Type });

        newledger.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }


            return res.status(200).json({
                message: `Your ${result.Account_Name} is created`
            })
        })
    })
}


exports.updateDebtorAccount = (req, res) => {

    const { Account_Name } = req.body;
    Ledger.findOne({ Account_Name: Account_Name })
        .populate('Debtors', '_id Debtor_name Debtor_address Debtor_contact_no Debtor_email Debtor_balance').exec((err, data) => {
            // console.log(data);
            var sumofDebtorRealBalance = 0.00;
            for (let i = 0; i < data.Debtors.length; i++) {
                // console.log(data.Debtors[i]);
                var sumofDebtorsBalance = parseFloat(data.Debtors[i].Debtor_balance).toFixed(2);
                sumofDebtorRealBalance = math.sum(sumofDebtorsBalance, sumofDebtorRealBalance);
                console.log(sumofDebtorRealBalance);
            }
            Ledger.findOne({ Account_Name: Account_Name }).exec((err, ledger) => {
                console.log(ledger);
                let new_balance = math.round(sumofDebtorRealBalance, 0);
                const updatedFields = {
                    Opening_Balance: new_balance,
                    Balance: new_balance
                }
                ledger = _.extend(ledger, updatedFields);
                ledger.save((err, success) => {
                    if (err) {
                        return res.status(400).json({
                            error: err
                        })
                    }
                    else if (success) {
                        res.status(200).json({
                            message: "data updated"
                        });
                        // console.log(success);
                    }
                })
            })
        })
}

exports.createCreditor = (req, res) => {

    const { Creditor_name, Creditor_address, Creditor_contact_no, Creditor_email, Creditor_Balance } = req.body;

    let newCreditor = new Creditor({ Creditor_name, Creditor_address, Creditor_contact_no, Creditor_email, Creditor_Balance });


    newCreditor.save((err, success) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }


        Ledger.findOneAndUpdate({ Account_Name: 'Creditor A/C' }, { $push: { Creditors: success._id } }, { new: true, upsert: false }).exec((err, success) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }

            res.status(200).json({
                message: `Your Creditor is created`
            })
        });
    })
}


exports.updateCreditorAccount = (req, res) => {

    const { Account_Name } = req.body;
    Ledger.findOne({ Account_Name: Account_Name })
        .populate('Creditors', '_id Creditor_name Creditor_address Creditor_contact_no Creditor_email Creditor_Balance').exec((err, data) => {
            // console.log(data);
            var sumofCreditorRealBalance = 0.00;
            for (let i = 0; i < data.Creditors.length; i++) {
                // console.log(data.Creditors[i]);
                var sumofCreditorsBalance = parseFloat(data.Creditors[i].Creditor_Balance).toFixed(2);
                sumofCreditorRealBalance = math.sum(sumofCreditorsBalance, sumofCreditorRealBalance);
            }
            Ledger.findOne({ Account_Name: Account_Name }).exec((err, ledger) => {
                console.log(ledger);
                let new_balance = math.round(sumofCreditorRealBalance, 0);
                const updatedFields = {
                    Opening_Balance: new_balance,
                    Balance: new_balance
                }
                ledger = _.extend(ledger, updatedFields);
                ledger.save((err, success) => {
                    if (err) {
                        return res.status(400).json({
                            error: err
                        })
                    }
                    else if (success) {
                        res.status(200).json({
                            message: "data updated"
                        });
                    }
                })
            })
        })
}

