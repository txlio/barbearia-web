import { useEffect, useState } from "react";
import api from "../api/axios";

function Cliente({ usuario, onLogout }) {
  const [servicos, setServicos] = useState([]);
  const [servicoSelecionado, setServicoSelecionado] = useState("");
  const [data, setData] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [horarios, setHorarios] = useState([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const buscarServicos = async () => {
    try {
      const response = await api.get("/servicos");
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

      const response = await api.get(
        `/agendamentos/horarios-disponiveis?data=${dataSelecionada}`
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

  useEffect(() => {
    buscarServicos();
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
        cliente: { id: usuario.id },
        servico: { id: Number(servicoSelecionado) },
        data,
        hora: horarioSelecionado,
      };

      await api.post("/agendamentos", body);

      setMensagem(
        `Agendamento realizado com sucesso para ${data} às ${horarioSelecionado}.`
      );
      setHorarioSelecionado("");
      buscarHorarios(data);
    } catch (error) {
      console.error("Erro ao agendar:", error);
      setErro(error.response?.data || "Erro ao realizar agendamento.");
    }
  };

  return (
    <div className="min-h-dvh bg-slate-950 px-4 py-6 text-white sm:px-6 sm:py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl sm:p-6 md:p-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-amber-500">
              Cliente
            </p>
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
              Barbearia Eduardo Silva
            </h1>
            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              Bem-vindo, {usuario?.nome}
            </p>
          </div>

          <button
            onClick={onLogout}
            className="w-full rounded-xl bg-slate-700 px-4 py-3 font-semibold text-white transition hover:bg-slate-600 sm:w-auto"
          >
            Sair
          </button>
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Escolha a data
          </label>
          <input
            type="date"
            value={data}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => {
              setData(e.target.value);
              setErro("");
              setMensagem("");
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
              setErro("");
              setMensagem("");
            }}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 pr-12 text-white outline-none transition focus:border-amber-500"
          >
            <option value="">Selecione um serviço</option>
            {servicos.map((servico) => (
              <option key={servico.id} value={servico.id}>
                {servico.nome}
              </option>
            ))}
          </select>
        </div>

        {carregando && (
          <div className="mb-4 rounded-xl bg-slate-800 px-4 py-3 text-slate-300">
            Carregando horários...
          </div>
        )}

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

        <h2 className="mb-4 text-lg font-semibold sm:text-xl">
          Horários disponíveis
        </h2>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {horarios.length > 0 ? (
            horarios.map((hora, index) => (
              <button
                key={index}
                onClick={() => setHorarioSelecionado(hora)}
                className={`rounded-xl px-4 py-4 text-base font-semibold transition ${
                  horarioSelecionado === hora
                    ? "border-2 border-amber-400 bg-amber-500 text-slate-950"
                    : "bg-slate-800 text-white hover:bg-slate-700"
                }`}
              >
                {hora}
              </button>
            ))
          ) : (
            <div className="col-span-full rounded-xl bg-slate-800 px-4 py-4 text-slate-300">
              Nenhum horário disponível para a data selecionada.
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
    </div>
  );
}

export default Cliente;