const express = require('express');
const dotenv  = require('dotenv');
const morgan =require('morgan');
const colors =require('colors');
const errorHandler =require('./middlewares/error');
const connectDB = require('./config/db');


// Load env vars
dotenv.config({path:'./config/config.env'});

//Connect to Database
connectDB();

const app =express();

// Body Parser -Middlewares
app.use(express.json());



//Dev Logging Middlewares 
// HTTP request logger middleware for node.js
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}

// Route Files
const bootCampRouter =require('./routes/bootcampRouter')
// Mounting The Route
app.use('/api/v1/bootcamps',bootCampRouter);

// Error Handler Comes after Mounting The Route Because due to line-by-line
// Execution When we hit the route then if erorr occur it will catch it.
app.use(errorHandler);

const port =process.env.PORT || 5000;
const server = app.listen(port,()=>{
    console.log(`Sever running in ${process.env.NODE_ENV} mode on port ${port}`.yellow.bold);
})

// Handling Unhandled Promise/Asynchronous Rejections
process.on('unhandledRejection', (err,promise) => {
    console.log('Unhandler Rejections ! Shutting down...');
    console.log(err.name, err.message .red);
    // Close Server & Exit Process
	server.close(() => {
		process.exit(1);
	});
});