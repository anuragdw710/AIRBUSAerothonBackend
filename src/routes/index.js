const express = require('express');
const CordController = require('../controller/cordController');

const router = express.Router();

router.post('/cord', CordController.createCord);


module.exports = router;