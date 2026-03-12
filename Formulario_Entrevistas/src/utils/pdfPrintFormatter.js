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

const ynPrintable = (value) => {
  if (!hasValue(value)) return '';
  const v = String(value).trim().toLowerCase();
  if (['si', 'sí', 'yes', 'true'].includes(v)) return 'Sí';
  if (['no', 'false'].includes(v)) return '';
  return String(value);
};

const mergeAnswer = (...parts) => parts.filter(hasValue).join(' ').trim();

const asList = (value) => {
  if (Array.isArray(value)) return value;
  if (hasValue(value)) return [String(value)];
  return [];
};

function getPrintableData(data = {}) {
  const entrevistados = asList(pick(data, ['entrevistados', 'informacion_entrevistado', 'entrevistado'])).map((item) => {
    if (typeof item === 'object' && item) {
      return {
        nombre: pick(item, ['nombre', 'entrevistado', 'nombre_completo']),
        parentesco: pick(item, ['parentesco', 'relacion']),
      };
    }
    return { nombre: String(item), parentesco: '' };
  });

  return {
    fecha: pick(data, ['fecha', 'fecha_entrevista', 'fechaEntrevista', 'fecha_entrevista_familiar']),
    formulario: pick(data, ['formulario', 'numero_formulario', 'formulario_numero']),
    seccion: pick(data, ['seccion', 'sección', 'seccion_grupo']),
    codigo: 'Código: P-AD-01-F-04 | Rev. 03',
    nombreCompleto:
      pick(data, ['nombre_completo', 'nombreCompleto', 'estudiante_nombre_completo'])
      || `${pick(data, ['nombre', 'nombre_estudiante'])} ${pick(data, ['apellido', 'apellido_estudiante'])}`.trim(),
    sexo: pick(data, ['sexo', 'genero', 'género']),
    edad: pick(data, ['edad']),
    entrevistados,
    entrevistado1: pick(data, ['entrevistado_1', 'entrevistado1_nombre']),
    parentesco1: pick(data, ['parentesco_1', 'parentesco1']),
    entrevistado2: pick(data, ['entrevistado_2', 'entrevistado2_nombre']),
    parentesco2: pick(data, ['parentesco_2', 'parentesco2']),
    nivelTutor: mergeAnswer(
      pick(data, ['nivel_madre', 'nivel_academico_madre']),
      pick(data, ['nivel_padre', 'nivel_academico_padre']),
    ),
    obraSalesiana: [
      'Oratorio',
      'Centro Juvenil',
      'Cooperador',
      'Traslado',
      'Exalumno',
    ].filter((opt) => String(pick(data, ['obra_salesiana', 'vinculacion_institucional', 'procede_obra_salesiana', opt.toLowerCase()])).toLowerCase().includes(opt.toLowerCase())).join(', ')
      || pick(data, ['obra_salesiana', 'vinculacion_institucional', 'procede_obra_salesiana']),
    relacionSalesiana: pick(data, ['relacion_salesiana', 'detalle_relacion_salesiana', 'vinculacion_detalle']),
    entrevistaRealizadaPor: pick(data, ['entrevista_realizada_por', 'entrevistador', 'entrevistado_por', 'realizada_por']),
    q1: pick(data, ['conducta_escolar', 'pregunta_1', 'pregunta1', 'p1']),
    q2: pick(data, ['inconveniente_colegio', 'pregunta_2', 'pregunta2', 'p2']),
    q3: mergeAnswer(
      ynPrintable(pick(data, ['ayuda_psicologica', 'ayuda_psicologica_si_no', 'pregunta_3', 'pregunta3', 'p3'])),
      pick(data, ['ayuda_psicologica_detalle', 'detalle_ayuda_psicologica', 'pregunta_3_detalle', 'pregunta3_detalle']),
    ),
    q4: pick(data, ['habitos_estudio', 'habitos_de_estudio', 'pregunta_4', 'pregunta4', 'p4']),
    q5: pick(data, ['actividades_familia', 'actividades_en_familia', 'pregunta_5', 'pregunta5', 'p5']),
    q6: pick(data, ['tiempo_juntos_casa', 'tiempo_juntos', 'pregunta_6', 'pregunta6', 'p6']),
    q7: pick(data, ['espera_del_centro', 'expectativas_centro', 'pregunta_7', 'pregunta7', 'p7']),
    q8: mergeAnswer(
      ynPrintable(pick(data, ['agresion_estudiante', 'agresion_si_no', 'pregunta_8', 'pregunta8', 'p8'])),
      pick(data, ['agresion_estudiante_detalle', 'detalle_agresion', 'pregunta_8_detalle', 'pregunta8_detalle']),
    ),
    q9: pick(data, ['convivencia_estudiante', 'con_quien_vive', 'pregunta_9', 'pregunta9', 'p9']),
    q10: pick(data, ['motivo_pertenecer', 'motivo_institucion', 'pregunta_10', 'pregunta10', 'p10']),
    q11: pick(data, ['dificultad_otra_institucion', 'dificultades_otra_institucion', 'pregunta_11', 'pregunta11', 'p11']),
    q12: pick(data, ['respuesta_estudiante', 'hablanos_tu_familia', 'pregunta_12', 'pregunta12', 'p12']),
    q13: pick(data, ['sobredad_detalle', 'sobreedad_detalle', 'pregunta_13', 'pregunta13', 'p13']),
    q14: ynPrintable(pick(data, ['problemas_alfabetizarse', 'problemas_alfabetizacion', 'pregunta_14', 'pregunta14', 'p14'])),
    q15: pick(data, ['desea_estudiar', 'motiva_estudiar_escuela', 'pregunta_15', 'pregunta15', 'p15']),
    q16: pick(data, ['ingreso_familia', 'ingreso_real_familia', 'pregunta_16', 'pregunta16', 'p16']),
    q17: pick(data, ['aporte_mensual', 'aporte_sugerido', 'pregunta_17', 'pregunta17', 'p17']),
    q18: pick(data, ['telefono', 'telefono_contacto', 'telefono_padre_madre_tutor', 'pregunta_18', 'pregunta18', 'p18']),
    observaciones: pick(data, ['observaciones', 'nota_observaciones']),
  };
}

