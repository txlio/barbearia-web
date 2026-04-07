import { useState } from "react";
import api from "../api/axios";

function Cadastro({ onVoltar }) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleCadastro = async (e) => {
    e.preventDefault();

    if (!nome || !telefone || !email || !senha) {
      setErro("Preencha todos os campos.");
      return;
    }

    try {
      setCarregando(true);
      setErro("");
      setMensagem("");

      const body = {
        nome,
        telefone,
        email,
        senha,
      };

      await api.post("/clientes", body);

      setMensagem("Cadastro realizado com sucesso. Agora faça login.");
      setNome("");
      setTelefone("");
      setEmail("");
      setSenha("");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      setErro(error.response?.data || "Erro ao realizar cadastro.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm uppercase tracking-[0.3em] text-amber-500">
            Barbearia Eduardo Silva
          </p>
          <h1 className="text-3xl font-bold">Cadastro</h1>
          <p className="mt-2 text-slate-400">
            Crie sua conta para acessar o sistema.
          </p>
        </div>

        {erro && (
          <div className="mb-4 rounded-xl border border-red-800 bg-red-950 px-4 py-3 text-red-200">
            {erro}
          </div>
        )}

        {mensagem && (
          <div className="mb-4 rounded-xl border border-green-800 bg-green-950 px-4 py-3 text-green-200">
            {mensagem}
          </div>
        )}

        <form onSubmit={handleCadastro} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Nome
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-amber-500"
              placeholder="Digite seu nome"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Telefone
            </label>
            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-amber-500"
              placeholder="Digite seu telefone"
            />
          </div>

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
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </button>

          <button
            type="button"
            onClick={onVoltar}
            className="w-full rounded-xl bg-slate-700 px-4 py-4 text-lg font-bold text-white transition hover:bg-slate-600"
          >
            Voltar para login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Cadastro;