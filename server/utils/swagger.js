const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Restaurant Subscription API",
      version: "1.0.0",
      description:
        "API for managing restaurant meal subscriptions, orders, and admin functionalities.",
    },
    servers: [{ url: "http://localhost:8080" }], // Update this with production URL when deployed
  },
  apis: ["./routes/*.js"], // Ensures it scans all route files
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
