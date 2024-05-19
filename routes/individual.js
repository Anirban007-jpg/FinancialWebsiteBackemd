const express = require('express');
const { requireSignin, IndividualMiddleware, updateUserProfile, photo, read } = require('../controllers/auth');
const router = express.Router();



router.put('/updateIndividualProfile', requireSignin, IndividualMiddleware,updateUserProfile);
router.get('/photo/:_id', photo);
router.get('/individual/profile', requireSignin, IndividualMiddleware, read);

module.exports = router;