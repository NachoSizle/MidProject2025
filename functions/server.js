const https = require("https");
let projects = null;

// Ruta de la URL pública donde está alojado db.json
const dbUrl = "https://mid-project-nacho.netlify.app/public/db.json";

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

// Función para obtener los datos desde localStorage
const loadData = async () => {
  try {
    if (!projects) {
      const projectsOnJSON = await readData();
      if (projectsOnJSON) {
        saveData(projectsOnJSON);
        console.log("Datos cargados desde db.json");
        console.log(projectsOnJSON);
        return projectsOnJSON;
      }
    }

    return JSON.parse(projects);
  } catch (error) {
    console.error("Error al cargar los datos:", error);
    return { projects: [] }; // Retorna un array vacío en caso de error
  }
};

// Función para guardar los datos en localStorage
const saveData = (data) => {
  projects = JSON.stringify(data);
};

// Función para manejar las solicitudes
module.exports.handler = async (event) => {
  const { path, httpMethod } = event;
  const [, , entity, uuid] = path.split("/"); // Separar las partes de la URL (ej. /api/projects/1)

  // Leer datos desde localStorage
  let data = await loadData();

  if (httpMethod === "GET") {
    // GET a "/projects" o "/projects/{uuid}"
    if (entity === "projects") {
      if (uuid) {
        // Si se proporciona un uuid, devolver el proyecto específico
        const project = data.projects.find(
          (p) => parseInt(p.uuid) === parseInt(uuid)
        );
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
        console.log("GET /projects");
        console.log(data);
        // Si no se proporciona un uuid, devolver todos los proyectos
        return {
          statusCode: 200,
          body: JSON.stringify(data.projects),
        };
      }
    }
  } else if (httpMethod === "POST" && entity === "projects") {
    // POST a "/projects" para agregar un nuevo proyecto
    const newProject = JSON.parse(event.body);
    newProject.uuid = data.projects.length + 1; // Generar un nuevo ID
    data.projects.push(newProject);
    saveData(data); // Guardar en localStorage

    return {
      statusCode: 201,
      body: JSON.stringify(newProject),
    };
  } else if (httpMethod === "PUT" && entity === "projects" && uuid) {
    // PUT a "/projects/{uuid}" para actualizar un proyecto existente
    const updatedProject = JSON.parse(event.body);
    const projectIndex = data.projects.findIndex(
      (p) => parseInt(p.uuid) === parseInt(uuid)
    );

    if (projectIndex !== -1) {
      data.projects[projectIndex] = {
        ...data.projects[projectIndex],
        ...updatedProject,
      };
      saveData(data); // Guardar en localStorage

      return {
        statusCode: 200,
        body: JSON.stringify(data.projects[projectIndex]),
      };
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Project not found" }),
    };
  } else if (httpMethod === "DELETE" && entity === "projects" && uuid) {
    // DELETE a "/projects/{uuid}" para eliminar un proyecto
    const projectIndex = data.projects.findIndex(
      (p) => parseInt(p.uuid) === parseInt(uuid)
    );

    if (projectIndex !== -1) {
      const deletedProject = data.projects.splice(projectIndex, 1);
      saveData(data); // Guardar en localStorage

      return {
        statusCode: 200,
        body: JSON.stringify(deletedProject),
      };
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Project not found" }),
    };
  }

  return {
    statusCode: 404,
    body: JSON.stringify({ message: "Not Found" }),
  };
};
