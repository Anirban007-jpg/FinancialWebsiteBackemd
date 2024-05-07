const express = require('express');
const router = express.Router();
const { companysignup, individualsignup, forgotPasword, forgotPaswordforCompany, ResetPassword, login, companylogin } = require('../controllers/auth');
const { companySignupValidator, individualSignupValidator, companyForgotPasswordValidator, companyUsersForgotPasswordValidator, resetPasswordValidator, individualSigninValidator, companySigninValidator } = require('../validators/auth');
const { runValidation } = require('../validators');


router.post('/register', companySignupValidator, runValidation,companysignup);
router.post('/registerasindividual', individualSignupValidator, runValidation,individualsignup);
router.post('/login', individualSigninValidator,runValidation, login);
router.post('/companylogin', companySigninValidator, runValidation, companylogin);
// router.post('/signout', signout);
// router.post('/google-login',googleLogin)
router.put('/forgotpassword', companyForgotPasswordValidator, runValidation, forgotPasword);
router.put('/forgotpasswordforCompany', companyUsersForgotPasswordValidator, runValidation, forgotPaswordforCompany);
router.put('/reset-password',resetPasswordValidator, runValidation, ResetPassword);
// router.get('/get-all-companies',getALlCompmanies);
// router.get('/secret', validateTokenMiddleware, companyMiddleware, (req,res) => {
//     res.json("reached endpoint")
// });

module.exports = router;