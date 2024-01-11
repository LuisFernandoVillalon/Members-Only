const User = require('../models/user');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

exports.member_sign_in_get = function (req, res, next) {
        if (!res.locals.currentUser) {
            res.redirect('/log-in');
        }
        res.render('forms/member_sign_in_form', { errors: null });
};

exports.member_sign_in_post = [
	body('secret_code')
		.trim()
		.toLowerCase()
		.isLength({ min: 1 })
		.escape()
		.withMessage('Secret code must not be empty'),
	async function (req, res, next) {
		const { currentUser } = res.locals;
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			console.log('SECRET MEMBER SIGN UP: Error with fields');
			console.log(errors);
			return res.render('forms/member_sign_in_form', {
				errors: errors.array(),
				user: res.locals.currentUser
			});
		} else if (req.body.secret_code !==  process.env.MEMBER_PASSCODE) {
			console.log('SECRET MEMBER SIGN UP: Not Correct Secret Code');
			console.log(errors);
			return res.render('forms/member_sign_in_form', {
				errors: [{ msg: 'Wrong Secret Code' }],
				user: res.locals.currentUser
			});
		}

		try {
			const isUserInDB = await User.findById(currentUser._id);
			console.log(isUserInDB);

			if (isUserInDB.membership_status) {
				console.log('SECRET MEMBER SIGN UP: User is already a member');
				return res.render('forms/member_sign_in_form', {
					errors: [{ msg: 'User is already a member' }],
					user: res.locals.currentUser
				});
			}

			const userToUpdate = new User(currentUser);
			userToUpdate.membership_status = true;

			// If username does not exist, continue to update
			User.findByIdAndUpdate(currentUser._id, userToUpdate, {})
			.then(() => {
				res.redirect('/');
			})
			.catch(err => {
				next(err);
			});
		} catch (err) {
			console.log('ADMIN SIGN UP: Error while trying to find user in db');
			return next(err);
		}
	}
];

exports.admin_sign_in_get = function (req, res, next) {
	if (!res.locals.currentUser) {
		res.redirect('/log-in');
	}

	res.render('forms/admin_sign_in_form', { errors: null });
};

exports.admin_sign_in_post = [
	body('secret_code')
		.trim()
		.toLowerCase()
		.isLength({ min: 1 })
		.escape()
		.withMessage('Secret admin code must not be empty'),
	async function (req, res, next) {
		const { currentUser } = res.locals;
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			console.log('ADMIN SIGN UP: Error with fields');
			console.log(errors);
			return res.render('forms/admin_sign_in_form', {
				errors: errors.array(),
				user: res.locals.currentUser
			});
		} else if (req.body.secret_code !==  process.env.ADMIN_PASSCODE) {
			console.log('ADMIN SIGN UP: Not Correct Admin code');
			console.log(errors);
			return res.render('forms/admin_sign_in_form', {
				errors: [{ msg: 'Wrong Secret Code' }],
				user: res.locals.currentUser
			});
		}

		try {
			const isUserInDB = await User.findById(currentUser._id);

			if (isUserInDB.admin_status) {
				console.log('ADMIN SIGN UP: User is already an admin');
				return res.render('forms/admin_sign_in_form', {
					errors: [{ msg: 'User is already a admin' }],
					user: res.locals.currentUser
				});
			}

			const userToUpdate = new User(currentUser);
			userToUpdate.admin_status = true;

			// If username does not exist, continue to update
			User.findByIdAndUpdate(currentUser._id, userToUpdate, {})
			.then(() => {
				res.redirect('/');
			})
			.catch(err => {
				next(err);
			});
		} catch (err) {
			console.log('ADMIN SIGN UP: Error while trying to find user in db');
			return next(err);
		}
	}
];