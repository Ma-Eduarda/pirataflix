import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import { TrashFill, CheckCircleFill, PlusCircleFill, PlusLg} from 'react-bootstrap-icons';
import '../pages/Home.css';

const formatarData = (dataString) => {
    if (!dataString) return "N/A";

    return new Date(dataString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
};

const truncateText = (text, maxLength) => {
    if (!text) return "Sem sinopse";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const Catalogo = ({ movies, userMovies, assistidos, onAdicionar, onRemover, onRemoverAssistido }) => {
    const navigate = useNavigate();

    return (
        <div className="catalogo-section">
            <div className="lista-header mb-4">
                <span className="barra-titulo"></span>
                <h2 className="titulo-lista">
                    Catálogo <span className="contador">({movies.length})</span>
                </h2>
            </div>

            {movies.length === 0 ? (
                <Alert dismissible variant="danger" className="text-center">
                    Nenhum filme encontrado.
                </Alert>
            ) : (
                <Row className="catalogo-row g-3">
                    {movies.map(movie => {
                        const jaNaLista = userMovies.some(m => m.id === movie.id);
                        const jaAssistido = assistidos.some(m => m.id === movie.id);

                        return (
                            <Col key={movie.id} xs={6} sm={4} md={3} lg={2}>
                                <Card
                                    className="movie-card"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/filme/${movie.id}`)}
                                >

                                    <div className="movie-cover">
                                        <img src={movie.capa_filme} alt={movie.titulo} />

                                        {jaAssistido && (
                                            <Badge
                                                bg="success"
                                                className="movie-badge"
                                            >
                                                <CheckCircleFill size={14} /> Assistido
                                            </Badge>
                                        )}

                                        {jaNaLista && !jaAssistido && (
                                            <Badge
                                                bg="primary"
                                                className="movie-badge"
                                            >
                                                <PlusCircleFill size={14} /> Na Lista
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="movie-info">
                                        <h6 onClick={() => navigate(`/filme/${movie.id}`)}>
                                            {movie.titulo}
                                        </h6>

                                        <p><strong>Diretor:</strong> {movie.diretor || "N/A"}</p>
                                        <p><strong>Sinopse:</strong> {truncateText(movie.sinopse, 20) || "N/A"}</p>
                                        <p><strong>Gênero:</strong> {(movie.generos || []).join(", ")}</p>

                                        <small>Lançamento: {formatarData(movie.dt_lancamento)}</small>

                                        <div className='d-flex flex-column gap-2'>
                                            {jaAssistido ? (
                                                <Button size="sm" variant="success" 
                                                onClick={(e) => { e.stopPropagation(); onRemoverAssistido(movie); }}
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                                    <CheckCircleFill size={14} /> Já assistido
                                                </Button>
                                            ) : jaNaLista ? (
                                                <Button size="sm" variant="danger"
                                                    onClick={(e) => { e.stopPropagation(); onRemover(movie); }}
                                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                                                >
                                                    <TrashFill size={14} /> Remover da Lista
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="primary"
                                                    onClick={(e) => { e.stopPropagation(); onAdicionar(movie); }}
                                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                                    <PlusLg size={16} style={{ color: "red" }} /> Adicionar à lista
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </div>
    );
};

export default Catalogo;
