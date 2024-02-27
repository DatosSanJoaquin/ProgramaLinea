import Areas from "./Areas";
import Contenido from "./Contenido";

const rutas = [
  {
    path: "/Areas",
    component: Areas,
    Titulo: "Areas",
  },
  {
    path: "/Contenido/:NombreArea",
    component: Contenido,
    Titulo: "Contenido",
  },
];

export default rutas;
