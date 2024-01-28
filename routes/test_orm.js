const express = require('express');
const router = express.Router();

const testOrmController = require('../controllers/text_orm.controller');

router.get('/', testOrmController.index);

module.exports = router;