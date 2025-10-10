import React from "react";

type Section =
  | "overview"
  | "transfer"
  | "deposit"
  | "saque"
  | "extract"
  | "loan"
  | "cards";

interface Props {
  active: Section;
  onChange: (s: Section) => void;
}

const sections: Section[] = [
  "overview",
  "transfer",
  "deposit",
  "saque",
  "extract",
  "loan",
  "cards",
];

const Nav: React.FC<Props> = ({ active, onChange }) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {sections.map((s) => (
        <button
          key={s}
          className={`px-3 py-1 border rounded ${
            active === s ? "bg-pink-500 text-white" : "bg-white"
          }`}
          onClick={() => onChange(s)}
        >
          {s}
        </button>
      ))}
    </div>
  );
};

export default Nav;
