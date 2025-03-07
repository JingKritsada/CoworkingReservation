const express = require('express');
const dotenv = require('dotenv');
const connection = require('./config/db');

dotenv.config({ path: './config/config.env' });

const app = express();
const hpp = require('hpp');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { xss } = require('express-xss-sanitizer');
const mongoSanitize = require('express-mongo-sanitize');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerConfig = require('../docs/swagger-config');
const swaggerSpec = swaggerJsdoc({
    swaggerDefinition: swaggerConfig,
    apis: ['../docs/**/*.js']
});

const auth = require('./routes/auth');
const spaces = require('./routes/spaces');
const reservations = require('./routes/reservations');
//VDO
require('./cronJobs');


app.use(express.json());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(rateLimit({ windowMs: 10 * 60 * 1000, max: 100 }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1/auth', auth);
app.use('/api/v1/spaces', spaces);
app.use('/api/v1/reservations', reservations);


const PORT = process.env.PORT || 5003;
const server = app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);

    // Close server & exit process
    server.close(() => process.exit(1));
});