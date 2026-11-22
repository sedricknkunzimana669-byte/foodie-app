const { resources, createResourceController } = require("./resourceController");

module.exports = createResourceController(resources.projects);