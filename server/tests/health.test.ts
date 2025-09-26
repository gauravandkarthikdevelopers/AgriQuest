import request from 'supertest';
import express from 'express';
import healthRoutes from '../src/routes/healthRoutes';

const app = express();
app.use(express.json());
app.use('/health', healthRoutes);

describe('Health Endpoints', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('status');
      expect(response.body.data).toHaveProperty('uptime');
      expect(response.body.data).toHaveProperty('services');
    });

    it('should include service status information', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.data.services).toHaveProperty('database');
      expect(response.body.data.services).toHaveProperty('geminiAPI');
    });
  });

  describe('GET /health/ready', () => {
    it('should return readiness status', async () => {
      const response = await request(app)
        .get('/health/ready');

      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('ready');
      expect(response.body.data).toHaveProperty('checks');
    });
  });

  describe('GET /health/info', () => {
    it('should return system information', async () => {
      const response = await request(app)
        .get('/health/info')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('node');
      expect(response.body.data).toHaveProperty('app');
      expect(response.body.data).toHaveProperty('database');
      expect(response.body.data).toHaveProperty('ai');
      expect(response.body.data).toHaveProperty('features');
    });
  });
});
