import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { useLocation, useParams } from "react-router-dom";
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
  const { NombreArea } = useParams();
  const location = useLocation();
  const [iniciativas, setIniciativas] = useState([]);

  const columns = [
    {
      dataField: "Id",
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
            <Col md={7}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "start",
                  paddingLeft: "3px",
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
                  <div>
                    {" "}
                    <h5
                      style={{
                        color: "inherit",
                        fontFamily: "'Work Sans',sans-serif",
                        fontWeight: "500",
                        lineHeight: "1.2",
                      }}
                    >
                      {row.NombreIniciativa}
                    </h5>
                    <p
                      style={{
                        color: "#263238",
                        fontFamily: "'Work Sans',sans-serif",
                        //marginBottom: "6px",
                        fontSize: "13px",
                        textAlign: "justify",
                        fontWeight: "400",
                      }}
                    >
                      {row.Descripcion}
                    </p>
                  </div>
                </div>
                {/* <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={
                      {
                        // width: "10px",
                        // height: "10px",
                        // //backgroundColor: "#5d428b",
                        // borderRadius: "50%",
                        // marginRight: "10px",
                      }
                    }
                  ></div>
                  <span className="iniciativas">Hitos</span>
                </div> */}
              </div>
            </Col>
            <Col md={3} style={{ paddingTop: "15px", paddingBottom: "15px" }}>
              <div style={{ paddingTop: "10px" }}>
                <ProgressBar variant="warning" now={row.AvanceN} />
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
              {row.Avance}{" "}
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
    FiltrarInformacion();
  }, []);

  const FiltrarInformacion = () => {
    const datos = location.state; // Accedes a los datos aquí
    // console.log("asdasdsd", datos); // { clave: 'valor' }

    let listaAreas = datos ? datos.ListaAreas : [];

    //let nombreArea = datos.NombreArea;
    console.log("location", datos);
    let nombreArea = "Fomento productivo y emprendimiento" || NombreArea;
    setArea(nombreArea);
    console.log("nombreArea", nombreArea);

    //filter contenis data
    const objArea =
      listaAreas.find((item) => item.Area.includes(nombreArea)) || {};
    console.log("objArea", objArea);

    if (Object.keys(objArea).length > 0) {
      let avance = objArea.Avance?.replace("%", "") || 0;
      console.log("avance", Number(avance));

      PorcentajeTotal(Number(avance));
    }

    if (datos) {
      if (datos.ListaIniciativas.length > 0) {
        let listaIniciativas = datos ? datos.ListaIniciativas : [];

        let filterIniciativas =
          listaIniciativas.find((item) => item.Area.includes(nombreArea)) || {};

        console.log("listIniciativas", filterIniciativas);

        if (Object.keys(filterIniciativas).length > 0) {
          let iniciativas = filterIniciativas.Iniciativas || [];

          console.log("iniciativas sin formato", iniciativas);

          let informacionIniciativas_ = [];

          iniciativas.map((item, i) => {
            let obj = {
              Id: i + 1,
              NombreIniciativa: item.NombreIniciativa,
              Descripcion: item.Descripcion,
              Avance: item.Avance,
              AvanceN: Number(item.Avance.replace("%", "")),
            };

            informacionIniciativas_.push(obj);
          });

          console.log("Render Iniciativas", informacionIniciativas_);
          setIniciativas(informacionIniciativas_);
        }
      }
    }
  };

  const PorcentajeTotal = (avance) => {
    const interval = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= avance ? avance : prevProgress + 1
      );
    }, 50); // Ajusta el tiempo según necesites

    return () => clearInterval(interval);
  };

  const Construir = (data) => {
    console.log(data);

    const resultado = {};

    //console.log(nombres);

    //setData(Object.values(resultado));
    //console.log(resultado);
  };

  const expandRow = {
    renderer: (row) => (
      <>
        {row.Iniciativas.map((iniciativa, i) => {
          return (
            <Row
              style={{
                paddingTop: "20px",
                paddingBottom: "15px",
                paddingLeft: "10px",
                border: "1px solid #E0E0E0",
                margin: "0px",
              }}
              key={i}
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
          md={12}
          style={{
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <span
            style={{
              textTransform: "uppercase",
              fontSize: "15px",
              fontWeight: "600",
              letterSpacing: "1px",
            }}
          >
            {area}
          </span>
        </Col>
        <Col
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ width: 120, height: 120 }}>
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
                strokeLinecap: "butt",
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
            <span style={{ fontSize: "14px", fontWeight: "700" }}>AVANCE</span>
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
        <Col md={4}>INICIATIVAS</Col>
        <Col md={6}></Col>
        <Col md={2}>% DE AVANCE</Col>
      </Row>
      <Row style={{ marginTop: "7px" }}>
        <BootstrapTable
          keyField="Id"
          data={iniciativas}
          columns={columns}
          //expandRow={expandRow}
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
