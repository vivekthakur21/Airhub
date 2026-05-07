const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const dns = require('dns');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

// Set DNS servers to resolve MongoDB SRV issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminEmail = 'admin@example.com';
    
    // Delete existing admin if it exists to fix double-hashing
    await User.deleteOne({ email: adminEmail });

    await User.create({
      name: 'Admin User',
      email: adminEmail,
      password: 'admin123', // Let the model hook handle hashing
      role: 'admin',
    });
    console.log('Admin user created successfully!');

    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
