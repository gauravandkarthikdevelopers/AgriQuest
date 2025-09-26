// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

db = db.getSiblingDB('agriquest');

// Create collections with validation
db.createCollection('farmers', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'village', 'region'],
      properties: {
        name: { bsonType: 'string', maxLength: 100 },
        village: { bsonType: 'string', maxLength: 100 },
        region: { bsonType: 'string', maxLength: 100 },
        xp: { bsonType: 'number', minimum: 0 },
        ecoScore: { bsonType: 'number', minimum: 0, maximum: 100 },
        badges: { bsonType: 'array', items: { bsonType: 'string' } }
      }
    }
  }
});

db.createCollection('challenges', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'description', 'xpReward', 'difficulty', 'criteria'],
      properties: {
        title: { bsonType: 'string', maxLength: 200 },
        description: { bsonType: 'string', maxLength: 1000 },
        xpReward: { bsonType: 'number', minimum: 1, maximum: 1000 },
        difficulty: { enum: ['easy', 'medium', 'hard'] },
        criteria: { bsonType: 'string', maxLength: 500 }
      }
    }
  }
});

db.createCollection('missions', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'nodes', 'xpReward'],
      properties: {
        title: { bsonType: 'string', maxLength: 200 },
        xpReward: { bsonType: 'number', minimum: 10, maximum: 500 },
        nodes: { bsonType: 'array', minItems: 1 }
      }
    }
  }
});

db.createCollection('cropscans');
db.createCollection('challengecompletions');

// Create indexes for better performance
db.farmers.createIndex({ 'region': 1, 'village': 1 });
db.farmers.createIndex({ 'xp': -1 });
db.farmers.createIndex({ 'ecoScore': -1 });

db.challenges.createIndex({ 'difficulty': 1 });
db.challenges.createIndex({ 'xpReward': -1 });
db.challenges.createIndex({ 'createdAt': -1 });

db.missions.createIndex({ 'xpReward': -1 });
db.missions.createIndex({ 'createdAt': -1 });

db.cropscans.createIndex({ 'farmerId': 1, 'createdAt': -1 });
db.cropscans.createIndex({ 'ecoScore': -1 });
db.cropscans.createIndex({ 'source': 1 });

db.challengecompletions.createIndex({ 'farmerId': 1, 'challengeId': 1 }, { unique: true });
db.challengecompletions.createIndex({ 'status': 1 });
db.challengecompletions.createIndex({ 'createdAt': -1 });

print('✅ AgriQuest database initialized successfully!');
