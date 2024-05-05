const express = require('express');
const router = express.Router();
const { companysignup, individualsignup } = require('../controllers/auth');
const { companySignupValidator, individualSignupValidator } = require('../validators/auth');
const { runValidation } = require('../validators');


router.post('/register', companySignupValidator, runValidation,companysignup);
router.post('/registerasindividual', individualSignupValidator, runValidation,individualsignup);
// router.post('/login', companySigninValidator, runValidation, login);
// router.post('/signout', signout);
// router.post('/google-login',googleLogin)
// router.put('/forgot-password', companyForgotPasswordValidator, runValidation, forgotPasword);
// router.put('/reset-password',resetPasswordValidator, runValidation, ResetPassword);
// router.get('/get-all-companies',getALlCompmanies);
// router.get('/secret', validateTokenMiddleware, companyMiddleware, (req,res) => {
//     res.json("reached endpoint")
// });

module.exports = router;