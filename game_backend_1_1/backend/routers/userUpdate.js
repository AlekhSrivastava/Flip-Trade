const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();
const User = mongoose.model('User')

router.patch('/upDateCredit', async (req, res) => {
    let { email, balance, loan } = req.body;
    if (!email) {
        return res.status(422).send({ message: 'mail not found' });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).send({ message: 'mail not found' });
    }
    try {
        user.balance += balance;
        user.loan += loan;
        await user.save();
        
        balance = user.balance;
        loan = user.loan;

        res.send({ email, balance, loan });
    } catch (err) {
        console.log(err);
        res.send({ message: 'Error updating user credit' });
    }
});


module.exports = router
