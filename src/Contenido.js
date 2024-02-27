import React, { useState, useEffect } from "react";
import Papa from "papaparse";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
import ProgressBar from "react-bootstrap/ProgressBar";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./App.css";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import ModalHitos from "./ModalHitos";

function Contenido() {
  const columns = [
    {
      dataField: "id",
      text: "Product ID",
      hidden: true,
    },
    {
      dataField: "Areas",
      text: "ÁREAS",
      headerClasses: "headerTabla",
      classes: "agrupacion",
      headerStyle: {
        width: "250px",
        minWidth: "250px",
        color: "#fff",
      },
      formatter: (cell, row) => {
        return (
          <Row>
            <Col md={4}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#5d428b",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  ></div>
                  <div>{row.Areas}</div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#5d428b",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  ></div>
                  <span className="iniciativas">
                    {row.Iniciativas.length} Iniciativas
                  </span>
                </div>
              </div>
            </Col>
            <Col md={6} style={{ paddingTop: "15px", paddingBottom: "15px" }}>
              <div style={{ paddingTop: "10px" }}>
                <ProgressBar variant="warning" now={row.barra} />
              </div>
            </Col>
            <Col
              md={2}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingRight: "0px",
              }}
            >
              {row.Avance}
            </Col>
          </Row>
        );
      },
    },
    // {
    //   dataField: "barra",
    //   text: "",

    //   headerClasses: "headerTabla",
    //   classes: "agrupacion",
    //   formatter: priceFormatter,
    // },

    // {
    //   dataField: "Avance",
    //   text: "AVANCE DEL ÁREA",
    //   align: "center",
    //   headerStyle: {
    //     width: "180px",
    //     minWidth: "180px",
    //   },
    //   headerClasses: "headerTabla",
    //   classes: "agrupacion",
    // },
  ];

  //Consulta

  const data = [
    {
      id: 1,
      Areas: "Cultura",
      barra: 25,
      Avance: "25%",
      Iniciativas: [
        {
          id: 1,
          Nombre: "Actividades Culturales",
          Porcentaje: "12.5%",
          Descripcion:
            "2260 beneficiarios de diversas actividades culturales (conciertos, obras de teatro, exposiciones, entre otras.)",
          Hitos: [
            {
              id: 1,
              Nombre: "Festival Multicultural",
            },
            {
              id: 2,
              Nombre: "Programa de Residencias para artistas",
            },
          ],
        },
        {
          id: 2,
          Nombre: "Talleres",
          Descripcion: "Talleres de formación artística para personas",
          Porcentaje: "12.5%",
          Hitos: [
            {
              id: 1,
              Nombre: "Taller de fotografía",
            },
            {
              id: 2,
              Nombre: "Taller de pintura",
            },
          ],
        },
      ],
    },
    {
      id: 2,
      Areas: "Deportes",
      barra: 30,
      Avance: "30%",
      Iniciativas: [
        {
          id: 1,
          Nombre: "Programas de Deporte Comunitario",
          Porcentaje: "15%",
          Descripcion:
            "3200 participantes en diferentes programas deportivos comunitarios (fútbol, baloncesto, voleibol, etc.).",
          Hitos: [
            {
              id: 1,
              Nombre: "Torneo Interbarrial de Fútbol",
            },
            {
              id: 2,
              Nombre: "Clínicas de Baloncesto para Jóvenes",
            },
          ],
        },
        {
          id: 2,
          Nombre: "Actividades de Bienestar y Fitness",
          Descripcion:
            "Programas de acondicionamiento físico y bienestar para la comunidad",
          Porcentaje: "15%",
          Hitos: [
            {
              id: 1,
              Nombre: "Yoga en el Parque",
            },
            {
              id: 2,
              Nombre: "Caminatas Guiadas",
            },
          ],
        },
      ],
    },
  ];

  const percentage = 66;

  const [progress, setProgress] = useState(0);
  const [porcentajeTotal, setPorcentajeTotal] = useState(0);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [informacionModal, setInformacionModal] = useState({});
  const [area, setArea] = useState("");

  useEffect(() => {
    Papa.parse("/Presupuestos.csv", {
      download: true,
      header: true, // asumiendo que tu CSV tiene encabezados de columna
      complete: function (results) {
        console.log("Finished:", results.data);
        console.log(JSON.stringify(results.data, null, 2)); // Convertir a JSON y formatear

        Construir(results.data);
      },
    });

    PorcentajeTotal();
  }, []);

  const Construir = (data) => {
    console.log("Construir");
    console.log(data);

    const resultado = {};

    data.forEach((item) => {
      // Si el área no está definida o está vacía, se ignora el elemento
      if (!item.Area || item.Area === "") return;

      // Si el área no existe en el resultado, se inicializa
      if (!resultado[item.Area]) {
        resultado[item.Area] = {};
      }

      // Si la iniciativa no existe en el área, se inicializa
      if (!resultado[item.Area][item.Iniciativa]) {
        resultado[item.Area][item.Iniciativa] = [];
      }

      // Se añade el hito a la iniciativa correspondiente
      resultado[item.Area][item.Iniciativa].push(item.Hito);
    });

    console.log("aaray", Object.values(resultado));

    let array = Object.values(resultado);

    const nombres = array.map((objeto) => {
      // 'Object.keys(objeto)[0]' obtendrá la clave del primer par clave-valor del objeto,
      // que parece ser lo que está marcado en rojo en la consola
      let nombreArea = Object.keys(objeto)[0];

      console.log("nombreArea", nombreArea);
      console.log("objeto", objeto);
    });

    //console.log(nombres);

    //setData(Object.values(resultado));
    //console.log(resultado);
  };

  const PorcentajeTotal = () => {
    const interval = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 55 ? 55 : prevProgress + 1
      );
    }, 50); // Ajusta el tiempo según necesites

    return () => clearInterval(interval);
  };

  const expandRow = {
    renderer: (row) => (
      <>
        {row.Iniciativas.map((iniciativa) => {
          return (
            <Row
              style={{
                paddingTop: "20px",
                paddingBottom: "15px",
                paddingLeft: "10px",
                border: "1px solid #E0E0E0",
                margin: "0px",
              }}
            >
              <Col md={10}>
                <h5
                  style={{
                    color: "inherit",
                    fontFamily: "'Work Sans',sans-serif",
                    fontWeight: "500",
                  }}
                >
                  {iniciativa.Nombre}
                </h5>
                <p
                  style={{
                    color: "inherit",
                    fontFamily: "'Work Sans',sans-serif",
                    marginBottom: "6px",
                  }}
                >
                  {iniciativa.Descripcion}
                </p>
                <div>
                  <span
                    href="#"
                    style={{
                      fontFamily: "'Work Sans',sans-serif",
                      textDecoration: "none",
                      fontSize: "14px",
                      cursor: "pointer",
                      color: "#ED6A21",
                    }}
                    onClick={() => {
                      console.log("iniciativa", iniciativa);
                      setInformacionModal(iniciativa);
                      setArea(row.Areas);
                      setMostrarModal(true);
                    }}
                  >
                    Ver Hitos
                  </span>
                </div>
              </Col>
              <Col md={2} style={{ display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "700",
                    marginLeft: "25px",
                    color: "#81BA27",
                  }}
                >
                  {iniciativa.Porcentaje}
                </div>
              </Col>
            </Row>
          );
        })}

        {/* <Row
              style={{
                paddingTop: "20px",
                paddingBottom: "15px",
                paddingLeft: "10px",
                border: "1px solid #E0E0E0",
                margin: "0px",
              }}
            >
              <Col md={10}>
                <h5
                  style={{
                    color: "inherit",
                    fontFamily: "'Work Sans',sans-serif",
                    fontWeight: "500",
                  }}
                >
                  Obligación de declarar proyecciones de GEI y medidas de mitigación{" "}
                  {row.id}
                </h5>
                <p
                  style={{ color: "inherit", fontFamily: "'Work Sans',sans-serif" }}
                >
                  Propondremos legislación para que aquellos proyectos productivos
                  que deban someterse a un proceso de evaluación ambiental declaren
                  sus proyecciones de GEI y medidas de mitigación consistentes con
                  el objetivo de carbononeutralidad, y para que la exigencia de que
                  en proyecciones de línea de base se considere el comportamiento
                  futuro de componentes ambientales según diferentes escenarios
                  climáticos.
                </p>
              </Col>
              <Col md={2} style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ fontSize: "3rem", fontWeight: "700" }}>10%</div>
              </Col>
            </Row> */}
      </>
    ),
  };

  function priceFormatter(cell, row) {
    console.log("row", row);

    return (
      <div style={{ paddingTop: "10px" }}>
        <ProgressBar variant="warning" now={row.barra} />
      </div>
    );
  }

  return (
    <Container fluid style={{ backgroundColor: "#fff" }}>
      <Row style={{ marginTop: "20px" }}>
        <Col
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ width: 150, height: 150 }}>
            <CircularProgressbar
              value={progress}
              text={`${progress}%`}
              strokeWidth={12}
              styles={buildStyles({
                pathColor: `rgba(93, 66, 139, ${progress / 100})`,
                textColor: "rgb(238,112,17)",
                //trailColor: "#d6d6d6",
                backgroundColor: "#3e98c7",
                textSize: "30px",
                textWeight: "bold",
                // Ajusta el grosor de la barra aquí
                text: {
                  fontWeight: "bold", // Usa 'bold', 'normal', '600', '700', etc.
                },
                // Transición suave del progreso
                pathTransition:
                  progress === 0 ? "none" : "stroke-dashoffset 0.5s ease 0s",
              })}
            />
          </div>
          <div style={{ marginTop: "10px" }}>
            <span style={{ fontSize: "14px" }}>CUMPLIMIENTO TOTAL</span>
          </div>
        </Col>
      </Row>
      <Row
        className="headerTabla"
        style={{
          marginTop: "10px",
          textAlign: "center",
          paddingTop: "10px",
          paddingBottom: "10px",
          marginLeft: "0px",
          marginRight: "0px",
        }}
      >
        <Col md={4}>AREAS</Col>
        <Col md={6}></Col>
        <Col md={2}>PORCENTAJE</Col>
      </Row>
      <Row style={{ marginTop: "7px" }}>
        <BootstrapTable
          keyField="id"
          data={data}
          columns={columns}
          expandRow={expandRow}
          bordered={false}
          headerClasses="custom-table-header"
        />
      </Row>
      {Object.keys(informacionModal).length > 0 && (
        <ModalHitos
          MostrarModal={mostrarModal}
          InformacionModal={informacionModal}
          Area={area}
          CerrarModal={() => {
            setMostrarModal(false);
            setArea("");
            setInformacionModal({});
          }}
        />
      )}
    </Container>
  );
}

export default Contenido;
