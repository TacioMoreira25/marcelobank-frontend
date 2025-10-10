import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { transacaoService } from "../services/transacaoService";
import type { ClienteCompleto } from "../types";

function Conta() {
  const navigate = useNavigate();
  const [clienteData, setClienteData] = useState<ClienteCompleto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("overview");

  // Estados para operações
  const [transferData, setTransferData] = useState({
    contaDestino: "",
    valor: "",
    pin: "",
  });
  const [depositData, setDepositData] = useState({ valor: "" });
  const [saqueData, setSaqueData] = useState({ valor: "", pin: "" });

  useEffect(() => {
    const cpf = localStorage.getItem("clienteCpf");
    const storedClienteData = localStorage.getItem("clienteData");

    if (!cpf || !storedClienteData) {
      setError("Nenhum cliente autenticado. Redirecionando...");
      setTimeout(() => navigate("/"), 2000);
      setLoading(false);
      return;
    }

    try {
      const data = JSON.parse(storedClienteData) as ClienteCompleto;
      setClienteData(data);
      setLoading(false);
    } catch {
      setError("Erro ao carregar dados. Redirecionando...");
      setTimeout(() => navigate("/"), 2000);
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("clienteCpf");
    localStorage.removeItem("numeroConta");
    localStorage.removeItem("clienteData");
    localStorage.removeItem("loginData");
    navigate("/");
  };

  // Funções bancárias
  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !transferData.contaDestino ||
      !transferData.valor ||
      !transferData.pin
    ) {
      alert("Preencha todos os campos");
      return;
    }
    if (!clienteData?.contas?.[0]) {
      alert("Conta não encontrada");
      return;
    }

    try {
      await transacaoService.transferir(
        clienteData.contas[0].numeroConta,
        parseInt(transferData.contaDestino),
        parseFloat(transferData.valor),
        transferData.pin
      );
      alert("Transferência realizada com sucesso!");
      setTransferData({ contaDestino: "", valor: "", pin: "" });
      setActiveSection("overview");
      window.location.reload(); // Recarrega dados
    } catch {
      alert("Erro ao realizar transferência");
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositData.valor) {
      alert("Informe o valor do depósito");
      return;
    }
    if (!clienteData?.contas?.[0]) {
      alert("Conta não encontrada");
      return;
    }

    try {
      await transacaoService.depositar(
        clienteData.contas[0].numeroConta,
        parseFloat(depositData.valor)
      );
      alert("Depósito realizado com sucesso!");
      setDepositData({ valor: "" });
      setActiveSection("overview");
      window.location.reload(); // Recarrega dados
    } catch {
      alert("Erro ao realizar depósito");
    }
  };

  const handleSaque = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saqueData.valor || !saqueData.pin) {
      alert("Preencha todos os campos");
      return;
    }
    if (!clienteData?.contas?.[0]) {
      alert("Conta não encontrada");
      return;
    }

    try {
      await transacaoService.sacar(
        clienteData.contas[0].numeroConta,
        parseFloat(saqueData.valor),
        saqueData.pin
      );
      alert("Saque realizado com sucesso!");
      setSaqueData({ valor: "", pin: "" });
      setActiveSection("overview");
      window.location.reload(); // Recarrega dados
    } catch {
      alert("Erro ao realizar saque");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (error || !clienteData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center space-y-4">
        <div className="text-xl text-red-600">
          {error || "Dados do cliente não encontrados"}
        </div>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
        >
          Voltar ao Login
        </button>
      </div>
    );
  }

  const cliente = clienteData;
  const conta = cliente.contas?.[0];
  const saldo = conta?.saldo || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-lg shadow-lg mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Bem-vindo, {cliente.nome || "Cliente"}
              </h1>
              <div className="space-y-1 text-sm">
                <p>CPF: {cliente.cpf || "N/A"}</p>
                <p>Email: {cliente.email || "N/A"}</p>
                <p>Telefone: {cliente.telefone || "N/A"}</p>
                {conta && (
                  <>
                    <p>Conta: {conta.numeroConta}</p>
                    <p>Tipo: {conta.tipoConta}</p>
                  </>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold mb-2">
                R$ {saldo.toFixed(2)}
              </div>
              <p className="text-sm opacity-90">Saldo atual</p>
              <button
                onClick={handleLogout}
                className="mt-4 px-4 py-2 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors text-sm"
              >
                Sair
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          {/* Navegação */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveSection("overview")}
                className={`px-4 py-2 rounded text-sm ${
                  activeSection === "overview"
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                🏠 Visão Geral
              </button>
              <button
                onClick={() => setActiveSection("transfer")}
                className={`px-4 py-2 rounded text-sm ${
                  activeSection === "transfer"
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                💸 Transferência
              </button>
              <button
                onClick={() => setActiveSection("deposit")}
                className={`px-4 py-2 rounded text-sm ${
                  activeSection === "deposit"
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                💰 Depósito
              </button>
              <button
                onClick={() => setActiveSection("saque")}
                className={`px-4 py-2 rounded text-sm ${
                  activeSection === "saque"
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                💳 Saque
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo das seções */}
        {activeSection === "overview" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              🏠 Visão Geral
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Conta</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {conta?.numeroConta || "N/A"}
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Tipo</h4>
                <p className="text-2xl font-bold text-orange-600">
                  {conta?.tipoConta || "N/A"}
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Status</h4>
                <p className="text-2xl font-bold text-green-600">Ativa</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === "transfer" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              💸 Transferência
            </h3>
            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conta de Destino
                </label>
                <input
                  type="number"
                  value={transferData.contaDestino}
                  onChange={(e) =>
                    setTransferData((prev) => ({
                      ...prev,
                      contaDestino: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Número da conta"
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
                    setTransferData((prev) => ({
                      ...prev,
                      valor: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="0,00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={transferData.pin}
                  onChange={(e) =>
                    setTransferData((prev) => ({
                      ...prev,
                      pin: e.target.value.replace(/\D/g, "").slice(0, 4),
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="••••"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition-colors"
              >
                Transferir
              </button>
            </form>
          </div>
        )}

        {activeSection === "deposit" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              💰 Depósito
            </h3>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={depositData.valor}
                  onChange={(e) =>
                    setDepositData((prev) => ({
                      ...prev,
                      valor: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="0,00"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
              >
                Depositar
              </button>
            </form>
          </div>
        )}

        {activeSection === "saque" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              💳 Saque
            </h3>
            <form onSubmit={handleSaque} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={saqueData.valor}
                  onChange={(e) =>
                    setSaqueData((prev) => ({
                      ...prev,
                      valor: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="0,00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={saqueData.pin}
                  onChange={(e) =>
                    setSaqueData((prev) => ({
                      ...prev,
                      pin: e.target.value.replace(/\D/g, "").slice(0, 4),
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="••••"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
              >
                Sacar
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Conta;
