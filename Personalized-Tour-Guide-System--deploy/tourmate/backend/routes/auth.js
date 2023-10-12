const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.post('/', authController.handleLogin);
router.post('/forget/:user', authController.forget);

module.exports = router;