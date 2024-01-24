const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();
const Card = mongoose.model('Card')
const Cardleft = mongoose.model('Cardleft')
function generateRandomArray() {
    let arr = [];
    let sum = 0;

    let value = 0;
    const state = true;
    // Generate 16 random numbers
    for (let i = 0; i < 16; i++) {
        value = Math.floor(Math.random() * 10) + 1; // Generate random number between 1 and 10
        sum += value;
        arr.push(new Card({ value, state }));
    }

    value = (120 - sum);
    arr.push(new Card({ value, state }));

    // Add 8 zeros to the array
    value = 0;
    for (let i = 0; i < 8; i++) {
        arr.push(new Card({ value, state }));
    }

    // Shuffle the array to randomize the position of zeros
    arr.sort(() => Math.random() - 0.5);

    return arr;
}

// dont pass any variable with random name in modal  
// new Cardleft({cl,val}); X                  
router.post('/cardsRem', async (req, res) => {
    const name = 'cardsleft';
    const cardLeft = 25;

    try {
        let cardleft = await Cardleft.findOne({ name });

        if (!cardleft) {
            const newCards = generateRandomArray();
            await Card.deleteMany();
            await Card.insertMany(newCards);

            cardleft = new Cardleft({ name, cardLeft });
            await cardleft.save();
            return res.send({ message: 'Cards updated' });
        }

        if (cardleft.cardLeft === 1) {
            const newCards = generateRandomArray();
            await Card.deleteMany();
            await Card.insertMany(newCards);

            cardleft.cardLeft = 25;
        } else {
            cardleft.cardLeft -= 1;
        }

        await cardleft.save();
        res.send({ message: 'Cards updated' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'An error occurred' });
    }
    /* const cardleft = await Cardleft.findOne({ name });
    if (!cardleft) {
        const newCards = generateRandomArray();
        await Card.deleteMany();
        await Card.insertMany(newCards);

        const updatedCards = new Cardleft({ name, cardLeft });
        await updatedCards.save();
        return res.send({ message: 'Cards updated' })
    }
    try {

        if (cardleft.cardLeft === 1) {
            try {
                const newCards = generateRandomArray();
                await Card.deleteMany();
                await Card.insertMany(newCards);

                cardleft.cardLeft = 25;
                await cardleft.save();
                res.send({ message: 'Cards updated' });
            }
            catch (err) {
                console.log(err);
                res.send({ message: 'Data not available' });

            }

        }
        else {

            cardleft.cardLeft = (cardleft.cardLeft - 1);
            await cardleft.save();
            res.send({ message: 'Cards updated' });
        }
    }
    catch (err) {
        console.log(err);
        res.send({ message: 'Data not availabe' });
    } */
});

router.get('/cardStack',async (req, res) => {
    try {
        const cardStk = await Card.find();
        res.send(cardStk);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'An error occurred' });
    }
});
module.exports = router;
