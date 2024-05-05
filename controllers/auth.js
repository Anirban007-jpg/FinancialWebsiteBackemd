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
            let Initials = "";
            
            for (let i=0;i< Company_Name.length; i++){
              if (Company_Name[i].includes("ABCDEFGHIJKLMNOPQRSTUVWXYZ")){
                Initials += Company_Name[i];
              }
            }
            
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
             let Initials = "";
             
             for (let i=0;i< Name.length; i++){
               if (Name[i].includes("ABCDEFGHIJKLMNOPQRSTUVWXYZ")){
                 Initials += Name[i];
               }
             }
             
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
   
 