import React, { useEffect, useContext, useState } from "react";
import Papa from "papaparse";
import {
  HashRouter,
  Route,
  Switch,
  Redirect,
  useLocation,
} from "react-router-dom";
import { AppContext } from "./provider/provider";
import rutas from "./routes";
import SelectorPeriodo from "./SelectorPeriodo";
import { BounceLoader } from "react-spinners";

const _obtenerRutas = (ruta) => {
  return ruta.map((prop, key) => {
    return (
      <Route
        path={prop.path}
        render={(props) => <prop.component />}
        key={key}
      />
    );
  });
};

function InnerRouterContent({ periodoActivo, cambiarPeriodo }) {
  const location = useLocation();

  const ocultarSelector = location.pathname.includes("/Contenido");

  return (
    <>
      {!ocultarSelector && (
        <div style={{ padding: "15px", textAlign: "center" }}>
          <SelectorPeriodo
            periodoActivo={periodoActivo}
            onPeriodoChange={cambiarPeriodo}
          />
        </div>
      )}

      <Switch>
        {_obtenerRutas(rutas)}
        <Route exact path="/">
          <Redirect to="/Areas" />
        </Route>
      </Switch>
    </>
  );
}

function Estructura() {
  const [state, setState] = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  const urls = {
    "Periodo 2021-2024":
      "https://raw.githubusercontent.com/DatosSanJoaquin/ProgramaLinea/refs/heads/main/public/Periodo1/ProgramaEnLinea.csv",
    "Periodo 2025-2028":
      "https://raw.githubusercontent.com/DatosSanJoaquin/ProgramaLinea/refs/heads/main/public/Periodo2/ProgramaEnLinea.csv",
  };

  useEffect(() => {
    const fetchDataPorPeriodo = async () => {
      const resultados = {};

      for (const [periodo, url] of Object.entries(urls)) {
        try {
          const response = await fetch(url);
          const csv = await response.text();
          const result = Papa.parse(csv, {
            header: true,
            skipEmptyLines: true,
          });
          resultados[periodo] = construirEstructura(result.data);
        } catch (error) {
          console.error(`Error cargando datos para ${periodo}`, error);
        }
      }

      console.log("resultados", {
        periodos: resultados,
        periodoActivo: "Periodo 2025-2028",
      });

      setState({
        periodos: resultados,
        periodoActivo: "Periodo 2025-2028",
      });
      setLoading(false);
    };

    fetchDataPorPeriodo();
  }, []);

  const construirEstructura = (data) => {
    let areasMap = new Map();
    let initiativesMap = new Map();
    let milestonesMap = new Map();
    let avanceGeneral;

    data.forEach((row) => {
      const area = row["Área"];
      const initiativeName = row["Nombre Iniciativa"];

      if (!avanceGeneral && row["% de avance general"]) {
        avanceGeneral = Number(row["% de avance general"].replace("%", ""));
      }

      if (!areasMap.has(area)) {
        areasMap.set(area, { Area: area, Avance: row["% de avance área"] });
      }

      if (!initiativesMap.has(area)) {
        initiativesMap.set(area, {
          Area: area,
          Iniciativas: [
            {
              NombreIniciativa: initiativeName,
              Descripcion: row["Descripción Iniciativa"],
              Avance: row["% de avance Iniciativa"],
              Reporte: row["Reporte de avance"],
            },
          ],
        });
      } else {
        let initiatives = initiativesMap.get(area).Iniciativas;
        if (
          !initiatives.some((init) => init.NombreIniciativa === initiativeName)
        ) {
          initiatives.push({
            NombreIniciativa: initiativeName,
            Descripcion: row["Descripción Iniciativa"],
            Avance: row["% de avance Iniciativa"],
            Reporte: row["Reporte de avance"],
          });
        }
      }

      if (!milestonesMap.has(initiativeName)) {
        milestonesMap.set(initiativeName, {
          NombreIniciativa: initiativeName,
          Hitos: [],
        });
      }

      milestonesMap.get(initiativeName).Hitos.push({
        Hito: row["Hitos"],
        Asignado: row["% asignado hitos"],
        Avance: row["% de avance acumulado"],
      });
    });

    return {
      Areas: Array.from(areasMap.values()),
      Iniciativas: Array.from(initiativesMap.values()),
      Hitos: Array.from(milestonesMap.values()),
      AvanceGeneral: avanceGeneral || 0,
    };
  };

  const cambiarPeriodo = (nuevoPeriodo) => {
    setState((prev) => ({
      ...prev,
      periodoActivo: nuevoPeriodo,
    }));
  };

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            //height: "100vh",
            marginTop: "200px",
          }}
        >
          <BounceLoader color="#623D8F" size={80} />
          <p
            style={{ marginTop: "20px", fontWeight: "bold", color: "#623D8F" }}
          >
            Cargando Información...
          </p>
        </div>
      ) : (
        <HashRouter>
          <InnerRouterContent
            periodoActivo={state.periodoActivo}
            cambiarPeriodo={cambiarPeriodo}
          />
        </HashRouter>
      )}
    </>
  );
}

export default Estructura;
