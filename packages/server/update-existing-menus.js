import { Client } from 'pg';

const renameLabel = (originalName) => {
  if (!originalName) return originalName;
  const normalized = originalName.trim().replace(/s$/, '');
  switch (normalized) {
    case 'Organization':
      return 'Enterprise Workspace';
    case 'Patient':
      return 'Clients / Patients';
    case 'Practitioner':
      return 'Staff Directory';
    case 'DiagnosticReport':
      return 'Diagnostic Records';
    case 'Questionnaire':
      return 'Forms & Surveys';
    case 'Project':
      return 'Workspace Configs';
    case 'AccessPolicy':
      return 'Access Policies';
    case 'Subscription':
      return 'Webhooks & Events';
    case 'Observation':
      return 'Clinical Metrics';
    case 'Batch':
      return 'Bulk Processing';
    case 'ServiceRequest':
      return 'Service Requests';
    default:
      return originalName;
  }
};

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
    console.log('Connected to PostgreSQL database medplum');

    // Retrieve all UserConfiguration resources
    const res = await client.query('SELECT id, content FROM "UserConfiguration"');
    console.log(`Found ${res.rows.length} UserConfiguration records`);

    for (const row of res.rows) {
      const content = JSON.parse(row.content);
      let changed = false;

      if (content.menu) {
        for (const menu of content.menu) {
          if (menu.title === 'Favorites') {
            menu.title = 'Key Workspaces';
            changed = true;
          } else if (menu.title === 'Admin') {
            menu.title = 'Management';
            changed = true;
          }
          if (menu.link) {
            for (const link of menu.link) {
              const newName = renameLabel(link.name);
              if (newName !== link.name) {
                console.log(`Updating link name: "${link.name}" -> "${newName}" for config ${row.id}`);
                link.name = newName;
                changed = true;
              }
            }
          }
        }
      }

      if (changed) {
        await client.query('UPDATE "UserConfiguration" SET content = $1 WHERE id = $2', [
          JSON.stringify(content),
          row.id
        ]);
        console.log(`✅ Updated UserConfiguration ${row.id}`);
      }
    }

    console.log('Done!');
    await client.end();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
