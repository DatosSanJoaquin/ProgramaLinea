import React, { useState, useEffect } from "react";
import Papa from "papaparse";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
import ProgressBar from "react-bootstrap/ProgressBar";
import {
  CircularProgressbar,
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";
import "./App.css";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import ModalHitos from "./ModalHitos";
import { Button } from "react-bootstrap";
import { NavLink, useParams, useHistory } from "react-router-dom";

function Areas() {
  const areas = [
    {
      nombre: "Cuidado y Protección Animal",
      porcentaje: 25,
      src: "/img/01.png",
    },
    {
      nombre: "Vivienda",
      porcentaje: 50,
      src: "/img/02.png",
    },
    {
      nombre: "Seguridad Comunitaria",
      porcentaje: 32,
      src: "/img/03.png",
    },
    {
      nombre: "Transparencia y modernización municipal",
      porcentaje: 64,
      src: "/img/05.png",
    },
  ];

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

  let history = useHistory();
  const [progress, setProgress] = useState(0);
  const [porcentajeTotal, setPorcentajeTotal] = useState(0);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [informacionModal, setInformacionModal] = useState({});
  const [area, setArea] = useState("");

  function handleClick() {
    history.push("/Contenido"); // Reemplaza '/otra-ruta' con la ruta de tu otro componente
  }

  return (
    <Container fluid style={{ backgroundColor: "#fff" }}>
      <Row
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      >
        {areas.map((area, i) => {
          return (
            <Col
              md={"auto"}
              key={i}
              style={{
                marginLeft: "20px",
                marginRight: "20px",
                marginTop: "15px",
                marginBottom: "25px",
                minWidth: "350px",
                maxWidth: "350px",
                //backgroundColor: "red",
              }}
            >
              <Row>
                <Col
                  md={12}
                  style={{
                    marginBottom: "20px",
                    textAlign: "center",
                  }}
                >
                  <span
                    style={{
                      textTransform: "uppercase",
                      fontSize: "13px",
                    }}
                  >
                    {area.nombre}
                  </span>
                </Col>
                <Col
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ width: 150, height: 150, padding: "0px" }}>
                    <CircularProgressbarWithChildren
                      value={area.porcentaje}
                      style={{ width: 500 }}
                      strokeWidth={12}
                      background
                      styles={buildStyles({
                        // Rotation of path and trail, in number of turns (0-1)
                        //rotation: 0.25,

                        // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                        strokeLinecap: "butt",

                        // Text size
                        textSize: "16px",

                        // How long animation takes to go from one percentage to another, in seconds
                        pathTransitionDuration: 0.5,

                        // Can specify path transition in more detail, or remove it entirely
                        // pathTransition: 'none',

                        // Colors
                        pathColor: `rgba(129, 186, 39, ${percentage / 100})`,
                        textColor: "#f88",
                        trailColor: "#d6d6d6",
                        backgroundColor: "#5D428B",
                        pathTransition:
                          progress === 0
                            ? "none"
                            : "stroke-dashoffset 0.5s ease 0s",
                      })}
                    >
                      {/* Put any JSX content in here that you'd like. It'll be vertically and horizonally centered. */}

                      <img
                        style={{ width: 60, margin: "10px" }}
                        src={area.src}
                        alt="imagen"
                      />
                      <div style={{ fontSize: 12, marginTop: -5 }}></div>
                    </CircularProgressbarWithChildren>
                  </div>
                </Col>
                <Col
                  md={12}
                  style={{
                    justifyContent: "center",
                    textAlign: "center",
                    marginTop: "10px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: "700",
                      color: "#263238",
                    }}
                  >
                    {area.porcentaje + "%"}
                  </span>
                  <p style={{ fontSize: "13px", marginBottom: "7px" }}>
                    de avance
                  </p>
                  <NavLink to={`/Contenido/${area.nombre}`}>
                    <Button
                      style={{
                        width: "100px",
                        borderRadius: "0px",
                        fontSize: "13px",
                      }}
                      className="btnMas"
                      //onClick={handleClick}
                    >
                      Ver más
                    </Button>
                  </NavLink>
                </Col>
              </Row>
            </Col>
          );
        })}
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

export default Areas;
