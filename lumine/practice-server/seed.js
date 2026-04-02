const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Account = require('./models/Account');

dotenv.config();

const accounts = [
    {
        title: "Starter Account Asia",
        price: 150,
        denomination: 33500,
        wishes: 10,
        primogems: 33500,
        server: "Asia",
        stock: 5,
        credentials: ["user1:pass1", "user2:pass2"],
        description: "Great starter account with lots of primogems.",
        status: 'active'
    },
    {
        title: "Europe Mid-Game",
        price: 300,
        denomination: 47000,
        wishes: 25,
        primogems: 47000,
        server: "Europe",
        stock: 2,
        credentials: ["eu1:pass1", "eu2:pass2"],
        description: "Ready for pulling standard banner.",
        status: 'active'
    },
    {
        title: "America Whale Starter",
        price: 500,
        denomination: 60000,
        wishes: 50,
        primogems: 60000,
        server: "America",
        stock: 1,
        credentials: ["na1:pass1"],
        description: "Massive amount of gems for America.",
        status: 'active'
    }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/luminestore-practice')
    .then(async () => {
        console.log('MongoDB Connected to seed data');
        
        await Account.deleteMany({});
        console.log('Cleared existing accounts');
        
        await Account.insertMany(accounts);
        console.log('Inserted seed accounts');
        
        mongoose.disconnect();
    })
    .catch(err => {
        console.error('Error seeding data:', err);
        process.exit(1);
    });
