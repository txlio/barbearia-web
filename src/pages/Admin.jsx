import { useEffect, useState } from "react";
import api from "../api/axios";

function Admin({ usuario, onLogout }) {
  const [agendamentos, setAgendamentos] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const buscarAgendamentos = async () => {
    try {
      const response = await api.get("/agendamentos");
      setAgendamentos(response.data);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      setErro("Erro ao carregar agendamentos.");
    }
  };

  useEffect(() => {
    buscarAgendamentos();
  }, []);

  const cancelarAgendamento = async (id) => {
    try {
      await api.put(`/agendamentos/${id}/cancelar`);
      setMensagem("Agendamento cancelado com sucesso.");
      setErro("");
      buscarAgendamentos();
    } catch (error) {
      console.error("Erro ao cancelar:", error);
      setErro(error.response?.data || "Erro ao cancelar agendamento.");
    }
  };

  const concluirAgendamento = async (id) => {
    try {
      await api.put(`/agendamentos/${id}/concluir`);
      setMensagem("Agendamento concluído com sucesso.");
      setErro("");
      buscarAgendamentos();
    } catch (error) {
      console.error("Erro ao concluir:", error);
      setErro(error.response?.data || "Erro ao concluir agendamento.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 sm:py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-5xl rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl sm:p-6 md:p-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-sky-400">
              Administração
            </p>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Barbearia Eduardo Silva
            </h1>
            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              Bem-vindo, {usuario?.nome}
            </p>
          </div>

          <button
            onClick={onLogout}
            className="rounded-xl bg-slate-700 px-4 py-3 font-semibold text-white transition hover:bg-slate-600"
          >
            Sair
          </button>
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

        <div className="space-y-4">
          {agendamentos.length === 0 && (
            <div className="rounded-xl bg-slate-800 px-4 py-4 text-slate-300">
              Nenhum agendamento encontrado.
            </div>
          )}

          {agendamentos.map((agendamento) => (
            <div
              key={agendamento.id}
              className="rounded-2xl border border-slate-800 bg-slate-800/70 p-5 md:p-6"
            >
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-bold text-white">
                    {agendamento.cliente?.nome || "Cliente não informado"}
                  </p>
                  <p className="text-sm text-slate-400">
                    Agendamento #{agendamento.id}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                    agendamento.status === "AGENDADO"
                      ? "bg-emerald-900 text-emerald-200"
                      : agendamento.status === "CANCELADO"
                      ? "bg-red-900 text-red-200"
                      : "bg-blue-900 text-blue-200"
                  }`}
                >
                  {agendamento.status}
                </span>
              </div>

              <div className="space-y-1 text-sm text-slate-300">
                <p>
                  <span className="font-semibold text-white">Serviço:</span>{" "}
                  {agendamento.servico?.nome || "Não informado"}
                </p>
                <p>
                  <span className="font-semibold text-white">Data:</span>{" "}
                  {agendamento.data}
                </p>
                <p>
                  <span className="font-semibold text-white">Hora:</span>{" "}
                  {agendamento.hora}
                </p>
                <p>
                  <span className="font-semibold text-white">Telefone:</span>{" "}
                  {agendamento.cliente?.telefone || "Não informado"}
                </p>
                <p>
                  <span className="font-semibold text-white">E-mail:</span>{" "}
                  {agendamento.cliente?.email || "Não informado"}
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  onClick={() => cancelarAgendamento(agendamento.id)}
                  className="rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-500"
                >
                  Cancelar
                </button>

                <button
                  onClick={() => concluirAgendamento(agendamento.id)}
                  className="rounded-xl bg-sky-600 px-4 py-3 font-semibold text-white transition hover:bg-sky-500"
                >
                  Concluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;