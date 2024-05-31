const express = require('express');
const { requireSignin, IndividualMiddleware } = require('../controllers/auth');
const {  stimulateJournal } = require('../controllers/journal');
const router = express.Router();

router.post('/stimulatejournal',  requireSignin, IndividualMiddleware, stimulateJournal);

module.exports = router;