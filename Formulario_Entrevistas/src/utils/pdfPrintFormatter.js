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

const yn = (value) => {
  if (!hasValue(value)) return '';
  const v = String(value).trim().toLowerCase();
  if (v === 'si' || v === 'sí' || v === 'yes' || v === 'true') return 'Sí';
  if (v === 'no' || v === 'false') return 'No';
  return String(value);
};

const mergeAnswer = (...parts) => parts.filter(hasValue).join(' ').trim();

function getPrintableData(data = {}) {
  return {
    fecha: pick(data, ['fecha', 'fecha_entrevista', 'fechaEntrevista']),
    formulario: pick(data, ['formulario', 'numero_formulario']),
    seccion: pick(data, ['seccion', 'sección']),
    nombreCompleto: pick(data, ['nombre_completo', 'nombreCompleto']) || `${pick(data, ['nombre', 'nombre_estudiante'])} ${pick(data, ['apellido', 'apellido_estudiante'])}`.trim(),
    entrevistaRealizadaPor: pick(data, ['entrevista_realizada_por', 'entrevistador', 'entrevistado_por']),
    q1: pick(data, ['conducta_escolar', 'pregunta_1', 'pregunta1', 'p1']),
    q2: pick(data, ['inconveniente_colegio', 'pregunta_2', 'pregunta2', 'p2']),
    q3: mergeAnswer(
      yn(pick(data, ['ayuda_psicologica', 'ayuda_psicologica_si_no', 'pregunta_3', 'pregunta3', 'p3'])),
      pick(data, ['ayuda_psicologica_detalle', 'detalle_ayuda_psicologica', 'pregunta_3_detalle', 'pregunta3_detalle']),
    ),
    q4: pick(data, ['habitos_estudio', 'habitos_de_estudio', 'pregunta_4', 'pregunta4', 'p4']),
    q5: pick(data, ['actividades_familia', 'actividades_en_familia', 'pregunta_5', 'pregunta5', 'p5']),
    q6: pick(data, ['tiempo_juntos_casa', 'tiempo_juntos', 'pregunta_6', 'pregunta6', 'p6']),
    q7: pick(data, ['espera_del_centro', 'expectativas_centro', 'pregunta_7', 'pregunta7', 'p7']),
    q8: mergeAnswer(
      yn(pick(data, ['agresion_estudiante', 'agresion_si_no', 'pregunta_8', 'pregunta8', 'p8'])),
      pick(data, ['agresion_estudiante_detalle', 'detalle_agresion', 'pregunta_8_detalle', 'pregunta8_detalle']),
    ),
    q9: pick(data, ['convivencia_estudiante', 'con_quien_vive', 'pregunta_9', 'pregunta9', 'p9']),
    q10: pick(data, ['motivo_pertenecer', 'motivo_institucion', 'pregunta_10', 'pregunta10', 'p10']),
    q11: pick(data, ['dificultad_otra_institucion', 'dificultades_otra_institucion', 'pregunta_11', 'pregunta11', 'p11']),
    q12: pick(data, ['respuesta_estudiante', 'hablanos_tu_familia', 'pregunta_12', 'pregunta12', 'p12']),
    q13: pick(data, ['sobredad_detalle', 'sobreedad_detalle', 'pregunta_13', 'pregunta13', 'p13']),
    q14: yn(pick(data, ['problemas_alfabetizarse', 'problemas_alfabetizacion', 'pregunta_14', 'pregunta14', 'p14'])),
    q15: pick(data, ['desea_estudiar', 'motiva_estudiar_escuela', 'pregunta_15', 'pregunta15', 'p15']),
    q16: pick(data, ['ingreso_familia', 'ingreso_real_familia', 'pregunta_16', 'pregunta16', 'p16']),
    q17: pick(data, ['aporte_mensual', 'aporte_sugerido', 'pregunta_17', 'pregunta17', 'p17']),
    q18: pick(data, ['telefono', 'telefono_contacto', 'telefono_padre_madre_tutor', 'pregunta_18', 'pregunta18', 'p18']),
    observaciones: pick(data, ['observaciones', 'nota_observaciones']),
  };
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
  @page { size: letter; margin: 14mm 10mm 16mm 10mm; }
  body { font-family: Arial, sans-serif; font-size: 12px; color: #111; margin: 0; }
  .wrap { padding-bottom: 28px; }
  .header { display: grid; grid-template-columns: 48px 1fr 48px; align-items: center; margin-bottom: 8px; }
  .logo { width: 42px; height: 42px; object-fit: contain; }
  .head { font-weight: 700; text-align: center; font-size: 13px; }
  .row { margin: 7px 0; }
  .label { font-weight: 700; margin-bottom: 2px; }
  .value { white-space: pre-wrap; min-height: 18px; border-bottom: 1px solid #000; padding-bottom: 2px; }
  .footer { position: fixed; left: 0; right: 0; bottom: 0; text-align: center; font-size: 11px; color: #333; padding: 4px 0; background: #fff; }
</style></head>
<body>
  <div class="wrap">
    <div class="header">
      <img class="logo" src="/logoipisa.png" alt="Logo IPISA" onerror="if(!this.dataset.a){this.dataset.a='1';this.src='logoipisa.png';}else if(!this.dataset.b){this.dataset.b='1';this.src='./logoipisa.png';}else{this.style.display='none';}" />
      <div class="head">PLANILLA PARA ENTREVISTA FAMILIAR</div>
      <div></div>
    </div>

    <div class="row"><div class="label">Fecha de entrevista:</div><div class="value">${esc(info.fecha)}</div></div>
    <div class="row"><div class="label">Formulario:</div><div class="value">${esc(info.formulario)}</div></div>
    <div class="row"><div class="label">Sección:</div><div class="value">${esc(info.seccion)}</div></div>
    <div class="row"><div class="label">Nombre(s) y Apellido(s) del estudiante:</div><div class="value">${esc(info.nombreCompleto)}</div></div>
    ${q.map(([label, value]) => `<div class="row"><div class="label">${esc(label)}</div><div class="value">${esc(value)}</div></div>`).join('')}
    <div class="row" style="margin-top:14px;"><div class="label">Entrevista realizada por:</div><div class="value">${esc(info.entrevistaRealizadaPor)}</div></div>
  </div>

  <div class="footer">Código: P-AD-01-F-04 | Rev. 03</div>
</body></html>`;
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
  }, 150);

  return true;
}

export function printInterviewPdfFormat(data = {}) {
  const html = buildPdfPrintableHtml(data);

  const printed = printFromIframe(html);
  if (printed) return;

  const w = window.open('', '_blank');
  if (!w) return;
  w.document.open();
  w.document.write(html);
  w.document.close();
  w.focus();
  w.print();
}


export * from './pdfPrintFormatter';

