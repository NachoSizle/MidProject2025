const jsonServer = require("json-server");

const app = jsonServer.create();
const middlewares = jsonServer.defaults();

// Base de datos en memoria (carga estática)
const db = {
  projects: [
    { id: 1, name: "Proyecto 1" },
    { id: 2, name: "Proyecto 2" },
  ],
};

// Cargar base de datos en memoria en JSON Server
const router = jsonServer.router({ ...db });

app.use(middlewares);
app.use(router);

console.log(
  "✅ JSON Server iniciado con los siguientes datos:",
  JSON.stringify(router.db.getState(), null, 2)
);

module.exports.handler = app;
