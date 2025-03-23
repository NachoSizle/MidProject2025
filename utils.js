/**
 * Bind close dialog
 */
export const bindCloseDialog = () => {
  const dialog = document.querySelector("dialog");
  const dialogClose = dialog.querySelector(".close");

  dialogClose.addEventListener("click", () => {
    dialog.close();
  });
}

/**
 * Bind the menu toggle button to open/close the menu
 */
export const bindMenuToggle = () => {
  const header = document.querySelector("body > header");
  const nav = header.querySelector("nav");
  const menuToggle = document.querySelector(".menu-toggle");

  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("opened");
    header.classList.toggle("menu-opened");
  });

  nav.addEventListener("click", () => {
    menuToggle.classList.remove("opened");
    header.classList.remove("menu-opened");
  });
};

/**
 * Fetch projects from the API or fallback to local JSON
 *
 * @returns {Promise<Object[]>} - The projects fetched from the API
 * @throws {Error} - If there's an error fetching the projects
 */
export const fetchProjects = async () => {
  try {
    const projectsRes = await fetch(
      "https://mid-project-nacho.netlify.app/api/projects"
    );
    return await projectsRes.json();
  } catch (error) {
    console.error("Error fetching projects:", error);
    const projectsRes = await fetch("/public/db.json");
    return await projectsRes.json();
  }
};

/**
 * Show all projects in the projects container
 *
 * @param {Node} projectsContainer - The container where the projects will be displayed
 * @param {Object{}} projects - The projects to be displayed
 */
export const showAllProjects = (projectsContainer, projects) => {
  if (!projectsContainer) {
    return;
  }

  projectsContainer.innerHTML = projects
    .sort((a, b) => a.uuid - b.uuid)
    .map(
      (project) => `
    <article class="basic-shadow">
      <img src="${project.image}" alt="${project.title}" />
      <div class="project-container">
        <div class="project-content">
          <h4>${project.name}</h4>
          <p>${project.description}</p>
        </div>
        <a href="/pages/project-detail/projectDetail.html?projectId=${project.uuid}">Learn More</a>
      </div>
    </article>
  `
    )
    .join("");
};
