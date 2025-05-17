import swaggerJsDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import { Express } from "express"

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Suimail API",
      version: "1.0.0",
      description: "API documentation for Suimail Backend",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Path to the API routes
}

const swaggerDocs = swaggerJsDoc({
  ...swaggerOptions,
  apis: ["./src/routes/authRoutes.ts", "./src/routes/mailRoutes.ts"],
})

export const setupSwaggerDocs = (app: Express) => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))
  console.log("Swagger docs available at http://localhost:3000/docs")
}
