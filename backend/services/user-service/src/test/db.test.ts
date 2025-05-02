import { PrismaClient } from '@prisma/client';

async function testDatabase() {
  const prisma = new PrismaClient();

  try {
    // Test connection
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('✓ Connected to database successfully');

    // List all tables
    console.log('\nListing all tables:');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('Tables:', tables);

    // Check users table structure
    console.log('\nChecking users table structure:');
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `;
    console.log('Users table columns:', columns);

  } catch (error) {
    console.error('Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase(); 