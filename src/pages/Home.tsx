import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { clienteService } from "../services/clienteService";
import { formatCPF } from "../utils/formatters";
import { validateCPF } from "../utils/validations";
import { useNavigate } from "react-router-dom";

function Home() {
  const [cpf, setCpf] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Logout automático quando chega na Home
  useEffect(() => {
    localStorage.removeItem("clienteCpf");
    localStorage.removeItem("numeroConta");
    localStorage.removeItem("clienteData");
    localStorage.removeItem("loginData");
  }, []);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || "";
    const formattedCpf = formatCPF(value.replace(/\D/g, ""));
    setCpf(formattedCpf);
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || "";
    const pinValue = value.replace(/\D/g, "").slice(0, 4);
    setPin(pinValue);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificação de segurança extra
    if (cpf === undefined || cpf === null) {
      setError("Erro interno: CPF não definido");
      return;
    }

    if (!cpf || !pin) {
      setError("Por favor, preencha CPF e PIN");
      return;
    }

    if (!validateCPF(cpf)) {
      setError("CPF deve ter 11 dígitos");
      return;
    }

    if (pin.length !== 4) {
      setError("PIN deve ter 4 dígitos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const cpfLimpo = cpf?.replace(/\D/g, "") || "";

      const loginData = {
        cpf: cpfLimpo,
        pin,
      };

      const response = await authService.login(loginData);

      if (response.data.sucesso && response.data.numeroConta) {
        const clienteDataResponse = await clienteService.buscarInfoCompleta(
          cpfLimpo
        );

        localStorage.setItem("clienteCpf", cpfLimpo);
        localStorage.setItem(
          "numeroConta",
          response.data.numeroConta.toString()
        );
        localStorage.setItem(
          "clienteData",
          JSON.stringify(clienteDataResponse.data)
        );
        localStorage.setItem("loginData", JSON.stringify(response.data));

        navigate("/contas");
      } else {
        setError(response.data.mensagem || "Erro ao fazer login");
      }
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: {
            status?: number;
            data?: { mensagem?: string };
          };
        };
        if (axiosError.response?.status === 401) {
          setError("CPF ou PIN incorreto");
        } else if (axiosError.response?.status === 404) {
          setError("Cliente não encontrado");
        } else {
          setError(
            axiosError.response?.data?.mensagem || "Erro ao acessar conta"
          );
        }
      } else {
        setError("Erro ao acessar conta. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative flex items-center justify-center min-h-[320px] mb-8 -mt-8 w-screen left-1/2 right-1/2 -translate-x-1/2">
        <img
          src="./src/assets/MbankA.jpg"
          alt="Imagem de um banco"
          className="absolute inset-0 w-full h-120 object-cover rounded-none"
        />
        <div className="relative z-10 flex flex-row items-center justify-center w-full h-full gap-8">
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]">
              Bem-vindo ao <b className="text-pink-500">MarceloBank</b>
            </h2>
            <p className="text-white mb-6 drop-shadow-[0_10px_10px_rgba(0,0,0,0.85)]">
              Mais que um Banco, um parceiro para seus negócios.
            </p>
          </div>
          <div className="bg-white bg-opacity-90 rounded-lg shadow-md p-4 max-w-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Acesse sua conta
            </h3>

            {error && (
              <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="cpf" className="block text-gray-700 mb-2 text-sm">
                CPF
              </label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={cpf}
                onChange={handleCpfChange}
                placeholder="000.000.000-00"
                maxLength={14}
                className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="pin" className="block text-gray-700 mb-2 text-sm">
                PIN
              </label>
              <input
                type="password"
                id="pin"
                name="pin"
                value={pin}
                onChange={handlePinChange}
                placeholder="••••"
                maxLength={4}
                className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full px-4 py-2 border border-pink-500 text-pink-500 rounded font-bold hover:bg-pink-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <b>{loading ? "Acessando..." : "Continuar"}</b>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 max-w-5xl mx-auto relative z-20">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Funcionalidades Disponíveis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border rounded-lg hover:bg-gray-50">
            <h4 className="font-semibold text-gray-700">Gestão de Clientes</h4>
            <p className="text-sm text-gray-500 mt-2">
              Cadastro, consulta e atualização de dados dos clientes
            </p>
          </div>
          <div className="text-center p-4 border rounded-lg hover:bg-gray-50">
            <h4 className="font-semibold text-gray-700">
              Gerenciamento de Contas
            </h4>
            <p className="text-sm text-gray-500 mt-2">
              Abertura, consulta e gestão de contas bancárias
            </p>
          </div>
          <div className="text-center p-4 border rounded-lg hover:bg-gray-50">
            <h4 className="font-semibold text-gray-700">
              Controle de Transações
            </h4>
            <p className="text-sm text-gray-500 mt-2">
              Histórico e processamento de todas as transações
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
