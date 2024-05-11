const express = require('express');
const { createDebtor, createLedger, updateDebtorAccount, test, createCreditor, updateCreditorAccount } = require('../controllers/ledger');
const {requireSignin} = require('../controllers/auth');
const router = express.Router();

// validators


router.post('/createLedger', createLedger);


// router.post('/test', test);
router.post('/createDebtor', createDebtor);
router.post('/createCreditor', createCreditor);
router.post('/updateCreditorAccoun', updateCreditorAccount);
router.put('/updateDebtorAccount', updateDebtorAccount);

module.exports = router;