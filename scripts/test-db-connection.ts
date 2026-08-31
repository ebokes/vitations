import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function testConnection() {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Environment variables not loaded');
      console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
      console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Set' : '✗ Missing');
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    console.log('🔗 Testing Supabase connection...');
    console.log('URL:', supabaseUrl);
    console.log('');

    // Test basic connection by querying profiles table
    const { data, error } = await supabase.from('profiles').select('count').limit(0);

    if (error) {
      if (error.code === '42P01') {
        console.log('⚠️  Database connected but tables not yet created');
        console.log('');
        console.log('✅ Connection successful!');
        console.log('👉 Next step: Apply migrations to create tables');
        console.log('');
        console.log('📋 To apply migrations:');
        console.log('1. Go to: https://supabase.com/dashboard/project/' + supabaseUrl.split('//')[1].split('.')[0]);
        console.log('2. Navigate to: SQL Editor');
        console.log('3. Create a new query and run each migration file in order:');
        console.log('   ① supabase/migrations/001_create_core_schema.sql');
        console.log('   ② supabase/migrations/002_enable_rls_policies.sql');
        console.log('   ③ supabase/migrations/003_setup_storage.sql');
        console.log('   ④ supabase/migrations/004_seed_data.sql');
        console.log('');
        console.log('💡 Copy the contents of each file and paste into the SQL Editor');
        return;
      }

      console.error('❌ Connection error:', error.message);
      console.log('Error code:', error.code);
      return;
    }

    console.log('✅ Successfully connected to Supabase!');
    console.log('✅ Tables exist and are accessible');
    console.log('');
    console.log('🎉 Database is ready to use!');

  } catch (err: any) {
    console.error('❌ Unexpected error:', err.message);
  }
}

testConnection();
