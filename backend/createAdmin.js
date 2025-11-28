const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load environment variables
dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB Atlas
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://zoronandha_db_user:eM4ya5hMhYd7F74d@cluster0.uuzxvbm.mongodb.net/parking-booking?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected to Atlas');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'khemasai413@gmail.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      
      // Update password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Hemasai123', salt);
      existingAdmin.password = hashedPassword;
      
      // Update to admin if not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
      }
      
      await existingAdmin.save();
      console.log('✅ Admin password updated successfully!');
      console.log('New Password: Hemasai123');
    } else {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Hemasai123', salt);

      // Create admin user
      const adminUser = new User({
        name: 'Khema Sai',
        email: 'khemasai413@gmail.com',
        password: hashedPassword,
        phone: '1234567890',
        role: 'admin'
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully!');
      console.log('Email: khemasai413@gmail.com');
      console.log('Password: Hemasai123');
      console.log('Role: admin');
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createAdminUser();
