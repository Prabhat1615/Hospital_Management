// SPDX-FileCopyrightText: Copyright Orangebot, Inc. and Medplum contributors
// SPDX-License-Identifier: Apache-2.0

import { Client } from 'pg';

async function main() {
  const client = new Client({
    host: '127.0.0.1',
    port: 5432,
    database: 'medplum',
    user: 'medplum',
    password: 'medplum',
  });

  try {
    await client.connect();
    console.log('Connected to Postgres');

    const practitioners = await client.query('SELECT id, content FROM "Practitioner"');
    console.log('\n--- PRACTITIONERS ---');
    for (const row of practitioners.rows) {
      const content = JSON.parse(row.content);
      // eslint-disable-next-line no-undef
      console.log(`Practitioner ID: ${row.id}, Name: ${JSON.stringify(content.name)}`);
    }

    const memberships = await client.query('SELECT id, content FROM "ProjectMembership"');
    console.log('\n--- PROJECT MEMBERSHIPS ---');
    for (const row of memberships.rows) {
      const content = JSON.parse(row.content);
      console.log(`Membership ID: ${row.id}, Profile: ${JSON.stringify(content.profile)}`);
    }

    const users = await client.query('SELECT id, email, content FROM "User"');
    console.log('\n--- USERS ---');
    for (const row of users.rows) {
      const content = JSON.parse(row.content);
      console.log(`User ID: ${row.id}, Name: ${content.firstName} ${content.lastName}, SQL Email: ${row.email}, JSON Email: ${content.email}`);
    }

    await client.end();
  } catch (err) {
    console.error(err);
  }
}

main();
