const Company = require('../models/company');
const Individual = require("../models/individual");
const fo = require('formidable');
const fs = require('fs');
// const sid = require('shortid');
const jwt = require('jsonwebtoken');
const { expressjwt: ejwt } = require('express-jwt');
const sgMail = require('@sendgrid/mail'); // SENDGRID_API_KEY
const nm = require('nodemailer');
require('dotenv').config()
const _ = require('lodash');
const bcrypt = require('bcrypt');

const { OAuth2Client } = require('google-auth-library');
const formidable = require('formidable');



exports.companysignup = (req, res) => {

       Company.findOne({TAN_No: req.body.TAN_No}).exec((err,company) => {
            if (company){
                return res.status(400).json({
                    error: "Company already exsists"
                })
            }
        
            const {Company_Name,TAN_No,Company_email,Company_address,Company_contact_no,password,confirmedPassword,role} = req.body;
            let gs = Company_Name.replace(/[a-z]/g, '');
            let Initials= gs.replace(/\s+/g, '');
            let profile = `${process.env.CLIENT_URL}/Company/profile/${Initials}`;
            
            if (confirmedPassword === null){
                return res.status(403).json({
                    error: "Confirm your password"
                })
            }
        
            if (password !== confirmedPassword){
                return res.status(403).json({
                    error: "Password do not match"
                })
            }
    
            var password1 = bcrypt.hashSync(password,10);
            let Acknowledgement_No = _.times(15, () => _.random(35).toString(36)).join('').toUpperCase()
    
            let newCompany = new Company({Company_Name,TAN_No,Company_email,Company_address,Company_contact_no,Initials,role,password:password1,profile,Acknowledgement_No});
            
           
            newCompany.save((err, success) => {
                if (err){
                    return res.status(400).json({
                        error: err
                    })
                }
                else if(success){
                    res.status(200).json({
                        message: `Your Company has been registered successfully! Your Acknowlegement No is ${Acknowledgement_No}`
                    })
                }
            })
        })
}
  

exports.individualsignup = (req, res) => {

        Individual.findOne({PAN_No: req.body.PAN_No}).exec((err,individual) => {
             if (individual){
                 return res.status(400).json({
                     error: "User already exsists"
                 })
             }
         
             const {Name,PAN_No,Email,Address,Contact_no,password,confirmedPassword,role} = req.body;
             
             let gs = Name.replace(/[a-z]/g, '');
             let Initials= gs.replace(/\s+/g, '');
             let profile = `${process.env.CLIENT_URL}/Individual/profile/${Initials}`;
             
             if (confirmedPassword === null){
                 return res.status(403).json({
                     error: "Confirm your password"
                 })
             }
         
             if (password !== confirmedPassword){
                 return res.status(403).json({
                     error: "Password do not match"
                 })
             }
     
             var password1 = bcrypt.hashSync(password,10);
             let Acknowledgement_No = _.times(15, () => _.random(35).toString(36)).join('').toUpperCase()
     
             let newindividual = new Individual({Name,PAN_No,Email,Address,Contact_no,Initials,role,password:password1,profile,Acknowledgement_No});
             
            
             newindividual.save((err, success) => {
                 if (err){
                     return res.status(400).json({
                         error: err
                     })
                 }
                 else if(success){
                     res.status(200).json({
                         message: `Your Account has been registered successfully! Your Acknowlegement No is ${Acknowledgement_No}`
                     })
                 }
             })
         })
}

exports.forgotPasword = (req,res) => {


    Individual.findOne({ Email : req.body.Email } , (err, individual) => {
            if (err || !individual) {
                return res.status(401).json({
                    error: 'User with that email does not exist'
                });
            }
      
            const token = jwt.sign({ _id: individual._id }, process.env.JWT_RESET_PASSWORD, { expiresIn: '10m' });
            console.log(individual);
      
            let transporter = nm.createTransport({
              host: "smtp.gmail.com",
              port: 465,
              auth: {
                  user: 'financia2926@gmail.com',
                  pass: 'rqmd mkqm tphc kjme',
              },
              secure: true
          
              })
            // email
            
            const mailOptions = {
                from: 
                {
                  name: 'FINANCIA',
                  address : 'financia2926@gmail.com',
                },
                to: individual.Email,
                subject: 'Email to reset password',
                html: `
                <p>Please use the following link to reset your password:</p> +
                <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>https://seoblog.com</p>
              };
              `
            };
            // populating the db > user > resetPasswordLink
            return individual.updateOne({ resetPasswordLink: token }, (err, success) => {
                if (err) {
                    return res.json({ error: err });
                } else {
                  transporter.sendMail(mailOptions, (err,success) => {
                    if(err){
                        console.log(err);
                        res.status(400).json({
                            error: err
                        });
                        
                    }
            
                    res.status(200).json({
                        message: "password reset link sent succesfully!"
                    })
                      })
                }
            });
        });
};

