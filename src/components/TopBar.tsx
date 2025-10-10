import React, { useState } from "react";
import MBank from "../assets/LogoMB.png";
import type { ClienteCompleto } from "../types";
import { formatCurrency } from "../utils/formatters";

interface Props {
  cliente: ClienteCompleto;
  numeroConta?: number;
  saldo?: number;
  onEdit?: () => void;
  onLogout?: () => void;
}

const TopBar: React.FC<Props> = ({
  cliente,
  numeroConta,
  saldo,
  onEdit,
  onLogout,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const getInitials = (nome?: string) => {
    if (!nome) return "?";
    const parts = nome.split(" ");
    return (parts[0][0] + (parts[1]?.[0] || parts[0][1] || "")).toUpperCase();
  };

  const handleEdit = () => {
    setShowDropdown(false);
    onEdit?.();
  };

  const handleLogout = () => {
    setShowDropdown(false);
    onLogout?.();
  };

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center gap-2">
          <img src={MBank} alt="MarceloBank" className="h-10" />
          <div className="font-bold text-pink-600 text-2xl">MarceloBank</div>
        </div>

        {/* Dropdown de Perfil */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 hover:bg-gray-100 px-4 py-2 rounded-lg transition"
          >
            {/* Avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {getInitials(cliente.nome)}
            </div>

            {/* Nome */}
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-800">
                {cliente.nome}
              </p>
              <p className="text-xs text-gray-600">{cliente.cpf}</p>
            </div>

            {/* Ícone de seta */}
            <svg
              className={`w-4 h-4 text-gray-600 transition ${
                showDropdown ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
              {/* Header do Dropdown */}
              <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4 rounded-t-lg">
                <p className="text-lg font-bold">{cliente.nome}</p>
                <p className="text-sm text-pink-100">{cliente.cpf}</p>
              </div>

              {/* Informações do Cliente */}
              <div className="p-4 space-y-3 border-b border-gray-200">
                {cliente.email && (
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">
                      EMAIL
                    </p>
                    <p className="text-sm text-gray-800 break-words">
                      {cliente.email}
                    </p>
                  </div>
                )}
                {cliente.telefone && (
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">
                      TELEFONE
                    </p>
                    <p className="text-sm text-gray-800">{cliente.telefone}</p>
                  </div>
                )}
                {cliente.dataNascimento && (
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">
                      DATA DE NASCIMENTO
                    </p>
                    <p className="text-sm text-gray-800">
                      {cliente.dataNascimento}
                    </p>
                  </div>
                )}
                {cliente.endereco && (
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">
                      ENDEREÇO
                    </p>
                    <p className="text-sm text-gray-800">{cliente.endereco}</p>
                  </div>
                )}
                {typeof numeroConta === "number" && (
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">
                      CONTA
                    </p>
                    <p className="text-sm text-gray-800 font-medium">
                      {numeroConta}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-600 font-semibold mb-1">
                    TIPO DE CONTA
                  </p>
                  <p className="text-sm text-gray-800 font-medium">
                    {cliente.contas?.[0]?.tipoConta === "CORRENTE"
                      ? "Conta Corrente"
                      : "Poupança"}
                  </p>
                </div>
                {typeof saldo === "number" && (
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">
                      SALDO
                    </p>
                    <p className="text-sm text-gray-800 font-medium">
                      {formatCurrency(saldo)}
                    </p>
                  </div>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="p-3 space-y-2">
                <button
                  onClick={handleEdit}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition text-sm font-medium"
                >
                  Editar Perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium"
                >
                  Sair
                </button>
              </div>
            </div>
          )}

          {/* Fundo transparente para fechar dropdown */}
          {showDropdown && (
            <div
              className="fixed inset-0 z-30"
              onClick={() => setShowDropdown(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
