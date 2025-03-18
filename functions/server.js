const https = require("https");

let projects = null;
const dbUrl = "https://mid-project-nacho.netlify.app/public/db.json";

// Cargar los proyectos desde db.json o localStorage
const loadData = async () => {
  if (projects) return JSON.parse(projects);

  try {
    const data = await readData();
    saveData(data);
    console.log("Datos cargados desde db.json");
    return data;
  } catch (error) {
    console.error("Error al cargar los datos:", error);
    return { projects: [] };
  }
};

// Leer los datos desde db.json
const readData = () => {
  return new Promise((resolve, reject) => {
    https
      .get(dbUrl, (response) => {
        let data = "";
        response.on("data", (chunk) => (data += chunk));
        response.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject("Error al parsear los datos JSON");
          }
        });
      })
      .on("error", (err) => reject(`Error: ${err.message}`));
  });
};

// Guardar los datos en localStorage
const saveData = (data) => {
  projects = JSON.stringify(data);
};

// Función principal para manejar las solicitudes
module.exports.handler = async (event) => {
  const { path, httpMethod } = event;
  const [_, __, entity, id] = path.split("/");

  let data = await loadData();

  if (httpMethod === "GET" && entity === "projects") {
    if (id) {
      const project = data.projects.find((p) => p.id === parseInt(id));
      return project
        ? { statusCode: 200, body: JSON.stringify(project) }
        : {
            statusCode: 404,
            body: JSON.stringify({ message: "Project not found" }),
          };
    }
    return { statusCode: 200, body: JSON.stringify(data.projects) };
  }

  if (httpMethod === "POST" && entity === "projects") {
    const newProject = JSON.parse(event.body);
    newProject.id = data.projects.length + 1;
    data.projects.push(newProject);
    saveData(data);
    return { statusCode: 201, body: JSON.stringify(newProject) };
  }

  if (httpMethod === "PUT" && entity === "projects" && id) {
    const updatedProject = JSON.parse(event.body);
    const projectIndex = data.projects.findIndex((p) => p.id === parseInt(id));

    if (projectIndex !== -1) {
      data.projects[projectIndex] = {
        ...data.projects[projectIndex],
        ...updatedProject,
      };
      saveData(data);
      return {
        statusCode: 200,
        body: JSON.stringify(data.projects[projectIndex]),
      };
    }
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Project not found" }),
    };
  }

  if (httpMethod === "DELETE" && entity === "projects" && id) {
    const projectIndex = data.projects.findIndex((p) => p.id === parseInt(id));

    if (projectIndex !== -1) {
      const deletedProject = data.projects.splice(projectIndex, 1);
      saveData(data);
      return { statusCode: 200, body: JSON.stringify(deletedProject) };
    }
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Project not found" }),
    };
  }

  return { statusCode: 404, body: JSON.stringify({ message: "Not Found" }) };
};
