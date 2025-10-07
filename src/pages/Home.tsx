import { formatCurrency } from "../utils/formatters";

function Home() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Bem-vindo ao MarceloBank
        </h2>
        <p className="text-gray-600 mb-6">
          Sistema de gerenciamento bancário completo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Clientes Ativos
          </h3>
          <p className="text-3xl font-bold text-blue-600">--</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Contas Abertas
          </h3>
          <p className="text-3xl font-bold text-green-600">--</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Total em Contas
          </h3>
          <p className="text-3xl font-bold text-yellow-600">
            {formatCurrency(0)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Transações Hoje
          </h3>
          <p className="text-3xl font-bold text-purple-600">--</p>
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