exports.forgotPaswordforCompany = (req,res) => {

    
          Company.findOne({ Company_email : req.body.Company_email }).exec((err, company) => {
        if (err || !company) {
            return res.status(401).json({
                error: 'Company with that email does not exist'
            });
        }
        
      
            const token = jwt.sign({ _id: company._id }, process.env.JWT_RESET_PASSWORD, { expiresIn: '10m' });
            // console.log(individual);
      
            let transporter = nm.createTransport({
              host: "smtp.gmail.com",
              port: 465,
              auth: {
                  user: 'financia2926@gmail.com',
                  pass: 'rqmd mkqm tphc kjme',
              },
              secure: true
          
              })
            // email
            
            const mailOptions = {
                from: 
                {
                  name: 'FINANCIA',
                  address : 'financia2926@gmail.com',
                },
                to: company.Company_email,
                subject: 'Email to reset password',
                html: `
                <p>Please use the following link to reset your password:</p> +
                <p>${process.env.CLIENT_URL}/auths/company/password/reset/${token}</p>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>https://seoblog.com</p>
              };
              `
            };
            // populating the db > user > resetPasswordLink
            return company.updateOne({ resetPasswordLink: token }, (err, success) => {
                if (err) {
                    return res.json({ error: err });
                } else {
                  transporter.sendMail(mailOptions, (err,success) => {
                    if(err){
                        console.log(err);
                        res.status(400).json({
                            error: err
                        });
                        
                    }
            
                    res.status(200).json({
                        message: "password reset link sent succesfully!"
                    })
                      })
                }
            });
        });
      
};
    

   
exports.ResetPassword = (req,res) => {
    const { resetPasswordLink, newPassword } = req.body;
      
        if (resetPasswordLink) {
            jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(err, decoded) {
                if (err) {
                    return res.status(401).json({
                        error: 'Expired link. Try again'
                    });
                }
                Individual.findOne({ resetPasswordLink }, (err, individual) => {
                    if (err || !individual) {
                        return res.status(401).json({
                            error: 'Something went wrong. Try later'
                        });
                    }
                    const updatedFields = {
                        password: bcrypt.hashSync(newPassword,10),
                        resetPasswordLink: ''
                    };
      
                    individual = _.extend(individual, updatedFields);
      
                    individual.save((err, result) => {
                        if (err) {
                            return res.status(400).json({
                                error: err
                            });
                        }
                        res.json({
                            message: `Great! Now you can login with your new password`
                        });
                    });
                });
            });
        }
}
   
exports.login = (req,res) => {
        const {PAN_No, password} = req.body;
        Individual.findOne({PAN_No: PAN_No }).exec((err, individual) => {
           if (err || !individual){
               return res.status(400).json({
                   error: "Company dosen't exsist!!! Please Check again"
               });
           }
       
           var checked = bcrypt.compareSync(password, individual.password);
       
           if (!checked) {
               return res.status(400).json({
                 error: "Password is wrong"
               });
           }
       
           const token = jwt.sign({_id: individual._id}, process.env.JWT_SECRET, {expiresIn: '1d'});
       
           res.cookie('token', token, {expiresIn: '1d'});
       
           const {Name,_id,PAN_No,Email,role,Username,Initials,Address,Contact_no,profile,Acknowledgement_No,email_verified} = individual;
           return res.status(200).json({
               token,
               individual: {_id,Name,PAN_No,Email,role,Initials,Username,Address,Contact_no,profile,Acknowledgement_No,email_verified}
           })
        })  
}

exports.companylogin = (req,res) => {
    const {TAN_No, password} = req.body;
    Company.findOne({TAN_No: TAN_No }).exec((err, company) => {
       if (err || !company){
           return res.status(400).json({
               error: "Company dosen't exsist!!! Please Check again"
           });
       }
   
       var checked = bcrypt.compareSync(password, company.password);
   
       if (!checked) {
           return res.status(400).json({
             error: "Password is wrong"
           });
       }
   
       const token = jwt.sign({_id: company._id}, process.env.JWT_SECRET, {expiresIn: '1d'});
   
       res.cookie('token', token, {expiresIn: '1d'});
   
       const {Company_Name,TAN_No,Company_email,role,email_verified,Initials,Company_address,Company_contact_no,profile,Acknowledgement_No} = company;
       return res.status(200).json({
           token,
           company: {Company_Name,TAN_No,Company_email,role,email_verified,Initials,Company_address,Company_contact_no,profile,Acknowledgement_No}
       })
    })  
}
   
exports.requireSignin = ejwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    credentialsRequired: false,
    requestProperty: "auth"
});

  
exports.signout = (req,res) => {
    res.clearCookie("token")
    res.json({
      message: 'Signout Success'
    })
}


exports.IndividualMiddleware = (req,res,next) => {
    const authUserId = req.auth._id;
    // console.log(authUserId);
    Individual.findById({_id: authUserId}).exec((err,individual) => {
      if (err || !individual){
       return res.status(400).json({
         error: "Individual already exsists"
            })
        }

        // console.log(individual);
  
        if (individual.role === "Company" || individual.role === "Admin" || individual.role !== "Individual"){
            return res.status(400).json({
                error: "Individual Area ! Access Denied"
            })
        }

        req.profile = individual;
        next();
    }) 
}
  
exports.CompanyMiddleware = (req,res,next) => {
    const adminUserId = req.auth._id;
    Company.findById({_id: adminUserId}).exec((err,company) => {
      if (err || !company){
       return res.status(400).json({
         error: "Company already exsists"
       })
      }
      if (company.role ==="Individual" || company.role !== "Compamy"){
        return res.status(400).json({
          error: "COmpany Resource ! Access Denied"
        })
      }
  
      req.profile = company;
      next();
    })
}
  
exports.updateUserProfile = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err,fields,files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            });
        }
        let individual = req.profile;
        individual = _.extend(individual,fields);
    
        
        if (files.photo) {
            if (files.photo.size > 10000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb'
                });
            }
            individual.photo.data = fs.readFileSync(files.photo.path);
            individual.photo.contentType = files.photo.type;
        }
        // console.log(individual);
        individual.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            // individual.hashed_password = undefined;
            res.json(result);
        });

    })
}       

exports.photo = (req, res) => {
    const _id = req.params._id;
    Individual.findOne({ _id}).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        if (user.photo.data) {
            res.set('Content-Type', user.photo.contentType);
            return res.send(user.photo.data);
        }
    });
};

exports.read = (req,res) => {
    req.profile.hashed_password = undefined;
    return res.json(req.profile);
};