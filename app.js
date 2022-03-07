const path = require('path')
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db');


//load config
dotenv.config({ path: './config/config.env' })

//passport config
require('./config/passport')(passport)

connectDB()

const app = express();

//LOgging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}





//handlebars

app.engine('.hbs', exphbs({ defaultLaylot: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

//sessions
app.use(session({
    secret: 'keyboard456',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Static folder
app.use(express.static(path.join(__dirname, 'public')))


//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))



const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`))