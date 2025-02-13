import { useEffect, useState } from "react";
import { generarReporteVentas } from "../helpers/generarReporteVentas.js";
import { useRentCar } from "../context/RentCarContext";

export const ReporteRentas = () => {
  const tableName = "Rentas";
  const relations = `
      Vehiculo (Descripcion, id) ,
      Empleado (Nombre, id) ,
      Cliente (Nombre, id)
    `;

  const { data, fetchData } = useRentCar();

  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    fetchData("Vehiculos");
    fetchData("Empleados");
    fetchData("Clientes");
    fetchData(tableName, relations);
  }, [fetchData, relations]);


  const rentasFiltradas = filtro
    ? (data.Rentas || []).filter(
        (renta) => renta.Vehiculo.id === Number(filtro)
      )
    : data.Rentas || []; 

  return (
    <div>
      <h2 className={"mb-4"}>Reporte de Rentas</h2>

        <div className="d-flex flex-column align-items-center gap-3">

      <div className="w-25 mb-4">
        <label htmlFor="filtro" className="form-label">
          Filtrar por Vehículo
        </label>
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          required
          className="form-select"
          id="vehiculosId"
        >
          <option value="">Todos los vehículos</option>
          {data.Vehiculos && data.Vehiculos.length > 0 ? (
            data.Vehiculos.map((vehiculo) => (
              <option key={vehiculo.id} value={vehiculo.id}>
                {vehiculo.Descripcion}
              </option>
            ))
          ) : (
            <option disabled>No hay vehículos disponibles</option>
          )}
        </select>
      </div>

      <button className={"btn btn-warning w-25"} onClick={() => generarReporteVentas(rentasFiltradas)}>
        Descargar Reporte de Ventas
      </button>
        </div>

    </div>
  );
};
