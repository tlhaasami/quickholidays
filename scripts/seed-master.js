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
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const usersToCreate = [
  { email: "admin@quickholidays.co.uk", password: "admin123", name: "Main Administrator", username: "admin", role: "admin" },
  { email: "admin2@quickholidays.co.uk", password: "admin123", name: "Secondary Admin", username: "admin2", role: "admin" },
  { email: "agent@quickholidays.co.uk", password: "agent123", name: "Primary Travel Agent", username: "agent", role: "agent" },
  { email: "chloe@quickholidays.co.uk", password: "agent123", name: "Chloe Dupont", username: "chloe", role: "agent" },
  { email: "amara@quickholidays.co.uk", password: "agent123", name: "Amara Okoye", username: "amara", role: "agent" },
  { email: "agent_test@quickholidays.co.uk", password: "agent123", name: "Test Agent Account", username: "agent_test", role: "agent" },
  { email: "processor@quickholidays.co.uk", password: "processor123", name: "Visa Specialist", username: "processor", role: "processor" },
  { email: "liam@quickholidays.co.uk", password: "processor123", name: "Liam O'Connor", username: "liam", role: "processor" },
  { email: "david@quickholidays.co.uk", password: "processor123", name: "David Smith", username: "david", role: "processor" },
  { email: "processor_test@quickholidays.co.uk", password: "processor123", name: "Test Processor Account", username: "processor_test", role: "processor" }
];

