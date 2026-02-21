import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import Carrossel from '../components/Carrossel.jsx';
import ListaUsuario from '../components/ListaUsuario.jsx';
import Catalogo from '../components/Catalogo.jsx';
import '../pages/Home.css';
import { listarFavoritos, listarAssistidos, adicionarFavorito, removerFavorito, marcarAssistido, removerAssistido } from "../services/usuario.js";
import { listarFilmes} from "../services/filme.js";


export default function Home({ user }) {
  const [movies, setMovies] = useState([]);
  const [userMovies, setUserMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [assistidos, setAssistidos] = useState([]);
  const [jaAssistido, setJaAssistido] = useState(false);


  useEffect(() => {
    async function carregar() {
      try {
        const data = await listarFilmes();
        setMovies(data);

      } catch (err) {
        console.log(err);
        setError("Erro ao carregar filmes");

      } finally {
        setLoading(false);

      }
    }

    carregar();
  }, []);

  
  useEffect(() => {
    console.log("MOVIES ATUALIZADO:", movies);
  }, [movies]);

  const fetchUserMovies = async () => {
    if (!user?.id) return;
    const list = await listarFavoritos(user.id);
    setUserMovies(list || []);

    const assistidosList = await listarAssistidos(user.id);
    setAssistidos(assistidosList || []);
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserMovies();

    } else {
      setUserMovies([]);
      setAssistidos([]);
    }
  }, [user]);


  const handleAdicionar = async (movie) => {
    if (!user) {
      setError("Você precisa estar logado para adicionar filmes à lista.");
      return;
    }

    await adicionarFavorito(user.id, movie.id);
    setSuccessMessage(`${movie.titulo} adicionado à sua lista!`);
    fetchUserMovies();
  };

  const handleRemover = async (movie) => {
    await removerFavorito(user?.id, movie.id);
    setSuccessMessage(`${movie.titulo} removido da sua lista!`);
    fetchUserMovies();
  };

  const handleAssistido = async (movie) => {
    await marcarAssistido(user?.id, movie.id);
    setSuccessMessage(`${movie.titulo} marcado como assistido!`);
    fetchUserMovies();
  };


  // remover filme assistido
  const handleRemoverAssistido = async (movie) => {
    if (!window.confirm("Deseja remover este filme da lista de assistidos?")) return;

    try {
      await removerAssistido(user.id, movie.id);
      setSuccessMessage(`${movie.titulo} removido da lista de assistidos!`);
      fetchUserMovies();
    } catch (err) {
      setError("Erro ao remover filme da lista de assistidos.");
    }
  };

  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError("");
        setSuccessMessage("");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);


  if (loading)
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </Container>
    );

  return (
    <>

      <Carrossel />

      <Container className="home" style={{ fontFamily: 'Inter, sans-serif' }}>

        {!user && error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

        <ListaUsuario
          user={user}
          userMovies={userMovies}
          onRemover={handleRemover}
          onAssistido={handleAssistido}
        />

        <Catalogo
          movies={movies}
          userMovies={userMovies}
          assistidos={assistidos}
          jaAssistido={jaAssistido}
          onAdicionar={handleAdicionar}
          onRemover={handleRemover}
          //onRemoverAssistido={handleRemoverAssistido}
        />
      </Container>
    </>
  );
}
