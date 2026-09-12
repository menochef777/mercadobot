import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import path from "path";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MercadoBot PDV API",
      version: "1.0.0",
      description: "API documentation for the MercadoBot PDV system",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
    tags: [
      { name: "Authentication", description: "Login and authentication routes" },
      { name: "Vendas", description: "Registro de vendas e fechamento do caixa diário" },
      { name: "Fiado", description: "Gerenciamento de fiado (caderneta / contas de clientes)" },
      { name: "Fornecedores", description: "Gerenciamento de fornecedores e visitas de reposição" },
      { name: "Estoque", description: "Alertas e gestão de estoque mínimo do mercadinho" },
      { name: "Files", description: "File management" },
      { name: "Users", description: "User management" },
      { name: "Products", description: "Product management" },
      { name: "Categories", description: "Category management" },
      { name: "Orders", description: "Order management" },
      { name: "Items", description: "Item management" },
      { name: "Roles", description: "Role management" },
      { name: "Permissions", description: "Permission management" },
      { name: "RolePermissions", description: "Role-Permission relationships" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Indica que o token é um JWT
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      }
    ],
  },
  apis: [path.join(__dirname, "./routers/**/*.ts")],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};