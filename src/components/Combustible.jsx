import { useState, useEffect } from "react";
import { useRentCar } from "../context/RentCarContext";
import { ToastContainer, toast } from "react-toastify";

export const Combustible = () => {

    const tableName = "Combustibles"

  const {
    data,
    fetchData,
    loading,
    createData,
    deleteData,
    updateData,
    adding,
  } = useRentCar();

  const [combustibleNombre, setCombustibleNombre] = useState("");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchData(tableName);
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createData(tableName, {
        Nombre: combustibleNombre,
        Estado: "Activo",
      });
      setCombustibleNombre(""); // Limpiar el campo después de crear
      toast.success("Operation Successfull", { autoClose: 3000 });
    } catch (error) {
      console.error("Error al crear la marca:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteData(tableName, id);
      toast.warning("Elimination Completed", { autoClose: 3000 });
    } catch (error) {
      console.error("Error al eliminar la marca:", error);
    }
  };

  const handleToggleEstado = async (id, estado) => {
    try {
      const nuevoEstado = estado === "Activo" ? "Inactivo" : "Activo";
      await updateData(tableName, id, { Estado: nuevoEstado });
    } catch (error) {
      console.error("Error al actualizar el estado de la marca:", error);
    }
  };

  const handleEdit = (combustible) => {
    setEditing(combustible); // Establecer la marca que se está editando
    setCombustibleNombre(combustible.Nombre); // Llenar el campo de texto con el nombre actual
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setCombustibleNombre("");
   
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateData(tableName, editing.id, {
        Nombre: combustibleNombre,
      });
      setEditing(null); // Salir del modo de edición
      setCombustibleNombre(""); // Limpiar el campo de texto
    } catch (error) {
      console.error("Error al actualizar la marca:", error);
    }
  };

  return (
    <div>
      <ToastContainer />

        <h2>Combustibles</h2>

      <form
        className="d-flex justify-content-center gap-3 mt-4 mb-4"
        onSubmit={editing ? handleUpdate : handleSubmit}
      >
        <input
          required
          type="text"
          name="combustibleNombre"
          placeholder="Nombre del Combustible"
          onChange={(e) => setCombustibleNombre(e.target.value)}
          value={combustibleNombre}
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
      {loading ? (
        <p>Cargando...</p>
      ) : !data.Combustibles || data.Combustibles.length === 0 ? (
        <p>No hay combustibles disponibles</p>
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
            {data.Combustibles.map((combustible) => (
              <tr key={combustible.id}>
                <td>{combustible.Nombre}</td>
                <td>{combustible.Estado}</td>
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
                              combustible.id,
                              combustible.Estado
                            )
                          }
                        >
                          {combustible.Estado === "Activo"
                            ? "Desactivar"
                            : "Activar"}
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleEdit(combustible)}
                        >
                          Editar
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleDelete(combustible.id)}
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
