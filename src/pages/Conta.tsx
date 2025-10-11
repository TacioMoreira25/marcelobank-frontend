import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { transacaoService } from "../services/transacaoService";
import { clienteService } from "../services/clienteService";
import { emprestimoService } from "../services/emprestimoService";
import { cartaoService } from "../services/cartaoService";
import { contaService } from "../services/contaService";
import type {
  ClienteCompleto,
  Transacao,
  Emprestimo,
  Cartao,
  Conta,
} from "../types";
import type { ActiveSection as Section } from "../types/conta";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";
import ContentArea from "../components/ContentArea";
import VisaoGeral from "../components/VisaoGeral";
import Cartoes from "../components/Cartoes";
import ModalEmitirCartao from "../components/ModalEmitirCartao";
import TransferenciaForm from "../components/TransferenciaForm";
import DepositoForm from "../components/DepositoForm";
import Saque from "../components/Saque";
import ExtratoLista from "../components/ExtratoLista";
import Emprestimos from "../components/Emprestimos";
import { formatCurrency } from "../utils/formatters";

function Conta() {
  const navigate = useNavigate();

  const [cliente, setCliente] = useState<ClienteCompleto | null>(null);
  const [numeroConta, setNumeroConta] = useState<number | null>(null);
  const [saldo, setSaldo] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [active, setActive] = useState<Section>("overview");

  const [, setSaldoAjuste] = useState(0);

  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [cartoes, setCartoes] = useState<Cartao[]>([]);

  const [transfer, setTransfer] = useState({
    contaDestino: "",
    valor: "",
    pin: "",
  });
  const [deposit, setDeposit] = useState({ valor: "" });
  const [saque, setSaque] = useState({ valor: "", pin: "" });
  const [loan, setLoan] = useState({ valor: "", prazo: "12" });

  const [showModalCartao, setShowModalCartao] = useState(false);
  const [tipoCartaoSelecionado, setTipoCartaoSelecionado] = useState("DEBITO");
  const [limiteCartaoSelecionado, setLimiteCartaoSelecionado] =
    useState("1000");

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

  const ajusteKey = (cpf: string, conta: number) =>
    `mbank_saldo_ajuste_${cpf}_${conta}`;
  const getAjusteFromLS = useCallback((cpf: string, conta: number): number => {
    try {
      const k = ajusteKey(cpf, conta);
      const v = localStorage.getItem(k);
      const n = v != null ? parseFloat(v) : 0;
      return Number.isFinite(n) ? n : 0;
    } catch (err) {
      console.debug("Ignorando falha ao ler ajuste de saldo:", err);
      return 0;
    }
  }, []);
  const setAjusteToLS = useCallback(
    (cpf: string, conta: number, val: number) => {
      try {
        const k = ajusteKey(cpf, conta);
        localStorage.setItem(k, String(val));
      } catch (err) {
        // persistência local é opcional; não bloquear fluxo
        console.debug("Ignorando falha ao salvar ajuste de saldo:", err);
      }
    },
    []
  );

  const fetchAll = useCallback(
    async (
      cpf: string,
      conta: number
    ): Promise<{ saldoBase?: number; saldoFinal?: number } | undefined> => {
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
        const saldoLocal = (() => {
          const contas = (
            Array.isArray(dados?.contas) ? (dados?.contas as Conta[]) : []
          ) as Conta[];
          const match = contas.find((c) => c?.numeroConta === conta);
          return match?.saldo ?? 0;
        })();
        const saldoBase = typeof saldoApi === "number" ? saldoApi : saldoLocal;
        const ajuste = getAjusteFromLS(cpf, conta);
        setSaldoAjuste(ajuste);
        const saldoFinal = saldoBase + ajuste;
        setSaldo(saldoFinal);

        setTransacoes(toArray<Transacao>(transResp?.data));
        setEmprestimos(toArray<Emprestimo>(empResp?.data));
        setCartoes(toArray<Cartao>(cartResp?.data));

        setError("");
        return { saldoBase, saldoFinal };
      } catch {
        setError("Erro ao carregar dados. Tente novamente.");
      } finally {
        setLoading(false);
      }
    },
    [getAjusteFromLS]
  );

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
    const aj = getAjusteFromLS(cpf, conta);
    setSaldoAjuste(aj);
    fetchAll(cpf, conta);
  }, [navigate, fetchAll, getAjusteFromLS]);

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
      alert("Transferência realizada com sucesso!");
      setTransfer({ contaDestino: "", valor: "", pin: "" });
      const cpf = localStorage.getItem("clienteCpf") || "";
      await fetchAll(cpf, numeroConta);
      setActive("overview");
    } catch {
      alert("Erro ao realizar transferência");
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
      alert("Depósito realizado com sucesso!");
      setDeposit({ valor: "" });
      const cpf = localStorage.getItem("clienteCpf") || "";
      await fetchAll(cpf, numeroConta);
      setActive("overview");
    } catch {
      alert("Erro ao realizar depósito");
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
      alert("Saque realizado com sucesso!");
      setSaque({ valor: "", pin: "" });
      const cpf = localStorage.getItem("clienteCpf") || "";
      await fetchAll(cpf, numeroConta);
      setActive("overview");
    } catch {
      alert("Erro ao realizar saque");
    }
  };

  const doSolicitarEmprestimo = async (
    e?: React.FormEvent | React.MouseEvent
  ) => {
    if (e && "preventDefault" in e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    const cpf = localStorage.getItem("clienteCpf") || "";
    if (!cpf) return;
    if (!loan.valor || !loan.prazo) {
      alert("Informe valor e prazo");
      return;
    }
    try {
      const valorSolicitado = parseFloat(loan.valor);
      const prazoMeses = parseInt(loan.prazo);

      const respSolicitacao = await emprestimoService.solicitar(
        cpf,
        valorSolicitado,
        prazoMeses
      );

      const aprovado = Math.round(valorSolicitado * 0.85 * 100) / 100;

      let idEmp: number | undefined = undefined;
      const dataCriacao = respSolicitacao as unknown as {
        data?: Record<string, unknown>;
      };
      if (dataCriacao?.data && typeof dataCriacao.data === "object") {
        const maybeId1 = dataCriacao.data["idEmprestimo"] as unknown;
        const maybeId2 = dataCriacao.data["id"] as unknown;
        if (typeof maybeId1 === "number") idEmp = maybeId1;
        else if (typeof maybeId2 === "number") idEmp = maybeId2;
      }
      if (!idEmp) {
        const lista = await emprestimoService.buscarPorCliente(cpf);
        const raw = lista as unknown as { data?: unknown };
        const arr: Record<string, unknown>[] = Array.isArray(raw.data)
          ? (raw.data as Record<string, unknown>[])
          : [];
        idEmp = arr
          .filter(
            (x) => x && (x.status === "SOLICITADO" || x.status === "EM_ANALISE")
          )
          .filter((x) => Number(x["valorSolicitado"]) === valorSolicitado)
          .sort((a, b) => {
            const bid = Number(b["idEmprestimo"] ?? b["id"] ?? 0);
            const aid = Number(a["idEmprestimo"] ?? a["id"] ?? 0);
            return bid - aid;
          })
          .map(
            (row) =>
              Number(row["idEmprestimo"]) || Number(row["id"]) || undefined
          )[0] as number | undefined;
      }

      if (idEmp) {
        await emprestimoService.aprovar(idEmp, aprovado);
        const cpfLocal = localStorage.getItem("clienteCpf") || "";
        if (cpfLocal && typeof numeroConta === "number") {
          setAjusteToLS(cpfLocal, numeroConta, 0);
          setSaldoAjuste(0);
        }
        setSaldo((s) => s + aprovado);
        setEmprestimos((prev) =>
          prev.map((it) =>
            it.idEmprestimo === idEmp
              ? { ...it, valorAprovado: aprovado, status: "APROVADO" }
              : it
          )
        );
        alert(
          `Solicitação de empréstimo enviada! Valor aprovado: ${formatCurrency(
            aprovado
          )}`
        );
      } else {
        alert(
          `Solicitação de empréstimo enviada! Valor aprovado (estimado): ${formatCurrency(
            aprovado
          )}`
        );
      }

      if (numeroConta) await fetchAll(cpf, numeroConta);
      setLoan({ valor: "", prazo: "12" });
    } catch {
      alert("Erro ao solicitar empréstimo");
    }
  };

  const doPagarParcela = async (
    id: number,
    valor: number,
    pinFromUi?: string
  ) => {
    if (!numeroConta) {
      alert("Conta não encontrada na sessão");
      return;
    }
    const pin =
      pinFromUi ??
      (window.prompt("Digite seu PIN para confirmar o pagamento da parcela:") ||
        "");
    if (!pin || pin.length < 4) {
      alert("PIN inválido");
      return;
    }
    const cpf = localStorage.getItem("clienteCpf") || "";
    let sacou = false;
    try {
      await transacaoService.sacar(numeroConta, valor, pin);
      sacou = true;
      await emprestimoService.pagarParcela(id, valor);
      if (cpf) {
        setAjusteToLS(cpf, numeroConta, 0);
        setSaldoAjuste(0);
      }
      await fetchAll(cpf, numeroConta);
      alert("Parcela paga com sucesso!");
    } catch {
      if (sacou) {
        try {
          await transacaoService.depositar(numeroConta, valor);
        } catch {
          // Se também falhar o estorno, informa mas não interrompe
        }
      }
      alert("Erro ao pagar parcela. Cancelado e estornado se necessário.");
    }
  };

  const doEmitirCartao = async () => {
    const cpf = localStorage.getItem("clienteCpf") || "";
    if (!cpf || !numeroConta) {
      alert("Dados não encontrados");
      return;
    }

    if (tipoCartaoSelecionado === "CREDITO") {
      const limite = parseFloat(limiteCartaoSelecionado);
      if (!limite || limite <= 0) {
        alert("Por favor, informe um limite válido para o cartão de crédito");
        return;
      }
    }

    try {
      const numeroCartao = Math.floor(100000000 + Math.random() * 900000000);
      const limite =
        tipoCartaoSelecionado === "CREDITO"
          ? parseFloat(limiteCartaoSelecionado)
          : 0;

      await cartaoService.emitir(
        numeroCartao,
        numeroConta,
        tipoCartaoSelecionado,
        limite
      );
      alert("Cartão emitido com sucesso!");
      setShowModalCartao(false);
      setTipoCartaoSelecionado("DEBITO");
      setLimiteCartaoSelecionado("1000");
      await fetchAll(cpf, numeroConta);
    } catch {
      alert("Erro ao emitir cartão");
    }
  };

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

  const handleReloadData = async () => {
    const cpf = localStorage.getItem("clienteCpf") || "";
    if (numeroConta) {
      await fetchAll(cpf, numeroConta);
    }
  };

  const handleSwitchAccount = async (novoNumeroConta: number) => {
    try {
      setNumeroConta(novoNumeroConta);
      try {
        localStorage.setItem("numeroConta", String(novoNumeroConta));
      } catch (err) {
        console.debug("Falha ao persistir numeroConta:", err);
      }
      const cpf = localStorage.getItem("clienteCpf") || "";
      if (cpf) {
        await fetchAll(cpf, novoNumeroConta);
        setActive("overview");
      }
    } catch {
      // silencioso
    }
  };

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

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* TOP BAR */}
      <TopBar
        cliente={cliente}
        numeroConta={numeroConta ?? undefined}
        onLogout={doLogout}
        onEdit={handleReloadData}
        onContaCreated={handleReloadData}
        onSwitchAccount={handleSwitchAccount}
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
            <VisaoGeral
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
                <TransferenciaForm
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
                <DepositoForm
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
                <Saque
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
                <ExtratoLista
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
                <Emprestimos
                  values={loan}
                  onChange={(vals) => setLoan({ ...loan, ...vals })}
                  onSubmit={doSolicitarEmprestimo}
                  items={emprestimos}
                  interestRate={4.5}
                  onPay={doPagarParcela}
                />
              </div>
            </div>
          )}

          {/* CARDS */}
          {active === "cards" && (
            <div>
              <Cartoes
                cartoes={cartoes}
                onEmitir={() => setShowModalCartao(true)}
                onBloquear={doBloquear}
                onDesbloquear={doDesbloquear}
              />
            </div>
          )}
        </ContentArea>
      </div>

      {/* MODAL EMITIR CARTÃO - SEMPRE NO TOPO */}
      <ModalEmitirCartao
        isOpen={showModalCartao}
        tipoSelecionado={tipoCartaoSelecionado}
        limiteSelecionado={limiteCartaoSelecionado}
        onTipoChange={setTipoCartaoSelecionado}
        onLimiteChange={setLimiteCartaoSelecionado}
        onConfirm={doEmitirCartao}
        onCancel={() => setShowModalCartao(false)}
      />
    </div>
  );
}

export default Conta;
