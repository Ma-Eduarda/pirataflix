import React from 'react';
import { Card, Button, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './ListaUsuario.css';
import { TrashFill, CheckCircleFill } from 'react-bootstrap-icons';

const ListaUsuario = ({ user, userMovies, onRemover, onAssistido }) => {
    const navigate = useNavigate();

    return (
        <div className="lista-section mb-5">
            <div className="lista-header mb-4">
                <span className="barra-titulo"></span>
                <h2 className="titulo-lista">
                    Sua Lista <span className="contador">({userMovies.length})</span>
                </h2>
            </div>

            {!user ? (
                <p className="login-text" onClick={() => navigate('/tela-login')}>
                    Faça login pra adicionar filmes à sua lista e acompanhar o que já assistiu!
                </p>
            ) : (
                <>
                    {userMovies.length === 0 ? (
                        <p style={{ color: "#acacac", marginTop: 8, fontSize: "0.9rem" }}>
                            Você ainda não adicionou nenhum filme à sua lista.
                        </p>
                    ) : (
                        <Row className="scroll-horizontal-container flex-nowrap g-3">
                            {userMovies.map(movie => (
                                <Col xs={6} sm={4} md={3} lg={2} key={movie.id} className='d-flex'>
                                <Card 
                                    key={movie.id} 
                                    className="movie-card w-100" 
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/filme/${movie.id}`)}
                                >

                                    <div className="movie-cover">
                                        <img src={movie.capa_filme} alt={movie.titulo} />
                                    </div>

                                    <div className="movie-info">
                                        <h6>{movie.titulo}</h6>


                                        <div className='d-flex flex-column'>
                                            <Button
                                                size="sm"
                                                onClick={(e) => { e.stopPropagation(); onRemover(movie); }}
                                                variant='danger'
                                                className="d-flex align-items-center justify-content-center gap-1"
                                            >
                                                <TrashFill size={14} /> Remover da Lista
                                            </Button>

                                            <Button
                                                size="sm"
                                                onClick={(e) => { e.stopPropagation(); onAssistido(movie); }}
                                                variant='success'
                                                className="d-flex align-items-center justify-content-center gap-1"

                                            >
                                                <CheckCircleFill size={14} /> Marcar Assistido
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </>
            )}
        </div>
    );
};

export default ListaUsuario;
