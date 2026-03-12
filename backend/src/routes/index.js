const express = require('express');

const healthRoutes = require('./health');
const estudiantesRoutes = require('./estudiantes');
const formularioRoutes = require('./formulario');
const entrevistasRoutes = require('./entrevistas');
const catalogosRoutes = require('./catalogos');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/estudiantes', estudiantesRoutes);
router.use('/formulario', formularioRoutes);
router.use('/entrevistas', entrevistasRoutes);
router.use('/catalogos', catalogosRoutes);

module.exports = router;
