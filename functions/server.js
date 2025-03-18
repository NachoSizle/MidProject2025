const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router({
  projects: [
    { id: 1, name: "Proyecto 1" },
    { id: 2, name: "Proyecto 2" },
  ],
});
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Asegúrate de que la función de Netlify maneje correctamente la respuesta
server.use("/api", router);

module.exports.handler = async (event, context) => {
  return new Promise((resolve, reject) => {
    // Crear un servidor en memoria y redirigir las peticiones
    server.handle(event, context, (err, response) => {
      if (err) {
        return reject(err);
      }

      // Asegúrate de que la respuesta sea un objeto JSON adecuado
      return resolve({
        statusCode: response.statusCode,
        body: JSON.stringify(response.body),
        headers: {
          "Content-Type": "application/json",
        },
      });
    });
  });
};
