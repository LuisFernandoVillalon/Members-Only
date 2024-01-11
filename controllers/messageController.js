const Message = require('../models/message');
const { body, validationResult } = require('express-validator');

exports.messages_get = async function (req, res, next) {
	try {
		let messages = await Message.find().maxTimeMS(20000).populate('user');
		messages = messages.sort((a, b) => {
			return a.timestamp < b.timestamp ? 1 : -1;
		});

		return messages;
	} catch (err) {
		console.log('MESSAGES GET: Error retrieving messages');
		console.log(err);

		return null;
	}
};

exports.message_delete = async function (req, res, next) {
	try {
		const message = req.params;
		await Message.findOneAndDelete({ _id: message.id });
		res.redirect('/');
	} catch (err) {
		console.log('MESSAGE DELETE: Error deleting messages');
		console.log(err);
		return null;
	}
};

exports.create_message_get = function (req, res, next) {
	res.render('forms/create_message_form', { errors: null });
};

exports.create_message_post = [
	body('title')
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage('Message title must not be empty'),
	body('text')
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage('Message content must not be empty'),
	async function (req, res, next) {
		const { currentUser } = res.locals;
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			console.log('CREATE MESSAGE: Error with fields');
			console.log(errors);
			return res.render('forms/create_message_form', {
				errors: errors.array(),
				user: res.locals.currentUser
			});
		}

		try {
			const newMessage = new Message({
				title: req.body.title,
				timestamp: new Date(),
				text: req.body.text,
				user: currentUser._id
			});

			await newMessage.save();
			res.redirect('/');
		} catch (err) {
			console.log('CREATE MESSAGE: Error while trying to save in db');
			return next(err);
		}
	}
];