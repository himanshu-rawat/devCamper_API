const express = require('express');
const dotenv  = require('dotenv');

// Load env vars
dotenv.config({path:'./config/config.env'});

const app =express();

// Route Files
const bootCampRouter =require('./routes/bootcampRouter')

// Mounting The Route
app.use('/api/v1/bootcamps',bootCampRouter);

const port =process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`Sever running in ${process.env.NODE_ENV} mode on port ${port}`);
})