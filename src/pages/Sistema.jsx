import { useEffect, useState } from "react";
import axios from "axios";

function Sistema() {
  const [servicos, setServicos] = useState([]);
  const [servicoSelecionado, setServicoSelecionado] = useState("");
  const [data, setData] = useState("2026-03-20");
  const [horarios, setHorarios] = useState([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [agendamentos, setAgendamentos] = useState([]);

  const buscarServicos = async () => {
    try {
      const response = await axios.get("http://localhost:8080/servicos");
      setServicos(response.data);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
      setErro("Não foi possível carregar os serviços.");
    }
  };

  const buscarHorarios = async (dataSelecionada) => {
    try {
      setCarregando(true);
      setErro("");
      setMensagem("");
      setHorarioSelecionado("");

      const response = await axios.get(
        `http://localhost:8080/agendamentos/horarios-disponiveis?data=${dataSelecionada}`
      );

      setHorarios(response.data);
    } catch (error) {
      console.error("Erro ao buscar horários:", error);
      setHorarios([]);
      setErro(
        error.response?.data || "Não foi possível buscar os horários disponíveis."
      );
    } finally {
      setCarregando(false);
    }
  };

  const buscarAgendamentos = async () => {
    try {
      const response = await axios.get("http://localhost:8080/agendamentos");
      setAgendamentos(response.data);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    }
  };

  useEffect(() => {
    buscarServicos();
    buscarAgendamentos();
  }, []);

  useEffect(() => {
    if (data && data.length === 10) {
      buscarHorarios(data);
    } else {
      setHorarios([]);
    }
  }, [data]);

  const agendarHorario = async () => {
    if (!servicoSelecionado) {
      setErro("Selecione um serviço.");
      return;
    }

    if (!horarioSelecionado) {
      setErro("Selecione um horário antes de agendar.");
      return;
    }

    try {
      setErro("");
      setMensagem("");

      const body = {
        cliente: { id: 1 },
        servico: { id: Number(servicoSelecionado) },
        data: data,
        hora: horarioSelecionado,
      };

      await axios.post("http://localhost:8080/agendamentos", body);

      setMensagem(
        `Agendamento realizado com sucesso para ${data} às ${horarioSelecionado}.`
      );
      setHorarioSelecionado("");

      await buscarHorarios(data);
      await buscarAgendamentos();
    } catch (error) {
      console.error("Erro ao agendar:", error);
      setErro(error.response?.data || "Erro ao realizar agendamento.");
    }
  };

  const cancelarAgendamento = async (id) => {
    try {
      await axios.put(`http://localhost:8080/agendamentos/${id}/cancelar`);
      setMensagem("Agendamento cancelado com sucesso.");
      setErro("");

      await buscarAgendamentos();

      if (data && data.length === 10) {
        await buscarHorarios(data);
      }
    } catch (error) {
      console.error("Erro ao cancelar:", error);
      setErro(error.response?.data || "Erro ao cancelar agendamento.");
    }
  };

  const concluirAgendamento = async (id) => {
    try {
      await axios.put(`http://localhost:8080/agendamentos/${id}/concluir`);
      setMensagem("Agendamento concluído com sucesso.");
      setErro("");

      await buscarAgendamentos();

      if (data && data.length === 10) {
        await buscarHorarios(data);
      }
    } catch (error) {
      console.error("Erro ao concluir:", error);
      setErro(error.response?.data || "Erro ao concluir agendamento.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 sm:py-8 md:px-8 md:py-10">
      <div className="mx-auto grid max-w-6xl gap-6 md:gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl sm:p-6 md:p-8">
          <div className="mb-6 md:mb-8">
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-amber-500">
              Agendamento
            </p>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Barbearia Eduardo Silva
            </h1>
            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              Escolha uma data, selecione um serviço e realize o agendamento.
            </p>
          </div>

          {mensagem && (
            <div className="mb-6 rounded-xl border border-emerald-800 bg-emerald-950 px-4 py-3 text-sm font-medium text-emerald-200">
              {mensagem}
            </div>
          )}

          {erro && (
            <div className="mb-6 rounded-xl border border-red-800 bg-red-950 px-4 py-3 text-sm font-medium text-red-200">
              {erro}
            </div>
          )}

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Escolha a data
            </label>
            <input
              type="date"
              value={data}
              onChange={(e) => {
                setData(e.target.value);
                setMensagem("");
                setErro("");
              }}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-amber-500"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Escolha o serviço
            </label>
            <select
              value={servicoSelecionado}
              onChange={(e) => {
                setServicoSelecionado(e.target.value);
                setMensagem("");
                setErro("");
              }}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-amber-500"
            >
              <option value="">Selecione um serviço</option>
              {servicos.map((servico) => (
                <option key={servico.id} value={servico.id}>
                  {servico.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-slate-300">
              Horários disponíveis
            </label>

            {carregando ? (
              <div className="rounded-xl bg-slate-800 px-4 py-4 text-slate-300">
                Carregando horários...
              </div>
            ) : horarios.length === 0 ? (
              <div className="rounded-xl bg-slate-800 px-4 py-4 text-slate-300">
                Nenhum horário disponível para a data selecionada.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {horarios.map((hora, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setHorarioSelecionado(hora)}
                    className={`rounded-xl px-4 py-4 text-base font-semibold transition ${
                      horarioSelecionado === hora
                        ? "border-2 border-amber-400 bg-amber-500 text-slate-950"
                        : "bg-slate-800 text-white hover:bg-slate-700"
                    }`}
                  >
                    {hora}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={agendarHorario}
            className="w-full rounded-xl bg-amber-500 px-4 py-5 text-lg font-bold text-slate-950 transition hover:bg-amber-400"
          >
            Agendar horário
          </button>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl sm:p-6 md:p-8">
          <div className="mb-6">
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-sky-400">
              Administração
            </p>
            <h2 className="text-xl font-bold sm:text-2xl">Agendamentos</h2>
            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              Visualize, cancele ou conclua os agendamentos cadastrados.
            </p>
          </div>

          <div className="space-y-4">
            {agendamentos.length === 0 && (
              <div className="rounded-xl bg-slate-800 px-4 py-4 text-slate-300">
                Nenhum agendamento encontrado.
              </div>
            )}

            {agendamentos.map((agendamento) => {
              const badgeStatus =
                agendamento.status === "AGENDADO"
                  ? "bg-emerald-900 text-emerald-200"
                  : agendamento.status === "CANCELADO"
                  ? "bg-red-900 text-red-200"
                  : "bg-blue-900 text-blue-200";

              return (
                <div
                  key={agendamento.id}
                  className="rounded-2xl border border-slate-800 bg-slate-800/70 p-5 md:p-6"
                >
                  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="w-fit rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-200">
                      ID {agendamento.id}
                    </span>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${badgeStatus}`}
                    >
                      {agendamento.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-slate-300">
                    <p>
                      <span className="font-semibold text-white">Data:</span>{" "}
                      {agendamento.data}
                    </p>
                    <p>
                      <span className="font-semibold text-white">Hora:</span>{" "}
                      {agendamento.hora}
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
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sistema;