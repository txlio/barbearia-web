import { useState } from "react";
import api from "../api/axios";
import Cadastro from "./Cadastro";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mostrarCadastro, setMostrarCadastro] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !senha) {
      setErro("Preencha e-mail e senha.");
      return;
    }

    try {
      setCarregando(true);
      setErro("");

      const response = await api.post("/auth/login", {
        email,
        senha,
      });

      onLogin(response.data);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setErro(error.response?.data || "E-mail ou senha inválidos.");
    } finally {
      setCarregando(false);
    }
  };

  if (mostrarCadastro) {
    return <Cadastro onVoltar={() => setMostrarCadastro(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm uppercase tracking-[0.3em] text-amber-500">
            Barbearia Eduardo Silva
          </p>
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="mt-2 text-slate-400">
            Entre para acessar o sistema.
          </p>
        </div>

        {erro && (
          <div className="mb-4 rounded-xl border border-red-800 bg-red-950 px-4 py-3 text-red-200">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-amber-500"
              placeholder="Digite seu e-mail"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-amber-500"
              placeholder="Digite sua senha"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-xl bg-amber-500 px-4 py-4 text-lg font-bold text-slate-950 transition hover:bg-amber-400 disabled:opacity-70"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>

          <button
            type="button"
            onClick={() => setMostrarCadastro(true)}
            className="w-full rounded-xl bg-slate-700 px-4 py-4 text-lg font-bold text-white transition hover:bg-slate-600"
          >
            Criar conta
          </button>
        </form>
      </div>
      <div className="mt-6 text-center text-xs text-slate-500">
        Desenvolvido por @txlio_reis
      </div>
    </div>
  );
}

export default Login;