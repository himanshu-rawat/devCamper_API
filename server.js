const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');

const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

const errorHandler = require('./middlewares/error');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

//Connect to Database
connectDB();

const app = express();

// Body Parser -Middlewares
app.use(express.json());
// Cookie Parser
app.use(cookieParser());

//Dev Logging Middlewares
// HTTP request logger middleware for node.js
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

// Sanitize Data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate Limiting
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 100
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Route Files
const bootCampRouter = require('./routes/bootcampRouter');
const courseRouter = require('./routes/courseRouter');
const authRouter = require('./routes/authRoutes');
const usersRouter = require('./routes/usersRoutes');
const reviewsRouter = require('./routes/ReviewsRoutes');
// Mounting The Route
app.use('/api/v1/bootcamps', bootCampRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewsRouter);

// Error Handler Comes after Mounting The Route Because due to line-by-line
// Execution When we hit the route then if erorr occur it will catch it.
app.use(errorHandler);

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
	console.log(`Sever running in ${process.env.NODE_ENV} mode on port ${port}`.yellow.bold);
});

// Handling Unhandled Promise/Asynchronous Rejections
process.on('unhandledRejection', (err, promise) => {
	console.log('Unhandler Rejections ! Shutting down...');
	console.log(err.name, err.message.red);
	// Close Server & Exit Process
	server.close(() => {
		process.exit(1);
	});
});
