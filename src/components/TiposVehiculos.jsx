import { useState, useEffect } from "react";
import { useRentCar } from "../context/RentCarContext";

export const TiposVehiculos = () => {

    const tableName = "TiposVehiculos"

  const {
    data,
    fetchData,
    loading,
    createData,
    deleteData,
    updateData,
    adding,
  } = useRentCar();
  const [tipoVehiculoNombre, setTipoVehiculoNombre] = useState("");
  const [editing, setEditing] = useState(null); // Estado para manejar la edición

  useEffect(() => {
    fetchData(tableName);
  }, [fetchData]);

  // Función para manejar la creación de una nueva marca
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createData(tableName, {
        Nombre: tipoVehiculoNombre,
        Estado: "Activo",
      });
      setTipoVehiculoNombre(""); // Limpiar el campo después de crear
    } catch (error) {
      console.error("Error al crear la marca:", error);
    }
  };

  // Función para manejar la eliminación de una marca
  const handleDelete = async (id) => {
    try {
      await deleteData(tableName, id);
    } catch (error) {
      console.error("Error al eliminar la marca:", error);
    }
  };

  // Función para manejar el cambio de estado de una marca
  const handleToggleEstado = async (id, estado) => {
    try {
      const nuevoEstado = estado === "Activo" ? "Inactivo" : "Activo";
      await updateData(tableName, id, { Estado: nuevoEstado });
    } catch (error) {
      console.error("Error al actualizar el estado de la marca:", error);
    }
  };

  // Función para manejar la edición de una marca
  const handleEdit = (tipoVehiculo) => {
    setEditing(tipoVehiculo); // Establecer la marca que se está editando
    setTipoVehiculoNombre(tipoVehiculo.Nombre); // Llenar el campo de texto con el nombre actual
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setTipoVehiculoNombre("");
   
  };

  // Función para actualizar una marca
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateData(tableName, editing.id, { Nombre: tipoVehiculoNombre });
      setEditing(null); // Salir del modo de edición
      setTipoVehiculoNombre(""); // Limpiar el campo de texto
    } catch (error) {
      console.error("Error al actualizar la marca:", error);
    }
  };

  return (
    <div>
        <h2>Tipos de Combustibles</h2>
      <form
        className="d-flex justify-content-center gap-3 mt-4 mb-4"
        onSubmit={editing ? handleUpdate : handleSubmit}
      >
        <input
          required
          type="text"
          name="tipoVehiculo"
          placeholder="Nombre"
          onChange={(e) => setTipoVehiculoNombre(e.target.value)}
          value={tipoVehiculoNombre}
          className="form-control"
          style={{maxWidth: "250px"}}
        />
        <button className="btn btn-success" disabled={adding}>
          {adding ? "Procesando..." : editing ? "Actualizar" : "Agregar"}
        </button>
        {editing && (
          <button
            className="btn btn-danger"
            type="button"
            onClick={() => handleCancelEdit()}
          >
            Cancelar
          </button>
        )}
      </form>

      {/* Tabla de marcas */}
      {loading ? (
        <p>Cargando...</p>
      ) : !data.TiposVehiculos || data.TiposVehiculos.length === 0 ? (
        <p>No hay tipos de vehiculos disponibles</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {data.TiposVehiculos.map((tipoVehiculo) => (
              <tr key={tipoVehiculo.id}>
                <td>{tipoVehiculo.Nombre}</td>
                <td>{tipoVehiculo.Estado}</td>
                <td>
                  <div className="dropdown">
                    <a
                      className="btn btn-secondary dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Opciones
                    </a>

                    <ul className="dropdown-menu">
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() =>
                            handleToggleEstado(
                              tipoVehiculo.id,
                              tipoVehiculo.Estado
                            )
                          }
                        >
                          {tipoVehiculo.Estado === "Activo"
                            ? "Desactivar"
                            : "Activar"}
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleEdit(tipoVehiculo)}
                        >
                          Editar
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleDelete(tipoVehiculo.id)}
                        >
                          Eliminar
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
