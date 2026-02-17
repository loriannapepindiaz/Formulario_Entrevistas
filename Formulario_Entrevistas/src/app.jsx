import { Routes, Route } from "react-router-dom";
import Numero1 from "./pages/numero1";
import Numero2 from "./pages/numero2";
import Numero3 from "./pages/numero3";
import Numero4 from "./pages/numero4";

function App() {
  return (
    <Routes>
      {/* Dirección principal */}
      <Route path="/" element={<Numero1 />} />

      {/* Paso 2: Entorno Familiar */}
      <Route path="/paso2" element={<Numero2 />} />
      <Route path="/paso3" element={<Numero3 />} />
      <Route path="/paso4" element={<Numero4 />} />
    </Routes>
  );
}

export default App;