const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const keys = require('./config/keys');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash')


const port = process.env.PORT || 5000;
const app = express();

//passport Configuration
require('./config/passport')(passport);


//EJS view engine setup
app.set('view engine', 'ejs')
app.set('/views/', express.static(path.join(__dirname, 'views')));
app.use(expressLayouts);


//public folder access or assets setup

app.use('/public/', express.static(path.join(__dirname, 'public')));


//MongoDB Connection

const db = keys.MongoDB.mongoURI;
mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => console.log(err));


//express middleware

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());


//express session

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


//passport middleware setup

app.use(passport.initialize());
app.use(passport.session());


//connect flash
app.use(flash());


//Global Variables

app.use((req, res, next) => {
    res.locals.successMessage = req.flash('successMessage');
    res.locals.errorMessage = req.flash('errorMessage');
    res.locals.error = req.flash('error');
    next();
});


// Routes

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

//Listening on PORT 5000

app.listen(port, () => {
    console.log(`Server is Running on PORT ${port}`)
});


module.exports = app;