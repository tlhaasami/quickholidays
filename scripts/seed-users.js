const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually to get credentials
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
  console.error("Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found in .env.local");
  console.error("Please add 'SUPABASE_SERVICE_ROLE_KEY=your-secret-service-role-key' to .env.local");
  process.exit(1);
}

// Initialize Supabase Client with Service Role Key to bypass email confirmation & rate limits
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const usersToCreate = [
  {
    email: "admin@quickholidays.co.uk",
    password: "admin123",
    name: "Main Administrator",
    username: "admin",
    role: "admin",
  },
  {
    email: "agent@quickholidays.co.uk",
    password: "agent123",
    name: "Primary Travel Agent",
    username: "agent",
    role: "agent",
  },
  {
    email: "processor@quickholidays.co.uk",
    password: "processor123",
    name: "Visa Verification Specialist",
    username: "processor",
    role: "processor",
  }
];

async function seedUsers() {
  console.log("Seeding credentials into Supabase Auth...");

  for (const user of usersToCreate) {
    console.log(`Creating user: ${user.email} (${user.role})...`);
    
    // Check if user already exists in auth.users by attempting to query profiles
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .maybeSingle();

    if (existingProfile) {
      console.log(`User ${user.email} already exists in database. Skipping.`);
      continue;
    }

    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        name: user.name,
        username: user.username,
        role: user.role,
      }
    });

    if (authErr || !authData.user) {
      console.error(`Failed to create auth user ${user.email}:`, authErr?.message);
      continue;
    }

    console.log(`Successfully created auth account for: ${user.email}`);

    // Since the database trigger creates the profile in 'pending' status for non-admins,
    // let's update their status to 'approved' to make them ready for testing login.
    const { error: profileErr } = await supabase
      .from('profiles')
      .update({ status: 'approved' })
      .eq('id', authData.user.id);

    if (profileErr) {
      console.error(`Warning: Failed to update profile status for ${user.email}:`, profileErr.message);
    } else {
      console.log(`Profile status for ${user.email} updated to approved.`);
    }
  }

  console.log("Credentials seeding process complete!");
}

seedUsers();
