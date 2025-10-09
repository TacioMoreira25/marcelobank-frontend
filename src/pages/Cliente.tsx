import React, { useState } from "react";
import { clienteService } from "../services/clienteService";
import { contaService } from "../services/contaService";
import {
  formatCPF,
  formatPhone,
} from "../utils/formatters";
import type { Cliente, Conta, TipoConta } from "../types";

interface FormData {
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  endereco: string;
  tipoConta: TipoConta;
  pin: string;
}

interface Errors {
  [key: string]: string;
}

function ClientePage() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState<FormData>({
    cpf: "",
    nome: "",
    email: "",
    telefone: "",
    dataNascimento: "",
    endereco: "",
    tipoConta: "CORRENTE",
    pin: "",
  });

  const resetForm = () => {
    setFormData({
      cpf: "",
      nome: "",
      email: "",
      telefone: "",
      dataNascimento: "",
      endereco: "",
      tipoConta: "CORRENTE",
      pin: "",
    });
    setErrors({});
    setSuccessMessage("");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "cpf") {
      formattedValue = formatCPF(value.replace(/\D/g, ""));
    } else if (name === "telefone") {
      formattedValue = formatPhone(value.replace(/\D/g, ""));
    } else if (name === "pin") {
      // Apenas números, máximo 4 dígitos
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCriarConta = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const clienteData: Cliente = {
        cpf: formData.cpf.replace(/\D/g, ""),
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone.replace(/\D/g, ""),
        dataNascimento: formData.dataNascimento,
        endereco: formData.endereco,
      };

      const clienteResponse = await clienteService.criar(clienteData);
      const cliente = clienteResponse.data;

      const contaData: Conta = {
        numeroConta: generateAccountNumber(),
        tipoConta: formData.tipoConta,
        pin: parseInt(formData.pin),
        saldo: 0,
        cliente: cliente,
        agencia: {
          codigoAgencia: 1,
        },
      };

      const contaResponse = await contaService.criarConta(contaData);
      const conta = contaResponse.data;

      setSuccessMessage(
        `Conta criada com sucesso! Número da conta: ${conta.numeroConta
          .toString()
          .padStart(8, "0")}`
      );
      resetForm();
    } catch (error: unknown) {
      console.error("Erro ao criar conta:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        if (axiosError.response?.data?.message) {
          setErrors({ general: axiosError.response.data.message });
        } else {
          setErrors({ general: "Erro ao criar conta. Tente novamente." });
        }
      } else {
        setErrors({ general: "Erro ao criar conta. Tente novamente." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-pink-500 text-center mb-6">
          Criar Nova Conta
        </h1>

        {/* Mensagens */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.general}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {/* Formulário Criar Conta */}
        <form onSubmit={handleCriarConta} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Digite seu nome completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CPF *
            </label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleInputChange}
              maxLength={14}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="000.000.000-00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone *
            </label>
            <input
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={handleInputChange}
              maxLength={15}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="(00) 00000-0000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Nascimento *
            </label>
            <input
              type="date"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço *
            </label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Rua, número, bairro, cidade"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Conta *
            </label>
            <select
              name="tipoConta"
              value={formData.tipoConta}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="CORRENTE">Conta Corrente</option>
              <option value="POUPANCA">Poupança</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PIN da Conta *
            </label>
            <input
              type="password"
              name="pin"
              value={formData.pin}
              onChange={handleInputChange}
              maxLength={4}
              pattern="\d{4}"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Digite um PIN de 4 dígitos"
            />
            <p className="text-xs text-gray-500 mt-1">
              PIN de 4 dígitos para acessar sua conta
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 border border-pink-500 text-pink-500 rounded font-bold hover:bg-pink-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Criando conta..." : "Criar Conta"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ClientePage;
