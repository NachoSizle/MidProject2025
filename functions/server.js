let DEFAULT_DATA = {
  projects: [
    {
      uuid: "4",
      name: "Lorem ipsum",
      description: "Lorem ipsum",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      image:
        "https://github.com/ironhack-jc/mid-term-api/blob/main/4.jpg?raw=true",
      completed_on: "June 10, 2021",
    },
    {
      uuid: "3",
      name: "Vectorify",
      description: "User Experience Design",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      image:
        "https://github.com/ironhack-jc/mid-term-api/blob/main/3.jpg?raw=true",
      completed_on: "June 10, 2021",
    },
    {
      uuid: "2",
      name: "Dashcoin",
      description: "Web Development",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      image:
        "https://github.com/ironhack-jc/mid-term-api/blob/main/2.jpg?raw=true",
      completed_on: "June 10, 2021",
    },
    {
      uuid: "1",
      name: "Simplify",
      description: "UI Design & App Development",
      content:
        "Aliqua id fugiat nostrud irure ex duis ea quis id quis ad et! Sunt qui esse pariatur duis deserunt mollit dolore cillum minim tempor enim. Elit aute irure tempor cupidatat incididunt sint deserunt ut voluptate aute id deserunt nisi. Aliqua id fugiat nostrud irure ex duis ea quis id quis ad et. Sunt qui esse pariatur duis deserunt mollit dolore cillum minim tempor enim. Elit aute irure tempor cupidatat incididunt sint deserunt ut voluptate aute id deserunt nisi.Aliqua id fugiat nostrud irure ex duis ea quis id quis ad et. Sunt quix duis ea quis id quis ad et. Sunt qui esse pariatur duis deserunt mollit dolore cillum minim tempor enim. Elit aute irure tempor cupidatat incididunt sint deserunt ut voluptate aute id deserunt nisi.<br><br>Aliqua id fugiat nostrud irure ex duis ea quis id quis ad et. Sunt qui esse pariatur duis deserunt mollit dolore cillum minim tempor enim. Elit aute irure tempor cupidatat incididunt sint deserunt ut voluptate aute id deserunt nisi.Aliqua id fugiat nostrud irure ex duis ea quis id quis ad e dolore cillum minim tempor enim. Elit aute irure tempor cupidatat incididunt sint deserunt ut voluptate aute id deserunt nisis ea quis id quis ad et. Sunt qui esse pariatur duis deserunt mollit dolore cillum minim tempor enim. Elit aute irure tempor cupidatat incididunt sint deserunt ut voluptate aute id deserunt nisi.Aliqua id fugiat nostrud irure ex duis ea quis id quis ad e dolore cillum minim tempor enim. Elit aute irure tempor cupidatat incididunt sint deserunt ut voluptate aute id deserunt nis cillum minim tempor enim.",
      image:
        "https://github.com/ironhack-jc/mid-term-api/blob/main/1.jpg?raw=true",
      completed_on: "June 22, 2021",
    },
  ],
};

// Guardar los datos en localStorage
const saveData = (data) => {
  DEFAULT_DATA = data;
};

// Función principal para manejar las solicitudes
module.exports.handler = (event) => {
  const { path, httpMethod } = event;
  const [_, __, entity, id] = path.split("/");

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

    console.log("GET projects");
    console.log(DEFAULT_DATA.projects);
    return { statusCode: 200, body: JSON.stringify(DEFAULT_DATA.projects) };
  }

  if (httpMethod === "POST" && entity === "projects") {
    const newProject = JSON.parse(event.body);
    newProject.id = DEFAULT_DATA.projects.length + 1;
    DEFAULT_DATA.projects.push(newProject);
    saveData(DEFAULT_DATA);
    return { statusCode: 201, body: JSON.stringify(newProject) };
  }

  if (httpMethod === "PUT" && entity === "projects" && id) {
    const updatedProject = JSON.parse(event.body);
    const projectIndex = DEFAULT_DATA.projects.findIndex(
      (p) => p.id === parseInt(id)
    );

    if (projectIndex !== -1) {
      DEFAULT_DATA.projects[projectIndex] = {
        ...DEFAULT_DATA.projects[projectIndex],
        ...updatedProject,
      };
      saveData(DEFAULT_DATA);
      return {
        statusCode: 200,
        body: JSON.stringify(DEFAULT_DATA.projects[projectIndex]),
      };
    }
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Project not found" }),
    };
  }

  if (httpMethod === "DELETE" && entity === "projects" && id) {
    const projectIndex = DEFAULT_DATA.projects.findIndex(
      (p) => p.id === parseInt(id)
    );

    if (projectIndex !== -1) {
      const deletedProject = DEFAULT_DATA.projects.splice(projectIndex, 1);
      saveData(DEFAULT_DATA);
      return { statusCode: 200, body: JSON.stringify(deletedProject) };
    }
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Project not found" }),
    };
  }

  return { statusCode: 404, body: JSON.stringify({ message: "Not Found" }) };
};
