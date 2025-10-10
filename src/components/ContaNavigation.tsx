import type { ActiveSection } from "../types/conta";

interface ContaNavigationProps {
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
}

export function ContaNavigation({
  activeSection,
  setActiveSection,
}: ContaNavigationProps) {
  const sections = [
    { id: "overview", label: "Visão Geral"},
    { id: "transfer", label: "Transferência"},
    { id: "deposit", label: "Depósito"},
    { id: "saque", label: "Saque"},
    { id: "extract", label: "Extrato"},
    { id: "loan", label: "Empréstimos"},
    { id: "cards", label: "Cartões"},
  ] as const;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id as ActiveSection)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSection === section.id
                ? "bg-pink-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
          {section.label}
          </button>
        ))}
      </div>
    </div>
  );
}
