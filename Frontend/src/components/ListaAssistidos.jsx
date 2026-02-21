import React from 'react';
import { Card, Button, Spinner, Badge, Row, Col } from 'react-bootstrap';
import './ListaUsuario.css';
import { TrashFill, CheckCircleFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

const ListaAssistidos = ({ assistidos, loading, onRemover }) => {
  const navigate = useNavigate();

  return (
    <div className="assistidos-section">
      <div className="lista-header mb-4">
        <span className="barra-titulo"></span>
        <h2 className="titulo-lista">
          Filmes assistidos <span className="contador">({assistidos.length})</span>
        </h2>
      </div>

      {loading && (
        <div className="d-flex justify-content-center my-4">
          <Spinner animation="border" />
        </div>
      )}

      {assistidos.length === 0 ? (
        <p style={{ color: "#acacac", marginTop: 8, fontSize: "0.9rem" }}>
          Você ainda não marcou nenhum filme como assistido.
        </p>
      ) : (
        <Row className="scroll-horizontal-container flex-nowrap g-3">

          {assistidos.map((movie) => (
            <Col xs={6} sm={4} md={3} lg={2} key={movie.id} className='d-flex'>
              <Card key={movie.id} className="movie-card w-100" onClick={() => navigate(`/filme/${movie.id}`)}>

                <div className="movie-cover">
                  <img src={movie.capa_filme} alt={movie.titulo} />
                  {/* 
                <Badge
                  bg="success"
                  className="movie-badge"
                >
                  <CheckCircleFill size={14} /> Assistido
                </Badge> */}

                </div>

                <div className="movie-info">
                  <h6>{movie.titulo}</h6>

                  <Button
                    variant="danger"
                    size="sm"
                    className="mt-2 d-flex align-items-center justify-content-center gap-1  "
                    style={{ borderRadius: "50px" }}
                    onClick={(e) => { e.stopPropagation(); onRemover(movie.id); }}
                  >
                    <TrashFill size={14} /> Remover da Lista
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default ListaAssistidos;
