const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router({
  projects: [
    { id: 1, name: "Proyecto 1" },
    { id: 2, name: "Proyecto 2" },
  ],
});
const middlewares = jsonServer.defaults();

// Asegurarse de que el servidor sirva las rutas correctas
server.use(middlewares);
server.use("/api", router);

module.exports.handler = async (event, context) => {
  return new Promise((resolve, reject) => {
    // Aquí usamos el método .handle para procesar la solicitud
    server.handle(event, context, (err, response) => {
      if (err) {
        console.error("Error al manejar la solicitud:", err);
        return reject({
          statusCode: 500,
          body: JSON.stringify({ message: "Error en el servidor" }),
        });
      }

      // Asegúrate de que la respuesta esté correctamente formada
      if (response) {
        return resolve({
          statusCode: response.statusCode || 200,
          body: JSON.stringify(response.body),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        return reject({
          statusCode: 404,
          body: JSON.stringify({ message: "No se encontró la respuesta" }),
        });
      }
    });
  });
};
