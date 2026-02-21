import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ModalEditarPerfil = ({ 
  show, 
  onHide, 
  nome, 
  email, 
  onNomeChange, 
  onEmailChange, 
  onSalvar, 
  salvando, 
  isAdmin, 
  emailAtual 
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton style={{ backgroundColor: "#1d1d1d" }}>
        <Modal.Title>Editar Perfil</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              value={nome}
              onChange={onNomeChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label style={isAdmin ? {} : { color: "#a3a3a3" }}>Email</Form.Label>
            <Form.Control
              type="email"
              value={isAdmin ? email : emailAtual}
              onChange={onEmailChange}
              disabled={!isAdmin}
              style={isAdmin ? {} : { color: "#a3a3a3", cursor: "not-allowed", backgroundColor: "#585858" }}
            />
            {!isAdmin && (
              <Form.Text style={{ color: "#d31a1a" }}>
                O email não pode ser alterado.
              </Form.Text>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="success" onClick={onSalvar} disabled={salvando}>
          {salvando ? "Salvando..." : "Salvar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEditarPerfil;
