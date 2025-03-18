const jsonServerless = require("json-serverless");

// Definir tus datos en memoria (puedes usar un archivo JSON también)
const data = {
  projects: [
    { id: 1, name: "Proyecto 1" },
    { id: 2, name: "Proyecto 2" },
  ],
};

module.exports.handler = jsonServerless(data);
