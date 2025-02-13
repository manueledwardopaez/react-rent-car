import { useState, useEffect } from "react";
import { useRentCar } from "../context/RentCarContext";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export const Inspecciones = () => {
  const tableName = "Inspecciones";
  const relations = `
    Vehiculo (Descripcion, id) ,
    Empleado (Nombre, id) ,
    Cliente (Nombre, id)
  `;

  const gomas = [
    "Delantera Izquierda",
    "Delantera Derecha",
    "Trasera Izquierda",
    "Trasera Derecha",
  ]

  const inspeccionDefault = {
    vehiculo: "",
    empleado: "",
    ralladuras: "",
    cantCombustible: "",
    gomaRepuesto: "",
    gato: "",
    totalCobro: "",
    roturasCristal: "",
    estadoGomas: "",
    fecha: "",
    estado: "Activo",
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [inspeccion, setInspeccion] = useState(inspeccionDefault);

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
  }, [fetchData, relations, isSubmitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createData(tableName, {
        Vehiculo: vehiculosId,
        Empleado: empleadosId,
        Cliente: clientesId,
        Ralladuras: inspeccion.ralladuras,
        CantCombustible: inspeccion.cantCombustible,
        GomaRepuesto: inspeccion.gomaRepuesto,
        Gato: inspeccion.gato,
        RoturasCristal: inspeccion.roturasCristal,
        EstadoGomas: inspeccion.estadoGomas,
        Fecha: inspeccion.fecha,
        Estado: "Activo",
      });
      setInspeccion({
        ...inspeccionDefault,
      });
      setVehiculosId(null);
      setEmpleadosId(null);
      setClientesId(null);
    } catch (error) {
      console.error("Error al crear la marca:", error);
    } finally {
      handleClose();
      setIsSubmitted(true);
    }
  };

  const handleDelete = async (inspeccion) => {
    try {
      await deleteData(tableName, inspeccion.id);
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

  const handleEdit = (inspeccion) => {
    handleShow();
    setEditing(inspeccion);
    setInspeccion({
      vehiculo: inspeccion.Vehiculo,
      empleado: inspeccion.Empleado,
      cliente: inspeccion.Cliente,
      ralladuras: inspeccion.Ralladuras,
      cantCombustible: inspeccion.CantCombustible,
      gomaRepuesto: inspeccion.GomaRepuesto,
      gato: inspeccion.Gato,
      roturasCristal: inspeccion.RoturasCristal,
      estadoGomas: inspeccion.EstadoGomas,
      fecha: inspeccion.Fecha,
      estado: "Activo",
    });
    setVehiculosId(inspeccion.Vehiculo?.id);
    setEmpleadosId(inspeccion.Empleado?.id);
    setClientesId(inspeccion.Cliente?.id);
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setInspeccion({
      ...inspeccionDefault,
    });
    setVehiculosId(null);
    setEmpleadosId(null);
    setClientesId(null);
    handleClose();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateData(tableName, editing.id, {
        Vehiculo: vehiculosId,
        Empleado: empleadosId,
        Cliente: clientesId,
        Ralladuras: inspeccion.ralladuras,
        CantCombustible: inspeccion.cantCombustible,
        GomaRepuesto: inspeccion.gomaRepuesto,
        Gato: inspeccion.gato,
        RoturasCristal: inspeccion.roturasCristal,
        EstadoGomas: inspeccion.estadoGomas,
        Fecha: inspeccion.fecha,
        Estado: "Activo",
      });
      console.log(inspeccion.estadoGomas);
      setEditing(null);
      setInspeccion({
        ...inspeccionDefault,
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

  return (
    <div>
      <h2>Inspecciones</h2>

      <Button variant="primary" onClick={handleShow} className="mt-4 mb-4">
        Rentar Vehiculo
      </Button>

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
            <label htmlFor="" className="form-label">
              Tiene ralladuras
            </label>
            <select
              value={inspeccion.ralladuras}
              onChange={(e) =>
                setInspeccion((prevData) => ({
                  ...prevData,
                  ralladuras: e.target.value,
                }))
              }
              required
              className="form-select w-100"
              aria-label="Selecciona"
            >
              <option value="">Ralladuras</option>
              <option value="Si">Si</option>
              <option value="No">No</option>
            
            </select>
          </div>

          <div className=" w-100">
            <label htmlFor="" className="form-label">
              Cantidad de Combustible
            </label>
            <select
              value={inspeccion.cantCombustible}
              onChange={(e) =>
                setInspeccion((prevData) => ({
                  ...prevData,
                  cantCombustible: e.target.value,
                }))
              }
              required
              className="form-select w-100"
              aria-label="Selecciona"
            >
              <option value="">Seleccion</option>
              <option value="1/2">1/2</option>
              <option value="1/3">1/3</option>
              <option value="1/4">1/4</option>
              <option value="Lleno">Lleno</option>
            </select>
          </div>

          <div className=" w-100">
            <label htmlFor="" className="form-label">
              Goma de Repuesto
            </label>
            <select
              value={inspeccion.gomaRepuesto}
              onChange={(e) =>
                setInspeccion((prevData) => ({
                  ...prevData,
                  gomaRepuesto: e.target.value,
                }))
              }
              required
              className="form-select w-100"
              aria-label="Selecciona"
            >
              <option value="">Seleccion</option>
              <option value="Si">Si</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className=" w-100">
            <label htmlFor="" className="form-label">
              Tiene Gato
            </label>
            <select
              value={inspeccion.gato}
              onChange={(e) =>
                setInspeccion((prevData) => ({
                  ...prevData,
                  gato: e.target.value,
                }))
              }
              required
              className="form-select w-100"
              aria-label="Selecciona"
            >
              <option value="">Seleccion</option>
              <option value="Si">Si</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className=" w-100">
            <label htmlFor="" className="form-label">
              Roturas de Cristal
            </label>
            <select
              value={inspeccion.roturasCristal}
              onChange={(e) =>
                setInspeccion((prevData) => ({
                  ...prevData,
                  roturasCristal: e.target.value,
                }))
              }
              required
              className="form-select w-100"
              aria-label="Selecciona"
            >
              <option value="">Seleccion</option>
              <option value="Si">Si</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className=" w-100">
            <label htmlFor="fecha" className="form-label">
              Fecha
            </label>
            <input
              type="date"
              name="fecha"
              onChange={(e) =>
                setInspeccion((prevData) => ({
                  ...prevData,
                  fecha: e.target.value,
                }))
              }
              value={inspeccion.fecha}
              required
              className="form-control w-100"
              id="fecha"
            />
          </div>

          <div className="w-100">
            <label className="form-label">Estado de las Gomas</label>
              
            <div className="d-flex flex-wrap gap-2">
              
              {gomas.map((goma, index) => (
                <div key={index} className="form-check">
                  <input
                    type="checkbox"
                    id={`goma-${index}`}
                    className="form-check-input"
                    checked={inspeccion.estadoGomas.includes(goma)}
                    onChange={(e) => {
                      setInspeccion((prevData) => {
                        const nuevaLista = e.target.checked
                          ? [...prevData.estadoGomas, goma] // Agregar si está checked
                          : prevData.estadoGomas.filter((g) => g !== goma); // Quitar si está unchecked

                        return { ...prevData, estadoGomas: nuevaLista };
                      });
                    }}
                  />
                  <label htmlFor={`goma-${index}`} className="form-check-label">
                    {goma}
                  </label>
                </div>
              ))}
            </div>
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
      ) : !data.Inspecciones || data.Inspecciones.length === 0 ? (
        <p>No hay inspeccions disponibles</p>
      ) : (
        <div className="row">
          {data.Inspecciones.map((inspeccion) => (
            <div key={inspeccion.id} className="col-md-6 col-lg-4 mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-4">
                    Inspeccion #{inspeccion.id}
                  </h5>
                  <div className="card-text text-start ">
                    <strong>Vehículo:</strong> {inspeccion.Vehiculo.Descripcion}{" "}
                    <br />
                    <strong>Empleado:</strong> {inspeccion.Empleado.Nombre}{" "}
                    <br />
                    <strong>Cliente:</strong> {inspeccion.Cliente.Nombre} <br />
                    <strong>Ralladuras:</strong> {inspeccion.Ralladuras} <br />{" "}
                    <strong>Cantidad de Combustible:</strong>{" "}
                    {inspeccion.CantCombustible} <br />
                    <strong>Goma de Repuesto:</strong> {inspeccion.GomaRepuesto}{" "}
                    <br />
                    <strong>Gato:</strong> {inspeccion.Gato} <br />
                    <strong>Roturas de Cristal:</strong>{" "}
                    {inspeccion.RoturasCristal} <br />
                    <strong>Gomas que revisar:</strong>
                    <ul className="list-unstyled mb-0">
                      {inspeccion.EstadoGomas.length > 0 ? (
                        inspeccion.EstadoGomas.map((goma, index) => (
                          <li key={index}>{goma}</li>
                        ))
                      ) : (
                        <li>Ninguna</li>
                      )}
                    </ul>
                    {/*  <br /> */}
                    <strong>Fecha:</strong> {inspeccion.Fecha} <br />
                    <strong>Estado:</strong>
                    <span
                      className={`badge ${
                        inspeccion.Estado === "Activo"
                          ? "bg-success"
                          : "bg-danger"
                      } ms-2`}
                    >
                      {inspeccion.Estado}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleEdit(inspeccion)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(inspeccion)}
                    >
                      Eliminar
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() =>
                        handleToggleEstado(inspeccion.id, inspeccion.Estado)
                      }
                    >
                      {inspeccion.Estado === "Activo"
                        ? "Desactivar"
                        : "Activar"}
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
