import { useState, useEffect } from "react";
import { useRentCar } from "../context/RentCarContext";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
/* import { ModalEliminar } from "../Modals/ModalEliminar";
 */
export const Vehiculos = () => {
  const tableName = "Vehiculos";
  const relations = `
  Marca (Nombre, id),
  Modelo (Nombre, id),
  TipoVehiculo (Nombre, id),
  TipoCombustible (Nombre, id)
`;

  const vehiculoDefault = {
    descripcion: "",
    marca: "",
    modelo: "",
    tipoVehiculo: "",
    combustible: "",
    placa: "",
    chasis: "",
    numMotor: "",
    estado: "Activo",
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [vehiculo, setVehiculo] = useState(vehiculoDefault);

  const [marcaId, setMarcaId] = useState(null);

  const [modeloId, setModeloId] = useState(null);

  const [tipoVehiculoId, setTipoVehiculoId] = useState(null);

  const [tipoCombustibleId, setTipoCombustibleId] = useState(null);

  const [editing, setEditing] = useState(null);

  const [isSubmitted, setIsSubmitted] = useState(false);

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
    fetchData("Marcas");
    fetchData("Modelos");
    fetchData("TiposVehiculos");
    fetchData("Combustibles");
    fetchData(tableName, relations);
    setIsSubmitted(false);
  }, [fetchData, relations, isSubmitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createData(tableName, {
        Descripcion: vehiculo.descripcion,
        Marca: marcaId,
        Modelo: modeloId,
        TipoVehiculo: tipoVehiculoId,
        TipoCombustible: tipoCombustibleId,
        Placa: vehiculo.placa,
        Chasis: vehiculo.chasis,
        NumMotor: vehiculo.numMotor,
        Estado: "Activo",
      });
      setVehiculo({
        ...vehiculoDefault,
      });
      setMarcaId(null);
      setModeloId(null);
      setTipoVehiculoId(null);
      setTipoCombustibleId(null);
    } catch (error) {
      console.error("Error al crear la marca:", error);
    } finally {
      handleClose();
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

  const handleEdit = (vehiculo) => {
    handleShow();
    setEditing(vehiculo);
    setVehiculo({
      descripcion: vehiculo.Descripcion,
      marca: vehiculo.Marca,
      modelo: vehiculo.Modelo,
      tipoVehiculo: vehiculo.TipoVehiculo,
      tipoCombustible: vehiculo.TipoCombustible,
      placa: vehiculo.Placa,
      chasis: vehiculo.Chasis,
      numMotor: vehiculo.NumMotor,
      estado: "Activo",
    });
    setMarcaId(vehiculo.Marca?.id);
    setModeloId(vehiculo.Modelo?.id);
    setTipoVehiculoId(vehiculo.TipoVehiculo?.id);
    setTipoCombustibleId(vehiculo.TipoCombustible?.id);
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setVehiculo({
      ...vehiculoDefault,
    });
    setMarcaId(null);
    setModeloId(null);
    setTipoVehiculoId(null);
    setTipoCombustibleId(null);
    handleClose();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateData(tableName, editing.id, {
        Descripcion: vehiculo.descripcion,
        Marca: marcaId,
        Modelo: modeloId,
        TipoVehiculo: tipoVehiculoId,
        TipoCombustible: tipoCombustibleId,
        Placa: vehiculo.placa,
        Chasis: vehiculo.chasis,
        NumMotor: vehiculo.numMotor,
        Estado: "Activo",
      });
      setEditing(null);
      setVehiculo({
        ...vehiculoDefault,
      });
      setMarcaId(null);
      setModeloId(null);
      setTipoVehiculoId(null);
      setTipoCombustibleId(null);
    } catch (error) {
      console.error("Error al actualizar:", error);
    } finally {
      handleClose();
      setIsSubmitted(true);
    }
  };

  return (
    <div>
      <h2>Vehiculos</h2>

      <Button variant="primary" onClick={handleShow} className="mt-4 mb-4">
        Agregar Vehiculo
      </Button>

      <Modal show={show} onHide={handleClose} className="p-4">
        <form
          className="d-flex flex-wrap justify-content-start mt-4 mb-4 m-5 gap-5"
          onSubmit={editing ? handleUpdate : handleSubmit}
          id="vehiculoForm"
        >
          <div className="w-100">
            <label htmlFor="descripcion" className="form-label">
              Descripción
            </label>
            <input
              type="text"
              id="descripcion"
              name="Descripcion"
              placeholder="Descripción"
              onChange={(e) =>
                setVehiculo((prevData) => ({
                  ...prevData,
                  descripcion: e.target.value,
                }))
              }
              value={vehiculo.descripcion}
              required
              className="form-control w-100"
            />
          </div>

          <div className="w-100">
            <label htmlFor="marca" className="form-label">
              Marca
            </label>
            <select
              id="marca"
              value={marcaId || ""}
              onChange={(e) => {
                const selected = data.Marcas.find(
                  (marca) => marca.id === Number(e.target.value)
                );
                setMarcaId(selected?.id);
              }}
              required
              className="form-select"
            >
              <option value="">Elige una marca</option>
              {data.Marcas ? (
                data.Marcas.map((marca) => (
                  <option
                    value={marca.id}
                    key={marca.id}
                    disabled={marca.Estado === "Inactivo"}
                  >
                    {marca.Nombre}
                  </option>
                ))
              ) : (
                <option disabled>No hay marcas disponibles</option>
              )}
            </select>
          </div>

          <div className="w-100">
            <label htmlFor="modelo" className="form-label">
              Modelo
            </label>
            <select
              id="modelo"
              value={modeloId || ""}
              onChange={(e) => {
                const selected = data.Modelos.find(
                  (modelo) => modelo.id === Number(e.target.value)
                );
                setModeloId(selected?.id);
              }}
              required
              className="form-select"
            >
              <option value="">Elige un Modelo</option>
              {data.Modelos ? (
                data.Modelos.map((modelo) => (
                  <option
                    value={modelo.id}
                    key={modelo.id}
                    disabled={modelo.Estado === "Inactivo"}
                  >
                    {modelo.Nombre}
                  </option>
                ))
              ) : (
                <option disabled>No hay modelos disponibles</option>
              )}
            </select>
          </div>

          <div className="w-100">
            <label htmlFor="tipoVehiculo" className="form-label">
              Tipo de Vehículo
            </label>
            <select
              id="tipoVehiculo"
              value={tipoVehiculoId || ""}
              onChange={(e) => {
                const selected = data.TiposVehiculos.find(
                  (tipoVehiculo) => tipoVehiculo.id === Number(e.target.value)
                );
                setTipoVehiculoId(selected?.id);
              }}
              required
              className="form-select"
            >
              <option value="">Tipo de Vehículo</option>
              {data.TiposVehiculos ? (
                data.TiposVehiculos.map((tipoVehiculo) => (
                  <option
                    value={tipoVehiculo.id}
                    key={tipoVehiculo.id}
                    disabled={tipoVehiculo.Estado === "Inactivo"}
                  >
                    {tipoVehiculo.Nombre}
                  </option>
                ))
              ) : (
                <option disabled>No hay tipos de vehículos disponibles</option>
              )}
            </select>
          </div>

          <div className="w-100">
            <label htmlFor="combustible" className="form-label">
              Combustible
            </label>
            <select
              id="combustible"
              value={tipoCombustibleId || ""}
              onChange={(e) => {
                const selected = data.Combustibles.find(
                  (combustible) => combustible.id === Number(e.target.value)
                );
                setTipoCombustibleId(selected?.id);
              }}
              required
              className="form-select"
            >
              <option value="">Combustible</option>
              {data.Combustibles ? (
                data.Combustibles.map((combustible) => (
                  <option
                    value={combustible.id}
                    key={combustible.id}
                    disabled={combustible.Estado === "Inactivo"}
                  >
                    {combustible.Nombre}
                  </option>
                ))
              ) : (
                <option disabled>No hay combustibles disponibles</option>
              )}
            </select>
          </div>

          <div className="w-100">
            <label htmlFor="placa" className="form-label">
              Placa
            </label>
            <input
              type="text"
              id="placa"
              name="Placa"
              placeholder="Placa"
              onChange={(e) =>
                setVehiculo((prevData) => ({
                  ...prevData,
                  placa: e.target.value,
                }))
              }
              value={vehiculo.placa}
              required
              className="form-control w-100"
            />
          </div>

          <div className="w-100">
            <label htmlFor="chasis" className="form-label">
              Chasis
            </label>
            <input
              type="text"
              id="chasis"
              name="Chasis"
              placeholder="Chasis"
              onChange={(e) =>
                setVehiculo((prevData) => ({
                  ...prevData,
                  chasis: e.target.value,
                }))
              }
              value={vehiculo.chasis}
              required
              className="form-control w-100"
            />
          </div>

          <div className="w-100">
            <label htmlFor="numMotor" className="form-label">
              Número de Motor
            </label>
            <input
              type="text"
              id="numMotor"
              name="NumMotor"
              placeholder="Número de Motor"
              onChange={(e) =>
                setVehiculo((prevData) => ({
                  ...prevData,
                  numMotor: e.target.value,
                }))
              }
              value={vehiculo.numMotor}
              required
              className="form-control w-100"
            />
          </div>
        </form>

        {/*  <form
          className="d-flex flex-wrap justify-content-start mt-4 mb-4 m-5 gap-5"
          onSubmit={editing ? handleUpdate : handleSubmit}
          id="vehiculoForm"
        >
          <input
            type="text"
            name="Descripcion"
            placeholder="Descripcion"
            onChange={(e) =>
              setVehiculo((prevData) => ({
                ...prevData,
                descripcion: e.target.value,
              }))
            }
            value={vehiculo.descripcion}
            required
            className="form-control w-100"
          />

          <select
            value={marcaId || ""}
            onChange={(e) => {
              const selected = data.Marcas.find(
                (marca) => marca.id === Number(e.target.value)
              );
              setMarcaId(selected?.id);
              console.log(marcaId);
            }}
            required
            className="form-select"
            aria-label="Selecciona una marca"
          >
            <option value="" defaultValue={true}>
              Elige una marca
            </option>
            {data.Marcas ? (
              data.Marcas.map((marca) => (
                <option
                  value={marca.id}
                  key={marca.id}
                  disabled={marca.Estado == "Inactivo" && true}
                >
                  {marca.Nombre}
                </option>
              ))
            ) : (
              <option disabled>No hay marcas disponibles</option>
            )}
          </select>

          <select
            value={modeloId || ""}
            onChange={(e) => {
              const selected = data.Modelos.find(
                (modelo) => modelo.id === Number(e.target.value)
              );
              setModeloId(selected?.id);
            }}
            required
            className="form-select"
            aria-label="Selecciona un modelo"
          >
            <option value="" defaultValue={true}>
              Elige un Modelo
            </option>
            {data.Modelos ? (
              data.Modelos.map((modelo) => (
                <option
                  value={modelo.id}
                  key={modelo.id}
                  disabled={modelo.Estado == "Inactivo" && true}
                >
                  {modelo.Nombre}
                </option>
              ))
            ) : (
              <option disabled>No hay modelos disponibles</option>
            )}
          </select>

          <select
            value={tipoVehiculoId || ""}
            onChange={(e) => {
              const selected = data.TiposVehiculos.find(
                (tipoVehiculo) => tipoVehiculo.id === Number(e.target.value)
              );
              setTipoVehiculoId(selected?.id);
            }}
            required
            className="form-select"
            aria-label="Selecciona un Tipo de Vehiculo"
          >
            <option value="" defaultValue={true}>
              Tipo de Vehiculo
            </option>
            {data.TiposVehiculos ? (
              data.TiposVehiculos.map((tipoVehiculo) => (
                <option
                  value={tipoVehiculo.id}
                  key={tipoVehiculo.id}
                  disabled={tipoVehiculo.Estado == "Inactivo" && true}
                >
                  {tipoVehiculo.Nombre}
                </option>
              ))
            ) : (
              <option disabled>No hay tipos de vehiculos disponibles</option>
            )}
          </select>

          <select
            value={tipoCombustibleId || ""}
            onChange={(e) => {
              const selected = data.Combustibles.find(
                (combustibles) => combustibles.id === Number(e.target.value)
              );
              setTipoCombustibleId(selected?.id);
            }}
            required
            className="form-select"
            aria-label="Selecciona un combustible"
          >
            <option value="" defaultValue={true}>
              Combustible
            </option>
            {data.Combustibles ? (
              data.Combustibles.map((combustibles) => (
                <option
                  value={combustibles.id}
                  key={combustibles.id}
                  disabled={combustibles.Estado == "Inactivo" && true}
                >
                  {combustibles.Nombre}
                </option>
              ))
            ) : (
              <option disabled>No hay combustibles disponibles</option>
            )}
          </select>

          <input
            type="text"
            name="Placa"
            placeholder="Placa"
            onChange={(e) =>
              setVehiculo((prevData) => ({
                ...prevData,
                placa: e.target.value,
              }))
            }
            value={vehiculo.placa}
            required
            className="form-control w-100"
          />

          <input
            type="text"
            name="Chasis"
            placeholder="Chasis"
            onChange={(e) =>
              setVehiculo((prevData) => ({
                ...prevData,
                chasis: e.target.value,
              }))
            }
            value={vehiculo.chasis}
            required
            className="form-control w-100"
          />

          <input
            type="text"
            name="NumMotor"
            placeholder="Numero de Motor"
            onChange={(e) =>
              setVehiculo((prevData) => ({
                ...prevData,
                numMotor: e.target.value,
              }))
            }
            value={vehiculo.numMotor}
            required
            className="form-control w-100"
          />
        </form>
 */}
        <Modal.Footer>
          <input
            type="submit"
            className="btn btn-success"
            form="vehiculoForm"
            disabled={adding}
            value={
              adding ? "Procesando..." : editing ? "Actualizar" : "Agregar"
            }
          >
            {/*   {adding ? "Procesando..." : editing ? "Actualizar" : "Agregar"} */}
          </input>
          <Button
            variant="danger"
            onClick={editing ? handleCancelEdit : handleClose}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/*   <ModalEliminar
        show2={show2}
        handleClose2={handleClose2}
        handleDelete={handleDelete}
      /> */}

      {loading ? (
        <p>Cargando...</p>
      ) : !data.Vehiculos || data.Vehiculos.length === 0 ? (
        <p>No hay vehículos disponibles</p>
      ) : (
        <div className="row">
          {data.Vehiculos.map((vehiculo) => (
            <div key={vehiculo.id} className="col-md-6 col-lg-4 mb-3">
              <div className="card shadow-sm">
                <div className="card-body ">
                  <h5 className="card-title mb-4">{vehiculo.Descripcion}</h5>
                  <p className="card-text text-start">
                    <strong>Marca:</strong> {vehiculo.Marca.Nombre} <br />
                    <strong>Modelo:</strong> {vehiculo.Modelo.Nombre} <br />
                    <strong>Tipo de Vehículo:</strong>{" "}
                    {vehiculo.TipoVehiculo.Nombre} <br />
                    <strong>Tipo de Combustible:</strong>{" "}
                    {vehiculo.TipoCombustible.Nombre} <br />
                    <strong>Placa:</strong> {vehiculo.Placa} <br />
                    <strong>Chasis:</strong> {vehiculo.Chasis} <br />
                    <strong>Número de Motor:</strong> {vehiculo.NumMotor} <br />
                    <strong>Estado:</strong>
                    <span
                      className={`badge ${
                        vehiculo.Estado === "Activo"
                          ? "bg-success"
                          : "bg-danger"
                      } ms-2`}
                    >
                      {vehiculo.Estado}
                    </span>
                  </p>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleEdit(vehiculo)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(vehiculo.id)}
                    >
                      Eliminar
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      disabled={vehiculo.Estado === "Rentado" && true}
                      onClick={() =>
                        handleToggleEstado(vehiculo.id, vehiculo.Estado)
                      }
                    >
                      {vehiculo.Estado === "Activo" ? "Desactivar" : "Activar"}
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
