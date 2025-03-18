const https = require("https");
const path = require("path");

// Ruta de la URL pública donde está alojado db.json
const dbUrl = "https://mid-project-nacho.netlify.app.netlify.app/db.json";

// Función para obtener los datos desde db.json
const readData = () => {
  return new Promise((resolve, reject) => {
    https
      .get(dbUrl, (response) => {
        let data = "";
        response.on("data", (chunk) => {
          data += chunk;
        });
        response.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject("Error al parsear los datos JSON");
          }
        });
      })
      .on("error", (err) => {
        reject("Error al obtener los datos de db.json: " + err.message);
      });
  });
};

// Función para manejar las solicitudes
module.exports.handler = async (event) => {
  const { path, httpMethod } = event;
  const parts = path.split("/"); // Separar las partes de la URL (ej. /api/projects/1)

  // Leer datos desde la URL pública de db.json
  let data;
  try {
    data = await readData();
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error al leer los datos", error }),
    };
  }

  if (httpMethod === "GET") {
    if (parts[2] === "projects") {
      if (parts[3]) {
        const project = data.projects.find((p) => p.id === parseInt(parts[3]));
        if (project) {
          return {
            statusCode: 200,
            body: JSON.stringify(project),
          };
        }
        return {
          statusCode: 404,
          body: JSON.stringify({ message: "Project not found" }),
        };
      } else {
        return {
          statusCode: 200,
          body: JSON.stringify(data.projects),
        };
      }
    }
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Not Found" }),
    };
  }
};
