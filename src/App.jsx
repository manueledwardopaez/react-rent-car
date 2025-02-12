import { Routes, Route, useNavigate } from "react-router";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/Login";

import "./App.css";
import { useEffect } from "react";
import { supabase } from "./supabase/client";
import { RentCarContextProvider } from "./context/RentCarContext.jsx";
import { MarcasPages } from "./pages/MarcasPages.jsx";
import { ModelosPages } from "./pages/ModelosPages.jsx";

import { TaskPage } from "./pages/TaskPage.jsx";
import { CombustiblePages } from "./pages/CombustiblePages.jsx";
import { TiposVehiculosPages } from "./pages/TiposVehiculosPages.jsx";
import { EmpleadosPages } from "./pages/EmpleadosPages.jsx";
import { ClientesPages } from "./pages/ClientesPages.jsx";
import { VehiculosPages } from "./pages/VehiculosPages.jsx";
import { RentasPages } from "./pages/RentasPages.jsx";
import { InspeccionesPages } from "./pages/InspeccionesPages.jsx";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          navigate("/login");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe(); // Limpia el listener al desmontar
    };
  }, [navigate]);

  return (
    <div>
      <RentCarContextProvider>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/tasks" element={<TaskPage />} />
          <Route path="/marcas" element={<MarcasPages />} />
          <Route path="/modelos" element={<ModelosPages />} />
          <Route path="/tiposDeCombustible" element={<CombustiblePages />} />
          <Route path="/tiposDeVehiculos" element={<TiposVehiculosPages />} />
          <Route path="/empleados" element={<EmpleadosPages />} />
          <Route path="/clientes" element={<ClientesPages />}></Route>

          <Route path="/vehiculos" element={<VehiculosPages />}></Route>
          <Route path="/rentas" element={<RentasPages />}></Route>
          <Route path="/inspecciones" element={<InspeccionesPages />}></Route>

          <Route path="/login" element={<Login />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </RentCarContextProvider>
    </div>
  );
}

export default App;
