import React from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';
import { Trash, Pencil } from 'react-bootstrap-icons';
import IconeUsuario from './InconeUsuario';
import '../pages/Home.css';

const TabelaUsuariosAdmin = ({ usuarios, loading, onEditar, onExcluir }) => {
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4 lista-header">
                <h2 className="m-0 titulo-lista">
                    <span className="barra-titulo"></span>
                    Gerenciar Usuários <span className="text-secondary">({usuarios.length})</span>
                </h2>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center my-5">
                    <Spinner animation="border" />
                </div>
            ) : (
                <div className="table-container catalogo-row g-3">
                    <Table responsive hover className="admin-table align-middle table-dark">
                        <thead>
                            <tr>
                                <th>Usuário</th>
                                <th>Email</th>
                                <th className="text-center">Ações</th>
                            </tr>
                        </thead>

                        <tbody>
                            {usuarios.map((u) => (
                                <tr key={u.id}>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <IconeUsuario name={u.nome} size={35} />
                                            <span className="fw-semibold">{u.nome}</span>
                                        </div>
                                    </td>

                                    <td className="text-secondary">{u.email}</td>

                                    <td className="text-center">
                                        <Button
                                            size="sm"
                                            variant="outline-primary"
                                            className="me-2"
                                            onClick={() => onEditar(u)}
                                        >
                                            <Pencil size={14} />
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="outline-danger"
                                            onClick={() => onExcluir(u.id)}
                                        >
                                            <Trash size={14} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </>
    );
};

export default TabelaUsuariosAdmin;
