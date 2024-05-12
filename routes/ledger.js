const express = require('express');
const { createDebtor, createLedger, updateDebtorAccount, test, createCreditor, updateCreditorAccount } = require('../controllers/ledger');
const {requireSignin, IndividualMiddleware, CompanyMiddleware} = require('../controllers/auth');
const router = express.Router();

// validators


router.post('/createLedger', requireSignin,IndividualMiddleware, createLedger);
router.post('/createLedgerforCompanyUser', requireSignin,CompanyMiddleware, createLedger);


// router.post('/test', test);
router.post('/createDebtor', createDebtor);
router.post('/createCreditor', createCreditor);
router.post('/updateCreditorAccoun', updateCreditorAccount);
router.put('/updateDebtorAccount', updateDebtorAccount);

module.exports = router;