import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Farmer, Challenge, Mission } from '../src/models';
import logger from '../src/utils/logger';

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/agriquest';
    await mongoose.connect(mongoUri);
    logger.info('Connected to MongoDB for seeding');

    // Clear existing data
    await Promise.all([
      Farmer.deleteMany({}),
      Challenge.deleteMany({}),
      Mission.deleteMany({}),
    ]);
    logger.info('Cleared existing data');

    // Seed Farmers
    const farmers = await Farmer.insertMany([
      {
        name: 'Demo Farmer',
        village: 'Green Valley',
        region: 'Maharashtra',
        xp: 150,
        ecoScore: 75,
        badges: ['eco-newcomer', 'first-scan'],
      },
      {
        name: 'Rajesh Kumar',
        village: 'Sunrise Village',
        region: 'Maharashtra',
        xp: 450,
        ecoScore: 88,
        badges: ['eco-warrior', 'sustainability-champion', 'water-saver'],
      },
      {
        name: 'Priya Patel',
        village: 'Green Valley',
        region: 'Gujarat',
        xp: 320,
        ecoScore: 82,
        badges: ['eco-warrior', 'wise-farmer'],
      },
      {
        name: 'Amit Singh',
        village: 'Harmony Hills',
        region: 'Punjab',
        xp: 280,
        ecoScore: 79,
        badges: ['eco-warrior', 'soil-protector'],
      },
      {
        name: 'Sunita Devi',
        village: 'Sunrise Village',
        region: 'Rajasthan',
        xp: 380,
        ecoScore: 85,
        badges: ['eco-warrior', 'water-saver', 'eco-champion'],
      },
      {
        name: 'Vikram Reddy',
        village: 'Fertile Fields',
        region: 'Andhra Pradesh',
        xp: 520,
        ecoScore: 91,
        badges: ['sustainability-champion', 'green-master', 'water-saver'],
      },
      {
        name: 'Lakshmi Nair',
        village: 'Coconut Grove',
        region: 'Kerala',
        xp: 340,
        ecoScore: 83,
        badges: ['eco-warrior', 'wise-farmer', 'soil-protector'],
      },
      {
        name: 'Ravi Sharma',
        village: 'Golden Fields',
        region: 'Haryana',
        xp: 290,
        ecoScore: 77,
        badges: ['eco-warrior', 'first-scan'],
      },
      {
        name: 'Meera Joshi',
        village: 'Mountain View',
        region: 'Himachal Pradesh',
        xp: 410,
        ecoScore: 86,
        badges: ['eco-warrior', 'sustainability-champion', 'eco-champion'],
      },
      {
        name: 'Arjun Gupta',
        village: 'River Bend',
        region: 'Uttar Pradesh',
        xp: 250,
        ecoScore: 74,
        badges: ['eco-newcomer', 'wise-farmer'],
      },
    ]);

    logger.info(`Seeded ${farmers.length} farmers`);

    // Seed Challenges
    const challenges = await Challenge.insertMany([
      {
        title: '24-Hour Drip Irrigation Trial',
        description: 'Switch from flood irrigation to drip irrigation for one day and document water savings. Take before and after photos of your irrigation setup.',
        xpReward: 50,
        difficulty: 'easy',
        criteria: 'Photo proof of drip irrigation setup and water usage comparison',
        imageUrl: '/uploads/challenges/drip-irrigation.jpg',
      },
      {
        title: 'Organic Compost Application',
        description: 'Apply homemade organic compost to a section of your field instead of chemical fertilizers. Monitor plant growth over 2 weeks.',
        xpReward: 75,
        difficulty: 'medium',
        criteria: 'Before/after photos and growth measurement documentation',
        imageUrl: '/uploads/challenges/compost.jpg',
      },
      {
        title: 'Green Manure Patch Planting',
        description: 'Plant nitrogen-fixing crops like legumes in a 10x10 meter patch to naturally improve soil fertility.',
        xpReward: 100,
        difficulty: 'medium',
        criteria: 'Photo of planted area and soil test results if available',
        imageUrl: '/uploads/challenges/green-manure.jpg',
      },
      {
        title: 'Natural Pest Trap Deployment',
        description: 'Create and deploy natural pest traps using eco-friendly materials. Monitor effectiveness over 1 week.',
        xpReward: 60,
        difficulty: 'easy',
        criteria: 'Photos of traps and pest count documentation',
        imageUrl: '/uploads/challenges/pest-trap.jpg',
      },
      {
        title: 'Mulching Experiment',
        description: 'Apply organic mulch (straw, leaves, grass clippings) to crop rows to conserve moisture and suppress weeds.',
        xpReward: 40,
        difficulty: 'easy',
        criteria: 'Before and after photos showing mulch application',
        imageUrl: '/uploads/challenges/mulching.jpg',
      },
      {
        title: 'Rainwater Harvesting Setup',
        description: 'Install a simple rainwater collection system for irrigation. Document water collected over one month.',
        xpReward: 120,
        difficulty: 'hard',
        criteria: 'Photos of setup and water collection measurements',
        imageUrl: '/uploads/challenges/rainwater.jpg',
      },
      {
        title: 'Companion Planting Trial',
        description: 'Plant beneficial companion crops together (like tomatoes with basil, or corn with beans) to improve growth naturally.',
        xpReward: 80,
        difficulty: 'medium',
        criteria: 'Layout photo and growth comparison with non-companion plants',
        imageUrl: '/uploads/challenges/companion.jpg',
      },
      {
        title: 'Soil pH Testing & Natural Correction',
        description: 'Test your soil pH and use natural methods (lime, compost, etc.) to adjust if needed. Retest after 2 weeks.',
        xpReward: 90,
        difficulty: 'medium',
        criteria: 'pH test results before and after treatment',
        imageUrl: '/uploads/challenges/soil-ph.jpg',
      },
      {
        title: 'Beneficial Insect Habitat Creation',
        description: 'Create habitat for beneficial insects by planting native flowers or building insect hotels.',
        xpReward: 70,
        difficulty: 'medium',
        criteria: 'Photos of habitat and any beneficial insects observed',
        imageUrl: '/uploads/challenges/insect-habitat.jpg',
      },
      {
        title: 'Zero-Waste Farming Day',
        description: 'Spend one full day farming with zero waste - compost all organic matter, reuse materials, minimize packaging.',
        xpReward: 110,
        difficulty: 'hard',
        criteria: 'Documentation of waste reduction activities and results',
        imageUrl: '/uploads/challenges/zero-waste.jpg',
      },
    ]);

    logger.info(`Seeded ${challenges.length} challenges`);

    // Seed Missions
    const missions = await Mission.insertMany([
      {
        title: 'The Fertilizer Dilemma',
        xpReward: 150,
        nodes: [
          {
            text: 'Your crops are showing slow growth. A fellow farmer suggests using chemical fertilizers for faster results, but you know organic methods are better for long-term soil health. What do you choose?',
            choices: [
              {
                text: 'Use chemical fertilizers for quick results',
                scoreImpact: -5,
                desc: 'Short-term gains but potential soil damage and chemical dependency',
              },
              {
                text: 'Apply organic compost and be patient',
                scoreImpact: 10,
                desc: 'Slower initial growth but healthier soil and sustainable practices',
              },
              {
                text: 'Mix both chemical and organic fertilizers',
                scoreImpact: 2,
                desc: 'Compromise approach with moderate sustainability impact',
              },
            ],
          },
          {
            text: 'After your fertilizer choice, you notice your neighbor is struggling with similar issues. How do you help?',
            choices: [
              {
                text: 'Share your organic composting knowledge',
                scoreImpact: 8,
                desc: 'Spread sustainable practices in your community',
              },
              {
                text: 'Recommend the local chemical supplier',
                scoreImpact: -3,
                desc: 'Perpetuate unsustainable farming practices',
              },
              {
                text: 'Suggest consulting an agricultural expert',
                scoreImpact: 5,
                desc: 'Promote professional guidance and learning',
              },
            ],
          },
          {
            text: 'Your harvest results are in. How do you evaluate your farming approach for next season?',
            choices: [
              {
                text: 'Analyze soil health and plan improvements',
                scoreImpact: 12,
                desc: 'Focus on long-term sustainability and soil health',
              },
              {
                text: 'Only look at yield numbers',
                scoreImpact: -2,
                desc: 'Short-sighted approach ignoring environmental impact',
              },
              {
                text: 'Consider both yield and environmental impact',
                scoreImpact: 8,
                desc: 'Balanced approach to sustainable farming',
              },
            ],
          },
        ],
      },
      {
        title: 'Water Crisis Challenge',
        xpReward: 200,
        nodes: [
          {
            text: 'The monsoon is late this year, and water is becoming scarce. Your crops need irrigation urgently. What water management strategy do you implement?',
            choices: [
              {
                text: 'Install drip irrigation system',
                scoreImpact: 15,
                desc: 'Highly efficient water use with minimal waste',
              },
              {
                text: 'Continue flood irrigation as usual',
                scoreImpact: -8,
                desc: 'Wasteful water use during scarcity',
              },
              {
                text: 'Use sprinkler irrigation',
                scoreImpact: 5,
                desc: 'Moderate water efficiency improvement',
              },
            ],
          },
          {
            text: 'You discover a way to collect and store rainwater. What do you do?',
            choices: [
              {
                text: 'Build rainwater harvesting system',
                scoreImpact: 12,
                desc: 'Sustainable water conservation for future use',
              },
              {
                text: 'Ignore it and rely on groundwater',
                scoreImpact: -5,
                desc: 'Miss opportunity for sustainable water management',
              },
              {
                text: 'Share the idea with other farmers first',
                scoreImpact: 10,
                desc: 'Community-focused approach to water conservation',
              },
            ],
          },
          {
            text: 'Local authorities offer subsidies for water-efficient farming equipment. How do you respond?',
            choices: [
              {
                text: 'Apply immediately and upgrade equipment',
                scoreImpact: 10,
                desc: 'Take advantage of sustainability incentives',
              },
              {
                text: 'Stick with traditional methods',
                scoreImpact: -3,
                desc: 'Resist modernization and efficiency improvements',
              },
              {
                text: 'Research and help neighbors apply too',
                scoreImpact: 15,
                desc: 'Maximize community benefit from sustainability programs',
              },
            ],
          },
        ],
      },
      {
        title: 'Pest Invasion',
        xpReward: 180,
        nodes: [
          {
            text: 'A pest outbreak threatens your crops. The agricultural store offers powerful chemical pesticides, but you know about natural alternatives. What do you choose?',
            choices: [
              {
                text: 'Use chemical pesticides immediately',
                scoreImpact: -10,
                desc: 'Quick fix but harmful to beneficial insects and soil',
              },
              {
                text: 'Try natural pest control methods',
                scoreImpact: 12,
                desc: 'Eco-friendly approach protecting beneficial organisms',
              },
              {
                text: 'Consult with organic farming experts',
                scoreImpact: 8,
                desc: 'Seek expert guidance for sustainable solutions',
              },
            ],
          },
          {
            text: 'Your natural pest control is working slowly. Neighbors pressure you to use chemicals for faster results. How do you respond?',
            choices: [
              {
                text: 'Give in to pressure and use chemicals',
                scoreImpact: -8,
                desc: 'Abandon sustainable practices under social pressure',
              },
              {
                text: 'Stay committed to natural methods',
                scoreImpact: 15,
                desc: 'Strong commitment to sustainable farming principles',
              },
              {
                text: 'Educate neighbors about natural alternatives',
                scoreImpact: 18,
                desc: 'Lead by example and spread sustainable practices',
              },
            ],
          },
          {
            text: 'The pest problem is resolved. How do you prevent future outbreaks?',
            choices: [
              {
                text: 'Plant diverse crops to create natural balance',
                scoreImpact: 14,
                desc: 'Biodiversity approach to pest management',
              },
              {
                text: 'Schedule regular chemical treatments',
                scoreImpact: -6,
                desc: 'Preventive chemical use with environmental impact',
              },
              {
                text: 'Create habitat for beneficial predator insects',
                scoreImpact: 16,
                desc: 'Natural ecosystem approach to pest control',
              },
            ],
          },
        ],
      },
      {
        title: 'Soil Health Crisis',
        xpReward: 160,
        nodes: [
          {
            text: 'Soil tests reveal your land has low fertility and poor structure. What long-term strategy do you implement?',
            choices: [
              {
                text: 'Start intensive composting program',
                scoreImpact: 12,
                desc: 'Build soil organic matter naturally',
              },
              {
                text: 'Apply synthetic fertilizers heavily',
                scoreImpact: -7,
                desc: 'Quick fix that may worsen soil structure',
              },
              {
                text: 'Implement crop rotation with legumes',
                scoreImpact: 15,
                desc: 'Natural nitrogen fixation and soil improvement',
              },
            ],
          },
          {
            text: 'You learn about cover crops that can improve soil health during fallow periods. What do you do?',
            choices: [
              {
                text: 'Plant nitrogen-fixing cover crops',
                scoreImpact: 14,
                desc: 'Improve soil fertility naturally during off-season',
              },
              {
                text: 'Leave fields bare to save on seed costs',
                scoreImpact: -5,
                desc: 'Miss opportunity for soil improvement and erosion control',
              },
              {
                text: 'Research best cover crops for your region',
                scoreImpact: 10,
                desc: 'Scientific approach to soil improvement',
              },
            ],
          },
        ],
      },
      {
        title: 'Market Pressure vs. Sustainability',
        xpReward: 220,
        nodes: [
          {
            text: 'Buyers offer premium prices for conventionally grown produce but lower prices for organic. Your organic certification is pending. What do you choose?',
            choices: [
              {
                text: 'Switch back to conventional for better prices',
                scoreImpact: -12,
                desc: 'Prioritize short-term profits over sustainability',
              },
              {
                text: 'Continue organic practices despite lower prices',
                scoreImpact: 16,
                desc: 'Long-term commitment to sustainable farming',
              },
              {
                text: 'Find direct-to-consumer organic markets',
                scoreImpact: 18,
                desc: 'Innovation in sustainable market channels',
              },
            ],
          },
          {
            text: 'A large corporation offers to contract your entire production if you use their chemical inputs. How do you respond?',
            choices: [
              {
                text: 'Accept the contract for financial security',
                scoreImpact: -10,
                desc: 'Compromise sustainability for guaranteed income',
              },
              {
                text: 'Negotiate for organic input allowances',
                scoreImpact: 8,
                desc: 'Try to balance business needs with sustainability',
              },
              {
                text: 'Decline and focus on sustainable partnerships',
                scoreImpact: 14,
                desc: 'Prioritize values over short-term financial gain',
              },
            ],
          },
        ],
      },
      {
        title: 'Climate Adaptation Challenge',
        xpReward: 190,
        nodes: [
          {
            text: 'Changing weather patterns are affecting your traditional farming schedule. How do you adapt?',
            choices: [
              {
                text: 'Research climate-resilient crop varieties',
                scoreImpact: 15,
                desc: 'Proactive adaptation to climate change',
              },
              {
                text: 'Stick to traditional varieties and hope for the best',
                scoreImpact: -5,
                desc: 'Resistance to necessary adaptation',
              },
              {
                text: 'Diversify crops to spread climate risk',
                scoreImpact: 12,
                desc: 'Smart risk management through diversification',
              },
            ],
          },
          {
            text: 'Extreme weather events are becoming more frequent. What infrastructure do you prioritize?',
            choices: [
              {
                text: 'Build storm-resistant structures',
                scoreImpact: 8,
                desc: 'Prepare for extreme weather resilience',
              },
              {
                text: 'Invest in water storage and drainage',
                scoreImpact: 14,
                desc: 'Focus on water management for climate adaptation',
              },
              {
                text: 'Do minimal preparation to save costs',
                scoreImpact: -8,
                desc: 'Short-sighted approach to climate risks',
              },
            ],
          },
        ],
      },
    ]);

    logger.info(`Seeded ${missions.length} missions`);

    logger.info('✅ Database seeding completed successfully!');
    logger.info(`📊 Summary:`);
    logger.info(`   - ${farmers.length} farmers created`);
    logger.info(`   - ${challenges.length} challenges created`);
    logger.info(`   - ${missions.length} missions created`);

  } catch (error) {
    logger.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedData();
