import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseServiceRoleKey || supabaseServiceRoleKey === 'your-service-role-key') {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not configured in .env.local');
  console.log('Please add your service role key to .env.local');
  process.exit(1);
}

async function applyMigrations() {
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  const migrations = [
    '001_create_core_schema.sql',
    '002_enable_rls_policies.sql',
    '003_setup_storage.sql',
    '004_seed_data.sql'
  ];

  console.log('🚀 Starting database migration...\n');

  for (const migration of migrations) {
    const filePath = join(process.cwd(), 'supabase', 'migrations', migration);

    try {
      console.log(`📄 Reading: ${migration}`);
      const sql = readFileSync(filePath, 'utf-8');

      console.log(`⚙️  Executing: ${migration}`);
      const { error } = await supabase.rpc('exec_sql', { sql });

      if (error) {
        console.error(`❌ Error in ${migration}:`, error.message);
        console.log('\n⚠️  Note: You may need to run migrations directly in Supabase SQL Editor');
        console.log('The rpc method may not be available. Use the SQL Editor instead.');
        return;
      }

      console.log(`✅ Completed: ${migration}\n`);
    } catch (err: any) {
      console.error(`❌ Failed to read ${migration}:`, err.message);
      return;
    }
  }

  console.log('✅ All migrations completed successfully!');
}

applyMigrations();
