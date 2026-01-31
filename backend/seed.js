const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const seedSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        const adminExists = await User.findOne({ username: 'admin@gmail.com' });

        if (adminExists) {
            console.log('Super Admin already exists. Updating password/name to ensure accuracy...');
            adminExists.name = 'Super Admin';
            const salt = await bcrypt.genSalt(10);
            adminExists.password = await bcrypt.hash('Admin@2026', salt);
            adminExists.role = 'SUPER_ADMIN';
            await adminExists.save();
            console.log('Super Admin updated successfully.');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('Admin@2026', salt);

            const superAdmin = new User({
                username: 'admin@gmail.com',
                password: hashedPassword,
                name: 'Super Admin',
                role: 'SUPER_ADMIN'
            });

            await superAdmin.save();
            console.log('Super Admin created successfully.');
        }

        process.exit();
    } catch (err) {
        console.error('Error seeding Super Admin:', err);
        process.exit(1);
    }
};

seedSuperAdmin();
