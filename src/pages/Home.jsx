import { useNavigate } from "react-router";
import { supabase } from "../supabase/client";
import { useEffect } from "react";

import { MenuCard } from "../components/MenuCard";

export const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!supabase.auth.getUser()) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <div className="mb-4">
        <h1>Home</h1>
        <p>
          Bienvenido a nuestro sistema de Rent-a-Car, donde puedes gestionar
          vehículos, clientes y reservas de forma rápida y eficiente.
          ¡Simplifica tu negocio con nuestra plataforma!
        </p>
      </div>

      <div className="d-flex flex-wrap gap-3">
       
        <MenuCard name={"Marcas"} link={"/marcas"} />
        <MenuCard name={"Modelos"} link={"/modelos"} />
        <MenuCard name={"Combustibles"} link={"/tiposDeCombustible"} />
        <MenuCard name={"Tipos de Vehiculos"} link={"/tiposDeVehiculos"} />
        <MenuCard name={"Empleados"} link={"/empleados"} />
        <MenuCard name={"Clientes"} link={"/clientes"} />

        <MenuCard name={"Vehiculos"} link={"/vehiculos"} />
        <MenuCard name={"Rentas"} link={"/rentas"} />
        <MenuCard name={"Inspecciones"} link={"/inspecciones"} />
      </div>
    </div>
  );
};
