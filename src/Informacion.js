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

function Informacion() {
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
    },
    {
      dataField: "barra",
      text: "",
      headerStyle: {
        //width: "200px",
        //minWidth: "200px",
      },
      headerClasses: "headerTabla",
      classes: "agrupacion",
      formatter: priceFormatter,
    },

    {
      dataField: "Avance",
      text: "AVANCE DEL ÁREA",
      headerStyle: {
        width: "150px",
        minWidth: "150px",
      },
      headerClasses: "headerTabla",
      classes: "agrupacion",
    },
  ];

  const data = [
    {
      id: 1,
      Areas: "Área 1",
      barra: "50",
      Avance: "50%",
    },
    {
      id: 2,
      Areas: "Área 2",
      barra: "50",
      Avance: "50%",
    },
    {
      id: 3,
      Areas: "Área 3",
      barra: "50",
      Avance: "50%",
    },
    {
      id: 4,
      Areas: "Área 4",
      barra: "50",
      Avance: "50%",
    },
    {
      id: 5,
      Areas: "Área 5",
      barra: "50",
      Avance: "50%",
    },
  ];

  const percentage = 66;

  const [progress, setProgress] = useState(0);
  const [porcentajeTotal, setPorcentajeTotal] = useState(0);

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
        prevProgress >= 66 ? 66 : prevProgress + 1
      );
    }, 50); // Ajusta el tiempo según necesites

    return () => clearInterval(interval);
  };

  const expandRow = {
    renderer: (row) => (
      <div>
        <p>{`This Expand row is belong to rowKey ${row.id}`}</p>
        <p>
          You can render anything here, also you can add additional data on
          every row object
        </p>
        <p>
          expandRow.renderer callback will pass the origin row object to you
        </p>
      </div>
    ),
  };

  function priceFormatter(cell, row) {
    return <ProgressBar variant="warning" now={60} />;
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
      <Row>
        <BootstrapTable
          keyField="id"
          data={data}
          columns={columns}
          expandRow={expandRow}
          bordered={false}
          headerClasses="custom-table-header"
        />
      </Row>
    </Container>
  );
}

export default Informacion;
