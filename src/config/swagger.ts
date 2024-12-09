import { SwaggerDefinition, Options } from "swagger-jsdoc";

const swaggerDefinition: SwaggerDefinition = {
  openapi: "3.1.0",
  info: {
    title: "Climbing Journal | API Documentation",
    version: "0.0.1",
    description: "Documentation for the Climbing Journal API.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const swaggerOptions: Options = {
  failOnErrors: true,
  definition: swaggerDefinition,
  apis: ["**/*.routes.ts"],
};

export default swaggerOptions;
