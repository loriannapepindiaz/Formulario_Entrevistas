const express = require('express');

const { getCatalogos } = require('../controllers/catalogosController');

const router = express.Router();

router.get('/', getCatalogos);

module.exports = router;
