import { Client } from 'pg';
import bcrypt from 'bcrypt';

const BCRYPT_SALT = '$2a$10$R.veG5c9K6H6Wz/Gk6hKe.';
const NEW_EMAIL = 'admin@grovyn.com';
const OLD_EMAIL = 'admin@example.com';
const NEW_PASSWORD = 'grovyn@123';

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

    // 1. Hash the new password using the Medplum salt
    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, BCRYPT_SALT);
    console.log('Generated new password hash:', hashedPassword);

    // 2. Update User table by parsing and editing the content JSON
    const users = await client.query('SELECT id, content FROM "User" WHERE email = $1', [OLD_EMAIL]);
    console.log(`Found ${users.rows.length} users with email ${OLD_EMAIL}`);
    for (const row of users.rows) {
      const user = JSON.parse(row.content);
      user.email = NEW_EMAIL;
      user.passwordHash = hashedPassword;
      const updatedContent = JSON.stringify(user);
      
      const updateRes = await client.query(
        'UPDATE "User" SET email = $1, content = $2 WHERE id = $3',
        [NEW_EMAIL, updatedContent, row.id]
      );
      console.log(`Updated "User" table row ID: ${row.id} - ${updateRes.rowCount} row(s) updated`);
    }

    // 3. Update User_History table
    const userHistRes = await client.query(
      `UPDATE "User_History" 
       SET content = replace(content, $1, $2) 
       WHERE content LIKE $3`,
      [OLD_EMAIL, NEW_EMAIL, `%${OLD_EMAIL}%`]
    );
    console.log(`Updated "User_History" table: ${userHistRes.rowCount} rows`);

    // 4. Update Practitioner table (telecom email)
    const pracRes = await client.query(
      `UPDATE "Practitioner" 
       SET content = replace(content, $1, $2) 
       WHERE content LIKE $3`,
      [OLD_EMAIL, NEW_EMAIL, `%${OLD_EMAIL}%`]
    );
    console.log(`Updated "Practitioner" table: ${pracRes.rowCount} rows`);

    // 5. Update Practitioner_History table (telecom email)
    const pracHistRes = await client.query(
      `UPDATE "Practitioner_History" 
       SET content = replace(content, $1, $2) 
       WHERE content LIKE $3`,
      [OLD_EMAIL, NEW_EMAIL, `%${OLD_EMAIL}%`]
    );
    console.log(`Updated "Practitioner_History" table: ${pracHistRes.rowCount} rows`);

    await client.end();
    console.log('\nCredential update complete! Please flush Redis and log in.');
  } catch (err) {
    console.error(err);
  }
}

main();
