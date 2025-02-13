import { useState, useEffect } from "react";
import { useRentCar } from "../context/RentCarContext";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { validarRenta } from "../helpers/validators";

export const Rentas = () => {
  const tableName = "Rentas";
  const relations = `
    Vehiculo (Descripcion, id) ,
    Empleado (Nombre, id) ,
    Cliente (Nombre, id)
  `;

  const rentaDefault = {
    vehiculo: "",
    empleado: "",
    cliente: "",
    fechaRenta: "",
    fechaDevolucion: "",
    montoDia: "",
    totalCobro: "",
    cantDias: "",
    comentario: "",
    estado: "Activo",
  };

  const [filtro, setFiltro] = useState(""); 

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [renta, setRenta] = useState(rentaDefault);

  const [vehiculosId, setVehiculosId] = useState(null);

  const [empleadosId, setEmpleadosId] = useState(null);

  const [clientesId, setClientesId] = useState(null);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [editing, setEditing] = useState(null);

  const {
    data,
    fetchData,
    loading,
    createData,
    deleteData,
    updateData,
    adding,
  } = useRentCar();

  useEffect(() => {
    fetchData("Vehiculos");
    fetchData("Empleados");
    fetchData("Clientes");
    fetchData(tableName, relations);
    setIsSubmitted(false);
    setTimeout(() => {
      console.log(data.Rentas)
    }, 4000);
  }, [fetchData, relations, isSubmitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validacion = validarRenta(renta);
    if (!validacion.valido) {
      alert(validacion.mensaje);
      return;
    }

    try {
      await createData(tableName, {
        Vehiculo: vehiculosId,
        Empleado: empleadosId,
        Cliente: clientesId,
        FechaRenta: renta.fechaRenta,
        FechaDevolucion: renta.fechaDevolucion,
        MontoDia: renta.montoDia,
        TotalCobro: renta.totalCobro,
        CantDias: renta.cantDias,
        Comentario: renta.comentario,
        Estado: "Activo",
      });
      setRenta({
        ...rentaDefault,
      });
      setVehiculosId(null);
      setEmpleadosId(null);
      setClientesId(null);
      handleToggleEstadoVehiculo(vehiculosId, "Activo");
    } catch (error) {
      console.error("Error al crear la marca:", error);
    } finally {
      handleClose();
      setIsSubmitted(true);
    }
  };

  const handleDelete = async (renta) => {
    try {
      await deleteData(tableName, renta.id);
      handleToggleEstadoVehiculo(renta.Vehiculo.id, "Rentado");
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

  const handleToggleEstadoVehiculo = async (id, estado) => {
    try {
      const nuevoEstado =
        (estado === "Activo" && "Rentado") ||
        (estado === "Rentado" && "Activo");
      await updateData("Vehiculos", id, { Estado: nuevoEstado });
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    }
  };

  const handleEdit = (renta) => {
    handleShow();
    setEditing(renta);
    setRenta({
      vehiculo: renta.Vehiculo,
      empleado: renta.Empleado,
      cliente: renta.Cliente,
      fechaRenta: renta.FechaRenta,
      fechaDevolucion: renta.FechaDevolucion,
      montoDia: renta.MontoDia,
      totalCobro: renta.TotalCobro,
      cantDias: renta.CantDias,
      comentario: renta.Comentario,
      estado: "Activo",
    });
    setVehiculosId(renta.Vehiculo?.id);
    setEmpleadosId(renta.Empleado?.id);
    setClientesId(renta.Cliente?.id);
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setRenta({
      ...rentaDefault,
    });
    setVehiculosId(null);
    setEmpleadosId(null);
    setClientesId(null);
    handleClose();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const validacion = validarRenta(renta);
    if (!validacion.valido) {
      alert(validacion.mensaje);
      return;
    }

    try {
      await updateData(tableName, editing.id, {
        Vehiculo: vehiculosId,
        Empleado: empleadosId,
        Cliente: clientesId,
        FechaRenta: renta.fechaRenta,
        FechaDevolucion: renta.fechaDevolucion,
        MontoDia: renta.montoDia,
        TotalCobro: renta.totalCobro,
        CantDias: renta.cantDias,
        Comentario: renta.comentario,
        Estado: "Activo",
      });
      setEditing(null);
      setRenta({
        ...rentaDefault,
      });
      setVehiculosId(null);
      setEmpleadosId(null);
      setClientesId(null);
    } catch (error) {
      console.error("Error al actualizar:", error);
    } finally {
      handleClose();
      setIsSubmitted(true);
    }
  };

  const filteredRentas = (data.Rentas || []).filter((renta) => {
    // Si hay un filtro seleccionado, filtra las rentas por el ID del vehículo
    if (filtro) {
      return renta.Vehiculo.id === filtro;
    }
    return true; // Si no hay filtro, mostrar todas las rentas
  });

  return (
    <div>
      <h2>Rentas</h2>

      <Button variant="primary" onClick={handleShow} className="mt-4 mb-4">
        Rentar Vehiculo
      </Button>

      <div className="w-25 mb-4">
        <label htmlFor="filtro" className="form-label">
          Filtrar por Vehiculo
        </label>
        <select
          value={filtro || ""}
          onChange={(e) => {
            const selected = data.Vehiculos.find(
              (vehiculo) => vehiculo.id === Number(e.target.value)
            );
            setFiltro(selected?.id);
          }}
          required
          className="form-select"
          id="vehiculosId"
        >
          <option value="">Seleccion</option>
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

      <Modal show={show} onHide={handleClose} className="p-4">
        <form
          className="d-flex flex-wrap justify-content-start mt-4 mb-4 m-5 gap-4"
          onSubmit={editing ? handleUpdate : handleSubmit}
          id="vehiculoForm"
        >
          <div className=" w-100">
            <label htmlFor="vehiculosId" className="form-label">
              Elige un Vehiculo
            </label>
            <select
              value={vehiculosId || ""}
              onChange={(e) => {
                const selected = data.Vehiculos.find(
                  (vehiculo) => vehiculo.id === Number(e.target.value)
                );
                setVehiculosId(selected?.id);
              }}
              required
              className="form-select"
              id="vehiculosId"
            >
              <option value="" defaultValue={true}>
                Vehiculos
              </option>
              {data.Vehiculos ? (
                data.Vehiculos.map((vehiculo) => (
                  <option
                    value={vehiculo.id}
                    key={vehiculo.id}
                    disabled={
                      vehiculo.Estado === "Inactivo" ||
                      vehiculo.Estado === "Rentado"
                    }
                  >
                    {vehiculo.Descripcion}
                  </option>
                ))
              ) : (
                <option disabled>No hay vehiculos disponibles</option>
              )}
            </select>
          </div>

          <div className=" w-100">
            <label htmlFor="empleadosId" className="form-label">
              Elige un Empleado
            </label>
            <select
              value={empleadosId || ""}
              onChange={(e) => {
                const selected = data.Empleados.find(
                  (empleado) => empleado.id === Number(e.target.value)
                );
                setEmpleadosId(selected?.id);
              }}
              required
              className="form-select"
              id="empleadosId"
            >
              <option value="" defaultValue={true}>
                Empleados
              </option>
              {data.Empleados ? (
                data.Empleados.map((empleado) => (
                  <option
                    value={empleado.id}
                    key={empleado.id}
                    disabled={empleado.Estado == "Inactivo" && true}
                  >
                    {empleado.Nombre}
                  </option>
                ))
              ) : (
                <option disabled>No hay empleados disponibles</option>
              )}
            </select>
          </div>

          <div className=" w-100">
            <label htmlFor="clientesId" className="form-label">
              Elige un Cliente
            </label>
            <select
              value={clientesId || ""}
              onChange={(e) => {
                const selected = data.Clientes.find(
                  (cliente) => cliente.id === Number(e.target.value)
                );
                setClientesId(selected?.id);
              }}
              required
              className="form-select"
              id="clientesId"
            >
              <option value="" defaultValue={true}>
                Clientes
              </option>
              {data.Clientes ? (
                data.Clientes.map((cliente) => (
                  <option
                    value={cliente.id}
                    key={cliente.id}
                    disabled={cliente.Estado == "Inactivo" && true}
                  >
                    {cliente.Nombre}
                  </option>
                ))
              ) : (
                <option disabled>No hay Clientes disponibles</option>
              )}
            </select>
          </div>

          <div className=" w-100">
            <label htmlFor="fechaRenta" className="form-label">
              Fecha de Inicio
            </label>
            <input
              type="date"
              name="fechaRenta"
              onChange={(e) =>
                setRenta((prevData) => ({
                  ...prevData,
                  fechaRenta: e.target.value,
                }))
              }
              value={renta.fechaRenta}
              required
              className="form-control w-100"
              id="fechaRenta"
            />
          </div>

          <div className=" w-100">
            <label htmlFor="fechaDevolucion" className="form-label">
              Fecha de Devolucion
            </label>
            <input
              type="date"
              name="fechaDevolucion"
              onChange={(e) =>
                setRenta((prevData) => ({
                  ...prevData,
                  fechaDevolucion: e.target.value,
                }))
              }
              value={renta.fechaDevolucion}
              required
              className="form-control w-100"
              id="fechaDevolucion"
            />
          </div>

          <div className=" w-100">
            <label htmlFor="montoDia" className="form-label">
              Monto por Dia
            </label>
            <input
              type="number"
              name="montoDia"
              onChange={(e) =>
                setRenta((prevData) => ({
                  ...prevData,
                  montoDia: e.target.value,
                }))
              }
              value={renta.montoDia}
              required
              className="form-control w-100"
              id="montoDia"
            />
          </div>

          <div className=" w-100">
            <label htmlFor="cantDias" className="form-label">
              Cantidad de Dias
            </label>
            <input
              type="number"
              name="cantDias"
              onChange={(e) =>
                setRenta((prevData) => ({
                  ...prevData,
                  cantDias: e.target.value,
                }))
              }
              value={renta.cantDias}
              required
              className="form-control w-100"
              id="cantDias"
            />
          </div>

          <div className=" w-100">
            <label htmlFor="totalCobro" className="form-label">
              Total a Cobrar
            </label>
            <input
              type="number"
              name="totalCobro"
              onChange={(e) =>
                setRenta((prevData) => ({
                  ...prevData,
                  totalCobro: e.target.value,
                }))
              }
              value={renta.totalCobro}
              required
              className="form-control w-100"
              id="totalCobro"
            />
          </div>

          <div className=" w-100">
            <label htmlFor="comentario" className="form-label">
              Comentarios
            </label>
            <textarea
              name="comentario"
              onChange={(e) =>
                setRenta((prevData) => ({
                  ...prevData,
                  comentario: e.target.value,
                }))
              }
              value={renta.comentario}
              className="form-control w-100"
              id="comentario"
            />
          </div>
        </form>

        <Modal.Footer>
          <input
            type="submit"
            className="btn btn-success"
            form="vehiculoForm"
            disabled={adding}
            value={
              adding ? "Procesando..." : editing ? "Actualizar" : "Agregar"
            }
          ></input>
          <Button
            variant="danger"
            onClick={editing ? handleCancelEdit : handleClose}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {loading ? (
        <p>Cargando...</p>
      ) : !data.Rentas || data.Rentas.length === 0 ? (
        <p>No hay rentas disponibles</p>
      ) : (
        <div className="row">
          {filteredRentas.map((renta) => (
            <div key={renta.id} className="col-md-6 col-lg-4 mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-4">Renta #{renta.id}</h5>
                  <p className="card-text text-start">
                    <strong>Vehículo:</strong> {renta.Vehiculo.Descripcion}{" "}
                    <br />
                    <strong>Empleado:</strong> {renta.Empleado.Nombre} <br />
                    <strong>Cliente:</strong> {renta.Cliente.Nombre} <br />
                    <strong>Fecha de Inicio:</strong> {renta.FechaRenta} <br />
                    <strong>Fecha de Fin:</strong> {renta.FechaDevolucion}{" "}
                    <br />
                    <strong>Monto por Dia:</strong> ${renta.MontoDia} <br />
                    <strong>Cantidad de Dias:</strong> {renta.CantDias} <br />
                    <strong>Monto Total:</strong> ${renta.TotalCobro} <br />
                    <strong>Comentario:</strong> {renta.Comentario} <br />
                    <strong>Estado:</strong>
                    <span
                      className={`badge ${
                        renta.Estado === "Activo" ? "bg-success" : "bg-danger"
                      } ms-2`}
                    >
                      {renta.Estado}
                    </span>
                  </p>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleEdit(renta)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(renta)}
                    >
                      Eliminar
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleToggleEstado(renta.id, renta.Estado)}
                    >
                      {renta.Estado === "Activo" ? "Desactivar" : "Activar"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
