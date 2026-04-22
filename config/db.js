const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdminUser = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Admin User';

  if (!email || !password) {
    console.warn('ADMIN_EMAIL or ADMIN_PASSWORD not set; skipping admin seed.');
    return;
  }

  try {
    let admin = await User.findOne({ email });
    if (admin) {
      if (admin.role !== 'admin' || !(await admin.comparePassword(password))) {
        admin.role = 'admin';
        admin.password = password;
        admin.name = name;
        await admin.save();
        console.log(`Default admin updated: ${email}`);
      } else {
        console.log(`Default admin already exists: ${email}`);
      }
      return;
    }

    await User.create({ name, email, password, role: 'admin' });
    console.log(`Default admin created: ${email}`);
  } catch (error) {
    console.error(`Admin seed error: ${error.message}`);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedAdminUser();
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
