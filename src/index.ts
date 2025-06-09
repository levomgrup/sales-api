import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec, swaggerJson, swaggerYaml } from './swagger';
import routes from './routes';
import { manageAutomaticVisits } from './controllers/visitController';

dotenv.config();

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Swagger JSON ve YAML endpoint'leri
app.get('/api-docs/swagger.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerJson);
});

app.get('/api-docs/swagger.yaml', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/yaml');
  res.send(swaggerYaml);
});

// MongoDB bağlantısı
const MONGODB_URI = process.env.MONGODB_URI as string;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB Atlas\'a başarıyla bağlandı');
  })
  .catch((err) => {
    console.error('MongoDB bağlantı hatası:', err);
  });

// Ana route
app.get('/', (req: Request, res: Response) => {
  res.send('Sales Management API');
});

// Tüm route'ları /api prefix'i ile ekle
app.use('/api', routes);

// Her gün gece yarısı otomatik ziyaret yönetimini çalıştır
setInterval(async () => {
  const now = new Date();
  if (now.getHours() === 0 && now.getMinutes() === 0) {
    await manageAutomaticVisits();
  }
}, 60000); // Her dakika kontrol et

// Port dinleme
const PORT = process.env.PORT || 5000;
app.listen(PORT,0.0.0.0, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
  console.log(`API Dokümantasyonu: http://localhost:${PORT}/api-docs`);
  console.log(`Swagger JSON: http://localhost:${PORT}/api-docs/swagger.json`);
  console.log(`Swagger YAML: http://localhost:${PORT}/api-docs/swagger.yaml`);
}); 
