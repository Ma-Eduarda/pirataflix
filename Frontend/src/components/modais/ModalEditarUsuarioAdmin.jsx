import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ModalEditarUsuarioAdmin = ({
    show,
    onHide,
    nome,
    email,
    onNomeChange,
    onEmailChange,
    onSalvar,
    salvando
}) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton style={{ backgroundColor: "#1d1d1d" }}>
                <Modal.Title>Editar usuário</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control value={nome} onChange={onNomeChange} />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control value={email} onChange={onEmailChange} />
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

export default ModalEditarUsuarioAdmin;
