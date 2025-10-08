import { formatCurrency } from "../utils/formatters";

function Home() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Bem-vindo ao <b>MarceloBank</b>
        </h2>
        <p className="text-gray-600 mb-6">
          Sistema de gerenciamento bancário completo.
        </p>
      </div>
      
      <div className="flex justify-end">
        <div className="bg-white rounded-lg shadow-md p-4 max-w-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Peça seu Cartão de Crédito e sua conta do Marcelo Bank!
          </h3>
          <div className="mb-4">
        <label htmlFor="cpf" className="block text-gray-700 mb-2"></label>
        <input
          type="text"
          id="cpf"
          name="cpf"
          placeholder="Digite seu CPF"
          className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
          </div>
          <button>
            <b>
              Continuar
            </b>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
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
