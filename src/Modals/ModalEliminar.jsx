import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export const ModalEliminar = ({ show2, handleClose2, handleDelete }) => {
  return (
    <>
      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Elemento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que quieres eliminar este elemento?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose2}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleDelete}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
