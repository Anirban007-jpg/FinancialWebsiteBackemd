const express = require('express');
const router = express.Router();
const { companysignup, individualsignup, forgotPasword } = require('../controllers/auth');
const { companySignupValidator, individualSignupValidator, companyForgotPasswordValidator } = require('../validators/auth');
const { runValidation } = require('../validators');


router.post('/register', companySignupValidator, runValidation,companysignup);
router.post('/registerasindividual', individualSignupValidator, runValidation,individualsignup);
// router.post('/login', companySigninValidator, runValidation, login);
// router.post('/signout', signout);
// router.post('/google-login',googleLogin)
router.put('/forgotpassword', companyForgotPasswordValidator, runValidation, forgotPasword);
// router.put('/reset-password',resetPasswordValidator, runValidation, ResetPassword);
// router.get('/get-all-companies',getALlCompmanies);
// router.get('/secret', validateTokenMiddleware, companyMiddleware, (req,res) => {
//     res.json("reached endpoint")
// });

module.exports = router;