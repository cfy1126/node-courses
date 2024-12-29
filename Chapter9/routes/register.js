const express = require('express');
const router = express.Router();
const { handleNewUser } = require('../controllers/registercontroller');

router.post('/', handleNewUser);

module.exports = router;
