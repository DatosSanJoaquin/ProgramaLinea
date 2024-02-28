import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  HashRouter,
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import "react-circular-progressbar/dist/styles.css";
import "./App.css";

import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

import rutas from "./routes";
import Contenido from "./Contenido";
import Areas from "./Areas";

function App() {
  const _obtenerRutas = (ruta) => {
    console.log(
      "rutas",
      ruta.map((prop, key) => {
        return (
          <Route
            path={prop.path}
            render={(props) => <prop.component />}
            key={key}
          />
        );
      })
    );

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

  return (
    <Router>
      <Switch>
        {/* Definir más rutas según sea necesario */}

        <Route path={"/Areas"} render={(props) => <Areas />} />
        <Route
          path={"/Contenido/:NombreArea"}
          render={(props) => <Contenido />}
        />

        {/* Si tienes una ruta de índice o una ruta de captura todo, asegúrate de que la ruta de Areas esté definida antes */}
      </Switch>
    </Router>
  );
}

export default App;
