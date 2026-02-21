import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Alert, Badge } from 'react-bootstrap';
import { ArrowLeft, CheckCircleFill, TrashFill, PlusCircle, PlusCircleFill } from 'react-bootstrap-icons';
import { buscarFilmePorId } from '../services/filme';
import { listarFavoritos, listarAssistidos, adicionarFavorito, removerFavorito, marcarAssistido, removerAssistido } from '../services/usuario';
import './TelaDetalhesFilme.css';

const formatarData = (dataString) => {
    if (!dataString) return "N/A";
    return new Date(dataString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
};

export default function TelaDetalhesFilme({ user }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [filme, setFilme] = useState(null);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [jaNaLista, setJaNaLista] = useState(false);
    const [jaAssistido, setJaAssistido] = useState(false);
    const [loadingActions, setLoadingActions] = useState(true);


    useEffect(() => {
        async function carregarFilme() {
            setLoadingActions(true);
            try {
                const promises = [buscarFilmePorId(id)];

                if (user?.id && user?.tipo !== "adm") {
                    promises.push(
                        listarFavoritos(user.id),
                        listarAssistidos(user.id)
                    );
                }

                const results = await Promise.all(promises);
                const data = results[0];
                setFilme(data);

                if (user?.id && user?.tipo !== "adm") {
                    const favoritos = results[1];
                    const assistidos = results[2];
                    setJaNaLista(favoritos.some(f => f.id === parseInt(id)));
                    setJaAssistido(assistidos.some(a => a.id === parseInt(id)));
                }
            } catch (err) {
                console.error(err);
                setError("Erro ao carregar detalhes do filme");
            } finally {
                setLoadingActions(false);
            }
        }

        carregarFilme();
    }, [id, user]);

    const handleAdicionar = async () => {
        if (!user) {
            setError("Você precisa estar logado para adicionar filmes à lista.");
            return;
        }

        try {
            await adicionarFavorito(user.id, filme.id);
            setSuccessMessage(`${filme.titulo} adicionado à sua lista!`);
            setJaNaLista(true);
        } catch (err) {
            setError("Erro ao adicionar filme à lista");
        }
    };

    const handleRemover = async () => {
        try {
            await removerFavorito(user?.id, filme.id);
            setSuccessMessage(`${filme.titulo} removido da sua lista!`);
            setJaNaLista(false);
        } catch (err) {
            setError("Erro ao remover filme da lista");
        }
    };

    const handleAssistido = async () => {
        try {
            await marcarAssistido(user?.id, filme.id);
            setSuccessMessage(`${filme.titulo} marcado como assistido!`);
            setJaAssistido(true);
        } catch (err) {
            setError("Erro ao marcar filme como assistido");
        }
    };

    const handleVoltar = () => {
        navigate(-1);
    };

    useEffect(() => {
        if (error || successMessage) {
            const timer = setTimeout(() => {
                setError("");
                setSuccessMessage("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error, successMessage]);

    // remover filme assistido
    const handleRemoverAssistido = async () => {
        if (!window.confirm("Deseja remover este filme da lista de assistidos?")) return;

        try {
            await removerAssistido(user.id, filme.id);
            setSuccessMessage(`${filme.titulo} removido da lista de assistidos!`);
            setJaAssistido(false);
        } catch (err) {
            setError("Erro ao remover filme da lista de assistidos.");
        }
    };

    if (!filme) {
        return null;
    }

    return (
        <Container className="detalhes-filme-container py-4">

            <Button variant="dark" className="mb-4" onClick={handleVoltar}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <ArrowLeft size={18} /> Voltar
            </Button>

            <br />

            {!user && error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}


            <Row className="detalhes-content">
                <Col md={4} className="mb-4">
                    <div className="poster-container">
                        <img
                            src={filme.capa_filme}
                            alt={filme.titulo}
                            className="poster-image"
                        />
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
                </Col>

                <Col md={8}>
                    <div className="filme-info">
                        <h1 className="filme-titulo">{filme.titulo}</h1>

                        <div className="filme-meta mb-4">
                            <span className="meta-item">
                                <strong>Lançamento:</strong> {formatarData(filme.dt_lancamento)}
                            </span>
                        </div>

                        <div className="filme-detalhes mb-4">
                            <div className="detalhe-item">
                                <strong>Diretor:</strong>
                                <p>{filme.diretor || "N/A"}</p>
                            </div>

                            <div className="detalhe-item">
                                <strong>Sinopse:</strong>
                                <p>{filme.sinopse || "N/A"}</p>
                            </div>

                            <div className="detalhe-item">
                                <strong>Gêneros:</strong>
                                <div className="generos-container">
                                    {(filme.generos || []).map((genero, index) => (
                                        <Badge key={index} bg="secondary" className="me-2">
                                            {genero}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {user?.tipo !== "adm" && !loadingActions && (
                            <div className="acoes-container d-flex gap-3 flex-wrap">
                                {jaAssistido ? (
                                    <>
                                        {/* <Button
                                            variant="danger"
                                            className="d-flex align-items-center gap-2"
                                            onClick={handleRemoverAssistido}
                                        >
                                            <TrashFill size={20} /> Remover de Assistidos
                                        </Button>  */}

                                        {/* <Button variant="success" className="d-flex align-items-center gap-2">
                                            <CheckCircleFill size={20} /> Já assistido
                                        </Button> */}

                                        {/* opção 3 */}
                                        <Button variant="success" className="d-flex align-items-center gap-2"
                                            onClick={handleRemoverAssistido}>
                                            <CheckCircleFill size={20} /> Já assistido
                                        </Button>
                                    </>

                                ) : jaNaLista ? (
                                    <>
                                        <Button
                                            variant="danger"
                                            onClick={handleRemover}
                                            className="d-flex align-items-center gap-2"
                                        >
                                            <TrashFill size={20} /> Remover da Lista
                                        </Button>

                                        <Button
                                            variant="success"
                                            onClick={handleAssistido}
                                            className="d-flex align-items-center gap-2"
                                        >
                                            <CheckCircleFill size={20} /> Marcar como Assistido
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant="primary"
                                        onClick={handleAdicionar}
                                        className="d-flex align-items-center gap-2 add-button"
                                    >
                                        <PlusCircle size={20} style={{ color: "red" }} />  Adicionar à Minha Lista
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
