const compression = require('compression');
const helmet = require('helmet');
const mongoose = require("mongoose");
require('dotenv').config();
var express = require('express');
var path = require('path');
// Passport.js is a popular authentication middleware for Node.js. It simplifies the 
// process of implementing authentication strategies within your web application, 
// providing an easy and flexible way to authenticate users.
const passport = require("passport");
// In Passport.js, const LocalStrategy = require('passport-local').Strategy; is a 
// statement that imports and initializes the Local Strategy module used for handling 
// local username/password authentication.
const LocalStrategy = require("passport-local").Strategy;
const User = require('./models/user');
const app = express();
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session");
const bcrypt = require("bcryptjs");
const indexRouter = require('./routes/routes');

// Compress all routes. Do this before any routes you want compressed
// Decrease the size of the response body and hence increase the speed of a web app
app.use(compression());

// Protects app from web vulnerabilities by setting HTTP headers appropriately
app.use(helmet());

// Tells Mongoose to be more lenient with query conditions. This can be useful in 
// situations where you want to perform queries on fields that are not explicitly defined
// in your schema. 
mongoose.set("strictQuery", false);

// Define the database URL to connect to.
const mongoDB = process.env.MY_MONGODB;

// Wait for database to connect, logging an error if there is a problem
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

passport.use(
	new LocalStrategy(async function (username, password, done) {
		try {
			const foundUser = await User.findOne({
				username: username
			});

			if (!foundUser) {
				console.log('User is not found! ');
				return done(null, false, { message: 'Incorrect username' });
			}

			bcrypt.compare( password, foundUser.password, async function (err, res) {
					if (res) {
						// passwords match. Log user in
						console.log('password do match!');
						return done(null, foundUser);
					} else {
						// password do not match!
						console.log('password do not match!');
						return done(null, false, {
							message: 'Incorrect password'
						});
					}
				}
			);
		} catch (err) {
			console.log('There is an error, return done');
			return done(err);
		}
	})
);

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user); // Pass the user to the done callback
  } catch (err) {
    done(err, null); // Pass the error to the done callback
  }
});

app.use(
	session({
		secret: 'cats',
		resave: false,
		saveUninitialized: true
	})
);
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
