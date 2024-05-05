const nm = require('nodemailer');
require('dotenv').config()

exports.contactForm = (req, res) => {
   const {email, usermessage, name} = req.body;
   let transporter = nm.createTransport({
    port: 465,
    service: "gmail",
    auth: {
        user: 'financia2926@gmail.com',
        pass: 'rqmd mkqm tphc kjme',
    },
    secure: false

    })
   var message = {
        from: email,
        to: 'financia2926@gmail.com',
        subject: 'Contact Mail',
        html: `<h1>Sent by ${name}</h1><br/><p>${usermessage}</p>`
    };

    transporter.sendMail(message, (err,success) => {
        if(err){
            console.log(err);
            res.status(400).json({
                error: err
            });
            
        }

        res.status(200).json({
            success: "Your email was sent succesfully!"
        })
    })
};