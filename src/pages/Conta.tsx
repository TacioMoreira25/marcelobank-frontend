import { useState, useEffect } from "react";
import {
  formatCPF,
  formatPhone,
  formatAccountNumber,
  formatCurrency,
} from "../utils/formatters";
import type {
  Cliente,
  Conta as ContaType,
  Transacao,
  Emprestimo,
} from "../types";

interface ClienteCompleto {
  cliente?: Cliente;
  contas?: ContaType[];
  nome?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  dataNascimento?: string;
  endereco?: string;
}

type ActiveSection =
  | "overview"
  | "transfer"
  | "deposit"
  | "extract"
  | "loan"
  | "cards";

function Conta() {
  const [clienteData, setClienteData] = useState<ClienteCompleto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState<ActiveSection>("overview");

  // Estados para confirmação PIN
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinValue, setPinValue] = useState("");
  const [pendingOperation, setPendingOperation] = useState<() => void>(
    () => {}
  );

  // Estados para transferência
  const [transferData, setTransferData] = useState({
    contaDestino: "",
    valor: "",
    descricao: "",
  });

  // Estados para depósito
  const [depositValue, setDepositValue] = useState("");

  // Estados para empréstimo
  const [loanData, setLoanData] = useState({
    valor: "",
    prazoMeses: "12",
  });

  // Estados para extrato
  const [transactions] = useState<Transacao[]>([]);
  const [loans] = useState<Emprestimo[]>([]);

  useEffect(() => {
    const cpf = localStorage.getItem("clienteCpf");
    const storedClienteData = localStorage.getItem("clienteData");

    if (!cpf || !storedClienteData) {
      setError("Nenhum cliente autenticado. Faça login novamente.");
      setLoading(false);
      return;
    }

    try {
      const data = JSON.parse(storedClienteData);
      setClienteData(data);
      loadTransactions();
      loadLoans();
    } catch {
      setError("Erro ao carregar dados do cliente.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTransactions = async () => {
    try {
      // Aqui você implementaria a busca de transações
      // const response = await transacaoService.buscarPorConta(numeroConta);
      // setTransactions(response.data);
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
    }
  };

  const loadLoans = async () => {
    try {
      // Aqui você implementaria a busca de empréstimos
      // const response = await emprestimoService.buscarPorCliente(cpf);
      // setLoans(response.data);
    } catch (error) {
      console.error("Erro ao carregar empréstimos:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("clienteCpf");
    localStorage.removeItem("clienteData");
    window.location.href = "/";
  };

  const confirmPin = (operation: () => void) => {
    setPendingOperation(() => operation);
    setShowPinModal(true);
  };

  const validatePin = () => {
    const contas: ContaType[] = clienteData?.contas || [];

    if (contas.length > 0) {
      const pinConta = contas[0].pin.toString();
      if (pinValue === pinConta) {
        setShowPinModal(false);
        setPinValue("");
        pendingOperation();
      } else {
        alert("PIN incorreto!");
        setPinValue("");
      }
    }
  };
  const executeTransfer = () => {
    try {
      console.log("Transferência:", transferData);
      alert("Transferência realizada com sucesso!");
      setTransferData({ contaDestino: "", valor: "", descricao: "" });
      setActiveSection("overview");
    } catch (error) {
      console.error("Erro na transferência:", error);
      alert("Erro ao realizar transferência.");
    }
  };

  const executeDeposit = () => {
    try {
      console.log("Depósito:", depositValue);
      alert("Depósito realizado com sucesso!");
      setDepositValue("");
      setActiveSection("overview");
    } catch (error) {
      console.error("Erro no depósito:", error);
      alert("Erro ao realizar depósito.");
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    confirmPin(executeTransfer);
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    confirmPin(executeDeposit);
  };

  const handleLoanRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Implementar lógica de solicitação de empréstimo
      console.log("Empréstimo solicitado:", loanData);
      alert("Solicitação de empréstimo enviada para análise!");
      setLoanData({ valor: "", prazoMeses: "12" });
      setActiveSection("overview");
    } catch (error) {
      console.error("Erro na solicitação de empréstimo:", error);
      alert("Erro ao solicitar empréstimo.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (error || !clienteData) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="text-xl text-red-600">
          {error || "Dados do cliente não encontrados"}
        </div>
        <button
          onClick={() => (window.location.href = "/")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Voltar ao Login
        </button>
      </div>
    );
  }

  const cliente: Cliente = (clienteData.cliente || clienteData) as Cliente;
  const contas: ContaType[] = clienteData.contas || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Bem-vindo, {cliente.nome}
              </h1>
              <p className="text-gray-600">CPF: {formatCPF(cliente.cpf)}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex flex-wrap">
            {[
              { key: "overview", label: "Visão Geral", color: "blue" },
              { key: "transfer", label: "Transferir", color: "green" },
              { key: "deposit", label: "Depositar", color: "purple" },
              { key: "extract", label: "Extrato", color: "yellow" },
              { key: "loan", label: "Empréstimos", color: "orange" },
              { key: "cards", label: "Cartões", color: "indigo" },
            ].map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => setActiveSection(key as ActiveSection)}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                  activeSection === key
                    ? `bg-${color}-500 text-white`
                    : `text-${color}-500 hover:bg-${color}-50`
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeSection === "overview" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Visão Geral
              </h2>

              {/* Informações do Cliente */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Informações Pessoais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Nome
                    </label>
                    <p className="text-gray-800">{cliente.nome}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="text-gray-800">{cliente.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Telefone
                    </label>
                    <p className="text-gray-800">
                      {formatPhone(cliente.telefone)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Suas Contas
                </h3>
                {contas.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Nenhuma conta encontrada.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contas.map((conta: ContaType, index: number) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              Conta{" "}
                              {conta.tipoConta.charAt(0) +
                                conta.tipoConta.slice(1).toLowerCase()}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Número: {formatAccountNumber(conta.numeroConta)}
                            </p>
                            <p className="text-sm text-gray-600">
                              Agência: 0001
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">
                              {formatCurrency(conta.saldo)}
                            </p>
                            <p className="text-xs text-gray-500">Saldo atual</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === "transfer" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Transferir Dinheiro
              </h2>
              <form onSubmit={handleTransfer} className="max-w-md space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conta de Destino
                  </label>
                  <input
                    type="text"
                    value={transferData.contaDestino}
                    onChange={(e) =>
                      setTransferData({
                        ...transferData,
                        contaDestino: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Número da conta de destino"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={transferData.valor}
                    onChange={(e) =>
                      setTransferData({
                        ...transferData,
                        valor: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0,00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição (opcional)
                  </label>
                  <input
                    type="text"
                    value={transferData.descricao}
                    onChange={(e) =>
                      setTransferData({
                        ...transferData,
                        descricao: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descrição da transferência"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                >
                  Transferir
                </button>
              </form>
            </div>
          )}

          {activeSection === "deposit" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Depositar
              </h2>
              <form onSubmit={handleDeposit} className="max-w-md space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor do Depósito
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={depositValue}
                    onChange={(e) => setDepositValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0,00"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600"
                >
                  Depositar
                </button>
              </form>
            </div>
          )}

          {activeSection === "extract" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Extrato
              </h2>
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Nenhuma transação encontrada.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            {transaction.tipoTransacao}
                          </p>
                          <p className="text-sm text-gray-600">
                            {transaction.descricao}
                          </p>
                          <p className="text-xs text-gray-500">
                            {transaction.dataTransacao} -{" "}
                            {transaction.horaTransacao}
                          </p>
                        </div>
                        <div
                          className={`font-bold ${
                            transaction.valor > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {formatCurrency(Math.abs(transaction.valor))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === "loan" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Empréstimos
              </h2>

              {/* Solicitar novo empréstimo */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Solicitar Empréstimo
                </h3>
                <form
                  onSubmit={handleLoanRequest}
                  className="max-w-md space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor Solicitado
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={loanData.valor}
                      onChange={(e) =>
                        setLoanData({ ...loanData, valor: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0,00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prazo (meses)
                    </label>
                    <select
                      value={loanData.prazoMeses}
                      onChange={(e) =>
                        setLoanData({ ...loanData, prazoMeses: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="12">12 meses</option>
                      <option value="24">24 meses</option>
                      <option value="36">36 meses</option>
                      <option value="48">48 meses</option>
                      <option value="60">60 meses</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600"
                  >
                    Solicitar Empréstimo
                  </button>
                </form>
              </div>

              {/* Empréstimos existentes */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Empréstimos Ativos
                </h3>
                {loans.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">
                      Nenhum empréstimo encontrado.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {loans.map((loan, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600">
                              Valor
                            </label>
                            <p className="text-gray-800">
                              {formatCurrency(
                                loan.valorAprovado || loan.valorSolicitado
                              )}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600">
                              Prazo
                            </label>
                            <p className="text-gray-800">
                              {loan.prazoMeses} meses
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600">
                              Status
                            </label>
                            <p className="text-gray-800">{loan.status}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600">
                              Saldo Devedor
                            </label>
                            <p className="text-gray-800">
                              {formatCurrency(loan.saldoDevedor || 0)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === "cards" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Cartões
              </h2>
              <div className="text-center py-8">
                <p className="text-gray-600">
                  Funcionalidade de cartões em desenvolvimento.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal de Confirmação PIN */}
        {showPinModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Confirme seu PIN
              </h3>
              <p className="text-gray-600 mb-4">
                Digite seu PIN de 4 dígitos para confirmar a operação
              </p>
              <input
                type="password"
                value={pinValue}
                onChange={(e) =>
                  setPinValue(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                maxLength={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                placeholder="••••"
                autoFocus
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowPinModal(false);
                    setPinValue("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={validatePin}
                  disabled={pinValue.length !== 4}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Conta;
