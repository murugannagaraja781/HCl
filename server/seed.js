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

    } catch (err) {
        console.error('Error seeding Super Admin:', err);
        process.exit(1);
    }
};

const seedCards = async () => {
    try {
        const CreditCard = require('./models/CreditCard');
        const cards = [
            {
                cardName: "HCL Signature Card",
                cardType: "Visa",
                benefits: ["5% Cashback on Travel", "Lounge Access", "No Joining Fee"],
                annualFee: 0,
                description: "Premium rewards for frequent travelers.",
                imageUrl: "https://images.unsplash.com/photo-1540331547168-8b63109225b7?auto=format&fit=crop&q=80&w=400"
            },
            {
                cardName: "HCL Gold Plus",
                cardType: "Mastercard",
                benefits: ["2% Dining Rewards", "Global Acceptance"],
                annualFee: 1500,
                description: "The classic card for everyday spend.",
                imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=400"
            }
        ];

        await CreditCard.deleteMany({});
        await CreditCard.insertMany(cards);
        console.log('Credit cards seeded successfully.');
    } catch (err) {
        console.error('Error seeding cards:', err);
    }
};

const runSeeds = async () => {
    await seedSuperAdmin();
    await seedCards();
    process.exit();
}

runSeeds();
