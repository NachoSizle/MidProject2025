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
server.use("/api", router);

module.exports.handler = async (event, context) => {
  return new Promise((resolve, reject) => {
    // Usamos el método handle para procesar la solicitud
    server.handle(event, context, (err, response) => {
      if (err) {
        console.error("Error al manejar la solicitud:", err);
        // Asegúrate de convertir el error a una cadena JSON
        return reject({
          statusCode: 500,
          body: JSON.stringify({ message: "Error en el servidor", error: err }),
        });
      }

      // Asegúrate de convertir la respuesta a una cadena JSON
      if (response) {
        return resolve({
          statusCode: response.statusCode || 200,
          body: JSON.stringify(response.body), // Convertir el cuerpo a JSON
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        // Si no hay respuesta, devolver un error adecuado
        return reject({
          statusCode: 404,
          body: JSON.stringify({ message: "No se encontró la respuesta" }),
        });
      }
    });
  });
};
