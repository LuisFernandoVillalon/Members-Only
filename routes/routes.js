const express = require('express');
const router = express.Router();
const auth_controller = require('../controllers/authController');
const index_controller = require('../controllers/indexController');
const user_controller = require('../controllers/userController');
const message_controller = require('../controllers/messageController');

// HOMEPAGE
// ------------------------------------------------------------
router.get("/", index_controller.index);

// SIGNUP
// ------------------------------------------------------------
router.get('/sign-up', auth_controller.sign_up_get);
router.post('/sign-up', auth_controller.sign_up_post);

// LOGIN/LOGOUT
// ------------------------------------------------------------
router.get('/log-in', auth_controller.log_in_get);
router.post('/log-in', auth_controller.log_in_post);
router.get('/log-out', auth_controller.log_out_get);

// USER
// ------------------------------------------------------------
router.get('/member-sign-in', user_controller.member_sign_in_get);
router.post('/member-sign-in', user_controller.member_sign_in_post);
router.get('/admin-sign-in', user_controller.admin_sign_in_get);
router.post('/admin-sign-in', user_controller.admin_sign_in_post);

// MESSAGE
// ------------------------------------------------------------
router.get('/create-message', message_controller.create_message_get);
router.post('/create-message', message_controller.create_message_post);
router.get('/delete-message/:id', message_controller.message_delete);


module.exports = router;