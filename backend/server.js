
require('dotenv').config();
const express = require('express');
const pool = require('./config/db');
// const cors = require('cors');
const authRouter = require('./routes/authRoutes');
const homeRouter = require('./routes/homeRoutes');


// connectTOdb()
const app = express();
const PORT = process.env.PORT || 3000;
//middleware to parse data in json format
app.use(express.json());
// app.use(cors());
app.use('/api/auth', authRouter);
app.use('/api/dashboard', homeRouter);

app.listen(PORT, () => {
    console.log(`Server is Running on Port ${3000}`);
   
})