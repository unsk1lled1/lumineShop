require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Account = require('./models/Account');

const SEED_DATA = [
  { denomination: 6000, primogems: 6000, wishes: 20, price: 5, server: 'Europe', title: 'Аккаунт 6000 примогемов' },
  { denomination: 6400, primogems: 6400, wishes: 22, price: 6, server: 'Asia', title: 'Аккаунт 6400 примогемов' },
  { denomination: 33500, primogems: 33500, wishes: 120, price: 20, server: 'America', title: 'Аккаунт 33500 примогемов' },
  { denomination: 47000, primogems: 47000, wishes: 168, price: 29, server: 'Europe', title: 'Жирный акк 47000 камней' },
  { denomination: 55000, primogems: 55000, wishes: 196, price: 34, server: 'Asia', title: 'Супер лот 55000 камней' },
  { denomination: 60000, primogems: 60000, wishes: 215, price: 40, server: 'TW/HK/MO', title: 'КИТ АКАУНТ 60К камней' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/practice_lumine');

    await User.deleteMany({});
    await Account.deleteMany({});

    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    const admin = await User.create({
      username: 'LumineAdmin',
      email: 'admin@lumine.com',
      password: adminPassword,
      role: 'admin',
      balance: 99999
    });

    const testUser = await User.create({
      username: 'TestBuyer',
      email: 'user@lumine.com',
      password: userPassword,
      role: 'user',
      balance: 100
    });

    const accountsToInsert = SEED_DATA.map(lot => {
      const fakeCredentials = [];
      for (let i = 1; i <= 5; i++) {
        fakeCredentials.push(`player_${lot.denomination}_${i}@mail.ru:PassWord${i}!`);
      }

      return {
        ...lot,
        credentials: fakeCredentials,
        stock: fakeCredentials.length,
        status: 'active',
        images: ['https://placehold.co/600x400/1e293b/ffffff?text=Genshin+Impact']
      };
    });

    await Account.insertMany(accountsToInsert);
    process.exit(0);
  } catch (error) {
    console.error('Ошибка при посеве данных:', error);
    process.exit(1);
  }
};

seedDB();
