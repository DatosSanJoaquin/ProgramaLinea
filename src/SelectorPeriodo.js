import React from "react";

const PERIODOS = ["Periodo 2021-2024", "Periodo 2025-2028"];

const SelectorPeriodo = ({ periodoActivo, onPeriodoChange }) => {
  return (
    <div className="btn-group selector-periodo" role="group">
      {PERIODOS.map((p) => (
        <button
          key={p}
          className={`btn selector-btn ${
            p === periodoActivo ? "activo" : "inactivo"
          }`}
          onClick={() => onPeriodoChange(p)}
        >
          <span style={{ fontFamily: "monospace", fontSize: "15px" }}>{p}</span>
        </button>
      ))}
    </div>
  );
};

export default SelectorPeriodo;
