import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const esc = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const hasValue = (value) => value !== undefined && value !== null && String(value).trim() !== '';

const pick = (data, keys) => {
  for (const key of keys) {
    if (hasValue(data[key])) return data[key];
  }
  return '';
};

function buildObraFlags(data) {
  const raw = String(pick(data, ['obra_salesiana', 'vinculacion_institucional', 'procede_obra_salesiana']) || '').toLowerCase();
  const check = (key, search) => {
    const val = String(pick(data, [key])).toLowerCase();
    return val === 'true' || val === 'si' || val === 'x' || val === '1' || raw.includes(search);
  };

  return {
    Exalumno: check('obra_exalumno', 'exalumno'),
    Oratorio: check('obra_oratorio', 'oratorio'),
    'Centro Juvenil': check('obra_centro_juvenil', 'centro juvenil') || check('centro_juvenil', 'centro juvenil'),
    Cooperador: check('obra_cooperador', 'cooperador'),
    Traslado: check('obra_traslado', 'traslado'),
  };
}

function getPrintableData(data = {}) {
  const items = (Array.isArray(data.entrevistados) ? data.entrevistados : []);
  const e1 = items[0] || {};

  return {
    fecha: pick(data, ['fecha', 'fecha_entrevista']),
    formulario: pick(data, ['formulario', 'numero_formulario']),
    seccion: pick(data, ['seccion', 'sección']),
    codigo: 'Código: P-AD-01-F-04 | Rev. 03',
    nombre: pick(data, ['nombre', 'nombre_estudiante']),
    apellido: pick(data, ['apellido', 'apellido_estudiante']),
    sexo: pick(data, ['sexo', 'genero']),
    edad: pick(data, ['edad']),
    entrevistado: pick(data, ['entrevistado_1', 'entrevistado']) || e1.nombre || '',
    parentesco: pick(data, ['parentesco_1', 'parentesco']) || e1.parentesco || '',
    nivelMadre: pick(data, ['nivel_madre', 'nivel_academico_madre']),
    nivelPadre: pick(data, ['nivel_padre', 'nivel_academico_padre']),
    nivelTutor: pick(data, ['nivel_tutor', 'nivel_academico_tutor']),
    estadoCivil: pick(data, ['estado_civil_padres', 'estado_civil', 'los_padres_son']),
    obraFlags: buildObraFlags(data),
    entrevistador: pick(data, ['entrevista_realizada_por', 'entrevistador']),
    observaciones: pick(data, ['observaciones']),

    q1: pick(data, ['conducta_escolar', 'p1']),
    q2: pick(data, ['inconveniente_colegio', 'p2']),
    q3: pick(data, ['ayuda_psicologica', 'p3']),
    q4: pick(data, ['zona_viven', 'en_que_zona_viven', 'desde_cuando', 'p4zona']),
    q5: pick(data, ['habitos_estudio', 'p4']),
    q6: pick(data, ['actividades_familia', 'p5']),
    q7: pick(data, ['tiempo_juntos_casa', 'p6']),
    q8: pick(data, ['espera_del_centro', 'p7']),
    q9: pick(data, ['agresion_estudiante', 'p8']),
    q10: pick(data, ['convivencia_estudiante', 'p9']),
    q11: pick(data, ['motivo_pertenecer', 'p10']),
    q12: pick(data, ['dificultad_otra_institucion', 'p11']),
    q13: pick(data, ['respuesta_estudiante', 'p12']),
    q14: pick(data, ['sobredad_detalle', 'p13']),
    q15: pick(data, ['problemas_alfabetizarse', 'p14']),
    q16: pick(data, ['desea_estudiar', 'p15']),
    q17: pick(data, ['ingreso_familia', 'p16']),
    q18: pick(data, ['aporte_mensual', 'p17']),
    telefono: pick(data, ['telefono', 'p18', 'telefono_tutor']),
  };
}

