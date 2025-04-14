import React, { useEffect, useContext, useState } from "react";
import MyProvider from "./provider/provider";
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
import Estructura from "./Estructura";

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
    <MyProvider>
      <Estructura />
    </MyProvider>
  );
}

export default App;
