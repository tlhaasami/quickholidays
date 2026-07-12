const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.resolve(__dirname, '../.env.local');
let supabaseUrl = "";
let serviceRoleKey = "";

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
        supabaseUrl = val;
      }
      if (key === 'SUPABASE_SERVICE_ROLE_KEY') {
        serviceRoleKey = val;
      }
    }
  });
}

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Error: Supabase credentials not found");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function check() {
  const { data, error } = await supabase.from('visa_forms').select('*').limit(1);
  if (error) {
    console.error("Error fetching visa_forms:", error.message);
  } else {
    console.log("visa_forms columns:", Object.keys(data[0] || {}));
  }
}

check();