function buildPrintableCoreHtml(data = {}) {
  const info = getPrintableData(data);
  const renderQ = (n, t, v) => `<div class="q-block"><div class="q-label">${n ? n + '. ' : ''}${esc(t)}</div><div class="q-line">${esc(v)}</div></div>`;

  return `
  <div class="pdf-page" id="page-1">
    <div class="header">
      <img class="logo" src="/logosalesianos.jpg" alt="Logo Salesianos" />
      <div class="head">PLANTILLA PARA ENTREVISTA FAMILIAR</div>
      <img class="logo" src="/logoipisa.png" alt="Logo IPISA" />
    </div>

    <div class="meta-row-central">
      <div class="meta-item"><strong>Fecha de entrevista:</strong> <span class="bb">${esc(info.fecha)}</span></div>
      <div class="meta-item"><strong>Formulario:</strong> <span class="bb">${esc(info.formulario)}</span></div>
      <div class="meta-item"><strong>Sección:</strong> <span class="bb">${esc(info.seccion)}</span></div>
    </div>

    <table class="main-table">
      <tr><th colspan="6" class="bg-gray">DATOS PERSONALES DEL ESTUDIANTE</th></tr>
      <tr>
        <th colspan="2">NOMBRE (S)</th>
        <th colspan="2">APELLIDO (S)</th>
        <th style="width:12%">SEXO</th>
        <th style="width:12%">EDAD</th>
      </tr>
      <tr>
        <td colspan="2" class="content-cell">${esc(info.nombre)}</td>
        <td colspan="2" class="content-cell">${esc(info.apellido)}</td>
        <td class="content-cell text-center">${esc(info.sexo)}</td>
        <td class="content-cell text-center">${esc(info.edad)}</td>
      </tr>
      <tr>
        <th colspan="4">ENTREVISTADO (S)</th>
        <th colspan="2">PARENTESCO</th>
      </tr>
      <tr>
        <td colspan="4" class="content-cell">${esc(info.entrevistado)}</td>
        <td colspan="2" class="content-cell">${esc(info.parentesco)}</td>
      </tr>
      <tr><th colspan="6" class="bg-gray">Indicar si proviene de alguna obra salesiana</th></tr>
      <tr class="obra-row">
        <td colspan="6">
          <div class="obra-grid">
            <div class="obra-item">Exalumno <span class="box">${info.obraFlags.Exalumno ? 'X' : ''}</span></div>
            <div class="obra-item">Oratorio <span class="box">${info.obraFlags.Oratorio ? 'X' : ''}</span></div>
            <div class="obra-item">Centro Juvenil <span class="box">${info.obraFlags['Centro Juvenil'] ? 'X' : ''}</span></div>
            <div class="obra-item">Cooperador <span class="box">${info.obraFlags.Cooperador ? 'X' : ''}</span></div>
            <div class="obra-item">Traslado <span class="box">${info.obraFlags.Traslado ? 'X' : ''}</span></div>
          </div>
        </td>
      </tr>
      <tr><th colspan="6" class="bg-gray">NIVEL DE PREPARACIÓN PADRE, MADRE O TUTOR</th></tr>
      <tr>
        <th style="width:15%">MADRE:</th><td colspan="2" class="content-cell">${esc(info.nivelMadre)}</td>
        <th style="width:15%">TUTOR:</th><td colspan="2" class="content-cell">${esc(info.nivelTutor)}</td>
      </tr>
      <tr>
        <th>PADRE:</th><td colspan="2" class="content-cell">${esc(info.nivelPadre)}</td>
        <th>LOS PADRES SON:</th><td colspan="2" class="content-cell">${esc(info.estadoCivil)}</td>
      </tr>
    </table>

    <div class="questions-flex">
      ${renderQ('1', '¿Cómo describe la conducta escolar del estudiante?', info.q1)}
      ${renderQ('2', '¿Ha tenido el estudiante algún inconveniente en el colegio? ¿Cómo usted lo ayudó?', info.q2)}
      ${renderQ('3', '¿Ha recibido el estudiante algún tipo de ayuda psicológica?', info.q3)}
      ${renderQ('4', '¿En qué zona viven de la ciudad? ¿Desde cuándo?', info.q4)}
      ${renderQ('5', '¿Cuáles hábitos de estudios tiene el niño?', info.q5)}
      ${renderQ('6', '¿Cuáles actividades realizan como familia?', info.q6)}
      ${renderQ('7', '¿Cuánto tiempo están juntos en la casa?', info.q7)}
      ${renderQ('8', '¿Qué espera usted de este Centro?', info.q8)}
      ${renderQ('9', '¿Ha agredido el estudiante a algún compañero? ¿Lo han agredido?', info.q9)}
    </div>
    <div class="footer-code">${esc(info.codigo)}</div>
  </div>

  <div class="pdf-page" id="page-2">
    <div class="questions-flex">
      ${renderQ('10', '¿Con quién vive el estudiante? En caso de no ser con su/s padre/s, ¿Por qué?', info.q10)}
      ${renderQ('11', '¿Por qué su familia quiere pertenecer a esta institución?', info.q11)}
      ${renderQ('12', 'En caso de que el estudiante venga de otra institución, ¿se presentó alguna dificultad? ¿Cómo entiende que podemos ayudar?', info.q12)}
      ${renderQ('13', 'Al estudiante: Háblanos un poco de tu familia, ¿Qué tiempo le dedicas al estudio?, ¿En cuál/es asignatura/s consideras que te destacas?', info.q13)}
      ${renderQ('14', 'Si el estudiante está sobreedad, ¿ha repetido algún curso? Si la respuesta es afirmativa ¿Por qué?', info.q14)}
      ${renderQ('15', '¿El niño o niña, ha presentado problemas para alfabetizarse?', info.q15)}
      ${renderQ('16', '¿Deseas estudiar en esta escuela? ¿Qué ha escuchado de este centro? ¿Qué te motiva a estar acá?', info.q16)}
      ${renderQ('17', '¿Cuál es el ingreso real de la familia?', info.q17)}
      ${renderQ('18', '¿Cuál es el aporte mensual con el que ustedes como familia podrían colaborar con la institución?', info.q18)}
      ${renderQ('', 'Teléfono padre, madre o tutor:', info.telefono)}
      ${renderQ('', 'OBSERVACIONES:', info.observaciones)}
    </div>

    <div class="sigs">
      <div class="sig-row"><strong>Entrevista realizada por:</strong> <span class="bb flex1">${esc(info.entrevistador)}</span></div>
      <div class="sig-row"><strong>Firma padres:</strong> <span class="bb flex1"></span></div>
    </div>
    <div class="footer-code">${esc(info.codigo)}</div>
  </div>`;
}

