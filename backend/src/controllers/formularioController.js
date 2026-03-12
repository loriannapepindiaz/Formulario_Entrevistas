const pool = require('../config/db');

const crearFormulario = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      estudiante,
      entrevista,
      participantes,
      respuestas_principales,
      respuestas_extra,
      hermanos_exalumnos,
      niveles_academicos_referentes
    } = req.body;

    await client.query("BEGIN");

    // 1️⃣ Crear estudiante
    const estudianteResult = await client.query(
      `
      INSERT INTO estudiante (nombres, apellidos, sexo_id, edad)
      VALUES ($1,$2,$3,$4)
      RETURNING id
      `,
      [
        estudiante.nombres,
        estudiante.apellidos,
        estudiante.sexo_id,
        estudiante.edad
      ]
    );

    const estudiante_id = estudianteResult.rows[0].id;

    // 2️⃣ Crear entrevista
    const entrevistaResult = await client.query(
      `
      INSERT INTO entrevista
      (
        estudiante_id,
        fecha_entrevista,
        estado_civil_id,
        vinculacion_id,
        especificar_vinculacion,
        entrevistador_id,
        telefono,
        ingreso_real,
        aporte_mensual,
        observaciones
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING id
      `,
      [
        estudiante_id,
        entrevista.fecha_entrevista,
        entrevista.estado_civil_id,
        entrevista.vinculacion_id,
        entrevista.especificar_vinculacion,
        entrevista.entrevistador_id,
        entrevista.telefono,
        entrevista.ingreso_real,
        entrevista.aporte_mensual,
        entrevista.observaciones
      ]
    );

    const entrevista_id = entrevistaResult.rows[0].id;

    // 3️⃣ Participantes de la entrevista
    if (participantes && participantes.length > 0) {
      for (const p of participantes) {
        await client.query(
          `
          INSERT INTO entrevista_participante
          (entrevista_id, nombre, parentesco_id, parentesco_otro)
          VALUES ($1,$2,$3,$4)
          `,
          [
            entrevista_id,
            p.nombre,
            p.parentesco_id,
            p.parentesco_otro
          ]
        );
      }
    }

    // 4️⃣ Respuestas principales
    if (respuestas_principales) {
      await client.query(
        `
        INSERT INTO entrevista_respuesta_principal
        (
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
          agresiones_detalle,
          convivencia,
          motivos_institucion,
          dificultades_otra_institucion,
          descripcion_estudiante,
          repitencia_sobreedad,
          alfabetizacion,
          alfabetizacion_detalle,
          motivacion_estudiante
        )
        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
        `,
        [
          entrevista_id,
          respuestas_principales.conducta,
          respuestas_principales.inconvenientes,
          respuestas_principales.ayuda_psicologica,
          respuestas_principales.ayuda_psicologica_detalle,
          respuestas_principales.zona_vivienda,
          respuestas_principales.habitos,
          respuestas_principales.actividades_familia,
          respuestas_principales.tiempo_juntos,
          respuestas_principales.expectativas_centro,
          respuestas_principales.agresion_ocurrida,
          respuestas_principales.agresiones_detalle,
          respuestas_principales.convivencia,
          respuestas_principales.motivos_institucion,
          respuestas_principales.dificultades_otra_institucion,
          respuestas_principales.descripcion_estudiante,
          respuestas_principales.repitencia_sobreedad,
          respuestas_principales.alfabetizacion,
          respuestas_principales.alfabetizacion_detalle,
          respuestas_principales.motivacion_estudiante
        ]
      );
    }

    // 5️⃣ Respuestas extra
    if (respuestas_extra) {
      await client.query(
        `
        INSERT INTO entrevista_respuesta_extra
        (
          entrevista_id,
          condicion_salud,
          condicion_salud_detalle,
          medicamento,
          medicamento_detalle,
          supervisor_extraescolar,
          supervisor_otro,
          padres_fuera,
          padres_fuera_detalle,
          pais_residencia_id,
          observaciones_padres_fuera,
          tipo_casa,
          tipo_casa_otro,
          estado_padres,
          convive_padres,
          figuras_familiares,
          hermanos_exalumnos_si_no,
          valoracion_familia
        )
        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
        `,
        [
          entrevista_id,
          respuestas_extra.condicion_salud,
          respuestas_extra.condicion_salud_detalle,
          respuestas_extra.medicamento,
          respuestas_extra.medicamento_detalle,
          respuestas_extra.supervisor_extraescolar,
          respuestas_extra.supervisor_otro,
          respuestas_extra.padres_fuera,
          respuestas_extra.padres_fuera_detalle,
          respuestas_extra.pais_residencia_id,
          respuestas_extra.observaciones_padres_fuera,
          respuestas_extra.tipo_casa,
          respuestas_extra.tipo_casa_otro,
          respuestas_extra.estado_padres,
          respuestas_extra.convive_padres,
          respuestas_extra.figuras_familiares,
          respuestas_extra.hermanos_exalumnos_si_no,
          respuestas_extra.valoracion_familia
        ]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Formulario guardado correctamente",
      estudiante_id,
      entrevista_id
    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error(error);

    res.status(500).json({
      success: false,
      error: "Error guardando formulario"
    });

  } finally {

    client.release();

  }
};

module.exports = {
  crearFormulario
};