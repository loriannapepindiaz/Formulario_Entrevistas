import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Numero3() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(() => JSON.parse(localStorage.getItem("entrevista") || "{}"));
  const [mostrarAlfabetizacionDetalle, setMostrarAlfabetizacionDetalle] = useState(saved.alfabetizacion === "Si");

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const values = Object.fromEntries(form.entries());
    const data = { ...saved, ...values };
    if (values.alfabetizacion !== "Si") {
      data.alfabetizacion_detalle = "";
    }
    localStorage.setItem("entrevista", JSON.stringify(data));
    setSaved(data);
    navigate("/paso4");
  };

  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4 md:p-8 font-sans">
      <style>{`
        select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
          background-position: right 0.75rem center;
          background-repeat: no-repeat;
          background-size: 1.25em 1.25em;
          padding-right: 2.5rem !important;
        }
        select:focus {
          outline: none;
          border-color: #4682B4;
          box-shadow: 0 0 0 2px rgba(70, 130, 180, 0.2);
        }
      `}</style>

      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        {/* Header + Barra de Pasos */}
        <div className="p-8 pb-4 text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-8">
            Entrevista Familiar
          </h1>
          <div className="flex items-center justify-center gap-4 md:gap-8 max-w-3xl mx-auto px-6 md:px-12 mb-12">
            <div className="flex flex-col items-center relative z-10">
              <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold mb-2 shadow-lg shadow-green-600/30 cursor-pointer" onClick={() => navigate("/")}>
                1
              </div>
              <span className="text-xs font-semibold text-green-600">Datos Básicos</span>
            </div>
            <div className="h-1 bg-green-600 flex-grow" />
            <div className="flex flex-col items-center relative z-10">
              <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold mb-2 shadow-lg shadow-green-600/30 cursor-pointer" onClick={() => navigate("/paso2")}>
                2
              </div>
              <span className="text-xs font-semibold text-green-600">Entorno Familiar</span>
            </div>
            <div className="h-1 bg-[#4682B4] flex-grow" />
            <div className="flex flex-col items-center relative z-10">
              <div className="w-10 h-10 rounded-full bg-[#4682B4] text-white flex items-center justify-center font-bold mb-2 shadow-lg shadow-blue-900/20">
                3
              </div>
              <span className="text-xs font-semibold text-[#4682B4]">Expectativas</span>
            </div>
            <div className="h-1 bg-slate-200 flex-grow" />
            <div className="flex flex-col items-center relative z-10">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold mb-2">
                4
              </div>
              <span className="text-xs font-medium text-slate-400">Preguntas Extras</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-10">
          {/* Detalle Final */}
          <div className="pt-6 border-t border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-[#4682B4] text-2xl">school</span>
              <h2 className="text-xl font-semibold text-slate-800">Académico y Detalles Finales</h2>
            </div>

            <div className="space-y-8">
              {/* 10 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  10. ¿Con quién vive el estudiante? En caso de no ser con su/s padre/s, ¿Por qué?
                </label>
                <textarea
                  name="convivencia"
                  defaultValue={saved.convivencia || ""}
                  placeholder="Describa la situación de convivencia..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  rows={2}
                />
              </div>

              {/* 11 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  11. ¿Por qué su familia quiere pertenecer a esta institución?
                </label>
                <textarea
                  name="motivos"
                  defaultValue={saved.motivos || ""}
                  placeholder="Escriba los motivos de elección..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  rows={2}
                />
              </div>

              {/* 12 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  12. En caso de que el estudiante venga de otra institución, ¿se presentó alguna dificultad? ¿Cómo entiende que podemos ayudar?
                </label>
                <textarea
                  name="dificultades"
                  defaultValue={saved.dificultades || ""}
                  placeholder="Detalle dificultades previas y expectativas de apoyo..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  rows={3}
                />
              </div>

              {/* 13 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  13. Al estudiante: Háblanos un poco de tu familia, ¿Qué tiempo le dedicas al estudio?, ¿En cuál/es asignatura/s consideras que te destacas?
                </label>
                <textarea
                  name="estudiante_descr"
                  defaultValue={saved.estudiante_descr || ""}
                  placeholder="Respuesta del estudiante..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  rows={3}
                />
              </div>

              {/* 14 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  14. Si el estudiante está sobreedad, ¿Ha repetido algún curso? ¿Por qué?
                </label>
                <textarea
                  name="repetido"
                  defaultValue={saved.repetido || ""}
                  placeholder="Especifique curso y motivo..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  rows={2}
                />
              </div>

              {/* 15 */}
              <div className="mt-8">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  15. ¿El niño o niña ha presentado problemas para alfabetizarse?
                </label>
                <div className="flex gap-8 items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="alfabetizacion"
                      value="Si"
                      checked={mostrarAlfabetizacionDetalle === true}
                      onChange={() => setMostrarAlfabetizacionDetalle(true)}
                      className="w-5 h-5 accent-[#4682B4]"
                    />
                    <span className="text-sm text-slate-700">Sí</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="alfabetizacion"
                      value="No"
                      checked={mostrarAlfabetizacionDetalle === false}
                      onChange={() => setMostrarAlfabetizacionDetalle(false)}
                      className="w-5 h-5 accent-[#4682B4]"
                    />
                    <span className="text-sm text-slate-700">No</span>
                  </label>
                </div>
                {mostrarAlfabetizacionDetalle && (
                  <textarea
                    name="alfabetizacion_detalle"
                    defaultValue={saved.alfabetizacion_detalle || ""}
                    placeholder="Especifique motivo, duración y profesional..."
                    className="mt-4 w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100"
                    rows={2}
                  />
                )}
              </div>

              {/* 16 */}
              <div className="mt-8">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  16. ¿Deseas estudiar en esta escuela? ¿Qué ha escuchado de este centro? ¿Qué te motiva a estar acá?
                </label>
                <textarea
                  name="motivacion"
                  defaultValue={saved.motivacion || ""}
                  placeholder="Motivación del estudiante..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  rows={3}
                />
              </div>

              {/* 17, 18, 19 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    17. Ingreso real de la familia
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">$</span>
                    <input
                      name="ingreso_real"
                      type="text"
                      defaultValue={saved.ingreso_real || ""}
                      placeholder="0.00"
                      className="pl-8 w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    18. Aporte mensual sugerido
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">$</span>
                    <input
                      name="aporte_mensual"
                      type="text"
                      defaultValue={saved.aporte_mensual || ""}
                      placeholder="0.00"
                      className="pl-8 w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    19. Teléfono para contacto
                  </label>
                  <input
                    name="telefono"
                    type="tel"
                    defaultValue={saved.telefono || ""}
                    placeholder="000-000-0000"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Observaciones */}
              <div className="mt-8">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Observaciones
                </label>
                <textarea
                  name="observaciones"
                  defaultValue={saved.observaciones || ""}
                  placeholder="Notas adicionales del entrevistador..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  rows={4}
                />
              </div>

              {/* Entrevista realizada por - versión corregida */}
              <div className="mt-8">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Entrevista realizada por
                </label>
                <select
                  name="entrevistador"
                  defaultValue={saved.entrevistador || ""}
                  className="
                    w-full px-4 py-3 
                    rounded-lg
                    border border-slate-300 
                    bg-white
                    text-slate-700
                    focus:border-[#4682B4]
                    focus:ring-2 focus:ring-blue-100
                    outline-none
                    transition-all
                    appearance-none
                  "
                >
                  <option value="" disabled>
                    Seleccione entrevistador(a)...
                  </option>
                  <option value="Carmen Alvarez">Carmen Alvarez</option>
                  <option value="Esther Garcia">Esther Garcia</option>
                  <option value="Glenys Estevez">Glenys Estevez</option>
                  <option value="Rud Peña">Rud Peña</option>
                  <option value="Luis Quezada">Luis Quezada</option>
                  <option value="Luis Reyes">Luis Reyes</option>
                  <option value="Laura Rodriguez">Laura Rodriguez</option>
                  <option value="Radelqui Santos">Radelqui Santos</option>
                  <option value="Adelin De la Rosa">Adelin De la Rosa</option>
                  <option value="Yariel Pichardo">Yariel Pichardo</option>
                  <option value="Daniela Vicente">Daniela Vicente</option>
                  <option value="Julia Paulino">Julia Paulino</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400 order-2 sm:order-1">
              Código: P-AD-01-F-04 | Rev. 03
            </p>
            <div className="flex gap-4 w-full sm:w-auto order-1 sm:order-2">
              <button
                type="button"
                onClick={() => navigate("/paso2")}
                className="flex-1 sm:flex-none px-8 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Volver atrás
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none bg-[#4682B4] text-white px-10 py-3 rounded-xl font-semibold shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                Siguiente
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Numero3;