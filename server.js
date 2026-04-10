const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_e6dpIN5lqfJT@ep-twilight-flower-a4d90qyf-pooler.us-east-1.aws.neon.tech/neondb",
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/admisiones", async (req, res) => {
  const datos = req.body;
  console.log("DATOS RECIBIDOS:", datos);

  try {
    // 1. INSERTAR EN ESTUDIANTE
    // Agregamos sexo, edad y vinculación porque tu tabla los requiere como NOT NULL
    const queryEstudiante = `
      INSERT INTO estudiante (nombres, apellidos, sexo, edad, vinculacion)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    
    const valoresEstudiante = [
      datos.nombres || null,
      datos.apellidos || null,
      datos.sexo || null,
      datos.edad ? parseInt(datos.edad) : null,
      datos.vinculacion || null
    ];

    const estudiante = await pool.query(queryEstudiante, valoresEstudiante);
    const estudiante_id = estudiante.rows[0].id;

    // 2. INSERTAR EN ENTREVISTA
    const entrevista = await pool.query(`
      INSERT INTO entrevista (estudiante_id, fecha_entrevista, entrevistador)
      VALUES ($1, CURRENT_DATE, $2)
      RETURNING id
    `, [estudiante_id, datos.entrevistador]);

    const entrevista_id = entrevista.rows[0].id;

    // 3. INSERTAR RESPUESTAS PRINCIPALES
    // Nota: Se agregaron los campos que faltaban según tu objeto de datos
    await pool.query(`
      INSERT INTO entrevista_respuesta_principal (
        entrevista_id,
        conducta,
        inconvenientes,
        ayuda_psicologica,
        ayuda_psicologica_detalle,
        zona_vivienda,
        habitos,
        actividades_familia,
        tiempo_juntos,
        expectativas_centro,
        agresion_ocurrida,
        agresiones_detalle
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `, [
      entrevista_id,
      datos.conducta,
      datos.inconvenientes,
      datos.ayuda_psic === "Si",
      datos.alfabetizacion_detalle || "", // O el campo correspondiente a detalle
      datos.zona_vivienda,
      datos.habitos,
      datos.actividades_familia,
      datos.tiempo_juntos,
      datos.expectativas_centro,
      datos.agresion_ocurrida === "Si",
      datos.motivos // O el campo donde guardes el detalle de agresión
    ]);

    // 4. INSERTAR RESPUESTAS EXTRA (Opcional según tu lógica)
    await pool.query(`
      INSERT INTO entrevista_respuesta_extra (entrevista_id)
      VALUES ($1)
    `, [entrevista_id]);

    res.json({ 
      success: true, 
      mensaje: "Entrevista y estudiante guardados correctamente",
      id: estudiante_id 
    });

  } catch (error) {
    console.error("ERROR EN DB:", error);
    // Enviamos el detalle del error para que sepas qué columna falta
    res.status(500).json({ 
      error: "Error guardando la entrevista", 
      detalle: error.message 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});