/**
 * VERSIÓN CORREGIDA DEFINITIVA
 * - Pregunta 9 perfectamente alineada (sin cortar ni mal posicionada)
 * - OBSERVACIONES más abajo (bajada unos 10px extra)
 * - Texto de respuestas "despegado" de la línea (espacio arriba de la línea)
 * - Espaciado exacto para que quepan las 9 preguntas en página 1 sin problemas
 */
export async function saveInterviewAsPdf(data = {}) {
  const info = getPrintableData(data);
  const fileName = `Entrevista_${info.nombre}_${info.apellido}.pdf`.replace(/\s+/g, '_');
  
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '215.9mm';
  container.innerHTML = `
    <style>
      .pdf-page { 
        width: 215.9mm; 
        height: 279.4mm; 
        padding: 15mm; 
        box-sizing: border-box; 
        background: white; 
        font-family: 'Helvetica', 'Arial', sans-serif; 
        font-size: 11.5px; 
        color: #000;
        display: flex;
        flex-direction: column;
      }
      .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
      .logo { height: 65px; width: auto; }
      .head { font-weight: bold; font-size: 17px; text-align: center; flex: 1; text-transform: uppercase; letter-spacing: 1px; }
      .meta-row-central { display: flex; justify-content: center; gap: 35px; margin-bottom: 15px; font-size: 12px; }
      .bb { border-bottom: 1px solid #000; padding: 0 6px; min-width: 90px; display: inline-block; text-align: left; }
      table.main-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; border: 1.5px solid #000; }
      table.main-table th, table.main-table td { border: 1px solid #000; padding: 6px; font-size: 10.5px; }
      .bg-gray { background: #f2f2f2; text-align: center !important; font-weight: bold; }
      .obra-grid { display: flex; justify-content: space-between; width: 100%; }
      .box { display: inline-block; width: 16px; height: 16px; border: 1px solid #000; margin-left: 6px; text-align: center; line-height: 16px; }

      /* === ESPACIADO AJUSTADO PARA QUE QUEPAN PERFECTO LAS 9 PREGUNTAS EN PÁGINA 1 === */
      .questions-flex { 
        flex: 1; 
        display: flex; 
        flex-direction: column; 
        gap: 11px; 
      }
      .q-block { 
        height: 48px; 
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }
      .q-label { 
        font-weight: bold; 
        margin-bottom: 3px; 
        font-size: 11.2px;
        line-height: 1.1;
      }
      /* === TEXTO DESPEGADO DE LA LÍNEA (espacio arriba) === */
      .q-line { 
        border-bottom: 1px solid #000; 
        height: 26px; 
        line-height: 20px;
        padding: 3px 4px 0 4px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 11.2px;
      }

      .sigs { margin-top: 25px; } /* ← OBSERVACIONES más abajo */
      .sig-row { display: flex; margin-bottom: 18px; align-items: baseline; }
      .flex1 { flex: 1; margin-left: 10px; }
      .footer-code { text-align: center; font-size: 10px; margin-top: auto; }
    </style>
    ${buildPrintableCoreHtml(data)}
  `;
  document.body.appendChild(container);

  try {
    const pdf = new jsPDF('p', 'mm', 'letter');
    
    const canvas1 = await html2canvas(container.querySelector('#page-1'), { 
      scale: 3, 
      useCORS: true, 
      allowTaint: true, 
      backgroundColor: '#ffffff' 
    });
    pdf.addImage(canvas1.toDataURL('image/png', 1.0), 'PNG', 0, 0, 215.9, 279.4);

    pdf.addPage();
    const canvas2 = await html2canvas(container.querySelector('#page-2'), { 
      scale: 3, 
      useCORS: true, 
      allowTaint: true, 
      backgroundColor: '#ffffff' 
    });
    pdf.addImage(canvas2.toDataURL('image/png', 1.0), 'PNG', 0, 0, 215.9, 279.4);

    const pdfBlob = pdf.output('blob');

    if ('showSaveFilePicker' in window) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: fileName,
          types: [{ description: 'PDF', accept: { 'application/pdf': ['.pdf'] } }]
        });
        const writable = await handle.createWritable();
        await writable.write(pdfBlob);
        await writable.close();
      } catch (err) {
        if (err.name !== 'AbortError') pdf.save(fileName);
      }
    } else {
      pdf.save(fileName);
    }

  } catch (error) {
    console.error("Error al generar PDF:", error);
  } finally {
    document.body.removeChild(container);
  }
}

