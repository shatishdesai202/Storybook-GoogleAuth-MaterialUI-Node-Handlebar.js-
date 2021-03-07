const path = require('path');
const express = require('express');
const dotenv = require('dotenv');

//session
const mongoose = require('mongoose');
const connectDB = require('./config/db');

//morgan
const morgan = require('morgan');

//handlebars
const exphnd = require('express-handlebars');

//routes
const routes = require('./routes/urls');
const app = express();
const methodOverride = require('method-override');

//Body-Parser
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

//Method Override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method 
    }
}))

//passport
const session = require('express-session');
//session
const Mongostore = require('connect-mongo')(session)
const passport = require('passport');



// Session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new Mongostore({
        mongooseConnection: mongoose.connection
    })
}));


//passport middleware
app.use(passport.initialize());
app.use(passport.session());

// set Global var
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
})



//passport config
require('./config/passport')(passport)

//handlebar helper
const {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select
} = require('./helpers/hbs');


//handlebar engine
app.engine('.hbs', exphnd({
    helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select
    },
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//static folder
app.use(express.static(path.join(__dirname, 'public')));


//Routes
app.use('/', require('./routes/urls'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

// load config
dotenv.config({
    path: './config/config.env'
});


connectDB();

// loggin 
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


app.use('/', routes);


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});