async function seedMaster() {
  console.log("=== START SEEDING LIVE DATA ===");

  // Clean up old numeric forms if they exist in DB
  const oldIds = [
    "4819582910", "7218495021", "9910543209", "3381048592",
    "QH-AGENT-2607-4819", "QH-AGENT-2607-7218", "QH-CHLOE-2607-9910", "QH-AMARA-2607-3381"
  ];
  await supabase.from('visa_forms').delete().in('id', oldIds);

  // 1. Create all 10 users in Supabase Auth
  const agentUserIds = [];
  const processorIdsMap = {};
  for (const user of usersToCreate) {
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .maybeSingle();

    let userId = "";

    if (existingProfile) {
      console.log(`User ${user.email} already exists in DB.`);
      userId = existingProfile.id;
    } else {
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
      userId = authData.user.id;
      console.log(`Created auth account: ${user.email}`);

      // Ensure profile is approved
      const { error: profileErr } = await supabase
        .from('profiles')
        .update({ status: 'approved' })
        .eq('id', userId);

      if (profileErr) {
        console.error(`Failed to approve profile for ${user.email}:`, profileErr.message);
      }
    }

    if (user.role === 'agent') {
      agentUserIds.push(userId);
    }
    if (user.role === 'processor') {
      processorIdsMap[user.email] = userId;
    }
  }

  // 2. Insert test clients and visa forms
  const defaultAgentId = agentUserIds[0] || null;

  const clientsToCreate = [
    {
      name: "Sarah Smith",
      email: "sarahsmith@gmail.com",
      phone: "7507677927",
      agent_id: defaultAgentId,
      forms: [
        {
          id: "QH-AGENT-2607-4819",
          title: "Portugal Tourism Visa Application",
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
            personal_dob: "1987-08-27"
          }
        }
      ]
    },
    {
      name: "James Wilson",
      email: "james.wilson@example.com",
      phone: "+44 7911 123456",
      agent_id: defaultAgentId,
      forms: [
        {
          id: "QH-AGENT-2607-7218",
          title: "Germany Business Visa Application",
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
        }
      ]
    },
    {
      name: "Elena Petrova",
      email: "elena.petrova@gmail.com",
      phone: "+44 7123 998877",
      agent_id: agentUserIds[1] || defaultAgentId,
      forms: [
        {
          id: "QH-CHLOE-2607-9910",
          title: "France Tourist Schengen Visa",
          status: "draft",
          form_data: {
            personal_surname: "PETROVA",
            personal_first_names: "ELENA",
            personal_dob: "1993-11-22",
            personal_pob: "MOSCOW, RUSSIA",
            personal_cob: "RUSSIA",
            personal_nationality: "RUSSIAN",
            personal_sex: "FEMALE",
            travel_submission_city: "LONDON",
            travel_destinations: "FRANCE",
            travel_purpose: "TOURISM",
            passport_number: "RU8204928"
          },
          approved_data: {}
        }
      ]
    },
    {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+44 7291 887766",
      agent_id: agentUserIds[2] || defaultAgentId,
      forms: [
        {
          id: "QH-AMARA-2607-3381",
          title: "Spain Tourism Visa Application",
          status: "approved",
          form_data: {
            personal_surname: "DOE",
            personal_first_names: "JOHN",
            personal_dob: "1985-01-15",
            personal_pob: "LONDON, UK",
            personal_cob: "UNITED KINGDOM",
            personal_nationality: "BRITISH",
            personal_sex: "MALE",
            travel_submission_city: "LONDON",
            travel_destinations: "SPAIN",
            travel_purpose: "TOURISM",
            passport_number: "GB0184950",
            docs_checked: ["passport", "brp", "photo", "flights", "hotel", "insurance"],
            appointment_date: "2026-07-25",
            appointment_ref: "SPA-92840-APPT"
          },
          approved_data: {
            personal_surname: "DOE",
            personal_first_names: "JOHN",
            personal_dob: "1985-01-15",
            personal_nationality: "BRITISH",
            personal_sex: "MALE",
            travel_destinations: "SPAIN",
            passport_number: "GB0184950"
          }
        }
      ]
    }
  ];

  for (const seed of clientsToCreate) {
    // Check if client exists
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('email', seed.email)
      .maybeSingle();

    let clientDbId = "";

    if (existingClient) {
      clientDbId = existingClient.id;
      console.log(`Client ${seed.name} already exists. Updating agent_id.`);
      const { error: updateErr } = await supabase
        .from('clients')
        .update({ agent_id: seed.agent_id })
        .eq('id', clientDbId);
      if (updateErr) {
        console.error(`Failed to update agent_id for client ${seed.name}:`, updateErr.message);
      }
    } else {
      const { data: dbClient, error: clientErr } = await supabase
        .from('clients')
        .insert({
          name: seed.name,
          email: seed.email,
          phone: seed.phone,
          agent_id: seed.agent_id
        })
        .select()
        .single();

      if (clientErr || !dbClient) {
        console.error(`Failed to insert client ${seed.name}:`, clientErr?.message);
        continue;
      }
      clientDbId = dbClient.id;
      console.log(`Seeded Client: ${seed.name}`);
    }

    // Insert forms
    for (const form of seed.forms) {
      const { data: existingForm } = await supabase
        .from('visa_forms')
        .select('id')
        .eq('id', form.id)
        .maybeSingle();

      if (existingForm) {
        console.log(`Visa Form ${form.id} already exists.`);
        continue;
      }

      let formData = { ...form.form_data };
      if (form.id === "QH-AGENT-2607-7218") {
        const procId = processorIdsMap["processor@quickholidays.co.uk"];
        if (procId) {
          formData.assigned_processor_id = procId;
          formData.assigned_processor_name = "Visa Specialist";
          formData.assigned_processor_email = "processor@quickholidays.co.uk";
        }
      }

      const { data: dbForm, error: formErr } = await supabase
        .from('visa_forms')
        .insert({
          id: form.id,
          client_id: clientDbId,
          title: form.title,
          applicant_name: seed.name,
          status: form.status,
          form_data: formData,
          approved_data: form.approved_data
        })
        .select()
        .single();

      if (formErr || !dbForm) {
        console.error(`Failed to seed Form ${form.id}:`, formErr?.message);
      } else {
        console.log(`Seeded Visa Form: ${form.id} (${form.status})`);
      }
    }
  }

  console.log("=== LIVE DATA SEEDING COMPLETE ===");
}

seedMaster();
