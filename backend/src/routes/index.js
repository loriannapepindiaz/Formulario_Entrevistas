const express = require('express');

const healthRoutes = require('./health');
const estudiantesRoutes = require('./estudiantes');
const padresRoutes = require('./padres');
const entrevistasRoutes = require('./entrevistas');
const catalogosRoutes = require('./catalogos');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/estudiantes', estudiantesRoutes);
router.use('/padres', padresRoutes);
router.use('/entrevistas', entrevistasRoutes);
router.use('/catalogos', catalogosRoutes);

module.exports = router;
