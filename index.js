const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require("cors");
require('dotenv').config();
const patient = require('./routes/patient')
const group = require('./routes/group')
const disease = require('./routes/disease')
app.use(express.json())
app.use(cors());
app.use('/api/v1/patient', patient);
app.use('/api/v1/group', group);
app.use('/api/v1/disease', disease);
const Pusher = require('pusher');
const pusher = new Pusher({
    appId: "1641917",
    key: "23770585f05335a622d6",
    secret: "36acc5ff88b81a8c18a7",
    cluster: "mt1",
    useTLS: true
  });
  

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected Successfully');
}).catch((err) => {
    console.log(err);
})
const port = process.env.PORT || 1000;
app.listen(port, () => console.log(`http://localhost:${port}/api/v1`));