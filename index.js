const express = require('express');
const morgan = require('morgan');
const bp = require('body-parser');
const cp = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require("fs")
const cron = require('node-cron');
require('dotenv').config(); 


// app
const app = express();

mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true}).then(() => console.log('DB connected'));

// middlewares
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(cp())


//cors
app.use(cors());    

fs.readdirSync('./routes').map((r) => app.use('/', require(`./routes/${r}`)));     // localhost:5005/


app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError'){
        res.status(401).json({
            error: "Unauthorized!"
        });
    }
});


app.get('/', (req,res) => {
    fs.readFile('apiDocs/docs.json', (err, data) => {
        if (err) {
            res.status(400).json({
                error: err
            })
        }

        const docs = JSON.parse(data);
        res.json(docs);
    })
})


// handle port
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})