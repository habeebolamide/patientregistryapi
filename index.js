const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require("cors");
require('dotenv').config();
const patient = require('./routes/patient')
const group = require('./routes/group')
const disease = require('./routes/disease')
app.use(express.json())
app.set('view engine','ejs')
app.use(cors());
app.get('/', (req,res) => {
    res.render('index')
})
app.use('/uploads', express.static('uploads'))
app.use('/api/v1/patient', patient);
app.use('/api/v1/group', group);
app.use('/api/v1/disease', disease);

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected Successfully');
}).catch((err) => {
    console.log(err);
})
const port = process.env.PORT || 1000;
app.listen(port, () => console.log(`http://localhost:${port}/api/v1`));