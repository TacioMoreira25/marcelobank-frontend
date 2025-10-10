import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { transacaoService } from "../services/transacaoService";
import { clienteService } from "../services/clienteService";
import { emprestimoService } from "../services/emprestimoService";
import { cartaoService } from "../services/cartaoService";
import { contaService } from "../services/contaService";
import type { ClienteCompleto, Transacao, Emprestimo, Cartao } from "../types";
import Header from "../components/Header";
import Nav from "../components/Nav";
import TransferForm from "../components/TransferForm";
import DepositForm from "../components/DepositForm";
import SaqueForm from "../components/SaqueForm";
import ExtractList from "../components/ExtractList";
import LoanSection from "../components/LoanSection";
import CardsSection from "../components/CardsSection";

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

  // Estado principal
  const [cliente, setCliente] = useState<ClienteCompleto | null>(null);
  const [numeroConta, setNumeroConta] = useState<number | null>(null);
  const [saldo, setSaldo] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [active, setActive] = useState<Section>("overview");

  // Listas
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [cartoes, setCartoes] = useState<Cartao[]>([]);

  // Forms
  const [transfer, setTransfer] = useState({
    contaDestino: "",
    valor: "",
    pin: "",
  });
  const [deposit, setDeposit] = useState({ valor: "" });
  const [saque, setSaque] = useState({ valor: "", pin: "" });
  const [loan, setLoan] = useState({ valor: "", prazo: "12" });


  const toArray = <T,>(
    input: unknown,
    keys: string[] = ["content", "items", "data", "transacoes"]
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
      const direto = obj["saldo"];
      if (typeof direto === "number") return direto;
      const conta = obj["conta"];
      if (conta && typeof conta === "object") {
        const s = (conta as Record<string, unknown>)["saldo"];
        if (typeof s === "number") return s;
      }
    }
    return undefined;
  };

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
      // Saldo: prioriza resposta dedicada
      const saldoApi = pickSaldo(saldoResp?.data);
      const saldoLocal = dados?.contas?.[0]?.saldo ?? 0;
      setSaldo(typeof saldoApi === "number" ? saldoApi : saldoLocal);

      // Extrato: normaliza para array tipado
      const txList = toArray<Transacao>(transResp?.data);
      setTransacoes(txList);

      // Empréstimos e Cartões (normaliza wrappers)
      const empList = toArray<Emprestimo>(empResp?.data);
      setEmprestimos(empList);

      const cartList = toArray<Cartao>(cartResp?.data);
      setCartoes(cartList);
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

  // Ações
  const doLogout = () => {
    localStorage.removeItem("clienteCpf");
    localStorage.removeItem("numeroConta");
    localStorage.removeItem("clienteData");
    localStorage.removeItem("loginData");
    navigate("/");
  };

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
      alert("Transferência realizada");
      setTransfer({ contaDestino: "", valor: "", pin: "" });
      // Recarrega conjuntos
      const cpf = localStorage.getItem("clienteCpf") || "";
      fetchAll(cpf, numeroConta);
      setActive("overview");
    } catch {
      alert("Erro na transferência");
    }
  };

  const doDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!numeroConta) return;
    if (!deposit.valor) {
      alert("Informe o valor");
      return;
    }
    try {
      await transacaoService.depositar(numeroConta, parseFloat(deposit.valor));
      alert("Depósito realizado");
      setDeposit({ valor: "" });
      const cpf = localStorage.getItem("clienteCpf") || "";
      fetchAll(cpf, numeroConta);
      setActive("overview");
    } catch {
      alert("Erro no depósito");
    }
  };

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
      alert("Saque realizado");
      setSaque({ valor: "", pin: "" });
      const cpf = localStorage.getItem("clienteCpf") || "";
      fetchAll(cpf, numeroConta);
      setActive("overview");
    } catch {
      alert("Erro no saque");
    }
  };

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
      alert("Solicitação enviada");
      if (numeroConta) fetchAll(cpf, numeroConta);
      setActive("loan");
      setLoan({ valor: "", prazo: "12" });
    } catch {
      alert("Erro ao solicitar empréstimo");
    }
  };

  const doEmitirCartao = async () => {
    const cpf = localStorage.getItem("clienteCpf") || "";
    if (!cpf || !numeroConta) return;
    try {
      const numeroCartao = Math.floor(100000 + Math.random() * 900000); // simples
      await cartaoService.emitir(numeroCartao, numeroConta, "DEBITO", 1000);
      alert("Cartão emitido");
      fetchAll(cpf, numeroConta);
    } catch {
      alert("Erro ao emitir cartão");
    }
  };

  const doBloquear = async (numeroCartao: number) => {
    const cpf = localStorage.getItem("clienteCpf") || "";
    if (!cpf) return;
    try {
      await cartaoService.bloquear(numeroCartao);
      if (numeroConta) fetchAll(cpf, numeroConta);
    } catch {
      alert("Erro ao bloquear cartão");
    }
  };

  const doDesbloquear = async (numeroCartao: number) => {
    const cpf = localStorage.getItem("clienteCpf") || "";
    if (!cpf) return;
    try {
      await cartaoService.desbloquear(numeroCartao);
      if (numeroConta) fetchAll(cpf, numeroConta);
    } catch {
      alert("Erro ao desbloquear cartão");
    }
  };

  // UI simples
  if (loading) return <div className="p-6">Carregando...</div>;
  if (error || !cliente)
    return (
      <div className="p-6">
        <p className="text-red-600 mb-4">
          {error || "Falha ao carregar dados."}
        </p>
        <button
          className="px-3 py-2 bg-gray-200 rounded"
          onClick={() => navigate("/")}
        >
          Voltar
        </button>
      </div>
    );

  return (
    <div className="p-4 space-y-4">
      <Header
        cliente={cliente}
        saldo={saldo}
        numeroConta={numeroConta ?? undefined}
        onLogout={doLogout}
      />

      <Nav active={active} onChange={setActive} />

      {active === "overview" && (
        <div className="border p-3 rounded">
          <div>Transações: {transacoes.length}</div>
          <div>Empréstimos: {emprestimos.length}</div>
          <div>Cartões: {cartoes.length}</div>
        </div>
      )}

      {active === "transfer" && (
        <TransferForm
          values={transfer}
          onChange={(vals) => setTransfer({ ...transfer, ...vals })}
          onSubmit={doTransfer}
        />
      )}

      {active === "deposit" && (
        <DepositForm
          value={deposit.valor}
          onChange={(v) => setDeposit({ valor: v })}
          onSubmit={doDeposit}
        />
      )}

      {active === "saque" && (
        <SaqueForm
          values={saque}
          onChange={(vals) => setSaque({ ...saque, ...vals })}
          onSubmit={doSaque}
        />
      )}

      {active === "extract" && <ExtractList items={transacoes} />}

      {active === "loan" && (
        <LoanSection
          values={loan}
          onChange={(vals) => setLoan({ ...loan, ...vals })}
          onSubmit={doSolicitarEmprestimo}
          items={emprestimos}
        />
      )}

      {active === "cards" && (
        <CardsSection
          items={cartoes}
          onEmitir={doEmitirCartao}
          onBloquear={doBloquear}
          onDesbloquear={doDesbloquear}
        />
      )}
    </div>
  );
}

export default Conta;
