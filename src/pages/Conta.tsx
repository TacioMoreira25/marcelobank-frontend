import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { transacaoService } from "../services/transacaoService";
import { clienteService } from "../services/clienteService";
import { emprestimoService } from "../services/emprestimoService";
import { cartaoService } from "../services/cartaoService";
import { contaService } from "../services/contaService";
import type { ClienteCompleto, Transacao, Emprestimo, Cartao } from "../types";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";
import ContentArea from "../components/ContentArea";
import OverviewContent from "../components/OverviewContent";
import CardsContent from "../components/CardsContent";
import ModalEmitirCartao from "../components/ModalEmitirCartao";
import TransferForm from "../components/TransferForm";
import DepositForm from "../components/DepositForm";
import SaqueForm from "../components/SaqueForm";
import ExtractList from "../components/ExtractList";
import LoanSection from "../components/LoanSection";

type Section =
  | "overview"
  | "transfer"
  | "deposit"
  | "saque"
  | "extract"
  | "loan"
  | "cards";

function Conta() {
  const navigate = useNavigate();

  // ===== ESTADOS PRINCIPAIS =====
  const [cliente, setCliente] = useState<ClienteCompleto | null>(null);
  const [numeroConta, setNumeroConta] = useState<number | null>(null);
  const [saldo, setSaldo] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [active, setActive] = useState<Section>("overview");

  // ===== LISTAS DE DADOS =====
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [cartoes, setCartoes] = useState<Cartao[]>([]);

  // ===== FORMULÁRIOS =====
  const [transfer, setTransfer] = useState({
    contaDestino: "",
    valor: "",
    pin: "",
  });
  const [deposit, setDeposit] = useState({ valor: "" });
  const [saque, setSaque] = useState({ valor: "", pin: "" });
  const [loan, setLoan] = useState({ valor: "", prazo: "12" });

  // ===== MODAL CARTÃO =====
  const [showModalCartao, setShowModalCartao] = useState(false);
  const [tipoCartaoSelecionado, setTipoCartaoSelecionado] = useState("DEBITO");

  // ===== FUNÇÕES AUXILIARES =====
  const toArray = <T,>(
    input: unknown,
    keys: string[] = [
      "content",
      "items",
      "data",
      "transacoes",
      "cartoes",
      "emprestimos",
      "records",
      "result",
    ]
  ): T[] => {
    if (Array.isArray(input)) return input as T[];
    if (input && typeof input === "object") {
      const obj = input as Record<string, unknown>;
      for (const k of keys) {
        const v = obj[k];
        if (Array.isArray(v)) return v as T[];
      }
    }
    return [] as T[];
  };

  const pickSaldo = (input: unknown): number | undefined => {
    if (typeof input === "number") return input;
    if (input && typeof input === "object") {
      const obj = input as Record<string, unknown>;
      if (typeof obj["saldo"] === "number") return obj["saldo"];
      if (obj["conta"] && typeof obj["conta"] === "object") {
        const s = (obj["conta"] as Record<string, unknown>)["saldo"];
        if (typeof s === "number") return s;
      }
    }
    return undefined;
  };

  // ===== CARREGAMENTO DE DADOS =====
  const fetchAll = useCallback(async (cpf: string, conta: number) => {
    setLoading(true);
    try {
      const [clienteResp, transResp, empResp, cartResp, saldoResp] =
        await Promise.all([
          clienteService.buscarInfoCompleta(cpf),
          transacaoService.buscarPorConta(conta),
          emprestimoService.buscarPorCliente(cpf),
          cartaoService.buscarPorCliente(cpf),
          contaService.consultarSaldo(conta),
        ]);

      const dados = (clienteResp.data || {}) as ClienteCompleto;
      setCliente(dados);

      const saldoApi = pickSaldo(saldoResp?.data);
      const saldoLocal = dados?.contas?.[0]?.saldo ?? 0;
      setSaldo(typeof saldoApi === "number" ? saldoApi : saldoLocal);

      setTransacoes(toArray<Transacao>(transResp?.data));
      setEmprestimos(toArray<Emprestimo>(empResp?.data));
      setCartoes(toArray<Cartao>(cartResp?.data));

      setError("");
    } catch {
      setError("Erro ao carregar dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cpf = localStorage.getItem("clienteCpf") || "";
    const contaStr = localStorage.getItem("numeroConta") || "";
    const conta = parseInt(contaStr);

    if (!cpf || !conta) {
      setError("Sessão expirada. Faça login novamente.");
      setLoading(false);
      setTimeout(() => navigate("/"), 1500);
      return;
    }

    setNumeroConta(conta);
    fetchAll(cpf, conta);
  }, [navigate, fetchAll]);

  // ===== AÇÕES =====
  const doLogout = () => {
    localStorage.removeItem("clienteCpf");
    localStorage.removeItem("numeroConta");
    localStorage.removeItem("clienteData");
    localStorage.removeItem("loginData");
    navigate("/");
  };

  // Transferência
  const doTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!numeroConta) return;
    if (!transfer.contaDestino || !transfer.valor || !transfer.pin) {
      alert("Preencha todos os campos");
      return;
    }
    try {
      await transacaoService.transferir(
        numeroConta,
        parseInt(transfer.contaDestino),
        parseFloat(transfer.valor),
        transfer.pin
      );
      alert("Transferência realizada com sucesso!");
      setTransfer({ contaDestino: "", valor: "", pin: "" });
      const cpf = localStorage.getItem("clienteCpf") || "";
      await fetchAll(cpf, numeroConta);
      setActive("overview");
    } catch {
      alert("Erro ao realizar transferência");
    }
  };

  // Depósito
  const doDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!numeroConta) return;
    if (!deposit.valor) {
      alert("Informe o valor");
      return;
    }
    try {
      await transacaoService.depositar(numeroConta, parseFloat(deposit.valor));
      alert("Depósito realizado com sucesso!");
      setDeposit({ valor: "" });
      const cpf = localStorage.getItem("clienteCpf") || "";
      await fetchAll(cpf, numeroConta);
      setActive("overview");
    } catch {
      alert("Erro ao realizar depósito");
    }
  };

  // Saque
  const doSaque = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!numeroConta) return;
    if (!saque.valor || !saque.pin) {
      alert("Preencha todos os campos");
      return;
    }
    try {
      await transacaoService.sacar(
        numeroConta,
        parseFloat(saque.valor),
        saque.pin
      );
      alert("Saque realizado com sucesso!");
      setSaque({ valor: "", pin: "" });
      const cpf = localStorage.getItem("clienteCpf") || "";
      await fetchAll(cpf, numeroConta);
      setActive("overview");
    } catch {
      alert("Erro ao realizar saque");
    }
  };

  // Empréstimo
  const doSolicitarEmprestimo = async (e: React.FormEvent) => {
    e.preventDefault();
    const cpf = localStorage.getItem("clienteCpf") || "";
    if (!cpf) return;
    if (!loan.valor || !loan.prazo) {
      alert("Informe valor e prazo");
      return;
    }
    try {
      await emprestimoService.solicitar(
        cpf,
        parseFloat(loan.valor),
        parseInt(loan.prazo)
      );
      alert("Solicitação de empréstimo enviada!");
      if (numeroConta) await fetchAll(cpf, numeroConta);
      setLoan({ valor: "", prazo: "12" });
    } catch {
      alert("Erro ao solicitar empréstimo");
    }
  };

  // Cartão - Emitir
  const doEmitirCartao = async () => {
    const cpf = localStorage.getItem("clienteCpf") || "";
    if (!cpf || !numeroConta) {
      alert("Dados não encontrados");
      return;
    }
    try {
      const numeroCartao = Math.floor(100000000 + Math.random() * 900000000);
      await cartaoService.emitir(
        numeroCartao,
        numeroConta,
        tipoCartaoSelecionado,
        tipoCartaoSelecionado === "CREDITO" ? 5000 : 0
      );
      alert("Cartão emitido com sucesso!");
      setShowModalCartao(false);
      setTipoCartaoSelecionado("DEBITO");
      await fetchAll(cpf, numeroConta);
    } catch {
      alert("Erro ao emitir cartão");
    }
  };

  // Cartão - Bloquear
  const doBloquear = async (numeroCartao: number) => {
    const cpf = localStorage.getItem("clienteCpf") || "";
    if (!cpf || !numeroConta) return;
    try {
      await cartaoService.bloquear(numeroCartao);
      alert("Cartão bloqueado!");
      await fetchAll(cpf, numeroConta);
    } catch {
      alert("Erro ao bloquear cartão");
    }
  };

  // Cartão - Desbloquear
  const doDesbloquear = async (numeroCartao: number) => {
    const cpf = localStorage.getItem("clienteCpf") || "";
    if (!cpf || !numeroConta) return;
    try {
      await cartaoService.desbloquear(numeroCartao);
      alert("Cartão desbloqueado!");
      await fetchAll(cpf, numeroConta);
    } catch {
      alert("Erro ao desbloquear cartão");
    }
  };

  // ===== LOADING =====
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // ===== ERROR =====
  if (error || !cliente) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4 text-lg">
            {error || "Falha ao carregar dados."}
          </p>
          <button
            className="px-6 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
            onClick={() => navigate("/")}
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    );
  }

  // ===== RENDER PRINCIPAL =====
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* TOP BAR */}
      <TopBar
        cliente={cliente}
        numeroConta={numeroConta ?? undefined}
        saldo={saldo}
        onLogout={doLogout}
        onEdit={() => {
          alert("Funcionalidade de editar perfil será implementada");
        }}
      />

      {/* MAIN CONTENT COM SIDEBAR E CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <Sidebar
          active={active}
          onChangeSection={setActive}
          onLogout={doLogout}
        />

        {/* CONTENT AREA */}
        <ContentArea>
          {/* OVERVIEW */}
          {active === "overview" && (
            <OverviewContent
              transacoes={transacoes}
              emprestimos={emprestimos}
              cartoes={cartoes}
              saldo={saldo}
            />
          )}

          {/* TRANSFER */}
          {active === "transfer" && (
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Transferir Dinheiro
              </h1>
              <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
                <TransferForm
                  values={transfer}
                  onChange={(vals) => setTransfer({ ...transfer, ...vals })}
                  onSubmit={doTransfer}
                />
              </div>
            </div>
          )}

          {/* DEPOSIT */}
          {active === "deposit" && (
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Depositar
              </h1>
              <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
                <DepositForm
                  value={deposit.valor}
                  onChange={(v) => setDeposit({ valor: v })}
                  onSubmit={doDeposit}
                />
              </div>
            </div>
          )}

          {/* SAQUE */}
          {active === "saque" && (
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Sacar</h1>
              <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
                <SaqueForm
                  values={saque}
                  onChange={(vals) => setSaque({ ...saque, ...vals })}
                  onSubmit={doSaque}
                />
              </div>
            </div>
          )}

          {/* EXTRACT */}
          {active === "extract" && (
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Extrato</h1>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <ExtractList
                  items={transacoes}
                  currentAccount={numeroConta ?? undefined}
                />
              </div>
            </div>
          )}

          {/* LOAN */}
          {active === "loan" && (
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Empréstimos
              </h1>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <LoanSection
                  values={loan}
                  onChange={(vals) => setLoan({ ...loan, ...vals })}
                  onSubmit={doSolicitarEmprestimo}
                  items={emprestimos}
                />
              </div>
            </div>
          )}

          {/* CARDS */}
          {active === "cards" && (
            <div>
              <ModalEmitirCartao
                isOpen={showModalCartao}
                tipoSelecionado={tipoCartaoSelecionado}
                onTipoChange={setTipoCartaoSelecionado}
                onConfirm={doEmitirCartao}
                onCancel={() => setShowModalCartao(false)}
              />

              <CardsContent
                cartoes={cartoes}
                onEmitir={() => setShowModalCartao(true)}
                onBloquear={doBloquear}
                onDesbloquear={doDesbloquear}
              />
            </div>
          )}
        </ContentArea>
      </div>
    </div>
  );
}

export default Conta;
