import { bindCloseDialog, bindMenuToggle } from "../../utils.js";

let _form;
let _dialog;

/**
 * Send the data to the dialog
 *
 * @param {Object} data - The data to be displayed in the dialog
 */
const _sendData = (data) => {
  try {
    const dataParsed = JSON.stringify(data, undefined, 2);

    _dialog.querySelector('p:last-of-type').textContent = dataParsed;
    _dialog.showModal();
  } catch (error) {
    console.error('Error sending message:', error);
  } finally {
    _form.reset();
  }
}

/**
 * Validate the contact form data
 *
 * @param {Object} data - The data to be validated
 * @returns {boolean} - If the form is valid
 */
const validateForm = (data) => {
  const nameInput = document.querySelector('input[name="name"]');
  const emailInput = document.querySelector('input[name="email"]');
  const phoneInput = document.querySelector('input[name="phone"]');
  const messageInput = document.querySelector('textarea[name="message"]');
  const { name, email, phone, message } = data;

  if (!name) {
    nameInput.focus();
    nameInput.classList.add('error');
  }

  if (!email) {
    emailInput.focus();
    emailInput.classList.add('error');
  }

  if (!phone || (phone.length < 9 || phone.length > 9)) {
    phoneInput.focus();
    phoneInput.classList.add('error');
    throw new Error('Invalid phone number');
  }

  if (!message) {
    messageInput.focus();
    messageInput.classList.add('error');
  }

  return true;
}

/**
 * Bind the contact form to send the data
 */
const bindContactForm = () => {
  _form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(_form);
    const data = Object.fromEntries(formData);

    try {
      if (validateForm(data)) {
        _sendData(data);
      }
    } catch (error) {
      alert(error.message);
      return;
    }
  });
}

/**
 * Bind the input events to remove the error class
 */
const bindInputEvents = () => {
  const inputs = document.querySelectorAll('input, textarea');

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
    });
  });
}

/**
 * Bind all events in the page
 */
const bindEvents = () => {
  bindCloseDialog();
  bindContactForm();
  bindInputEvents();
  bindMenuToggle();
}

window.onload = () => {
  _form = document.querySelector('form');
  _dialog = document.querySelector('dialog');

  bindEvents();
}