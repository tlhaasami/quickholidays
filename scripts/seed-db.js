const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually to get credentials
const envPath = path.resolve(__dirname, '../.env.local');
let supabaseUrl = "";
let supabaseKey = "";

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
      if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
        supabaseKey = val;
      }
    }
  });
}

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not found in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Seeding test database rows...");

  // Clean up old numeric forms if they exist in DB
  const oldIds = ["4819582910", "7218495021"];
  await supabase.from('visa_forms').delete().in('id', oldIds);

  // 1. Clear any existing seed clients and forms to keep it clean (optional)
  // Let's search if Sarah Smith exists to avoid duplicates
  const { data: existingClients } = await supabase
    .from('clients')
    .select('id')
    .eq('email', 'sarahsmith@gmail.com')
    .maybeSingle();

  if (existingClients) {
    console.log("Sarah Smith already exists in clients. Skipping insertion.");
    return;
  }

  // 2. Insert Client 1 (Sarah Smith)
  const { data: client1, error: err1 } = await supabase
    .from('clients')
    .insert({
      name: "Sarah Smith",
      email: "sarahsmith@gmail.com",
      phone: "7507677927"
    })
    .select()
    .single();

  if (err1 || !client1) {
    console.error("Failed to insert Client Sarah Smith:", err1?.message);
    return;
  }
  console.log("Seeded Client: Sarah Smith");

  // 3. Insert Visa Form for Sarah Smith (Needs Approval / Completed)
  const { data: form1, error: ferr1 } = await supabase
    .from('visa_forms')
    .insert({
      id: "QH-AGENT-2607-4819",
      client_id: client1.id,
      title: "Portugal Tourism Visa Application",
      applicant_name: "Sarah Smith",
      status: "client_completed",
      form_data: {
        personal_surname: "SMITH",
        personal_first_names: "SARAH ELIZABETH",
        personal_dob: "1987-08-27",
        personal_pob: "LIVERPOOL, UK",
        personal_cob: "UNITED KINGDOM",
        personal_nationality: "BRITISH",
        personal_nationality_birth: "BRITISH",
        personal_sex: "FEMALE",
        personal_marital_status: "Separated",
        travel_submission_city: "LONDON",
        travel_destinations: "PORTUGAL",
        travel_purpose: "TOURISM",
        passport_type: "ORDINARY PASSPORT",
        passport_number: "RU4154351",
        passport_issue_date: "2022-11-07",
        passport_expiry_date: "2027-11-06",
        address_street: "12 Liverpool Road",
        address_postal_code: "L1 0AB",
        address_city: "Liverpool",
        address_county: "Merseyside",
        address_country: "United Kingdom",
        address_phone: "7507677927",
        address_email: "sarahsmith@gmail.com"
      },
      approved_data: {
        personal_surname: "SMITH",
        personal_first_names: "SARAH ELIZABETH",
        personal_dob: "1987-08-27",
        personal_pob: "LIVERPOOL, UK",
        personal_cob: "UNITED KINGDOM",
        personal_nationality: "BRITISH",
        personal_nationality_birth: "BRITISH",
        personal_sex: "FEMALE"
      }
    })
    .select()
    .single();

  if (ferr1 || !form1) {
    console.error("Failed to insert Form for Sarah Smith:", ferr1?.message);
    return;
  }
  console.log("Seeded Visa Form: 4819582910");

  // 4. Insert Client 2 (James Wilson)
  const { data: client2, error: err2 } = await supabase
    .from('clients')
    .insert({
      name: "James Wilson",
      email: "james.wilson@example.com",
      phone: "+44 7911 123456"
    })
    .select()
    .single();

  if (err2 || !client2) {
    console.error("Failed to insert Client James Wilson:", err2?.message);
    return;
  }
  console.log("Seeded Client: James Wilson");

  // 5. Insert Visa Form for James Wilson (Needs Approval / Processing)
  const { data: form2, error: ferr2 } = await supabase
    .from('visa_forms')
    .insert({
      id: "QH-AGENT-2607-7218",
      client_id: client2.id,
      title: "Germany Business Visa Application",
      applicant_name: "James Wilson",
      status: "needs_approval",
      form_data: {
        personal_surname: "WILSON",
        personal_first_names: "JAMES ALEXANDER",
        personal_dob: "1990-04-12",
        personal_pob: "MANCHESTER, UK",
        personal_cob: "UNITED KINGDOM",
        personal_nationality: "BRITISH",
        personal_sex: "MALE",
        travel_submission_city: "MANCHESTER",
        travel_destinations: "GERMANY",
        travel_purpose: "BUSINESS",
        passport_number: "GB9102452"
      },
      approved_data: {}
    })
    .select()
    .single();

  if (ferr2 || !form2) {
    console.error("Failed to insert Form for James Wilson:", ferr2?.message);
    return;
  }
  console.log("Seeded Visa Form: 7218495021");

  console.log("Database seeded successfully!");
}

seed();
