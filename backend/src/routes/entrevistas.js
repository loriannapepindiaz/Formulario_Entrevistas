const express = require('express');

const {
  createOne,
  getAll,
  getById,
  updateById
} = require('../controllers/entrevistasController');

const router = express.Router();

router.post('/', createOne);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', updateById);

module.exports = router;
