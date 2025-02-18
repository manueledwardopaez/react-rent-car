import { useState, useEffect } from "react";
import { useRentCar } from "../context/RentCarContext";
import {
  validarCedula,
  validarLimiteCredito,
  validarTarjetaCredito,
} from "../helpers/validators";
import {
  formatDinero,
  formatTarjeta,
  formatCedula,
} from "../helpers/formatters";
import { ToastContainer, toast } from "react-toastify";

export const Clientes = () => {
  const tableName = "Clientes";
  

  const {
    data,
    fetchData,
    loading,
    createData,
    deleteData,
    updateData,
    adding,
  } = useRentCar();

  const [cliente, setCliente] = useState({
    nombre: "",
    cedula: "",
    tarjetaCredito: "",
    limiteCredito: "",
    tipoPersona: "",
    estado: "",
  });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchData(tableName);
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarCedula(cliente.cedula)) {
      return toast.error("La cédula ingresada no es válida.");
    }

    if (!validarTarjetaCredito(cliente.tarjetaCredito)) {
      return toast.error("La tarjeta de credito no es válida.");
    }

    if (!validarLimiteCredito(cliente.limiteCredito)) {
      return toast.error("El limite de credito no es suficiente.");
    }

    try {
      await createData(tableName, {
        Nombre: cliente.nombre,
        Cedula: cliente.cedula,
        TarjetaCredito: cliente.tarjetaCredito,
        LimiteCredito: cliente.limiteCredito,
        TipoPersona: cliente.tipoPersona,
        Estado: "Activo",
      });
      setCliente({
        nombre: "",
        cedula: "",
        tarjetaCredito: "",
        limiteCredito: "",
        tipoPersona: "",
        estado: "",
      });
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
      toast.warning("Elimination Completed", { autoClose: 3000 });
    } catch (error) {
      console.error("Error al actualizar el estado de la marca:", error);
    }
  };

  const handleEdit = (cliente) => {
    setEditing(cliente);
    setCliente({
      nombre: cliente.Nombre,
      cedula: cliente.Cedula,
      tarjetaCredito: cliente.TarjetaCredito,
      limiteCredito: cliente.LimiteCredito,
      tipoPersona: cliente.TipoPersona,
      estado: cliente.Estado,
    });
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setCliente({
      nombre: "",
      cedula: "",
      tarjetaCredito: "",
      limiteCredito: "",
      tipoPersona: "",
      estado: "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validarCedula(cliente.cedula)) {
      return toast.error("La cédula ingresada no es válida.");
    }

    if (!validarTarjetaCredito(cliente.tarjetaCredito)) {
      return toast.error("La tarjeta de credito no es válida.");
    }

    if (!validarLimiteCredito(cliente.limiteCredito)) {
      return toast.error("El limite de credito no es suficiente.");
    }

    try {
      await updateData(tableName, editing.id, {
        Nombre: cliente.nombre,
        Cedula: cliente.cedula,
        TarjetaCredito: cliente.tarjetaCredito,
        LimiteCredito: cliente.limiteCredito,
        TipoPersona: cliente.tipoPersona,
        Estado: "Activo",
      });
      setEditing(null); // Salir del modo de edición
      setCliente({
        nombre: "",
        cedula: "",
        tarjetaCredito: "",
        limiteCredito: "",
        tipoPersona: "",
        estado: "",
      }); // Limpiar el campo de texto
    } catch (error) {
      console.error("Error al actualizar la marca:", error);
    }
  };

  return (
    <div>
       <ToastContainer />
      <h2>Clientes</h2>

      <form
        className="d-flex justify-content-center gap-3 mt-4 mb-4"
        onSubmit={editing ? handleUpdate : handleSubmit}
      >
        <input
          required
          type="text"
          name="cliente"
          placeholder="Nombre y Apellido"
          onChange={(e) =>
            setCliente((prevData) => ({
              ...prevData,
              nombre: e.target.value,
            }))
          }
          value={cliente.nombre}
          className="form-control"
          style={{ maxWidth: "200px" }}
        />

        <input
          required
          type="text"
          name="cedula"
          placeholder="Cédula"
          onChange={(e) =>
            setCliente((prevData) => ({
              ...prevData,
              cedula: e.target.value,
            }))
          }
          value={cliente.cedula}
          className="form-control"
          style={{ maxWidth: "200px" }}
        />

        <input
          required
          type="number"
          name="tarjetaCredito"
          placeholder="Tarjeta de Crédito"
          onChange={(e) =>
            setCliente((prevData) => ({
              ...prevData,
              tarjetaCredito: e.target.value,
            }))
          }
          value={cliente.tarjetaCredito}
          className="form-control"
          style={{ maxWidth: "200px" }}
        />

        <input
          required
          type="number"
          name="limiteCredito"
          placeholder="Limite de Crédito"
          onChange={(e) =>
            setCliente((prevData) => ({
              ...prevData,
              limiteCredito: e.target.value,
            }))
          }
          value={cliente.limiteCredito}
          className="form-control"
          style={{ maxWidth: "200px" }}
        />

        <select
          value={cliente.tipoPersona}
          onChange={(e) =>
            setCliente((prevData) => ({
              ...prevData,
              tipoPersona: e.target.value,
            }))
          }
          required
          className="form-select"
          style={{ width: "200px" }}
          aria-label="Selecciona una marca"
        >
          <option value="">Tipo de Persona</option>
          <option value="Física">Física</option>
          <option value="Jurídica">Jurídica</option>
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

      {loading ? (
        <p>Cargando...</p>
      ) : !data.Clientes || data.Clientes.length === 0 ? (
        <p>No hay Clientes disponibles</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cédula</th>
              <th>Tarjeta de Crédito</th>
              <th>Limite de Crédito</th>
              <th>Tipo de Persona</th>
              <th>Estado</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {data.Clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.Nombre}</td>
                <td>{formatCedula(cliente.Cedula)}</td>
                <td> {formatTarjeta(cliente.TarjetaCredito)}</td>
                <td>{formatDinero(cliente.LimiteCredito)}</td>
                <td>{cliente.TipoPersona}</td>
                <td>{cliente.Estado}</td>
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
                            handleToggleEstado(cliente.id, cliente.Estado)
                          }
                        >
                          {cliente.Estado === "Activo"
                            ? "Desactivar"
                            : "Activar"}
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleEdit(cliente)}
                        >
                          Editar
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleDelete(cliente.id)}
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
