import { useState, useEffect } from "react";
import { useRentCar } from "../context/RentCarContext";

export const Modelos = () => {
  const tableName = "Modelos";
  const relations = "Marca (Nombre, id)";

  const {
    data,
    fetchData,
    loading,
    createData,
    deleteData,
    updateData,
    adding,
  } = useRentCar();

  const [modeloNombre, setModeloNombre] = useState("");
  const [marca, setMarca] = useState({
    id: null,
    nombre: "",
  });

  const [editing, setEditing] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    fetchData("Marcas");
    fetchData(tableName, relations);
    setIsSubmitted(false);
  }, [isSubmitted, fetchData]);

  // Función para manejar la creación de una nueva marca
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createData(tableName, {
        Nombre: modeloNombre,
        Estado: "Activo",
        Marca: marca.id,
      });
      setModeloNombre("");
  
    } catch (error) {
      console.error("Error al crear la marca:", error);
    } finally {
      setIsSubmitted(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteData(tableName, id);
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

  const handleEdit = (modelo) => {
    setEditing(modelo); // Establecer la marca que se está editando
    setModeloNombre(modelo.Nombre); // Llenar el campo de texto con el nombre actual
    setMarca({
      id: modelo.Marca.id || null,
      nombre: modelo.Marca.Nombre || "",
    });
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setModeloNombre("");
    setMarca({
      id: null,
      nombre: "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateData(tableName, editing.id, {
        Nombre: modeloNombre,
        Marca: marca.id,
      });
      setEditing(null); // Salir del modo de edición
      setModeloNombre(""); // Limpiar el campo de texto
    } catch (error) {
      console.error("Error al actualizar la marca:", error);
    } finally {
      setIsSubmitted(true);
    }
  };

  return (
    <div>
      <h1>Modelos</h1>

      <form
        className="d-flex justify-content-start mt-4 mb-4 gap-5"
        onSubmit={editing ? handleUpdate : handleSubmit}
      >
        <input
          type="text"
          name="modeloNombre"
          placeholder="Nombre del modelo"
          onChange={(e) => setModeloNombre(e.target.value)}
          value={modeloNombre}
          required
          className="form-control"
          style={{ maxWidth: "250px" }}
        />

        <select
          value={marca.id || ""}
          onChange={(e) => {
            const selected = data.Marcas.find(
              (marca) => marca.id === Number(e.target.value)
            );
            setMarca({
              id: selected?.id || null,
              nombre: selected?.Nombre || "",
            });
          }}
          required
          className="form-select"
          style={{ width: "200px" }}
          aria-label="Selecciona una marca"
        >
          <option value="" defaultValue={true}>
            Elige una marca
          </option>
          {data.Marcas ? (
            data.Marcas.map((marca) => (
              <option value={marca.id} key={marca.id} disabled={marca.Estado == "Inactivo" && true}>
                {marca.Nombre}
              </option>
            ))
          ) : (
            <option disabled>No hay marcas disponibles</option>
          )}
        </select>

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
      {/* Tabla de modelos */}
      {loading ? (
        <p>Cargando...</p>
      ) : !data.Modelos || data.Modelos.length === 0 ? (
        <p>No hay modelos disponibles</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Marca</th>
              <th>Estado</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {data.Modelos.map((modelo) => (
              <tr key={modelo.id}>
                <td>{modelo.Nombre}</td>
                <td>{modelo.Marca?.Nombre}</td>
                <td>{modelo.Estado}</td>
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
                            handleToggleEstado(modelo.id, modelo.Estado)
                          }
                        >
                          {modelo.Estado === "Activo"
                            ? "Desactivar"
                            : "Activar"}
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleEdit(modelo)}
                        >
                          Editar
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleDelete(modelo.id)}
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
