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

function App() {
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

  return (
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
  );
}

export default App;
