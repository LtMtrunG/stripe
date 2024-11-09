require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const mockData = require('./mock-data/mock-data'); 

// Import Models
const User = require('../module/user/user');
const Charity = require('../module/charity/charity');
const Donor = require('../module/donor/donor');
const Project = require('../module/project/project');

const buckets = [
  'charity-resources',
  'donor-resources',
];

// Connect to the DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    const db = mongoose.connection.db;
    console.log('Creating collections for buckets...');
    
    for (const bucket of buckets) {
      console.log(`> Creating bucket: ${bucket}`);
      await db.createCollection(`${bucket}.chunks`);
      await db.createCollection(`${bucket}.files`);
    }

    console.log("Init mock data...");
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Initialize Data
const initializeData = async () => {
  try {
    console.log('Resetting Database & Populating initial data...');

    // Reset DB
    await User.deleteMany();
    await Charity.deleteMany();
    await Donor.deleteMany();
    await Project.deleteMany();

    // Create ADMIN
    const admin = new User({
      email: mockData.admin.email,
      password: await bcrypt.hash(mockData.admin.password, 10),
      role: mockData.admin.role,
      isVerified: true,
    });
    await admin.save();

    // Create CHARITY organization accounts
    const charityDocs = await Promise.all(
      mockData.charities.map(async (charity) => {
        const charityUser = new User({
          email: `${charity.companyName.replace(' ', '').toLowerCase()}@charitan.com`,
          password: await bcrypt.hash('charitypassword', 10),
          role: 'Charity', 
          isVerified: true,
        });
        await charityUser.save();

        return new Charity({
          user: charityUser._id,
          companyName: charity.companyName,
          address: `${charity.companyName} Address`,
          taxCode: `TAX${Math.floor(Math.random() * 10000)}`,
          type: charity.type,
        }).save();
      })
    );
    // Create 30 DONORS
    const donors = [];

      for (let i = 0; i < 1; i++) {
        const donorUser = new User({
          email: `donor${i}@gmail.com`,
          password: await bcrypt.hash('donorpassword', 10),
          role: 'Donor', 
          isVerified: true,
        });
        await donorUser.save();
        const donor = new Donor({
          user: donorUser._id,
          firstName: `First${i}`,
          lastName: `Last${i}`,
          address: `$Address ${i}`,
        });
        donors.push(await donor.save());
    }

    // Create Global Crisis CHARITY PROJECTS
    const globalProjects = mockData.globalProjects.map((project) => {
      const charity = charityDocs.find(c => c.companyName === project.charityCompanyName);
      return {
        title: project.title,
        description: project.description,
        duration: project.duration,
        goalAmount: project.goalAmount,
        charity: charity._id,
      
        status: 'pending',
      };
    });

    await Project.insertMany(globalProjects);

    // Create Local CHARITY PROJECTS
    const localProjects = mockData.localProjects.map((project) => {
      const charity = charityDocs.find(c => c.companyName === project.charityCompanyName);
      return {
        title: project.title,
        description: project.description,
        duration: project.duration,
        goalAmount: project.goalAmount,
        charity: charity._id,
        status: 'pending',
      };
    });

    await Project.insertMany(localProjects);

    console.log('Initial data population complete.');
  } catch (error) {
    console.error('Error initializing data:', error);
  } finally {
    // mongoose.connection.close();
  }
};

module.exports = { connectDB, initializeData };



