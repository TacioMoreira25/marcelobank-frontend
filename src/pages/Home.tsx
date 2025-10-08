//import { formatCurrency } from "../utils/formatters";

function Home() {
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
          Bem-vindo ao <b className="text-pink-500">Marcelo Bank</b>
        </h2>
        <p className="text-white mb-6 drop-shadow-[0_10px_10px_rgba(0,0,0,0.85)]">
          Mais que um Banco, um parceiro para seus negócios.
        </p>
          </div>
          <div className="bg-white bg-opacity-90 rounded-lg shadow-md p-4 max-w-sm">
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
            maxLength={11}
            pattern="\d*"
            inputMode="numeric"
            className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onInput={e => {
          const input = e.target as HTMLInputElement;
          input.value = input.value.replace(/\D/g, '').slice(0, 11);
            }}
          />
        </div>
        <button
          className="w-full px-4 py-2 border border-pink-500 text-pink-500 rounded font-bold hover:bg-pink-500 hover:text-white transition-colors"
        >
          <b>
            Continuar
          </b>
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
