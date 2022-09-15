const swaggerAutogen = require("swagger-autogen")();

const outputFile = "../common/swagger_output.json";
const endpointsFiles = ["../dist/server/index.js"];

swaggerAutogen(outputFile, endpointsFiles);
