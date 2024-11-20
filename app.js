const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const mongoose = require('mongoose');
const bodyparser=require('body-parser');
const crypto = require('crypto');
const bookroutes=require('./routes/bookroutes');
const data=require('./data');
const app = express();
const port = 5000;


let otpStorage = {};
app.use(express.static('/public'));

app.use(express.static(path.join((__dirname,'public'))));
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.set('view engine', 'ejs');


const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'pandimuthaiah2006@gmail.com', 
        pass: 'wetx gzgq nhhl msaf'  
    }
});

mongoose.connect('mongodb://localhost:27017/ticketbooking', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('MongoDB connection error:', err));

    app.post('/send-otp', (req, res) => {
        const { name, email, event, noOfTickets } = req.body;
    
       
        const otp = crypto.randomInt(100000, 999999);
    
       
        otpStorage[email] = otp;
    
        
        const mailOptions = {
            from: 'pandimuthaiah2006@gmail.com',
            to: email,
            subject: 'Your OTP for Ticket Booking',
            text: `Your OTP is ${otp}`
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Email sent: ' + info.response);
    
           
            res.render('otp', { email });
        });
    });
    
    
    app.post('/verify-otp', (req, res) => {
        console.log('Request Body:', req.body); 
        let booking = {
            name: req.body.name,
            email: req.body.email,
            noOfTickets: req.body.noOfTickets
          };
        const { email, otp } = req.body;
    
        
        if (otpStorage[email] && otpStorage[email] == otp) {
           
            delete otpStorage[email]; 
            
            res.render('confirmation', { booking });
        } else {
            
            res.send('Invalid OTP. Please try again.');
        }
    });

app.use('/bookings',bookroutes);




app.get('/booking/:id/:type', (req, res) => {
    const eventType = req.params.type;
    const eventId = req.params.id;          
    const event = data[eventType].find(e => e.id == eventId);
    res.sendFile(path.join(__dirname,'/views','index.html'));
});
app.get('/',(req,res) =>{
    res.sendFile(path.join(__dirname,'views','home.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`); 
});
