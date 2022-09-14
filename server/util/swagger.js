const swaggerAutogen = require("swagger-autogen")();

const outputFile = "../common/swagger_output.json";
const endpointsFiles = ["../api/products/product.router.ts"];

swaggerAutogen(outputFile, endpointsFiles);
