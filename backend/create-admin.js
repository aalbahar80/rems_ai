const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdminUser() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Check if admin user exists
    const existingUser = await client.query(
      'SELECT user_id FROM users WHERE username = $1',
      ['admin']
    );

    if (existingUser.rows.length > 0) {
      console.log('Admin user already exists, updating password...');

      const passwordHash = await bcrypt.hash('password', 10);
      await client.query(
        'UPDATE users SET password_hash = $1 WHERE username = $2',
        [passwordHash, 'admin']
      );

      console.log('Admin password updated successfully');
    } else {
      console.log('Creating new admin user...');

      const passwordHash = await bcrypt.hash('password', 10);
      await client.query(
        `
        INSERT INTO users (
          username, email, password_hash, user_type, preferred_language, 
          is_active, email_verified
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
        ['admin', 'admin@rems.local', passwordHash, 'admin', 'en', true, true]
      );

      console.log('Admin user created successfully');
    }

    console.log('');
    console.log('Test credentials:');
    console.log('Username: admin');
    console.log('Password: password');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

createAdminUser();
