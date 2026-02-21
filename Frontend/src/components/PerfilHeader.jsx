import React from 'react';
import { Button } from 'react-bootstrap';
import { Trash, Pencil } from 'react-bootstrap-icons';
import IconeUsuario from './InconeUsuario';

const PerfilHeader = ({ usuario, onEditarClick, onExcluirClick }) => {
    return (
        <div className="perfil-header d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center">
                <div className="perfil-icone me-3">
                    <IconeUsuario name={usuario.nome || usuario.name} size={90} />
                </div>
                <div>
                    <h2 className="perfil-nome">{usuario.nome || usuario.name}</h2>
                    <p className="perfil-email">{usuario.email}</p>
                </div>
            </div>

            <div className="d-flex flex-column align-items-end gap-2">
                <Button
                    variant="light"
                    size="sm"
                    onClick={onEditarClick}
                    style={{ borderRadius: "10px", display: "inline-flex", alignItems: "center", gap: "2px" }}
                >
                    <Pencil className="me-2" />
                    Editar perfil
                </Button>

                <Button
                    variant="danger"
                    size="sm"
                    onClick={onExcluirClick}
                    style={{ borderRadius: "10px", display: "inline-flex", alignItems: "center", gap: "1px" }}
                >
                    <Trash className="me-1" />
                    Excluir conta
                </Button>
            </div>
        </div>
    );
};

export default PerfilHeader;
