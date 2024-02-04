const express = require('express');
const mongoose = require('mongoose');

const { mongoUrl } = require('./keys');
const port = process.env.PORT || 3000;
const mUrl = process.env.MONGO_URL || mongoUrl;

const user = require('./models/User')
const requireToken = require ('./middleware/requireToken')
const authRoutes = require('./routers/authRoutes');
const userUpdate = require('./routers/userUpdate');

const card = require('./models/Card')
const cardleft = require('./models/Cardleft')
const cardsUpdate = require('./routers/cardsUpdate');

const app = express();

const dbName = 'game';
mongoose.connect(mUrl, {
  dbName,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// call when db connect
mongoose.connection.on('connected', () => {
  console.log('mongoose connected successfully...');
});

// call when db not connect
mongoose.connection.on('error', (err) => {
  console.log('error detected...', err);
});


app.use(express.json());

//to acces authRoute post and get methods
app.use(authRoutes);
app.use(userUpdate);
app.use(cardsUpdate);


app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});

