import React, { useEffect, useContext, useState } from "react";
import Papa from "papaparse";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  HashRouter,
} from "react-router-dom";
import { AppContext } from "./provider/provider";
import rutas from "./routes";
function Estructura() {
  const [state, setState] = useContext(AppContext);

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

  useEffect(() => {
    //fetch("/Programa%20en%20linea%20web/Programa%20en%20linea.csv")
    //fetch(process.env.PUBLIC_URL + "/ProgramaEnLinea.csv")
    fetch(
      "https://www.sanjoaquin.cl/Programa%20en%20linea%20web/Programa%20en%20linea.csv"
    )
      .then((response) => response.text())
      .then((csv) => {
        console.log("csv", csv);
        Papa.parse(csv, {
          header: true,
          complete: (result) => {
            createArrays(result.data);
          },
          skipEmptyLines: true,
        });
      })
      .catch((error) => {
        console.error("Error fetching the CSV file:", error);
        //alert("Error al leer los datos ", error);
      });
  }, []);

  const createArrays = (data) => {
    let mainValues = {};

    let areasMap = new Map();
    let initiativesMap = new Map();
    let milestonesMap = new Map();
    let avanceGeneral;
    data.forEach((row) => {
      const area = row["Área"];
      const initiativeName = row["Nombre Iniciativa"];

      if (!avanceGeneral) {
        avanceGeneral = row["% de avance general"]
          ? Number(row["% de avance general"].replace("%", ""))
          : 0;
        console.log("avanceGeneral", avanceGeneral);
      }

      // Solo agrega el área si aún no está en el mapa
      if (!areasMap.has(area)) {
        areasMap.set(area, { Area: area, Avance: row["% de avance área"] });
      }

      // Iniciativas y su información relacionada
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
        // Solo agrega la iniciativa si aún no existe en este área
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

      // Hitos relacionados a cada iniciativa
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

    // Convertir los Map a Array para el estado de React
    const areasArray = Array.from(areasMap.values());
    const initiativesArray = Array.from(initiativesMap.values());
    const milestonesArray = Array.from(milestonesMap.values());

    mainValues = {
      Areas: areasArray,
      Iniciativas: initiativesArray,
      Hitos: milestonesArray,
      AvanceGeneral: avanceGeneral,
    };
    setState(mainValues);
  };

  return (
    <>
      {Object.keys(state).length > 0 ? (
        <HashRouter>
          <Switch>
            {/* Definir más rutas según sea necesario */}
            {_obtenerRutas(rutas)}
            <Route exact path="/">
              <Redirect to="/Areas"></Redirect>
            </Route>

            {/* Si tienes una ruta de índice o una ruta de captura todo, asegúrate de que la ruta de Areas esté definida antes */}
          </Switch>
        </HashRouter>
      ) : (
        ""
      )}
    </>
  );
}

export default Estructura;
