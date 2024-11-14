const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


const Port = 3000;
const DB = process.env.DB;

mongoose.connect(DB).then(()=>{
    console.log('MongoDB is connected')
}).catch(()=>{
    console.log('MongoDB is not connected')
})

app.listen(Port,()=>{
    console.log(`http://localhost:${Port}`);
});