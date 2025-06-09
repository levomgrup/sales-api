import swaggerJsdoc from 'swagger-jsdoc';
import yaml from 'js-yaml';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sales Management API',
      version: '1.0.0',
      description: 'Satış yönetimi için RESTful API',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Geliştirme sunucusu',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'], // Tüm route ve model dosyalarını tara
};

export const swaggerSpec = swaggerJsdoc(options);

// JSON ve YAML formatlarını dışa aktar
export const swaggerJson = JSON.stringify(swaggerSpec, null, 2);
export const swaggerYaml = yaml.dump(swaggerSpec); 