import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Numero1() {
  const navigate = useNavigate();
  const saved = JSON.parse(localStorage.getItem("entrevista") || "{}");

  const [currentDate, setCurrentDate] = useState("");
  const [entrevistados, setEntrevistados] = useState(() => {
    if (saved.entrevistados) {
      return saved.entrevistados.map((e) => ({ ...e, id: e.id || Date.now() }));
    } else if (saved.entrevistado) {
      return [
        {
          id: Date.now(),
          nombre: saved.entrevistado || "",
          parentesco: saved.parentesco || "",
          parentesco_otro: saved.parentesco_otro || "",
        },
      ];
    } else {
      return [
        {
          id: Date.now(),
          nombre: "",
          parentesco: "",
          parentesco_otro: "",
        },
      ];
    }
  });
  const [mostrarTutorFields, setMostrarTutorFields] = useState(
    saved.entrevistados?.some((e) => e.parentesco === "tutor") ||
      saved.parentesco === "tutor" ||
      false
  );

  const [nivelMadre, setNivelMadre] = useState(saved.nivel_madre || "");
  const [duracionMadre, setDuracionMadre] = useState(saved.duracion_madre || "");
  const [tipoMadre, setTipoMadre] = useState(saved.tipo_madre || "");
  const [mostrarDuracionMadre, setMostrarDuracionMadre] = useState(!!saved.nivel_madre && saved.nivel_madre !== "ninguno");
  const [mostrarTipoMadre, setMostrarTipoMadre] = useState(!!saved.nivel_madre && ["licenciatura", "maestria", "ingenieria", "doctorado", "otros"].includes(saved.nivel_madre));

  const [nivelPadre, setNivelPadre] = useState(saved.nivel_padre || "");
  const [duracionPadre, setDuracionPadre] = useState(saved.duracion_padre || "");
  const [tipoPadre, setTipoPadre] = useState(saved.tipo_padre || "");
  const [mostrarDuracionPadre, setMostrarDuracionPadre] = useState(!!saved.nivel_padre && saved.nivel_padre !== "ninguno");
  const [mostrarTipoPadre, setMostrarTipoPadre] = useState(!!saved.nivel_padre && ["licenciatura", "maestria", "ingenieria", "doctorado", "otros"].includes(saved.nivel_padre));

  const [nivelTutor, setNivelTutor] = useState(saved.nivel_tutor || "");
  const [duracionTutor, setDuracionTutor] = useState(saved.duracion_tutor || "");
  const [tipoTutor, setTipoTutor] = useState(saved.tipo_tutor || "");
  const [mostrarDuracionTutor, setMostrarDuracionTutor] = useState(!!saved.nivel_tutor && saved.nivel_tutor !== "ninguno");
  const [mostrarTipoTutor, setMostrarTipoTutor] = useState(!!saved.nivel_tutor && ["licenciatura", "maestria", "ingenieria", "doctorado", "otros"].includes(saved.nivel_tutor));

  const [vinculacion, setVinculacion] = useState(saved.vinculacion || "");
  const [especificarVinculacion, setEspecificarVinculacion] = useState(saved.especificar_vinculacion || "");
  const [mostrarEspecificarVinculacion, setMostrarEspecificarVinculacion] = useState(!!saved.vinculacion);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setCurrentDate(today);
  }, []);

  useEffect(() => {
    setMostrarTutorFields(entrevistados.some((e) => e.parentesco === "tutor"));
  }, [entrevistados]);

  const handleNombreChange = (index, value) => {
    const newEnt = [...entrevistados];
    newEnt[index].nombre = value;
    setEntrevistados(newEnt);
  };

  const handleParentescoChange = (index, value) => {
    const newEnt = [...entrevistados];
    newEnt[index].parentesco = value;
    setEntrevistados(newEnt);
  };

  const handleOtroChange = (index, value) => {
    const newEnt = [...entrevistados];
    newEnt[index].parentesco_otro = value;
    setEntrevistados(newEnt);
  };

  const addEntrevistado = () => {
    setEntrevistados([
      ...entrevistados,
      { id: Date.now(), nombre: "", parentesco: "", parentesco_otro: "" },
    ]);
  };

  const removeEntrevistado = (index) => {
    if (entrevistados.length > 1) {
      setEntrevistados(entrevistados.filter((_, i) => i !== index));
    }
  };

  const handleNivelMadreChange = (e) => {
    const value = e.target.value;
    setNivelMadre(value);
    setMostrarDuracionMadre(value && value !== "ninguno");
    setMostrarTipoMadre(value && ["licenciatura", "maestria", "ingenieria", "doctorado", "otros"].includes(value));
    if (!["licenciatura", "maestria", "ingenieria", "doctorado", "otros"].includes(value)) {
      setTipoMadre("");
    }
  };

  const handleNivelPadreChange = (e) => {
    const value = e.target.value;
    setNivelPadre(value);
    setMostrarDuracionPadre(value && value !== "ninguno");
    setMostrarTipoPadre(value && ["licenciatura", "maestria", "ingenieria", "doctorado", "otros"].includes(value));
    if (!["licenciatura", "maestria", "ingenieria", "doctorado", "otros"].includes(value)) {
      setTipoPadre("");
    }
  };

  const handleNivelTutorChange = (e) => {
    const value = e.target.value;
    setNivelTutor(value);
    setMostrarDuracionTutor(value && value !== "ninguno");
    setMostrarTipoTutor(value && ["licenciatura", "maestria", "ingenieria", "doctorado", "otros"].includes(value));
    if (!["licenciatura", "maestria", "ingenieria", "doctorado", "otros"].includes(value)) {
      setTipoTutor("");
    }
  };

  const handleVinculacionChange = (e) => {
    const value = e.target.value;
    setVinculacion(value);
    setMostrarEspecificarVinculacion(!!value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    if (!form.get("nombres") || !form.get("apellidos")) {
      alert("Por favor complete Nombre(s) y Apellido(s) antes de continuar.");
      return;
    }

    if (
      !entrevistados.length ||
      entrevistados.some((ent) => !ent.nombre.trim() || !ent.parentesco)
    ) {
      alert(
        "Por favor complete todos los campos de los entrevistados antes de continuar."
      );
      return;
    }

    if (
      entrevistados.some(
        (ent) => ent.parentesco === "otro" && !ent.parentesco_otro?.trim()
      )
    ) {
      alert('Por favor especifique el parentesco cuando selecciona "Otro".');
      return;
    }

    const values = Object.fromEntries(form.entries());
    const data = { 
      ...saved, 
      ...values, 
      entrevistados,
      nivel_madre: nivelMadre,
      duracion_madre: duracionMadre,
      tipo_madre: tipoMadre,
      nivel_padre: nivelPadre,
      duracion_padre: duracionPadre,
      tipo_padre: tipoPadre,
      nivel_tutor: nivelTutor,
      duracion_tutor: duracionTutor,
      tipo_tutor: tipoTutor,
      vinculacion,
      especificar_vinculacion: especificarVinculacion
    };
    localStorage.setItem("entrevista", JSON.stringify(data));
    navigate("/paso2");
  };

  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4 md:p-8 font-sans">
      <style>{`
        select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
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
        {/* Header */}
        <div className="p-8 pb-4 text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-8">
            Entrevista Familiar
          </h1>

          <div className="flex items-center justify-center gap-4 md:gap-8 max-w-3xl mx-auto px-6 md:px-12 mb-12">
            <div className="flex flex-col items-center relative z-10">
              <div className="w-10 h-10 rounded-full bg-[#4682B4] text-white flex items-center justify-center font-bold mb-2 shadow-lg shadow-blue-600/30">
                1
              </div>
              <span className="text-xs font-semibold text-[#4682B4]">Datos Básicos</span>
            </div>

            <div className="h-1 bg-slate-300 flex-grow" />

            <div className="flex flex-col items-center relative z-10">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold mb-2">
                2
              </div>
              <span className="text-xs font-medium text-slate-400">Entorno Familiar</span>
            </div>

            <div className="h-1 bg-slate-300 flex-grow" />

            <div className="flex flex-col items-center relative z-10">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold mb-2">
                3
              </div>
              <span className="text-xs font-medium text-slate-400">Expectativas</span>
            </div>

            <div className="h-1 bg-slate-300 flex-grow" />

            <div className="flex flex-col items-center relative z-10">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold mb-2">
                4
              </div>
              <span className="text-xs font-medium text-slate-400">Preguntas Extras</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-10">
          {/* Datos básicos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Fecha de Entrevista</label>
              <input
                name="fecha"
                value={currentDate}
                readOnly
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-600 cursor-default"
                type="date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Formulario</label>
              <input
                name="formulario"
                defaultValue={saved.formulario || ""}
                placeholder="0"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                type="text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Sección</label>
              <input
                name="seccion"
                defaultValue={saved.seccion || ""}
                placeholder="0"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                type="text"
              />
            </div>
          </div>

          {/* Datos Personales del Estudiante */}
          <div className="pt-6 border-t border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-[#4682B4] text-2xl">person</span>
              <h2 className="text-xl font-semibold text-slate-800">Datos Personales del Estudiante</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nombre(s)</label>
                <input
                  name="nombres"
                  defaultValue={saved.nombres || ""}
                  placeholder="Ingrese nombres"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  type="text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Apellido(s)</label>
                <input
                  name="apellidos"
                  defaultValue={saved.apellidos || ""}
                  placeholder="Ingrese apellidos"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  type="text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Sexo</label>
                <select
                  name="sexo"
                  defaultValue={saved.sexo || ""}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none"
                >
                  <option value="">Seleccione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Edad</label>
                <input
                  name="edad"
                  defaultValue={saved.edad || ""}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  type="number"
                />
              </div>
            </div>
          </div>

          {/* Información del Entrevistado */}
          <div className="pt-6 border-t border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-[#4682B4] text-2xl">groups</span>
              <h2 className="text-xl font-semibold text-slate-800">Información del Entrevistado</h2>
            </div>

            {entrevistados.map((ent, index) => (
              <div key={ent.id} className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Entrevistado {index + 1}
                    </label>
                    <input
                      value={ent.nombre}
                      onChange={(e) => handleNombreChange(index, e.target.value)}
                      placeholder="Nombre de quien asiste a la entrevista"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      type="text"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Parentesco</label>
                    <select
                      value={ent.parentesco}
                      onChange={(e) => handleParentescoChange(index, e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none"
                    >
                      <option value="">Seleccione relación</option>
                      <option value="madre">Madre</option>
                      <option value="padre">Padre</option>
                      <option value="madrastra">Madrastra</option>
                      <option value="padrastro">Padrastro</option>
                      <option value="tutor">Tutor Legal</option>
                      <option value="otro">Otro</option>
                    </select>

                    {ent.parentesco === "otro" && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Especifique el parentesco
                        </label>
                        <input
                          value={ent.parentesco_otro}
                          onChange={(e) => handleOtroChange(index, e.target.value)}
                          placeholder="Ej: Abuela, Tía, Cuidadora, etc."
                          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                          type="text"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {entrevistados.length > 1 && (
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeEntrevistado(index)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                    >
                      <span className="material-symbols-outlined">delete</span>
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addEntrevistado}
              className="bg-blue-100 text-blue-600 px-6 py-2 rounded-full font-medium hover:bg-blue-200 transition-all flex items-center gap-2"
            >
              <span className="text-lg">+</span> Agregar otra persona
            </button>
          </div>

          {/* Nivel de preparación */}
          <div className="pt-6 border-t border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-[#4682B4] text-2xl">school</span>
              <h2 className="text-xl font-semibold text-slate-800">
                Nivel académico del Tutor(a)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Madre */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nivel académico - Madre
                </label>
                <select
                  value={nivelMadre}
                  onChange={handleNivelMadreChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none"
                >
                  <option value="">Seleccione</option>
                  <option value="primaria">Educación primaria</option>
                  <option value="bachillerato">Bachillerato</option>
                  <option value="universitario">Universitario</option>
                  <option value="licenciatura">Licenciatura</option>
                  <option value="maestria">Maestría</option>
                  <option value="ingenieria">Ingeniería</option>
                  <option value="doctorado">Doctorado</option>
                  <option value="otros">Otros</option>
                  <option value="ninguno">Ninguno / No aplica</option>
                </select>
                {mostrarDuracionMadre && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Años de duración
                    </label>
                    <input
                      value={duracionMadre}
                      onChange={(e) => setDuracionMadre(e.target.value)}
                      placeholder="Ingrese años de duración"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      type="number"
                    />
                  </div>
                )}
                {mostrarTipoMadre && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Especifique el tipo
                    </label>
                    <input
                      value={tipoMadre}
                      onChange={(e) => setTipoMadre(e.target.value)}
                      placeholder="Especifique el tipo (ej: en Derecho)"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      type="text"
                    />
                  </div>
                )}
              </div>

              {/* Padre */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nivel académico - Padre
                </label>
                <select
                  value={nivelPadre}
                  onChange={handleNivelPadreChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none"
                >
                  <option value="">Seleccione</option>
                  <option value="primaria">Educación primaria</option>
                  <option value="bachillerato">Bachillerato</option>
                  <option value="universitario">Universitario</option>
                  <option value="licenciatura">Licenciatura</option>
                  <option value="maestria">Maestría</option>
                  <option value="ingenieria">Ingeniería</option>
                  <option value="doctorado">Doctorado</option>
                  <option value="otros">Otros</option>
                  <option value="ninguno">Ninguno / No aplica</option>
                </select>
                {mostrarDuracionPadre && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Años de duración
                    </label>
                    <input
                      value={duracionPadre}
                      onChange={(e) => setDuracionPadre(e.target.value)}
                      placeholder="Ingrese años de duración"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      type="number"
                    />
                  </div>
                )}
                {mostrarTipoPadre && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Especifique el tipo
                    </label>
                    <input
                      value={tipoPadre}
                      onChange={(e) => setTipoPadre(e.target.value)}
                      placeholder="Especifique el tipo (ej: en Derecho)"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      type="text"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Campo del Tutor - solo aparece si se selecciona "Tutor Legal" */}
            {mostrarTutorFields && (
              <div className="mt-8 pt-4">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-[#4682B4] text-xl">
                    person_raised_hand
                  </span>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Nivel académico - Tutor Legal
                  </h3>
                </div>

                <div className="max-w-md">
                  <select
                    value={nivelTutor}
                    onChange={handleNivelTutorChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none"
                  >
                    <option value="">Seleccione</option>
                    <option value="primaria">Educación primaria</option>
                    <option value="bachillerato">Bachillerato</option>
                    <option value="universitario">Universitario</option>
                    <option value="licenciatura">Licenciatura</option>
                    <option value="maestria">Maestría</option>
                    <option value="ingenieria">Ingeniería</option>
                    <option value="doctorado">Doctorado</option>
                    <option value="otros">Otros</option>
                    <option value="ninguno">Ninguno / No aplica</option>
                  </select>
                  {mostrarDuracionTutor && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Años de duración
                      </label>
                      <input
                        value={duracionTutor}
                        onChange={(e) => setDuracionTutor(e.target.value)}
                        placeholder="Ingrese años de duración"
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        type="number"
                      />
                    </div>
                  )}
                  {mostrarTipoTutor && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Especifique el tipo
                      </label>
                      <input
                        value={tipoTutor}
                        onChange={(e) => setTipoTutor(e.target.value)}
                        placeholder="Especifique el tipo (ej: en Derecho)"
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        type="text"
                      />
                    </div>
                  )}
                </div>

                <p className="mt-2 text-xs text-slate-500 italic">
                  Campo opcional - solo aplica si el entrevistado es el tutor legal
                </p>
              </div>
            )}
          </div>

          {/* Vinculación Institucional */}
          <div className="pt-6 border-t border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-[#4682B4] text-2xl">link</span>
              <h2 className="text-xl font-semibold text-slate-800">Vinculación Institucional</h2>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Indicar si proviene de alguna obra salesiana:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { value: "oratorio", label: "Oratorio" },
                { value: "centro", label: "Centro Juvenil" },
                { value: "cooperador", label: "Cooperador" },
                { value: "traslado", label: "Traslado" },
                { value: "exalumno", label: "Exalumno" },
              ].map((item) => (
                <label
                  key={item.value}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-lg border border-slate-300
                    bg-white cursor-pointer transition-all
                    hover:border-[#4682B4] hover:bg-blue-50
                    has-[:checked]:border-[#4682B4] has-[:checked]:bg-blue-50
                    has-[:checked]:text-[#4682B4]
                  `}
                >
                  <input
                    type="radio"
                    name="vinculacion"
                    value={item.value}
                    checked={vinculacion === item.value}
                    onChange={handleVinculacionChange}
                    className="w-5 h-5 accent-[#4682B4]"
                  />
                  <span className="text-sm text-slate-700">{item.label}</span>
                </label>
              ))}
            </div>
            {mostrarEspecificarVinculacion && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Especifique la relación (ej: exalumno, trabaja, animador, etc.)
                </label>
                <textarea
                  value={especificarVinculacion}
                  onChange={(e) => setEspecificarVinculacion(e.target.value)}
                  placeholder="Detalles de la vinculación..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#4682B4] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  rows={3}
                />
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400 order-2 sm:order-1">
              Código: P-AD-01-F-04 | Rev. 03
            </p>

            <div className="flex gap-4 w-full sm:w-auto order-1 sm:order-2">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex-1 sm:flex-none px-8 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-all"
              >
                Cancelar
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

export default Numero1;