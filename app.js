const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const typeRoutes = require('./routes/productTypeRoutes');
const offerEventRoute = require('./routes/offerEventRoutes');
const offerHeaderRoute = require('./routes/offerHeaderRoutes');

const app = express();
app.enable('trust proxy');
app.use(helmet({
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: {
            allowOrigins: ['*'],
        },
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ['*'],
                scriptSrc: ["* data: 'unsafe-eval' 'unsafe-inline' blob:"],
            },
        },
    })
);

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(session({
    secret: 'keyboard car',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use(mongoSanitize());

app.use(xss());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.cookies);
    next();
});

app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/types', typeRoutes);
app.use('/api/v1/offerEvent', offerEventRoute);
app.use('/api/v1/offerHeader', offerHeaderRoute);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;