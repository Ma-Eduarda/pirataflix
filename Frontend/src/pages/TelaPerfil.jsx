import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
import ListaUsuario from '../components/ListaUsuario.jsx';
import PerfilHeader from '../components/PerfilHeader.jsx';
import TabelaUsuariosAdmin from '../components/TabelaUsuariosAdmin.jsx';
import ListaAssistidos from '../components/ListaAssistidos.jsx';
import ModalEditarPerfil from '../components/modais/ModalEditarPerfil.jsx';
import ModalExcluirConta from '../components/modais/ModalExcluirConta.jsx';
import ModalEditarUsuarioAdmin from '../components/modais/ModalEditarUsuarioAdmin.jsx';
import "./TelaPerfil.css";
import "./Home.css";
import { listarAssistidos, listarUsuarios, atualizarUsuario, deletarUsuario, removerAssistido } from "../services/usuario";
import { listarFavoritos, removerFavorito, marcarAssistido } from "../services/usuario.js";

function TelaPerfil({ user, setUser }) {
  const [assistidos, setAssistidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usuarioAtual, setUsuarioAtual] = useState(user);
  const [userMovies, setUserMovies] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [erroExclusao, setErroExclusao] = useState('');

  // Modais
  const [showModal, setShowModal] = useState(false);
  const [showModalAdmin, setShowModalAdmin] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [nome, setNome] = useState(user?.nome || "");
  const [email, setEmail] = useState(user?.email || "");
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const navigate = useNavigate();
  const isAdmin = user?.tipo === "adm";

  useEffect(() => {
    setUsuarioAtual(user);
  }, [user]);

  useEffect(() => {
    if (usuarioAtual) {
      setNome(usuarioAtual.nome || "");
      setEmail(usuarioAtual.email || "");
    }
  }, [usuarioAtual, showModal]);

  // BUSCAR ASSISTIDOS 
  useEffect(() => {
    const fetchAssistidos = async () => {
      if (!user || isAdmin) return;

      setLoading(true);
      setError(null);

      try {
        const data = await listarAssistidos(user.id);
        setAssistidos(data);
      } catch (err) {
        setError(err.message || "Erro ao buscar assistidos");
      } finally {
        setLoading(false);
      }
    };

    fetchAssistidos();
  }, [user, isAdmin]);

  // BUSCAR USUARIOS 
  useEffect(() => {
    const fetchUsuarios = async () => {
      if (!isAdmin) return;

      setLoading(true);
      try {
        const data = await listarUsuarios();
        setUsuarios(data);
      } catch (err) {
        setError("Erro ao carregar usuários");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [isAdmin]);

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

  const handleRemover = async (movie) => {
    await removerFavorito(user?.id, movie.id);
    setError(`${movie.titulo} removido da sua lista!`);
    fetchUserMovies();
  };

  const handleAssistido = async (movie) => {
    await marcarAssistido(user?.id, movie.id);
    setSuccessMessage(`${movie.titulo} marcado como assistido!`);
    fetchUserMovies();
  };

  // editar perfil próprio
  const handleSalvarPerfil = async () => {
    if (!nome.trim()) {
      alert("O nome não pode ficar vazio.");
      return;
    }

    if (!window.confirm("Deseja salvar as alterações?")) return;

    try {
      setSalvando(true);
      const dadosAtualizacao = { nome: nome.trim() };

      if (isAdmin && email.trim()) {
        dadosAtualizacao.email = email.trim();
      }

      const usuarioAtualizado = await atualizarUsuario(usuarioAtual.id, dadosAtualizacao);

      setUsuarioAtual(usuarioAtualizado);
      localStorage.setItem("user", JSON.stringify(usuarioAtualizado));
      setShowModal(false);
    } catch (err) {
      alert("Erro ao atualizar perfil.");
    } finally {
      setSalvando(false);
    }
  };

  // admin editar usuário
  const handleSalvarAdmin = async () => {
    if (!nome.trim()) return;
    if (!window.confirm("Deseja salvar as alterações?")) return;

    setSalvando(true);
    await atualizarUsuario(usuarioSelecionado.id, { nome, email });
    setUsuarios((prev) =>
      prev.map((u) => (u.id === usuarioSelecionado.id ? { ...u, nome, email } : u))
    );
    setShowModalAdmin(false);
    setSalvando(false);
  };

  // admin excluir usuário (da tabela)
  const handleExcluirUsuarioAdmin = async (id) => {
    if (!window.confirm("Deseja excluir este usuário?")) return;

    await deletarUsuario(id, null, true);
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  };

  // excluir própria conta (precisa de senha)
  const handleExcluirConta = async (senha) => {
    try {
      setExcluindo(true);
      setErroExclusao('');

      await deletarUsuario(usuarioAtual.id, senha, false);

      localStorage.removeItem("user");
      window.location.href = "/";

    } catch (err) {
      if (err.response?.status === 401) {
        setErroExclusao("Senha incorreta.");
      } else {
        setErroExclusao(
          err.response?.data?.erro || "Erro ao excluir conta."
        );
      }
      setExcluindo(false);
    }
  };

  // remover filme assistido
  const handleRemoverAssistido = async (movieId) => {
    if (!window.confirm("Deseja remover este filme da lista de assistidos?")) return;

    try {
      await removerAssistido(user.id, movieId);
      setAssistidos((prev) => prev.filter((movie) => movie.id !== movieId));
    } catch (err) {
      alert("Erro ao remover filme da lista de assistidos.");
    }
  };

  const handleEditarUsuario = (usuario) => {
    setUsuarioSelecionado(usuario);
    setNome(usuario.nome);
    setEmail(usuario.email);
    setShowModalAdmin(true);
  };

  if (!user) {
    return (
      <Container className="text-center mt-5">
        <h3>Você precisa estar logado para acessar o perfil.</h3>
      </Container>
    );
  }

  if (!usuarioAtual) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="home mt-5" style={{ fontFamily: 'Inter, sans-serif' }}>
      <PerfilHeader
        usuario={usuarioAtual}
        onEditarClick={() => setShowModal(true)}
        onExcluirClick={() => setShowConfirm(true)}
      />

      <hr />
      <br />

      {isAdmin ? (
        <TabelaUsuariosAdmin
          usuarios={usuarios}
          loading={loading}
          onEditar={handleEditarUsuario}
          onExcluir={handleExcluirUsuarioAdmin}
        />
      ) : (
        <>
          <ListaAssistidos
            assistidos={assistidos}
            loading={loading}
            onRemover={handleRemoverAssistido}
          />

          <ListaUsuario
            user={user}
            userMovies={userMovies}
            onRemover={handleRemover}
            onAssistido={handleAssistido}
          />
        </>
      )}

      <ModalEditarPerfil
        show={showModal}
        onHide={() => setShowModal(false)}
        nome={nome}
        email={email}
        onNomeChange={(e) => setNome(e.target.value)}
        onEmailChange={(e) => setEmail(e.target.value)}
        onSalvar={handleSalvarPerfil}
        salvando={salvando}
        isAdmin={isAdmin}
        emailAtual={usuarioAtual.email}
      />

      <ModalExcluirConta
        show={showConfirm}
        onHide={() => {
          setShowConfirm(false);
          setErroExclusao('');
        }}
        onConfirmar={handleExcluirConta}
        excluindo={excluindo}
        isAdmin={isAdmin}
        erro={erroExclusao}
      />

      <ModalEditarUsuarioAdmin
        show={showModalAdmin}
        onHide={() => setShowModalAdmin(false)}
        nome={nome}
        email={email}
        onNomeChange={(e) => setNome(e.target.value)}
        onEmailChange={(e) => setEmail(e.target.value)}
        onSalvar={handleSalvarAdmin}
        salvando={salvando}
      />
    </Container>
  );
}

export default TelaPerfil;