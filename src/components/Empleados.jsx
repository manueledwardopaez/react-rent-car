import { useState, useEffect } from "react";
import { useRentCar } from "../context/RentCarContext";
import { validarCedula } from "../helpers/validators";
import { formatCedula } from "../helpers/formatters";

export const Empleados = () => {
  const tableName = "Empleados";

  const {
    data,
    fetchData,
    loading,
    createData,
    deleteData,
    updateData,
    adding,
  } = useRentCar();

  const [empleado, setEmpleado] = useState({
    nombre: "",
    cedula: "",
    tanda: "",
    comision: "",
    fechaIngreso: "",
    estado: "",
  });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchData(tableName);
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarCedula(empleado.cedula)) {
      return alert("La cédula ingresada no es válida.");
    }

    try {
      await createData(tableName, {
        Nombre: empleado.nombre,
        Cedula: empleado.cedula,
        Tanda: empleado.tanda,
        Comision: empleado.comision,
        FechaIngreso: empleado.fechaIngreso,
        Estado: "Activo",
      });
      setEmpleado({
        nombre: "",
        cedula: "",
        tanda: "",
        comision: "",
        fechaIngreso: "",
        estado: "",
      }); // Limpiar el campo después de crear
    } catch (error) {
      console.error("Error al crear la marca:", error);
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

  const handleEdit = (empleado) => {
    setEditing(empleado);
    setEmpleado({
      nombre: empleado.Nombre,
      cedula: empleado.Cedula,
      tanda: empleado.Tanda,
      comision: empleado.Comision,
      fechaIngreso: empleado.FechaIngreso,
      estado: empleado.Estado,
    });
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setEmpleado({
      nombre: "",
      cedula: "",
      tanda: "",
      comision: "",
      fechaIngreso: "",
      estado: "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validarCedula(empleado.cedula)) {
      return alert("La cédula ingresada no es válida.");
    }

    try {
      await updateData(tableName, editing.id, {
        Nombre: empleado.nombre,
        Cedula: empleado.cedula,
        Tanda: empleado.tanda,
        Comision: empleado.comision,
        FechaIngreso: empleado.fechaIngreso,
        Estado: "Activo",
      });
      setEditing(null); // Salir del modo de edición
      setEmpleado({
        nombre: "",
        cedula: "",
        tanda: "",
        comision: "",
        fechaIngreso: "",
        estado: "",
      }); // Limpiar el campo de texto
    } catch (error) {
      console.error("Error al actualizar la marca:", error);
    }
  };

  return (
    <div>
      <h2>Empleados</h2>

      <form
        className="d-flex justify-content-center gap-3 mt-4 mb-4"
        onSubmit={editing ? handleUpdate : handleSubmit}
      >
        <input
          required
          type="text"
          name="empleado"
          placeholder="Nombre y Apellido"
          onChange={(e) =>
            setEmpleado((prevData) => ({
              ...prevData,
              nombre: e.target.value,
            }))
          }
          value={empleado.nombre}
          className="form-control"
          style={{ maxWidth: "200px" }}
        />

        <input
          required
          type="number"
          name="cedula"
          placeholder="Cedula"
          onChange={(e) =>
            setEmpleado((prevData) => ({
              ...prevData,
              cedula: e.target.value,
            }))
          }
          value={empleado.cedula}
          className="form-control"
          style={{ maxWidth: "200px" }}
        />

        <select
          value={empleado.tanda}
          onChange={(e) =>
            setEmpleado((prevData) => ({
              ...prevData,
              tanda: e.target.value,
            }))
          }
          required
          className="form-select"
          style={{ width: "200px" }}
          aria-label="Selecciona una marca"
        >
          <option value="">Elige una tanda</option>
          <option value="Diurna">Diurna</option>
          <option value="Nocturna">Nocturna</option>
        </select>

        <select
          value={empleado.comision}
          onChange={(e) =>
            setEmpleado((prevData) => ({
              ...prevData,
              comision: e.target.value,
            }))
          }
          required
          className="form-select"
          style={{ width: "200px" }}
          aria-label="Selecciona una marca"
        >
          <option value="">Elige una comision</option>
          <option value="3%">3%</option>
          <option value="5%">5%</option>
          <option value="7%">7%</option>
        </select>

        <input
          required
          type="date"
          name="fechaIngreso"
          placeholder="Fecha de Ingreso"
          onChange={(e) =>
            setEmpleado((prevData) => ({
              ...prevData,
              fechaIngreso: e.target.value,
            }))
          }
          value={empleado.fechaIngreso}
          className="form-control"
          style={{ maxWidth: "200px" }}
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
      ) : !data.Empleados || data.Empleados.length === 0 ? (
        <p>No hay Empleados disponibles</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cedula</th>
              <th>Tanda</th>
              <th>Comision</th>
              <th>Fecha de Ingreso</th>
              <th>Estado</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {data.Empleados.map((empleado) => (
              <tr key={empleado.id}>
                <td>{empleado.Nombre}</td>
                <td>{ formatCedula( empleado.Cedula)}</td>
                <td>{empleado.Tanda}</td>
                <td>{empleado.Comision}</td>
                <td>{empleado.FechaIngreso}</td>
                <td>{empleado.Estado}</td>
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
                            handleToggleEstado(empleado.id, empleado.Estado)
                          }
                        >
                          {empleado.Estado === "Activo"
                            ? "Desactivar"
                            : "Activar"}
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleEdit(empleado)}
                        >
                          Editar
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleDelete(empleado.id)}
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
