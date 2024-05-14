const express = require('express');
const { createDebtor, createLedger, updateDebtorAccount, test, createCreditor, updateCreditorAccount } = require('../controllers/ledger');
const {requireSignin, IndividualMiddleware, CompanyMiddleware} = require('../controllers/auth');
const router = express.Router();

// validators


router.post('/createLedger', requireSignin,IndividualMiddleware, createLedger);
router.post('/createLedgerforCompanyUser', requireSignin,CompanyMiddleware, createLedger);


// router.post('/test', test);
router.post('/createDebtor', requireSignin,IndividualMiddleware,createDebtor);
router.post('/createCreditor', requireSignin,IndividualMiddleware,createCreditor);
router.post('/updateCreditorAccount', requireSignin,IndividualMiddleware,updateCreditorAccount);
router.put('/updateDebtorAccount', requireSignin,IndividualMiddleware,updateDebtorAccount);

module.exports = router;