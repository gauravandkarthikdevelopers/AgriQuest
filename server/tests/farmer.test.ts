import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import farmerRoutes from '../src/routes/farmerRoutes';
import { Farmer } from '../src/models';

const app = express();
app.use(express.json());
app.use('/farmers', farmerRoutes);

describe('Farmer Endpoints', () => {
  describe('GET /farmers/demo', () => {
    it('should create and return demo farmer if not exists', async () => {
      const response = await request(app)
        .get('/farmers/demo')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('name', 'Demo Farmer');
      expect(response.body.data).toHaveProperty('village', 'Green Valley');
      expect(response.body.data).toHaveProperty('region', 'Maharashtra');
      expect(response.body.data).toHaveProperty('xp');
      expect(response.body.data).toHaveProperty('ecoScore');
      expect(response.body.data).toHaveProperty('badges');
    });

    it('should return existing demo farmer', async () => {
      // Create demo farmer first
      await request(app).get('/farmers/demo');

      // Request again
      const response = await request(app)
        .get('/farmers/demo')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Demo Farmer');
    });
  });

  describe('GET /farmers/leaderboard', () => {
    beforeEach(async () => {
      // Create test farmers
      await Farmer.create([
        { name: 'Farmer 1', village: 'Village A', region: 'Region 1', xp: 100, ecoScore: 80 },
        { name: 'Farmer 2', village: 'Village B', region: 'Region 1', xp: 200, ecoScore: 90 },
        { name: 'Farmer 3', village: 'Village A', region: 'Region 2', xp: 150, ecoScore: 85 },
      ]);
    });

    it('should return leaderboard with farmers sorted by XP', async () => {
      const response = await request(app)
        .get('/farmers/leaderboard')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      
      // Check sorting by XP (descending)
      const farmers = response.body.data;
      for (let i = 0; i < farmers.length - 1; i++) {
        expect(farmers[i].xp).toBeGreaterThanOrEqual(farmers[i + 1].xp);
      }
    });

    it('should filter by region', async () => {
      const response = await request(app)
        .get('/farmers/leaderboard?region=Region 1')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((entry: any) => {
        expect(entry.farmer.region).toBe('Region 1');
      });
    });

    it('should respect limit parameter', async () => {
      const response = await request(app)
        .get('/farmers/leaderboard?limit=2')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(2);
    });
  });

  describe('GET /farmers/:id', () => {
    let farmerId: string;

    beforeEach(async () => {
      const farmer = await Farmer.create({
        name: 'Test Farmer',
        village: 'Test Village',
        region: 'Test Region',
        xp: 100,
        ecoScore: 75,
      });
      farmerId = farmer._id.toString();
    });

    it('should return farmer by ID', async () => {
      const response = await request(app)
        .get(`/farmers/${farmerId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Test Farmer');
      expect(response.body.data._id).toBe(farmerId);
    });

    it('should return 404 for non-existent farmer', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .get(`/farmers/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });
  });

  describe('GET /farmers/regions', () => {
    beforeEach(async () => {
      await Farmer.create([
        { name: 'F1', village: 'V1', region: 'Maharashtra', xp: 0, ecoScore: 50 },
        { name: 'F2', village: 'V2', region: 'Gujarat', xp: 0, ecoScore: 50 },
        { name: 'F3', village: 'V3', region: 'Maharashtra', xp: 0, ecoScore: 50 },
      ]);
    });

    it('should return unique regions', async () => {
      const response = await request(app)
        .get('/farmers/regions')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data).toContain('Maharashtra');
      expect(response.body.data).toContain('Gujarat');
      expect(response.body.data.length).toBe(2);
    });
  });
});
