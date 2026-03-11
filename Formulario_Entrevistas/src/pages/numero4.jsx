import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { printInterviewPdfFormat } from '../utils/pdfPrintFormatter';

function Numero4() {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [saved, setSaved] = useState(() => JSON.parse(localStorage.getItem('entrevista') || '{}'));
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPrintConfirm, setShowPrintConfirm] = useState(false);

  const [mostrarCondicionSaludDetalle, setMostrarCondicionSaludDetalle] = useState(saved.condicion_salud === 'Si');
  const [mostrarMedicamentoDetalle, setMostrarMedicamentoDetalle] = useState(
    saved.medicamento === 'Si' || saved.medicamento === 'Tal vez',
  );
  const [mostrarOtroSupervisor, setMostrarOtroSupervisor] = useState(saved.supervisor_extraescolar === 'Otro');
  const [mostrarPadresFueraDetalle, setMostrarPadresFueraDetalle] = useState(saved.padres_fuera === 'Si');
  const [mostrarTipoCasaOtro, setMostrarTipoCasaOtro] = useState(saved.tipo_casa === 'Otros');

  let initialHermanos = [];
  if (saved.hermanos) {
    initialHermanos = saved.hermanos;
  } else if (saved.hermanos_nombre) {
    initialHermanos = [{ nombre: saved.hermanos_nombre, anio: saved.hermanos_anio, taller: saved.hermanos_taller }];
  }

  const [hermanos, setHermanos] = useState(initialHermanos);
  const [mostrarHermanosDetalle, setMostrarHermanosDetalle] = useState(
    saved.hermanos_exalumnos_si_no === 'Si' || initialHermanos.length > 0,
  );

  const addHermano = () => setHermanos([...hermanos, { nombre: '', anio: '', taller: '' }]);

  const removeHermano = (indexToRemove) => {
    if (hermanos.length > 1) {
      setHermanos(hermanos.filter((_, idx) => idx !== indexToRemove));
    }
  };

  const saveFormData = (target) => {
    const form = new FormData(target ?? formRef.current);
    const values = Object.fromEntries(form.entries());
    const data = { ...saved, ...values };

    if (values.condicion_salud !== 'Si') data.condicion_salud_detalle = '';
    if (values.medicamento !== 'Si' && values.medicamento !== 'Tal vez') data.medicamento_detalle = '';
    if (values.supervisor_extraescolar !== 'Otro') {
      data.supervisor_otro = '';
      data.supervisor_otro_especifico = '';
    }
    if (values.padres_fuera !== 'Si') {
      data.padres_fuera_detalle = '';
      data.pais_residencia = '';
      data.observaciones_padres_fuera = '';
    }
    if (values.tipo_casa !== 'Otros') data.tipo_casa_otro = '';

    data.hermanos = [];
    let i = 0;
    while (true) {
      const nombre = values[`hermanos[${i}].nombre`];
      if (!nombre) break;
      const anio = values[`hermanos[${i}].anio`];
      const taller = values[`hermanos[${i}].taller`];
      data.hermanos.push({ nombre, anio, taller });
      i += 1;
    }
    if (values.hermanos_exalumnos_si_no !== 'Si') data.hermanos = [];

    localStorage.setItem('entrevista', JSON.stringify(data));
    setSaved(data);

    return data;
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    saveFormData(e?.target);
    setShowSuccess(true);
  };

  const handlePrint = () => setShowPrintConfirm(true);

  const confirmPrint = () => {
    setShowPrintConfirm(false);
    const data = saveFormData(formRef.current);

    // Impresión separada: usa únicamente el formato de la planilla PDF
    // (preguntas del PDF) y NO incluye las preguntas extras del Paso 4.
    printInterviewPdfFormat(data);
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    navigate('/');
  };

  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="p-8 pb-4 text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-8">Entrevista Familiar</h1>

          <div className="flex items-center justify-center gap-4 md:gap-8 max-w-3xl mx-auto px-6 md:px-12 mb-12">
            <div className="flex flex-col items-center relative z-10">
              <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold mb-2 shadow-lg shadow-green-600/30 cursor-pointer" onClick={() => navigate('/')}>
                1
              </div>
              <span className="text-xs font-semibold text-green-600">Datos Básicos</span>
            </div>
            <div className="h-1 bg-green-600 flex-grow" />
            <div className="flex flex-col items-center relative z-10">
              <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold mb-2 shadow-lg shadow-green-600/30 cursor-pointer" onClick={() => navigate('/paso2')}>
                2
              </div>
              <span className="text-xs font-semibold text-green-600">Entorno Familiar</span>
            </div>
            <div className="h-1 bg-green-600 flex-grow" />
            <div className="flex flex-col items-center relative z-10">
              <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold mb-2 shadow-lg shadow-green-600/30 cursor-pointer" onClick={() => navigate('/paso3')}>
                3
              </div>
              <span className="text-xs font-semibold text-green-600">Expectativas</span>
            </div>
            <div className="h-1 bg-[#4682B4] flex-grow" />
            <div className="flex flex-col items-center relative z-10">
              <div className="w-10 h-10 rounded-full bg-[#4682B4] text-white flex items-center justify-center font-bold mb-2 shadow-lg shadow-blue-900/20">
                4
              </div>
              <span className="text-xs font-semibold text-[#4682B4]">Preguntas Extras</span>
            </div>
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="p-8 pt-0 space-y-10">
          <div className="pt-6 border-t border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-[#4682B4] text-2xl">question_mark</span>
              <h2 className="text-xl font-semibold text-slate-800">Preguntas Extras</h2>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  20. ¿Padece su hijo de alguna condición de salud física o mental? ¿Requiere tratamiento?
                </label>
                <div className="flex gap-8 items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="condicion_salud" value="Si" checked={mostrarCondicionSaludDetalle} onChange={() => setMostrarCondicionSaludDetalle(true)} className="w-5 h-5 accent-[#4682B4]" />
                    <span className="text-sm text-slate-700">Sí</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="condicion_salud" value="No" checked={!mostrarCondicionSaludDetalle} onChange={() => setMostrarCondicionSaludDetalle(false)} className="w-5 h-5 accent-[#4682B4]" />
                    <span className="text-sm text-slate-700">No</span>
                  </label>
                </div>
                {mostrarCondicionSaludDetalle && (
                  <textarea name="condicion_salud_detalle" defaultValue={saved.condicion_salud_detalle || ''} placeholder="Explique la condición y tratamiento..." className="mt-4 w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100" rows={3} />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">21. ¿Toma su hijo(a) algún medicamento fijo o regularmente?</label>
                <div className="flex gap-6 items-center flex-wrap">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="medicamento" value="Si" checked={saved.medicamento === 'Si'} onChange={() => { setMostrarMedicamentoDetalle(true); setSaved((prev) => ({ ...prev, medicamento: 'Si' })); }} className="w-5 h-5 accent-[#4682B4]" />
                    <span className="text-sm text-slate-700">Sí</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="medicamento" value="No" checked={saved.medicamento === 'No'} onChange={() => { setMostrarMedicamentoDetalle(false); setSaved((prev) => ({ ...prev, medicamento: 'No' })); }} className="w-5 h-5 accent-[#4682B4]" />
                    <span className="text-sm text-slate-700">No</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="medicamento" value="Tal vez" checked={saved.medicamento === 'Tal vez'} onChange={() => { setMostrarMedicamentoDetalle(true); setSaved((prev) => ({ ...prev, medicamento: 'Tal vez' })); }} className="w-5 h-5 accent-[#4682B4]" />
                    <span className="text-sm text-slate-700">Tal vez</span>
                  </label>
                </div>
                {mostrarMedicamentoDetalle && (
                  <textarea name="medicamento_detalle" defaultValue={saved.medicamento_detalle || ''} placeholder="¿Cuál(es)? Dosis y frecuencia si aplica..." className="mt-4 w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100" rows={2} />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">22. ¿Quién supervisa al estudiante durante actividades extraescolares?</label>
                <div className="flex gap-8 items-center flex-wrap">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="supervisor_extraescolar" value="Madre" checked={saved.supervisor_extraescolar === 'Madre'} onChange={() => setMostrarOtroSupervisor(false)} className="w-5 h-5 accent-[#4682B4]" />
                    <span className="text-sm text-slate-700">Madre</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="supervisor_extraescolar" value="Padre" checked={saved.supervisor_extraescolar === 'Padre'} onChange={() => setMostrarOtroSupervisor(false)} className="w-5 h-5 accent-[#4682B4]" />
                    <span className="text-sm text-slate-700">Padre</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="supervisor_extraescolar" value="Otro" checked={mostrarOtroSupervisor} onChange={() => setMostrarOtroSupervisor(true)} className="w-5 h-5 accent-[#4682B4]" />
                    <span className="text-sm text-slate-700">Otro</span>
                  </label>
                </div>

                {mostrarOtroSupervisor && (
                  <div className="mt-4 space-y-4">
                    <div className="flex gap-6 flex-wrap">
                      {['Tutor legal', 'Madrastra', 'Padrastro'].map((opt) => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="supervisor_otro" value={opt} defaultChecked={saved.supervisor_otro === opt} className="w-5 h-5 accent-[#4682B4]" />
                          <span className="text-sm text-slate-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Otro (especifique):</label>
                      <input type="text" name="supervisor_otro_especifico" defaultValue={saved.supervisor_otro_especifico || ''} placeholder="Ej: Abuela, tío, hermano mayor..." className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">23. ¿Alguno de los padres reside fuera del país?</label>
                <div className="flex gap-8 items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="padres_fuera" value="Si" checked={mostrarPadresFueraDetalle} onChange={() => setMostrarPadresFueraDetalle(true)} className="w-5 h-5 accent-[#4682B4]" />
                    <span className="text-sm text-slate-700">Sí</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="padres_fuera" value="No" checked={!mostrarPadresFueraDetalle} onChange={() => setMostrarPadresFueraDetalle(false)} className="w-5 h-5 accent-[#4682B4]" />
                    <span className="text-sm text-slate-700">No</span>
                  </label>
                </div>

                {mostrarPadresFueraDetalle && (
                  <div className="mt-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">Especifique cuál:</label>
                      <div className="flex gap-8 items-center flex-wrap">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="padres_fuera_detalle" value="Madre" defaultChecked={saved.padres_fuera_detalle === 'Madre'} className="w-5 h-5 accent-[#4682B4]" />
                          <span className="text-sm text-slate-700">Madre</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="padres_fuera_detalle" value="Padre" defaultChecked={saved.padres_fuera_detalle === 'Padre'} className="w-5 h-5 accent-[#4682B4]" />
                          <span className="text-sm text-slate-700">Padre</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="padres_fuera_detalle" value="Ambos" defaultChecked={saved.padres_fuera_detalle === 'Ambos'} className="w-5 h-5 accent-[#4682B4]" />
                          <span className="text-sm text-slate-700">Ambos</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">País de residencia</label>
                      <div className="relative max-w-md">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 material-symbols-outlined">public</span>
                        <select name="pais_residencia" defaultValue={saved.pais_residencia || ''} className="appearance-none w-full pl-14 pr-14 py-4 rounded-lg border border-slate-300 bg-white text-slate-700 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer">
                          <option value="">Seleccione país...</option>
                          <option value="Estados Unidos">Estados Unidos</option>
                          <option value="España">España</option>
                          <option value="Italia">Italia</option>
                          <option value="Francia">Francia</option>
                          <option value="Alemania">Alemania</option>
                          <option value="Canadá">Canadá</option>
                          <option value="Chile">Chile</option>
                          <option value="Argentina">Argentina</option>
                          <option value="Colombia">Colombia</option>
                          <option value="Venezuela">Venezuela</option>
                          <option value="Perú">Perú</option>
                          <option value="México">México</option>
                          <option value="Puerto Rico">Puerto Rico</option>
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#4682B4] material-symbols-outlined">expand_more</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Observaciones adicionales</label>
                      <textarea name="observaciones_padres_fuera" defaultValue={saved.observaciones_padres_fuera || ''} placeholder="Detalles sobre la situación, tiempo fuera, envíos de dinero, visitas, etc..." className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none min-h-[100px]" rows={4} />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">24. La casa en que viven es:</label>
                <div className="flex gap-6 items-center flex-wrap">
                  {['Propia', 'Rentada', 'Prestada', 'Otros'].map((v) => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="tipo_casa" value={v} checked={saved.tipo_casa === v} onChange={(e) => setMostrarTipoCasaOtro(e.target.value === 'Otros')} className="w-5 h-5 accent-[#4682B4]" />
                      <span className="text-sm text-slate-700">{v}</span>
                    </label>
                  ))}
                </div>

                {mostrarTipoCasaOtro && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Especifique:</label>
                    <div className="relative max-w-md">
                      <select name="tipo_casa_otro" defaultValue={saved.tipo_casa_otro || ''} className="appearance-none w-full pl-5 pr-14 py-4 rounded-lg border border-slate-300 bg-white text-slate-700 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer">
                        <option value="">Seleccione una opción</option>
                        <option value="Hipotecada">Hipotecada</option>
                        <option value="Familiar (de padres o abuelos)">Familiar (de padres o abuelos)</option>
                        <option value="Cedida">Cedida</option>
                        <option value="Alquilada">Alquilada</option>
                        <option value="En proceso de compra">En proceso de compra</option>
                        <option value="Vivienda compartida">Vivienda compartida</option>
                        <option value="Vivienda provisional">Vivienda provisional</option>
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#4682B4] material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">25. Estado de los padres:</label>
                <div className="flex gap-6 items-center flex-wrap">
                  {['Ambos viven', 'Solo vive la madre', 'Solo vive el padre', 'Ninguno vive'].map((v) => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="estado_padres" value={v} defaultChecked={saved.estado_padres === v} className="w-5 h-5 accent-[#4682B4]" />
                      <span className="text-sm text-slate-700">{v}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">26. ¿Con quién convive el estudiante?</label>
                <div className="flex gap-6 items-center flex-wrap">
                  {['Con ambos', 'Solo con la madre', 'Solo con el padre', 'No convive con ninguno'].map((v) => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="convive_padres" value={v} defaultChecked={saved.convive_padres === v} className="w-5 h-5 accent-[#4682B4]" />
                      <span className="text-sm text-slate-700">{v}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">27. ¿Existe alguna de las siguientes figuras en el núcleo familiar?</label>
                <div className="flex gap-6 items-center flex-wrap">
                  {['Madrastra', 'Padrastro', 'Ambos', 'Ninguno'].map((v) => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="figuras_familiares" value={v} defaultChecked={saved.figuras_familiares === v} className="w-5 h-5 accent-[#4682B4]" />
                      <span className="text-sm text-slate-700">{v}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">28. ¿Tiene algún hermano(a) o exalumno en IPISA?</label>
                <div className="flex gap-8 items-center mb-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="hermanos_exalumnos_si_no"
                      value="Si"
                      checked={mostrarHermanosDetalle}
                      onChange={() => {
                        setMostrarHermanosDetalle(true);
                        if (hermanos.length === 0) addHermano();
                      }}
                      className="w-5 h-5 accent-[#4682B4]"
                    />
                    <span className="text-sm text-slate-700">Sí</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="hermanos_exalumnos_si_no"
                      value="No"
                      checked={!mostrarHermanosDetalle}
                      onChange={() => {
                        setMostrarHermanosDetalle(false);
                        setHermanos([]);
                      }}
                      className="w-5 h-5 accent-[#4682B4]"
                    />
                    <span className="text-sm text-slate-700">No</span>
                  </label>
                </div>

                {mostrarHermanosDetalle && (
                  <div className="space-y-5">
                    {hermanos.map((h, index) => (
                      <div key={index} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative">
                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                          <h4 className="text-base font-semibold text-slate-800">Hermano/a o exalumno {index + 1}</h4>
                          {hermanos.length > 1 && (
                            <button type="button" onClick={() => removeHermano(index)} className="flex items-center gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md transition-all text-sm font-medium">
                              <span className="material-symbols-outlined text-red-500">delete</span>
                              Eliminar
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre completo</label>
                            <input name={`hermanos[${index}].nombre`} type="text" defaultValue={h.nombre} placeholder="Ej: Ana López" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Taller</label>
                            <div className="relative">
                              <select name={`hermanos[${index}].taller`} defaultValue={h.taller} className="appearance-none w-full px-4 py-3 pr-10 rounded-lg border border-slate-300 bg-white text-slate-700 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer transition-all">
                                <option value="">Seleccione taller</option>
                                <option value="INFO">INFO</option>
                                <option value="GAT">GAT</option>
                                <option value="CYP">CYP</option>
                                <option value="EBA">EBA</option>
                                <option value="MECA">MECA</option>
                                <option value="AUTO">AUTO</option>
                                <option value="ELDAD">ELDAD</option>
                                <option value="ELCA">ELCA</option>
                              </select>
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 material-symbols-outlined">expand_more</span>
                            </div>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Año de graduación (si aplica)</label>
                            <input name={`hermanos[${index}].anio`} type="number" defaultValue={h.anio} placeholder="Ej: 2023" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-center mt-6">
                      <button type="button" onClick={addHermano} className="px-6 py-2.5 bg-[#4682B4]/10 hover:bg-[#4682B4]/20 text-[#4682B4] rounded-lg border border-[#4682B4]/30 transition-all font-medium flex items-center gap-2 shadow-sm">
                        <span className="material-symbols-outlined">add</span>
                        Agregar otra persona
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">29. Valoración de la familia</label>
                <div className="relative max-w-md">
                  <select name="valoracion_familia" defaultValue={saved.valoracion_familia || ''} className="appearance-none w-full pl-5 pr-14 py-4 rounded-lg border border-slate-300 bg-white text-slate-700 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer">
                    <option value="">Seleccione</option>
                    <option value="100">100 - Familias muy necesitadas, viven en situación de pobreza</option>
                    <option value="75">75 - Familias necesitadas, pero estables, trabaja solo uno de los padres, salario promedio</option>
                    <option value="50">50 - Familias estables, pocos miembros en la familia, ambos padres trabajan, son profesionales</option>
                    <option value="25">25 - Familias estables económicamente, ambos padres trabajan, ingresos superior a $100,000</option>
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#4682B4] material-symbols-outlined">expand_more</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">El 100 se le da prioridad y el 25 menos prioridad</p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400 order-2 sm:order-1">Código: P-AD-01-F-04 | Rev. 03</p>

            <div className="flex gap-4 w-full sm:w-auto order-1 sm:order-2">
              <button type="button" onClick={() => navigate('/paso3')} className="flex-1 sm:flex-none px-8 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">arrow_back</span>
                Volver atrás
              </button>
              <button type="button" onClick={handlePrint} className="flex-1 sm:flex-none px-8 py-3 rounded-xl border border-[#4682B4] text-[#4682B4] font-medium hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">print</span>
                Imprimir
              </button>
              <button type="submit" className="flex-1 sm:flex-none bg-[#4682B4] text-white px-10 py-3 rounded-xl font-semibold shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2">
                Guardar y Finalizar
                <span className="material-symbols-outlined">check_circle</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm z-50">
          <div className="bg-white p-7 rounded-2xl shadow-2xl max-w-sm w-full text-center border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-800 mb-5">Entrevista guardada exitosamente</h3>
            <button onClick={closeSuccess} className="bg-[#4682B4] text-white px-8 py-3 rounded-xl font-medium hover:opacity-90 transition-all">
              OK
            </button>
          </div>
        </div>
      )}

      {showPrintConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm z-50 no-print">
          <div className="bg-white p-7 rounded-2xl shadow-2xl max-w-sm w-full text-center border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">¿Desea guardar e imprimir la entrevista?</h3>
            <div className="flex justify-center gap-5">
              <button onClick={confirmPrint} className="bg-[#4682B4] text-white px-8 py-3 rounded-xl font-medium hover:opacity-90 transition-all">
                Sí
              </button>
              <button onClick={() => setShowPrintConfirm(false)} className="border border-slate-300 text-slate-700 px-8 py-3 rounded-xl font-medium hover:bg-slate-50 transition-all">
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default numero4;