function renderEntrevistados(info) {
  if (info.entrevistados.length > 0) {
    return info.entrevistados.map((e, idx) => `
      <div class="row"><div class="label">Entrevistado ${idx + 1}:</div><div class="value">${esc(e.nombre)}</div></div>
      <div class="row"><div class="label">Parentesco:</div><div class="value">${esc(e.parentesco)}</div></div>
    `).join('');
  }

  return `
    <div class="row"><div class="label">Entrevistado 1:</div><div class="value">${esc(info.entrevistado1)}</div></div>
    <div class="row"><div class="label">Parentesco:</div><div class="value">${esc(info.parentesco1)}</div></div>
    <div class="row"><div class="label">Entrevistado 2:</div><div class="value">${esc(info.entrevistado2)}</div></div>
    <div class="row"><div class="label">Parentesco:</div><div class="value">${esc(info.parentesco2)}</div></div>
  `;
}

export function buildPdfPrintableHtml(data = {}) {
  const info = getPrintableData(data);

  const q = [
    ['1. ¿Cómo describe la conducta escolar del estudiante?', info.q1],
    ['2. ¿Ha tenido el estudiante algún inconveniente en el colegio? ¿Cómo usted lo ayudó?', info.q2],
    ['3. ¿Ha recibido el estudiante algún tipo de ayuda psicológica?', info.q3],
    ['4. ¿Cuáles hábitos de estudio tiene su niño?', info.q4],
    ['5. ¿Cuáles actividades realizan como familia?', info.q5],
    ['6. ¿Cuánto tiempo están juntos en la casa?', info.q6],
    ['7. ¿Qué espera usted de este Centro?', info.q7],
    ['8. ¿Ha agredido el estudiante a algún compañero? ¿Lo han agredido?', info.q8],
    ['9. ¿Con quién vive el estudiante? En caso de no ser con su(s) padre(s), ¿Por qué?', info.q9],
    ['10. ¿Por qué su familia quiere pertenecer a esta institución?', info.q10],
    ['11. En caso de que el estudiante venga de otra institución, ¿se presentó alguna dificultad? ¿Cómo entiende que podemos ayudar?', info.q11],
    ['12. Al estudiante: Háblanos un poco de tu familia, ¿qué tiempo le dedicas al estudio?, ¿en qué(s) asignatura(s) considera(s) que te destacas?', info.q12],
    ['13. Si el estudiante está sobreedad, ¿ha repetido algún curso? ¿Por qué?', info.q13],
    ['14. Si el niño o niña ha presentado problemas para alfabetizarse?', info.q14],
    ['15. ¿Deseas estudiar en esta escuela? ¿Qué has escuchado de este centro? ¿Qué te motiva a estar acá?', info.q15],
    ['16. ¿Cuál es el ingreso real de la familia?', info.q16],
    ['17. ¿Cuál es el aporte mensual con el que ustedes como familia podrían colaborar con la institución?', info.q17],
    ['18. Teléfono padre, madre o tutor.', info.q18],
    ['OBSERVACIONES:', info.observaciones],
  ];

  return `<!doctype html>
<html><head><meta charset="utf-8" /><title>Entrevista Familiar</title>
<style>
  @page { size: letter; margin: 14mm 10mm 14mm 10mm; }
  body { font-family: Arial, sans-serif; font-size: 12px; color: #111; margin: 0; }
  .header { display: grid; grid-template-columns: 56px 1fr 56px; align-items: center; margin-bottom: 8px; column-gap: 12px; }
  .logo { width: 56px; height: 56px; object-fit: contain; }
  .logo-left { justify-self: start; }
  .logo-right { justify-self: end; }
  .head { font-weight: 700; text-align: center; font-size: 13px; }
  .meta-row { display: grid; grid-template-columns: minmax(0,1.4fr) minmax(0,1fr) minmax(0,1fr); gap: 14px; margin: 8px 0 8px; }
  .meta-item { display: flex; align-items: center; gap: 6px; min-width: 0; }
  .meta-label { font-weight: 700; white-space: nowrap; }
  .meta-value { display: inline-block; min-width: 50px; width: 100%; border-bottom: 1px solid #000; line-height: 1.2; min-height: 16px; overflow-wrap: anywhere; }
  .code-top { text-align: right; font-size: 10px; color: #333; margin-bottom: 8px; }
  .row { margin: 6px 0; break-inside: avoid-page; page-break-inside: avoid; }
  .label { font-weight: 700; margin-bottom: 2px; }
  .value { white-space: pre-wrap; overflow-wrap: anywhere; min-height: 16px; border-bottom: 1px solid #000; padding-bottom: 2px; }
  .footer { margin-top: 10px; text-align: center; font-size: 11px; color: #333; break-inside: avoid-page; page-break-inside: avoid; }
</style></head>
<body>
  <div class="header">
    <img class="logo logo-left" src="/logosalesianos.jpg" alt="Logo Salesianos" onerror="if(!this.dataset.a){this.dataset.a='1';this.src='logosalesianos.jpg';}else if(!this.dataset.b){this.dataset.b='1';this.src='./logosalesianos.jpg';}else{this.style.display='none';}" />
    <div class="head">PLANILLA PARA ENTREVISTA FAMILIAR</div>
    <img class="logo logo-right" src="/logoipisa.png" alt="Logo IPISA" onerror="if(!this.dataset.a){this.dataset.a='1';this.src='logoipisa.png';}else if(!this.dataset.b){this.dataset.b='1';this.src='./logoipisa.png';}else{this.style.display='none';}" />
  </div>

  <div class="meta-row">
    <div class="meta-item"><span class="meta-label">Fecha de entrevista:</span><span class="meta-value">${esc(info.fecha)}</span></div>
    <div class="meta-item"><span class="meta-label">Formulario:</span><span class="meta-value">${esc(info.formulario)}</span></div>
    <div class="meta-item"><span class="meta-label">Sección:</span><span class="meta-value">${esc(info.seccion)}</span></div>
  </div>
  <div class="code-top">${esc(info.codigo)}</div>

  <div class="row"><div class="label">Nombre(s) y Apellido(s) del estudiante:</div><div class="value">${esc(info.nombreCompleto)}</div></div>
  <div class="row"><div class="label">Sexo:</div><div class="value">${esc(info.sexo)}</div></div>
  <div class="row"><div class="label">Edad:</div><div class="value">${esc(info.edad)}</div></div>
  <div class="row"><div class="label">Información del Entrevistado:</div><div class="value">&nbsp;</div></div>
  ${renderEntrevistados(info)}
  <div class="row"><div class="label">Nivel académico del Tutor(a):</div><div class="value">${esc(info.nivelTutor)}</div></div>
  <div class="row"><div class="label">Vinculación Institucional:</div><div class="value">${esc(info.obraSalesiana)}</div></div>
  <div class="row"><div class="label">Especifique la relación (ej: exalumno, trabaja, animador, etc.):</div><div class="value">${esc(info.relacionSalesiana)}</div></div>

  ${q.map(([label, value]) => `<div class="row"><div class="label">${esc(label)}</div><div class="value">${esc(value)}</div></div>`).join('')}
  <div class="row" style="margin-top:12px;"><div class="label">Entrevista realizada por:</div><div class="value">${esc(info.entrevistaRealizadaPor)}</div></div>
  <div class="footer">${esc(info.codigo)}</div>
</body></html>`;
}

function openPrintableWindow(html) {
  const w = window.open('', '_blank');
  if (!w) return null;
  w.document.open();
  w.document.write(html);
  w.document.close();
  return w;
}

function printFromIframe(html) {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc || !iframe.contentWindow) {
    document.body.removeChild(iframe);
    return false;
  }

  doc.open();
  doc.write(html);
  doc.close();

  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => {
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
    }, 500);
  }, 180);

  return true;
}

export function saveInterviewAsPdf(data = {}) {
  const html = buildPdfPrintableHtml(data);
  const w = openPrintableWindow(html);
  if (!w) return;

  setTimeout(() => {
    w.focus();
    w.print();
  }, 250);
}

export function printInterviewPdfFormat(data = {}) {
  const html = buildPdfPrintableHtml(data);

  const printed = printFromIframe(html);
  if (printed) return;

  const w = openPrintableWindow(html);
  if (!w) return;
  setTimeout(() => {
    w.focus();
    w.print();
  }, 250);
}


export * from './pdfPrintFormatter';
