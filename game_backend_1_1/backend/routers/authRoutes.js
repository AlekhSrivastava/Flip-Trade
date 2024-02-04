const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();
const User = mongoose.model('User')
const jwt = require('jsonwebtoken')
const { jwtkey } = require('../keys');
const requireToken = require("../middleware/requireToken");


router.post('/signup', async (req, res) => {

    const { email, password } = req.body;
    const user = await User.findOne({ email }); 
    if (user) {
        return res.send({ message: 'user exist' })
    }
    try {
        const user = new User({ email, password });
        await user.save()
        const token = jwt.sign({ userId: user._id }, jwtkey)
        res.send({ token });
    }
    catch (err) {
        console.log(err);
        res.send(err);
    }
})
router.post('/signin', async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).send({ message: 'please enter email and password' })
    }
    const user = await User.findOne({ email }); 
    if (!user) {
        return res.send({ message: 'invalid' })
    }
    try {
        await user.comparePassword(password);
        const token = jwt.sign({ userId: user._id }, jwtkey)
        res.send({ token });
    }
    catch (err) {
        console.log(err);
        res.send({ message: 'invalid' });
    }
})
// exporting it to the index page after middleware filtering
router.get('/getUser', requireToken, (req, res) => {
    const {email,balance,loan} = req.user;
    res.send({email,balance,loan});
});

module.exports = router