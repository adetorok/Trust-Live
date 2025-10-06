import 'dotenv/config';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';

async function run() {
  await connectDB(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/trust');
  const adminEmail = process.env.DEMO_ADMIN_EMAIL || 'admin@trust.com';
  const adminPassword = process.env.DEMO_ADMIN_PASSWORD || 'admin123';
  const userEmail = process.env.DEMO_USER_EMAIL || 'user@trust.com';
  const userPassword = process.env.DEMO_USER_PASSWORD || 'user123';

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    const passwordHash = await User.hashPassword(adminPassword);
    admin = await User.create({ email: adminEmail, name: 'Admin', passwordHash, roles: ['org_admin'] });
    console.log('Created admin:', admin.email);
  } else {
    console.log('Admin exists:', admin.email);
  }

  let user = await User.findOne({ email: userEmail });
  if (!user) {
    const passwordHash = await User.hashPassword(userPassword);
    user = await User.create({ email: userEmail, name: 'User', passwordHash, roles: ['user'] });
    console.log('Created user:', user.email);
  } else {
    console.log('User exists:', user.email);
  }
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});


