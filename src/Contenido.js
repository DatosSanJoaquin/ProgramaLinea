import React, { useState, useEffect, useContext } from "react";
import Papa from "papaparse";
import { useLocation, useParams, NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import ProgressBar from "react-bootstrap/ProgressBar";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./App.css";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import ModalHitos from "./ModalHitos";
import { AppContext } from "./provider/provider";

function Contenido() {
  const [state, setState] = useContext(AppContext);
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
                    <h5 className="nombreIniciativa">{row.NombreIniciativa}</h5>
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    _InformacionModal(row);
                    //console.log("iniciativa", iniciativa);
                    //setInformacionModal(iniciativa);
                  }}
                >
                  <span className="iniciativas">Ver Hitos</span>
                </div>
              </div>
            </Col>
            <Col md={3} style={{ paddingTop: "15px", paddingBottom: "15px" }}>
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <ProgressBar now={row.AvanceN} />
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
              <span className="porcentajeBarra">{row.Avance} </span>
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

  const [progress, setProgress] = useState(0);
  const [porcentajeTotal, setPorcentajeTotal] = useState(0);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [informacionModal, setInformacionModal] = useState({});
  const [area, setArea] = useState("");

  useEffect(() => {
    if (state?.periodos?.[state.periodoActivo]) {
      console.log("nombre area", NombreArea);
      setArea(NombreArea);
      FiltrarInformacion();
      window.parent.postMessage("scrollToTop", "*");
    }
  }, [state.periodoActivo]);

  const FiltrarInformacion = () => {
    const datos = state?.periodos?.[state.periodoActivo] || {};
    const listaAreas = datos.Areas || [];

    console.log("periodo activo", state.periodoActivo);

    console.log("location", datos);
    //let nombreArea = "Fomento productivo y emprendimiento" || NombreArea;
    //let nombreArea = datos ? datos.NombreArea : NombreArea;
    const nombreArea = location.state?.NombreArea || NombreArea;
    const nombreNormalizado = nombreArea.trim().toLowerCase();
    //console.log("nombreArea", nombreArea);
    //setArea(nombreArea);
    console.log("nombreArea", nombreArea);

    //filter contenis data
    const objArea = listaAreas.find((item) =>
      item.Area.trim().toLowerCase().includes(nombreNormalizado)
    );
    console.log("objArea", objArea);

    //setArea(objArea.Area);

    if (Object.keys(objArea).length > 0) {
      let avance = objArea.Avance?.replace("%", "") || 0;
      console.log("avance", Number(avance));

      PorcentajeTotal(Number(avance));
    }

    if (state) {
      if (datos.Iniciativas && datos.Iniciativas.length > 0) {
        let listaIniciativas = datos.Iniciativas;

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
              Reporte: item.Reporte ? item.Reporte : "No disponible.",
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

  const _InformacionModal = (data) => {
    console.log("Informacion modal fila", data);
    const datos = state?.periodos?.[state.periodoActivo] || {};

    let nombreIniciativa = data.NombreIniciativa;

    let listaHitos = datos.Hitos || [];

    let filterHitos = listaHitos.filter(
      (item) => item.NombreIniciativa === nombreIniciativa
    );

    console.log("filterHitos", filterHitos);

    if (filterHitos.length > 0) {
      let informacionHitos = filterHitos[0].Hitos || [];

      let informacion = {
        Area: area,
        NombreIniciativa: nombreIniciativa,
        Descripcion: data.Descripcion,
        Avance: data.Avance,
        Hitos: informacionHitos,
        Reporte: data.Reporte,
      };

      console.log("informacion", informacion);
      setInformacionModal(informacion);
      //etArea(data.Areas);
      setMostrarModal(true);
    }

    //setArea(row.Areas);
    setMostrarModal(true);
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
                      //setArea(row.Areas);
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
          md={6}
          xs={6}
          style={{
            display: "flex",
            justifyContent: "flex-start", // Alinea el botón a la izquierda
          }}
        >
          <NavLink
            to={{
              pathname: `/Areas`,
            }}
          >
            <Button
              style={{
                width: "130px",
                borderRadius: "0px",
                fontSize: "13px",
              }}
              className="btnMas"
              //onClick={handleClick}
            >
              Volver atrás
            </Button>
          </NavLink>
        </Col>

        {/* Espacio en blanco para equilibrar el botón Volver atrás */}
        <Col
          md={6}
          xs={6}
          style={{
            display: "flex",
            justifyContent: "flex-end", // Alinea el botón a la derecha
            alignItems: "center",
          }}
        >
          <span className="tituloPeriodo">{state.periodoActivo}</span>
        </Col>
        {/* Título Area centrado */}
        <Col
          md={12}
          //xs={6}
          style={{
            textAlign: "center",
            marginBottom: "10px",
            marginTop: "5px",
          }}
        >
          <span
            className="tituloArea"
            // style={{
            //   textTransform: "uppercase",
            //   fontSize: "15px",
            //   fontWeight: "600",

            //   letterSpacing: "1px",
            // }}
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
          CerrarModal={() => {
            setMostrarModal(false);
            //setArea("");
            setInformacionModal({});
          }}
        />
      )}
    </Container>
  );
}

export default Contenido;
