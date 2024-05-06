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



exports.companysignup = (req, res) => {

       Company.findOne({TAN_No: req.body.TAN_No}).exec((err,company) => {
            if (company){
                return res.status(400).json({
                    error: "Company already exsists"
                })
            }
        
            const {Company_Name,TAN_No,Company_email,Company_address,Company_contact_no,password,confirmedPassword,role} = req.body;
            let profile = `${process.env.CLIENT_URL}/profile/${Company_Name}`;
            let gs = Company_Name.replace(/[a-z]/g, '');
            let Initials= gs.replace(/\s+/g, '');
            
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
             let profile = `${process.env.CLIENT_URL}/profile/${Name}`;
             
             let gs = Name.replace(/[a-z]/g, '');
             let Initials= gs.replace(/\s+/g, '');
             
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
        const { email } = req.body.Email;

 
        Individual.findOne({ email }).exec((err, individual) => {
            if (err || !individual) {
                return res.status(401).json({
                    error: 'User with that email does not exist'
                });
            }
      
            const token = jwt.sign({ _id: individual._id }, process.env.JWT_RESET_PASSWORD, { expiresIn: '10m' });
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

        
        Company.findOne({ email }).exec((err, company) => {
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
                <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
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
                Company.findOne({ resetPasswordLink }, (err, company) => {
                    if (err || !company) {
                        return res.status(401).json({
                            error: 'Something went wrong. Try later'
                        });
                    }
                    const updatedFields = {
                        password: bcrypt.hashSync(newPassword,10),
                        resetPasswordLink: ''
                    };
      
                    company = _.extend(company, updatedFields);
      
                    company.save((err, result) => {
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
   
 