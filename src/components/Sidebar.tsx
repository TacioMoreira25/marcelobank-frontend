import React from "react";
import type { ActiveSection as Section } from "../types/conta";

interface Props {
  active: Section;
  onChangeSection: (s: Section) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<Props> = ({ active, onChangeSection, onLogout }) => {
  const sections: { id: Section; label: string }[] = [
    { id: "overview", label: "Visão Geral" },
    { id: "transfer", label: "Transferir" },
    { id: "deposit", label: "Depositar" },
    { id: "saque", label: "Sacar" },
    { id: "extract", label: "Extrato" },
    { id: "loan", label: "Empréstimos" },
    { id: "cards", label: "Cartões" },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Menu de navegação */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onChangeSection(section.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition font-medium ${
              active === section.id
                ? "bg-pink-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {section.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full text-left px-4 py-3 rounded-lg transition font-medium text-red-600 hover:bg-red-50"
        >
          Sair
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
