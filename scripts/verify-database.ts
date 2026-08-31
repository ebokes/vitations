import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function verifyDatabase() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  console.log('🔍 Verifying database setup...\n');

  const expectedTables = [
    'profiles',
    'packages',
    'package_features',
    'templates',
    'template_versions',
    'invitations',
    'invitation_versions',
    'events',
    'guests',
    'rsvps',
    'gift_registries',
    'gift_registry_items',
    'gift_claims',
    'orders',
    'payments',
    'media',
    'livestreams',
    'custom_invitation_requests',
    'notifications',
    'audit_logs'
  ];

  let allTablesExist = true;
  let createdTables: string[] = [];
  let missingTables: string[] = [];

  // Check each table
  for (const table of expectedTables) {
    const { error } = await supabase.from(table).select('count').limit(0);

    if (error) {
      if (error.code === 'PGRST205' || error.code === '42P01') {
        console.log(`❌ ${table}: Not found`);
        missingTables.push(table);
        allTablesExist = false;
      } else {
        console.log(`⚠️  ${table}: ${error.message}`);
      }
    } else {
      console.log(`✅ ${table}: OK`);
      createdTables.push(table);
    }
  }

  console.log('');
  console.log('📊 Summary:');
  console.log(`   Tables created: ${createdTables.length}/${expectedTables.length}`);

  if (allTablesExist) {
    console.log('\n✅ All tables exist!');

    // Check for seed data
    console.log('\n🌱 Checking seed data...');

    const { data: packages, error: pkgError } = await supabase
      .from('packages')
      .select('tier, name, price_ngn');

    if (!pkgError && packages && packages.length > 0) {
      console.log('✅ Packages seeded:');
      packages.forEach(pkg => {
        console.log(`   - ${pkg.name} (${pkg.tier}): ₦${pkg.price_ngn.toLocaleString()}`);
      });
    }

    const { data: templates, error: tmpError } = await supabase
      .from('templates')
      .select('name, design_type, status')
      .eq('status', 'active');

    if (!tmpError && templates && templates.length > 0) {
      console.log(`✅ Templates seeded: ${templates.length} active templates`);
    }

    console.log('\n🎉 Database is fully configured and ready to use!');
    console.log('👉 You can now proceed to Phase 04: Design System and UI Foundation');

  } else {
    console.log(`\n❌ Missing ${missingTables.length} tables`);
    console.log('\n📋 Next steps:');
    console.log('1. Open: https://supabase.com/dashboard/project/jwlibzsmvxkfeebufdou/sql');
    console.log('2. Run each migration file in the SQL Editor:');
    missingTables.forEach((table, i) => {
      if (i === 0) console.log('   - supabase/migrations/001_create_core_schema.sql');
    });
    if (missingTables.length > 0) {
      console.log('   - supabase/migrations/002_enable_rls_policies.sql');
      console.log('   - supabase/migrations/003_setup_storage.sql');
      console.log('   - supabase/migrations/004_seed_data.sql');
    }
  }
}

verifyDatabase();
