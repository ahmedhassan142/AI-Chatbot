// scripts/create-admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://ah770643:2H3IHP4cvAsXzhW8@cluster0.bdbqw.mongodb.net/AI-Chatbot?retryWrites=true&w=majority&appName=Cluster0";

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env.local');
  console.log('Please add MONGODB_URI to your .env.local file');
  process.exit(1);
}

// Define User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  emailVerified: { type: Date, default: null },
  verificationToken: { type: String, default: null },
  verificationTokenExpires: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log('URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//****:****@')); // Hide password
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Admin user details - CHANGE THESE!
    const adminData = {
      name: 'Super Admin',
      email: 'admin@erpsystem.com',
      password: 'Admin@123456', // CHANGE THIS PASSWORD!
      role: 'admin',
      emailVerified: new Date(),
    };

    // Check if user already exists
    const existingUser = await User.findOne({ email: adminData.email });
    
    if (existingUser) {
      console.log(`\n⚠️ User with email ${adminData.email} already exists`);
      
      if (existingUser.role !== 'admin') {
        // Update to admin
        existingUser.role = 'admin';
        existingUser.emailVerified = new Date();
        await existingUser.save();
        console.log('✅ User has been updated to ADMIN role');
      } else {
        console.log('✅ User is already an ADMIN');
      }
      
      console.log('\n📋 User Details:');
      console.log('   Name:', existingUser.name);
      console.log('   Email:', existingUser.email);
      console.log('   Role:', existingUser.role);
      console.log('   Verified:', existingUser.emailVerified ? 'Yes' : 'No');
      
    } else {
      // Create new admin
      const hashedPassword = await bcrypt.hash(adminData.password, 12);
      
      const newAdmin = new User({
        ...adminData,
        password: hashedPassword,
      });
      
      await newAdmin.save();
      
      console.log('\n✅✅✅ ADMIN USER CREATED SUCCESSFULLY! ✅✅✅');
      console.log('========================================');
      console.log('📧 Email:', adminData.email);
      console.log('🔑 Password:', adminData.password);
      console.log('👤 Role: ADMIN');
      console.log('✅ Status: Verified');
      console.log('========================================');
      console.log('\n⚠️  IMPORTANT: Save these credentials and delete this console log!');
      console.log('⚠️  Change this password after first login!\n');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.message.includes('authentication failed')) {
      console.log('\n💡 Tip: Check your MongoDB username and password in .env.local');
    } else if (error.message.includes('getaddrinfo')) {
      console.log('\n💡 Tip: Check your MongoDB cluster URL in .env.local');
    }
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the function
createAdmin();