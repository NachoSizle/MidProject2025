const serverless = require("serverless-http");
const jsonServer = require("json-server");
const router = jsonServer.router("db.json");
const app = jsonServer.create();
const middlewares = jsonServer.defaults();

// Cargar base de datos en memoria en JSON Server

app.use(middlewares);
app.use(router);

console.log(
  "✅ JSON Server iniciado con los siguientes datos:",
  JSON.stringify(router.db.getState(), null, 2)
);

module.exports.handler = serverless(app);
