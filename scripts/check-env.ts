import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

console.log('🔍 Checking environment configuration...\n');

const checks = [
  { name: 'NEXT_PUBLIC_SUPABASE_URL', value: process.env.NEXT_PUBLIC_SUPABASE_URL },
  { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
  { name: 'SUPABASE_SERVICE_ROLE_KEY', value: process.env.SUPABASE_SERVICE_ROLE_KEY },
  { name: 'NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY', value: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY },
  { name: 'PAYSTACK_SECRET_KEY', value: process.env.PAYSTACK_SECRET_KEY },
  { name: 'NEXT_PUBLIC_APP_URL', value: process.env.NEXT_PUBLIC_APP_URL },
];

let hasErrors = false;

checks.forEach(check => {
  const value = check.value || '';
  const isSet = value && value !== `your-${check.name.toLowerCase().replace(/_/g, '-')}`;
  const isMissing = !value;
  const isPlaceholder = value.startsWith('your-');

  if (isMissing) {
    console.log(`❌ ${check.name}: Missing`);
    hasErrors = true;
  } else if (isPlaceholder) {
    console.log(`⚠️  ${check.name}: Placeholder (not configured)`);
    if (check.name.includes('SUPABASE')) {
      hasErrors = true;
    }
  } else if (check.value) {
    const displayValue = check.value.substring(0, 20) + '...';
    console.log(`✅ ${check.name}: ${displayValue}`);

    // Check key format
    if (check.name === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
      if (check.value.startsWith('ysb_')) {
        console.log('   ⚠️  Key starts with "ysb_" - should start with "eyJ"');
        console.log('   💡 This looks like a Paystack key, not a Supabase key');
        hasErrors = true;
      } else if (!check.value.startsWith('eyJ')) {
        console.log('   ⚠️  Supabase keys typically start with "eyJ"');
      }
    }
  }
});

console.log('');

if (hasErrors) {
  console.log('❌ Configuration issues found!');
  console.log('');
  console.log('📋 To fix:');
  console.log('1. Go to your Supabase project: https://supabase.com/dashboard');
  console.log('2. Click on your project');
  console.log('3. Go to Settings → API');
  console.log('4. Copy the correct keys:');
  console.log('   - Project URL');
  console.log('   - anon public key (starts with "eyJ")');
  console.log('   - service_role key (starts with "eyJ")');
  console.log('5. Update .env.local with these values');
} else {
  console.log('✅ All required Supabase credentials are configured!');
  console.log('⚠️  Remember: Paystack keys are optional until Phase 13');
}
