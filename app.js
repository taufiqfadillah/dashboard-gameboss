const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const toastr = require('express-toastr');
const bodyParser = require('body-parser');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3200

//------------ EJS Configuration ------------//
app.use(expressLayouts);
app.use('/dist', express.static(path.join(__dirname, 'views/dist')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//------------ Session Configuration ------------//
app.use(cookieParser(process.env.Secret_Key));
app.use(session({
  secret: process.env.Secret_Key,
  resave: true,
  saveUninitialized: true
}));

//------------ Body Parser Configuration ------------//
app.use(bodyParser.urlencoded({ extended: true }));


//------------ Socket.io Configuration ------------//
const { configureSocket } = require('./config/socket');
const http = require('http');
const server = http.createServer(app);
const io = configureSocket(server);
app.set('io', io);

//------------ Passport Configuration ------------//
app.use(express.urlencoded({ extended: true }));

passport.use(new LocalStrategy(
  (username, password, done) => {
    if (username === process.env.Username || 'admin' && password === process.env.Password || 'admin123') {
      return done(null, { username: 'admin', name: 'Ryan Paturahman' });
    } else {
      return done(null, false, { message: 'Incorrect username or password' });
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  done(null, { username: username, name: 'Ryan Paturahman' });
});


//------------ Flash & Toast Configuration ------------//
app.use(flash());
app.use(toastr());

app.use(passport.initialize());
app.use(passport.session());


//------------ Routes ------------//
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));


//------------ Firebase Configuration ------------//
const { db } = require('./config/firebase');

async function startServer() {
  try {
    await db.collection('gameboss').get();
    console.log('Database Firebase connected successfully!👌👌👌');
  } catch (error) {
    console.error('Error connecting to Firebase:', error.message);
  }
}
startServer();


server.listen(port, () => {
  console.log(`Server running to http://localhost:${port}`)
})