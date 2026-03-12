const express = require('express');
const router = express.Router();

const { crearFormulario } = require('../controllers/formularioController');

router.post('/', crearFormulario);
router.get("/", (req,res)=>{
   res.json({message:"Ruta formulario activa"});
});

module.exports = router;
