import { bindCloseDialog, bindMenuToggle, fetchProjects, showAllProjects } from "./utils.js";

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
 * Bind all the events
 */
const _bindEvents = () => {
  _dialog = document.querySelector("dialog");
  _form = document.querySelector(".subscribe-form");

  bindCloseDialog();
  bindMenuToggle();
  bindSubscribeForm();
}

/**
 * Load the projects
 */
const _loadProjects = async () => {
  try {
    const { projects } = await fetchProjects();

    const projectsContainer = document.querySelector(".projects-list");

    showAllProjects(projectsContainer, projects);
  } catch (error) {
    console.error("Error loading projects:", error);
  }
};

window.onload = async () => {
  _bindEvents();
  await _loadProjects();
};
