import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function Numero2() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(() => JSON.parse(localStorage.getItem("entrevista") || "{}"));
  // Estado para manejar la selección visual del estado civil
  const [selectedEstadoCivil, setSelectedEstadoCivil] = useState(saved.estado_civil || "");
  // Estados para campos condicionales
  const [mostrarAyudaPsicDetalle, setMostrarAyudaPsicDetalle] = useState(saved.ayuda_psic === "Si");
  const [mostrarAgresionesDetalle, setMostrarAgresionesDetalle] = useState(saved.agresion_ocurrida === "Si");
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const values = Object.fromEntries(form.entries());
    const data = { ...saved, ...values, estado_civil: selectedEstadoCivil };
    localStorage.setItem("entrevista", JSON.stringify(data));
    navigate("/paso3");
  };
  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4 md:p-8 font-sans">
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
            <div className="h-1 bg-slate-200 flex-grow" />
            <div className="flex flex-col items-center relative z-10">
              <div className="w-10 h-10 rounded-full bg-[#4682B4] text-white flex items-center justify-center font-bold mb-2 shadow-lg shadow-blue-900/20">
                2
              </div>
              <span className="text-xs font-semibold text-[#4682B4]">Entorno Familiar</span>
            </div>
            <div className="h-1 bg-slate-200 flex-grow" />
            <div className="flex flex-col items-center relative z-10">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold mb-2">
                3
              </div>
              <span className="text-xs font-medium text-slate-400">Expectativas</span>
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
        
          {/* Estado Civil */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="material-symbols-outlined text-[#4682B4] text-2xl">groups</span>
              <h2 className="text-xl font-semibold text-slate-800">
                Estado Civil de los Padres
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Soltero/a", "Casado/a", "Divorciado/a", "Viudo/a", "Unión libre", "Separado/a", "En trámite de divorcio"].map((opcion) => {
                const isSelected = selectedEstadoCivil === opcion;
                return (
                  <label
                    key={opcion}
                    className={`relative flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all h-14
                      ${isSelected ? "border-[#4682B4] bg-blue-50/50" : "border-slate-100 bg-white hover:border-slate-200"}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                      ${isSelected ? "border-[#4682B4]" : "border-slate-300"}`}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#4682B4]" />}
                    </div>
                    <input
                      type="radio"
                      name="estado_civil"
                      value={opcion}
                      checked={isSelected}
                      onChange={(e) => setSelectedEstadoCivil(e.target.value)}
                      className="absolute opacity-0"
                    />
                    <span className={`text-sm font-medium ${isSelected ? "text-[#4682B4] font-bold" : "text-slate-600"}`}>
                      {opcion}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
          {/* Detalle del Estudiante - Todas las preguntas restauradas */}
          <div className="pt-6 border-t border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-[#4682B4] text-2xl">person</span>
              <h2 className="text-xl font-semibold text-slate-800">Detalle del Estudiante</h2>
            </div>
            <div className="space-y-8">
              {/* 1 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  1. ¿Cómo describe la conducta escolar del estudiante?
                </label>
                <textarea
                  name="conducta"
                  defaultValue={saved.conducta || ""}
                  placeholder="Describa el comportamiento general..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  rows={3}
                />
              </div>
              {/* 2 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  2. ¿Ha tenido el estudiante algún inconveniente en el colegio? ¿Cómo usted lo ayudó?
                </label>
                <textarea
                  name="inconvenientes"
                  defaultValue={saved.inconvenientes || ""}
                  placeholder="Relate situaciones y su intervención..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  rows={3}
                />
              </div>
              {/* 3 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  3. ¿Ha recibido el estudiante algún tipo de ayuda psicológica?
                </label>
                <div className="flex gap-8 items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="ayuda_psic"
                      value="Si"
                      checked={mostrarAyudaPsicDetalle === true}
                      onChange={() => setMostrarAyudaPsicDetalle(true)}
                      className="w-5 h-5 accent-[#4682B4]"
                    />
                    <span className="text-sm text-slate-700">Sí</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="ayuda_psic"
                      value="No"
                      checked={mostrarAyudaPsicDetalle === false}
                      onChange={() => setMostrarAyudaPsicDetalle(false)}
                      className="w-5 h-5 accent-[#4682B4]"
                    />
                    <span className="text-sm text-slate-700">No</span>
                  </label>
                </div>
                {mostrarAyudaPsicDetalle && (
                  <textarea
                    name="ayuda_psic_detalle"
                    defaultValue={saved.ayuda_psic_detalle || ""}
                    placeholder="Especifique motivo, duración y profesional..."
                    className="mt-4 w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100"
                    rows={2}
                  />
                )}
              </div>
              {/* Nueva pregunta 4 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  4. ¿En qué zona viven de la ciudad? ¿Desde cuándo?
                </label>
                <textarea
                  name="zona_vivienda"
                  defaultValue={saved.zona_vivienda || ""}
                  placeholder="Especifique la zona y tiempo de residencia..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  rows={3}
                />
              </div>
              {/* Original 4 ahora 5 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  5. ¿Cuáles hábitos de estudios tiene el niño?
                </label>
                <textarea
                  name="habitos"
                  defaultValue={saved.habitos || ""}
                  placeholder="Horarios, lugar de estudio, supervisión..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  rows={3}
                />
              </div>
              {/* 6 y 7 en grid (originales 5 y 6) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    6. ¿Cuáles actividades realizan como familia?
                  </label>
                  <textarea
                    name="actividades_familia"
                    defaultValue={saved.actividades_familia || ""}
                    placeholder="Pasatiempos, paseos o rutinas compartidas..."
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-[#4682B4] transition-all"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    7. ¿Cuánto tiempo están juntos en la casa?
                  </label>
                  <textarea
                    name="tiempo_juntos"
                    defaultValue={saved.tiempo_juntos || ""}
                    placeholder="Cantidad de horas de convivencia diaria..."
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-[#4682B4] transition-all"
                    rows={2}
                  />
                </div>
              </div>
              {/* Original 7 ahora 8 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  8. ¿Qué espera usted de este Centro?
                </label>
                <textarea
                  name="expectativas_centro"
                  defaultValue={saved.expectativas_centro || ""}
                  placeholder="Expectativas académicas y formativas..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] outline-none transition-all"
                  rows={3}
                />
              </div>
              {/* Original 8 ahora 9 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  9. ¿Ha agredido el estudiante a algún compañero? ¿Lo han agredido?
                </label>
                <div className="flex gap-8 items-center mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="agresion_ocurrida"
                      value="Si"
                      checked={mostrarAgresionesDetalle === true}
                      onChange={() => setMostrarAgresionesDetalle(true)}
                      className="w-5 h-5 accent-[#4682B4]"
                    />
                    <span className="text-sm text-slate-700">Sí</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="agresion_ocurrida"
                      value="No"
                      checked={mostrarAgresionesDetalle === false}
                      onChange={() => setMostrarAgresionesDetalle(false)}
                      className="w-5 h-5 accent-[#4682B4]"
                    />
                    <span className="text-sm text-slate-700">No</span>
                  </label>
                </div>
                {mostrarAgresionesDetalle && (
                  <textarea
                    name="agresiones"
                    defaultValue={saved.agresiones || ""}
                    placeholder="Especifique tipo de agresión y cómo se resolvió..."
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] outline-none transition-all"
                    rows={3}
                  />
                )}
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
                onClick={() => navigate("/")}
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