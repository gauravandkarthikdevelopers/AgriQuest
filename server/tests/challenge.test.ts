import request from 'supertest';
import express from 'express';
import { Challenge, Farmer, ChallengeCompletion } from '../src/models';
import challengeRoutes from '../src/routes/challengeRoutes';

const app = express();
app.use(express.json());
app.use('/challenges', challengeRoutes);

describe('Challenge Endpoints', () => {
  describe('GET /challenges', () => {
    beforeEach(async () => {
      await Challenge.create([
        {
          title: 'Test Challenge 1',
          description: 'Description 1',
          xpReward: 50,
          difficulty: 'easy',
          criteria: 'Test criteria 1',
        },
        {
          title: 'Test Challenge 2',
          description: 'Description 2',
          xpReward: 100,
          difficulty: 'medium',
          criteria: 'Test criteria 2',
        },
      ]);
    });

    it('should return list of challenges', async () => {
      const response = await request(app)
        .get('/challenges')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('challenges');
      expect(response.body.data).toHaveProperty('pagination');
      expect(response.body.data.challenges).toBeInstanceOf(Array);
      expect(response.body.data.challenges.length).toBe(2);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/challenges?limit=1&page=1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.challenges.length).toBe(1);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(1);
      expect(response.body.data.pagination.total).toBe(2);
    });
  });

  describe('POST /challenges/:id/complete', () => {
    let challengeId: string;
    let farmerId: string;

    beforeEach(async () => {
      const challenge = await Challenge.create({
        title: 'Test Challenge',
        description: 'Test Description',
        xpReward: 75,
        difficulty: 'medium',
        criteria: 'Test criteria',
      });
      challengeId = challenge._id.toString();

      const farmer = await Farmer.create({
        name: 'Test Farmer',
        village: 'Test Village',
        region: 'Test Region',
        xp: 100,
        ecoScore: 70,
      });
      farmerId = farmer._id.toString();
    });

    it('should complete challenge successfully', async () => {
      const response = await request(app)
        .post(`/challenges/${challengeId}/complete`)
        .send({
          farmerId,
          notes: 'Completed successfully',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('completion');
      expect(response.body.data).toHaveProperty('farmer');
      expect(response.body.data).toHaveProperty('xpGained', 75);

      // Verify farmer XP was updated
      const updatedFarmer = await Farmer.findById(farmerId);
      expect(updatedFarmer?.xp).toBe(175); // 100 + 75
    });

    it('should prevent duplicate completions', async () => {
      // Complete once
      await request(app)
        .post(`/challenges/${challengeId}/complete`)
        .send({ farmerId })
        .expect(200);

      // Try to complete again
      const response = await request(app)
        .post(`/challenges/${challengeId}/complete`)
        .send({ farmerId })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('already completed');
    });

    it('should return 404 for non-existent challenge', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .post(`/challenges/${nonExistentId}/complete`)
        .send({ farmerId })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });

    it('should return 404 for non-existent farmer', async () => {
      const nonExistentFarmerId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .post(`/challenges/${challengeId}/complete`)
        .send({ farmerId: nonExistentFarmerId })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });
  });

  describe('GET /challenges/farmer/:farmerId/completions', () => {
    let farmerId: string;
    let challengeId: string;

    beforeEach(async () => {
      const farmer = await Farmer.create({
        name: 'Test Farmer',
        village: 'Test Village',
        region: 'Test Region',
        xp: 100,
        ecoScore: 70,
      });
      farmerId = farmer._id.toString();

      const challenge = await Challenge.create({
        title: 'Test Challenge',
        description: 'Test Description',
        xpReward: 50,
        difficulty: 'easy',
        criteria: 'Test criteria',
      });
      challengeId = challenge._id.toString();

      await ChallengeCompletion.create({
        challengeId,
        farmerId,
        status: 'approved',
        xpAwarded: 50,
      });
    });

    it('should return farmer completions', async () => {
      const response = await request(app)
        .get(`/challenges/farmer/${farmerId}/completions`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('completions');
      expect(response.body.data.completions).toBeInstanceOf(Array);
      expect(response.body.data.completions.length).toBe(1);
      expect(response.body.data.completions[0]).toHaveProperty('challengeId');
      expect(response.body.data.completions[0]).toHaveProperty('xpAwarded', 50);
    });
  });
});
