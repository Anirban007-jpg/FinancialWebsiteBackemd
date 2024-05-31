const formidable = require("formidable");
const journal = require("../models/journal");
const math = require("mathjs");
const ledger = require("../models/ledger");
const debtor = require("../models/debtor");
const creditor = require("../models/creditor");

exports.stimulateJournal = async (req, res) => {


    var { Debit_item, Debit_Item_balance, Debtor_name, Creditor_name, Credit_item, Document_id, Credit_Item_balance, Narration, Financial_Year, Assessment_Year, Document_Date, Posting_Date, Document_No, Document_Header, Debit_Item_Currency, Credit_Item_Currency } = req.body

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < charactersLength; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    var Document_No = result;

    if (Debit_item === "Purchase A/C") {
        var number4 = math.divide(parseFloat(req.body.Discount_Received).toFixed(3), 100);
        var Discount_Received_Percentage = math.round(number4, 3);
        var number5 = math.multiply(Discount_Received_Percentage, Debit_Item_balance);
        var Discount_Received_Balance = math.round(number5, 0);
        var Discount_Received_Balance_Type = "Cr"
        var Credit_Item_balance = math.subtract(Credit_Item_balance, Discount_Received_Balance);

        var numval = math.sum(Credit_Item_balance, Discount_Received_Balance)
        if (Debit_Item_balance !== numval) {
            return res.status(400).json({
                error: "Debit and credit must be equal"
            })
        }
    }


    if (Credit_item === "Sale A/C") {
        var number6 = math.divide(parseFloat(req.body.Discount_Allowed).toFixed(3), 100);
        var Discount_Allowed_Percentage = math.round(number6, 3);
        var number7 = math.multiply(Discount_Allowed_Percentage, Credit_Item_balance);
        var Discount_Allowed_Balance = math.round(number7, 0);
        var Discount_Allowed_Balance_Type = "Dr"
        var Debit_Item_balance = math.subtract(Debit_Item_balance, Discount_Allowed_Balance);

        // console.log();
    }




    // var numvalerorcheck = math.sum(Debit_Item_balance,Loss_on_Sale_of_Asset_Balance);
    // var numvalerorcheck1 = math.sum(Credit_Item_balance,Profit_on_Sale_of_Asset_Balance);

    // if (Credit_item !== "Plant"){
    //     if (numvalerorcheck !== Credit_Item_balance) {
    //         return res.status(400).json({
    //             error: "Debit and credit must be equal"
    //         })
    //     }else if (Debit_Item_balance !== numvalerorcheck1){
    //         return res.status(400).json({
    //             error: "Debit and credit must be equal"
    //         })
    //     }

    // }


    if (Credit_item === 'Debtor A/C') {
        let debtordata = await debtor.findOne({ Debtor_name });
        // console.log(debtordata);
        var Credit_item = debtordata.Debtor_name;
        var numberval4 = math.divide(parseFloat(req.body.Discount_Allowed_on_debtors).toFixed(3), 100);
        var Discount_Allowed_on_Debtors_percentage = math.round(numberval4, 3);
        var numberval5 = math.multiply(Discount_Allowed_on_Debtors_percentage, Debit_Item_balance);
        var Discount_Allowed_on_Debtors_Balance = math.round(numberval5, 0);
        var Discount_Allwoed_on_Debtors_Balance_Type = "Dr"
        var Debit_Item_balance = math.subtract(Debit_Item_balance, Discount_Allowed_on_Debtors_Balance);
    }

    if (Debit_item === 'Creditor A/C') {
        let creditordata = await creditor.findOne({ Creditor_name });
        // console.log(debtordata);
        var Credit_item = creditordata.Creditor_name;
        var numberval40 = math.divide(parseFloat(req.body.Discount_Received_on_creditors).toFixed(3), 100);
        var Discount_Received_on_Creditors_percentage = math.round(numberval40, 3);
        var numberval50 = math.multiply(Discount_Received_on_Creditors_percentage, Credit_Item_balance);
        var Discount_Received_on_Creditors_Balance = math.round(numberval50, 0);
        var Discount_Received_on_Creditors_Balance_Type = "Cr"
        var Credit_Item_balance = math.subtract(Credit_Item_balance, Discount_Received_on_Creditors_Balance);
    }



    if (Credit_item === 'Land' || Credit_item === 'Machinery & Equipment' || Credit_item === 'Buildings' || Credit_item === 'Furniture & Fixtures' || Credit_item === 'Leasehold Improvements') {
        if (Debit_Item_balance > Credit_Item_balance) {
            var Profit_on_Sale_of_Asset_Balance = math.subtract(Debit_Item_balance, Credit_Item_balance);
            var Profit_on_Sale_of_Asset_Balance_Type = "Cr";
        } else if (Debit_Item_balance < Credit_Item_balance) {
            var Loss_on_Sale_of_Asset_Balance = math.subtract(Credit_Item_balance, Debit_Item_balance);
            var Loss_on_Sale_of_Asset_Balance_Type = "Dr";
        }
    }



    return res.status(200).json({
        Debit_item, Debit_Item_balance, Credit_item, Credit_Item_balance, Discount_Received_on_Creditors_Balance, Discount_Received_on_Creditors_Balance_Type, Discount_Allowed_on_Debtors_Balance, Discount_Allwoed_on_Debtors_Balance_Type, Narration, Financial_Year, Document_id, Assessment_Year, Document_Date, Posting_Date, Document_No, Document_Header, Debit_Item_Currency, Credit_Item_Currency, Discount_Received_Balance, Discount_Received_Balance_Type, Discount_Allowed_Balance, Discount_Allowed_Balance_Type, Profit_on_Sale_of_Asset_Balance, Profit_on_Sale_of_Asset_Balance_Type, Loss_on_Sale_of_Asset_Balance, Loss_on_Sale_of_Asset_Balance_Type
    })
}
