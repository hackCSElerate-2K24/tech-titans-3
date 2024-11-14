const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const path = require('path');  
const cors = require('cors');
const product = require('./Routes/product_routes');
const user = require('./Routes/user_routes');


app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
  }));

app.use(express.json());
app.use(product); 
app.use(user);        

const Port = 3000;
const DB = process.env.DB;

mongoose.connect(DB).then(() => {
    console.log('MongoDB is connected');
}).catch(() => {
    console.log('MongoDB is not connected');
});

app.listen(Port, () => {
    console.log(`Server running at http://localhost:${Port}`);
});
