// @ts-nocheck
import { Client } from 'pg';
import Redis from 'ioredis';

async function testPostgres(host) {
  console.log(`Testing connection to PostgreSQL on ${host}:5432...`);
  const client = new Client({
    host: host,
    port: 5432,
    database: 'medplum',
    user: 'medplum',
    password: 'medplum',
  });
  try {
    await client.connect();
    console.log(`✅ PostgreSQL (${host}) connection successful!`);
    const res = await client.query('SELECT version()');
    console.log(`   Postgres version: ${res.rows[0].version}`);
    await client.end();
    return true;
  } catch (err) {
    console.error(`❌ PostgreSQL (${host}) connection failed:`, err.message);
    return false;
  }
}

async function testRedis(host) {
  console.log(`Testing connection to Redis on ${host}:6379...`);
  const redis = new Redis({
    host: host,
    port: 6379,
    password: 'medplum',
    maxRetriesPerRequest: 1,
    connectTimeout: 5000,
  });
  try {
    const pong = await redis.ping();
    console.log(`✅ Redis (${host}) connection successful! Response:`, pong);
    redis.disconnect();
    return true;
  } catch (err) {
    console.error(`❌ Redis (${host}) connection failed:`, err.message);
    return false;
  }
}

async function main() {
  console.log('--- TESTING LOCALHOST ---');
  await testPostgres('localhost');
  console.log('');
  await testRedis('localhost');
  console.log('\n--- TESTING 127.0.0.1 ---');
  await testPostgres('127.0.0.1');
  console.log('');
  await testRedis('127.0.0.1');
  process.exit(0);
}

main();
