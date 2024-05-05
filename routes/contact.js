const express = require('express');
const router = express.Router();

// validators
const { runValidation } = require('../validators');
const { contactFormValidator } = require('../validators/form');
const { contactForm } = require('../controllers/form');

router.post('/contact', contactFormValidator, runValidation, contactForm);

module.exports = router;