import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useState } from "react";

function ModalExcluirConta({ show, onHide, onConfirmar, excluindo, erro }) { 
  const [senha, setSenha] = useState("");

  const handleConfirmar = () => {
    onConfirmar(senha);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Excluir conta</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          Tem certeza que deseja <strong>excluir sua conta</strong>?
        </p>
        <p className="text-danger">
          Essa ação não poderá ser desfeita.
        </p>

        <Form>
          <Form.Group>
            <Form.Label>Digite sua senha:</Form.Label>
            <Form.Control
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)} 
              disabled={excluindo}
            />
          </Form.Group>
        </Form>

        {erro && <Alert variant="danger" className="mt-3">{erro}</Alert>}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={excluindo}>
          Cancelar
        </Button>
        <Button 
          variant="danger" 
          onClick={handleConfirmar} 
          disabled={excluindo || !senha.trim()}
        >
          {excluindo ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Excluindo...
            </>
          ) : (
            "Excluir conta"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalExcluirConta;