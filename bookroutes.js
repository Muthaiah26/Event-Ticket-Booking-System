const express=require('express');
const router=express.Router();
const Booking = require('../models/booking');
router.post('/book',async(req,res)=>{
    const {event, name, email, noOfTickets} =req.body;
    const newBooking = new Booking({
        event,name,email, noOfTickets
    });
    try{
        const savedBooking = await newBooking.save();
        res.render('confirmation',{booking:savedBooking});
    }catch(err){
        res.status(400).send('error booking tickets' + err.message);

    }
});
module.exports = router;