import React from "react";
import {
  Row,
  Col,
  Modal,
  Button,
  Container,
  Form,
  Tab,
  Tabs,
  OverlayTrigger,
} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";

function ModalHitos(props) {
  let columnsHitos = [
    {
      dataField: "Nombre",
      text: "Descripción",
      sort: true,
      headerStyle: { width: "50%" },
      headerClasses: "headerTablaHitos",
      classes: "cellColumnsTablaHitos",
      footer: "",
      footerClasses: "footerTablaHitos",
    },
    {
      dataField: "Asignado",
      text: " % Asignado",
      sort: true,
      headerStyle: { width: "20%", textAlign: "center" },
      classes: "cellColumnsTablaHitos",
      headerClasses: "headerTablaHitos",
      align: "center",
      footerAlign: (column, colIndex) => "center",
      footerClasses: "footerTablaHitos",

      footer: "Total",
    },
    {
      dataField: "Avance",
      text: " % Avance",
      sort: true,
      headerStyle: { width: "20%", textAlign: "center" },
      align: "center",
      //classes: "cellColumnsTablaHitos",
      headerClasses: "headerTablaHitos",
      footerAlign: (column, colIndex) => "center",
      footerClasses: "footerTablaHitos",

      footer: "100%",
      formatter: (cell, row) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "70px" }}>
            {/* <CircularProgressbar
            value={row.Avance}
            text={row.Avance + "%"}
            background
            backgroundPadding={6}
            styles={buildStyles({
              backgroundColor: "#3e98c7",
              textColor: "#fff",
              pathColor: "#fff",
              trailColor: "transparent",
            })}
          /> */}

            <CircularProgressbar
              value={row.Avance}
              text={`${row.Avance}%`}
              circleRatio={0.75}
              styles={buildStyles({
                rotation: 1 / 2 + 1 / 8,
                strokeLinecap: "butt",
                trailColor: "#eee",
                textSize: "26px",
                textColor: "rgb(238,112,17)",
                pathColor: `rgba(129,186,39, ${row.Avance / 100})`,
                pathTransition:
                  row.Avance === 0 ? "none" : "stroke-dashoffset 0.5s ease 0s",
              })}
            />
          </div>
        </div>
      ),
    },
  ];

  let data = [
    {
      id: 1,
      Nombre: "Hito 1",
      Asignado: "50%",
      Avance: "30",
    },
    {
      id: 2,
      Nombre: "Hito 2",
      Asignado: "20%",
      Avance: "60",
    },
    {
      id: 3,
      Nombre: "Hito 3",
      Asignado: "20%",
      Avance: "100",
    },
    {
      id: 4,
      Nombre: "Hito 4",
      Asignado: "10%",
      Avance: "100",
    },
  ];

  return (
    <Modal
      show={props.MostrarModal}
      dialogClassName="modal-90w"
      //dialogClassName="anchoModal"
      //onHide={handleClose}
      backdrop="static"
      keyboard={false}
      onHide={() => {
        props.CerrarModal();
      }}
    >
      <Modal.Header
        className="encabezadoModal"
        closeButton
        closeVariant="white"
      >
        <Modal.Title
          style={{ color: "#fff", fontSize: "1.1rem", fontWeight: "600" }}
        >
          {props.Area}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>{props.InformacionModal.Nombre}</h5>
        <Row style={{ marginTop: "20px" }}>
          {/* <Col md={12}>
            <p style={{ textAlign: "justify" }}>
              <strong>Nombre:</strong> Cuando era niño soñaba con ser astronauta
              y ahora soy astronauta
            </p>
          </Col> */}
          <Col>
            <p>
              <strong style={{ color: "#EA5323" }}>Descripción:</strong> Un
              total de 2260 personas disfrutaron de una rica agenda cultural,
              participando en una variedad de eventos que incluyeron conciertos,
              obras de teatro y exposiciones. Este diverso programa logró captar
              la atención de un amplio público, fomentando el aprecio por las
              artes y la cultura.
            </p>
          </Col>
        </Row>

        <Row>
          <BootstrapTable
            keyField="id"
            data={data}
            columns={columnsHitos}
            bordered={false}
            //headerClasses="tablaHitos"
          />
        </Row>
        {/* {
          <ul>
            {props.InformacionModal.Hitos.map((item, index) => (
              <li key={index}>{item.Nombre}</li>
            ))}
          </ul>
        } */}
      </Modal.Body>
    </Modal>
  );
}

export default ModalHitos;
