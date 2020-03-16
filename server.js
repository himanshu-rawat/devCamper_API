const express = require('express');
const dotenv  = require('dotenv');

const morgan =require('morgan');

// Load env vars
dotenv.config({path:'./config/config.env'});

const app =express();

//Dev Logging Middlewares 
// HTTP request logger middleware for node.js
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}

// Route Files
const bootCampRouter =require('./routes/bootcampRouter')
// Mounting The Route
app.use('/api/v1/bootcamps',bootCampRouter);

const port =process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`Sever running in ${process.env.NODE_ENV} mode on port ${port}`);
})