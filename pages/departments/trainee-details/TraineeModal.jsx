import { Modal } from "react-bootstrap";

const TraineeModal = ({ children, title, handleShow, handleClose }) => {
  return (
    <Modal show={handleShow} onHide={handleClose} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title style={{ fontWeight: "400" }} > {title} </Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default TraineeModal;