export async function printInterviewPdfFormat(data = {}) {
  const info = getPrintableData(data);
  const fileName = `Entrevista_${info.nombre}_${info.apellido}`;
  const html = buildPdfPrintableHtml(data);
  
  const frame = document.createElement('iframe');
  frame.style.display = 'none';
  document.body.appendChild(frame);
  const doc = frame.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();

  frame.contentWindow.onload = () => {
    frame.contentWindow.document.title = fileName;
    setTimeout(() => {
      frame.contentWindow.focus();
      frame.contentWindow.print();
      document.body.removeChild(frame);
    }, 500);
  };
}

function buildPdfPrintableHtml(data = {}) {
  const name = pick(data, ['nombre']) || 'Entrevista';
  return `<!doctype html><html><head><meta charset="utf-8"/><title>Entrevista_${esc(name)}</title>
<style>
  @page { size: letter; margin: 8mm; }
  body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 11.5px; margin:0; padding:0; color: #000; }
  .pdf-page { height: 260mm; display: flex; flex-direction: column; overflow: hidden; page-break-after: always; padding: 15mm; box-sizing: border-box; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .logo { height: 60px; width: auto; }
  .head { font-weight: bold; font-size: 17px; text-align: center; flex: 1; text-transform: uppercase; letter-spacing: 1px; }
  .meta-row-central { display: flex; justify-content: center; gap: 35px; margin-bottom: 15px; font-size: 12px; width: 100%; }
  .bb { border-bottom: 1px solid #000; padding: 0 6px; min-width: 90px; display: inline-block; text-align: left; }
  table.main-table { width: 100%; border-collapse: collapse; table-layout: fixed; margin-bottom: 12px; border: 1.5px solid #000; }
  table.main-table th, table.main-table td { border: 1px solid #000; padding: 6px; font-size: 10.5px; }
  .bg-gray { background: #f2f2f2; text-align: center !important; font-weight: bold; font-size: 11px; }
  .content-cell { min-height: 18px; vertical-align: middle; }
  .text-center { text-align: center; }
  .obra-grid { display: flex; justify-content: space-between; width: 100%; padding: 2px 0; }
  .box { display: inline-block; width: 16px; height: 16px; border: 1px solid #000; margin-left: 6px; text-align: center; line-height: 16px; font-weight: bold; background: #fff; }

  .questions-flex { flex: 1; display: flex; flex-direction: column; gap: 11px; }
  .q-block { height: 48px; display: flex; flex-direction: column; justify-content: flex-end; }
  .q-label { font-weight: bold; margin-bottom: 3px; font-size: 11.2px; line-height: 1.1; }
  .q-line { border-bottom: 1px solid #000; height: 26px; line-height: 20px; padding: 3px 4px 0 4px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: 11.2px; }

  .sigs { margin-top: 25px; }
  .sig-row { display: flex; margin-bottom: 18px; align-items: baseline; }
  .flex1 { flex: 1; margin-left: 10px; }
  .footer-code { text-align: center; font-size: 10px; margin-top: auto; padding-top: 10px; }
</style></head>
<body>
  ${buildPrintableCoreHtml(data)}
</body></html>`;
}