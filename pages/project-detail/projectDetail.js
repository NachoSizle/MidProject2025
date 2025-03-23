import { bindCloseDialog, bindMenuToggle, fetchProjects, showAllProjects } from "../../utils.js";

let _dialog;
let _form;

/**
 * Send the email to the dialog
 *
 * @param {string} email - The email to be displayed in the dialog
 */
const _sendData = (email) => {
  try {
    _dialog.querySelector('p:last-of-type').textContent = email;
    _dialog.showModal();
  } catch (error) {
    console.error('Error sending message:', error);
  } finally {
    _form.reset();
  }
}

/**
 * Bind the subscribe form to send the email
 */
const bindSubscribeForm = () => {
  _form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = _form.querySelector('input').value;

    try {
      _sendData(email);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });
};

/**
 * Load the recent projects in the project detail container
 *
 * @param {Object[]} relatedProjects - The projects related to the actual project
 * @returns 
 */
const _loadRecentProjects = (relatedProjects) => {
  if (!relatedProjects?.length) {
    return;
  }

  const projectsContainer = document.querySelector(".projects-list");

  showAllProjects(projectsContainer, relatedProjects);
};

/**
 * Show the actual project in the project detail container
 *
 * @param {Object} project - The actual project to be displayed
 * @param {Object[]} relatedProjects - The projects related to the actual project
 */
const _showActualProject = (project, relatedProjects) => {
  const {
    name,
    description,
    image,
    content,
    completed_on,
  } = project;

  const projectStructure = document.querySelector('#project-detail');
  const projectName = projectStructure.querySelector('h1');
  const projectDescription = projectStructure.querySelector('.project-category p:first-of-type');
  const projectCompletedOn = projectStructure.querySelector('.project-category p:last-of-type');
  const projectImages = projectStructure.querySelectorAll('.project-image img');
  const projectContent = projectStructure.querySelector('.project-content');
  
  projectName.textContent = name;
  projectDescription.textContent = description;
  projectCompletedOn.innerHTML = `<span>Completed on </span>${completed_on}`;
  projectImages.forEach(img => {
    img.src = image;
  });
  projectContent.innerHTML = content;

  
  _loadRecentProjects(relatedProjects);
}

/**
 * Bind all events
 */
const _bindEvents = () => {
  _dialog = document.querySelector("dialog");
  _form = document.querySelector(".subscribe-form");

  bindCloseDialog();
  bindMenuToggle();
  bindSubscribeForm();
}

/**
 * Fetch the actual project from the API and show it
 */
const _fetchActualProject = async () => {
  try {
    const projectId = new URLSearchParams(window.location.search).get(
      "projectId"
    );
    const { projects } = await fetchProjects();
    const actualProject = projects.find(
      (p) => p.uuid === parseInt(projectId)
    );

    if (actualProject) {
      const { related_projects } = actualProject;
      const relatedProjects = related_projects.map((uuid) =>
        projects.find((p) => p.uuid === uuid)
      );
      _showActualProject(actualProject, relatedProjects);
    }
  } catch (error) {
    console.error("Error loading project:", error);
  }
}

window.onload = () => {
  _bindEvents();

  _fetchActualProject();
};
