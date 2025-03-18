const fs = require("fs");
const path = require("path");

// Ruta del archivo JSON existente
const dbPath = path.join(__dirname, "/db.json");

// Leer los datos desde db.json
const readData = () => {
  try {
    if (!fs.existsSync(dbPath)) {
      // Si el archivo no existe, crear uno nuevo con una estructura básica
      const initialData = { projects: [] };
      fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2)); // Crear el archivo db.json
      return initialData;
    }

    const data = fs.readFileSync(dbPath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error al leer db.json", err);
    return { projects: [] }; // Si ocurre un error, devuelve una base vacía
  }
};

// Guardar los datos en db.json
const writeData = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error escribiendo en db.json", err);
  }
};

module.exports.handler = async (event) => {
  const { path, httpMethod } = event;
  const parts = path.split("/"); // Separar las partes de la URL (ej. /api/projects/1)

  // Leer datos desde el archivo JSON
  const data = readData();

  if (httpMethod === "GET") {
    // Si es un GET a "/projects" o "/projects/{id}"
    if (parts[2] === "projects") {
      if (parts[3]) {
        // Si se proporciona un id, devolver el proyecto específico
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
        // Si no se proporciona un id, devolver todos los proyectos
        return {
          statusCode: 200,
          body: JSON.stringify(data.projects),
        };
      }
    }
  } else if (httpMethod === "POST" && parts[2] === "projects") {
    // Si es un POST a "/projects", agregar un nuevo proyecto
    const newProject = JSON.parse(event.body);
    newProject.id = data.projects.length + 1; // Generar un nuevo ID
    data.projects.push(newProject);
    writeData(data); // Guardar en db.json

    return {
      statusCode: 201,
      body: JSON.stringify(newProject),
    };
  } else if (httpMethod === "PUT" && parts[2] === "projects" && parts[3]) {
    // Si es un PUT a "/projects/{id}", actualizar un proyecto existente
    const updatedProject = JSON.parse(event.body);
    const projectIndex = data.projects.findIndex(
      (p) => p.id === parseInt(parts[3])
    );

    if (projectIndex !== -1) {
      data.projects[projectIndex] = {
        ...data.projects[projectIndex],
        ...updatedProject,
      };
      writeData(data); // Guardar en db.json

      return {
        statusCode: 200,
        body: JSON.stringify(data.projects[projectIndex]),
      };
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Project not found" }),
    };
  } else if (httpMethod === "DELETE" && parts[2] === "projects" && parts[3]) {
    // Si es un DELETE a "/projects/{id}", eliminar un proyecto
    const projectIndex = data.projects.findIndex(
      (p) => p.id === parseInt(parts[3])
    );

    if (projectIndex !== -1) {
      const deletedProject = data.projects.splice(projectIndex, 1);
      writeData(data); // Guardar en db.json

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
