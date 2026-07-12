"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { visaSections, VisaField, VisaForm, ClientProfile } from "@/constants/visaFields";
import { createClient } from "@/lib/supabase/client";

export default function AgentDashboard() {
  const router = useRouter();
  const params = useParams();
  const usernameParam = params?.username as string;
  const [agentName, setAgentName] = useState("Agent");
  const [agentUsername, setAgentUsername] = useState("");
  const supabase = createClient();
  
  // Navigation Tabs in Sidebar
  const [sidebarTab, setSidebarTab] = useState<"clients" | "add_client">("clients");

  // Client Data States
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
  const [selectedForm, setSelectedForm] = useState<VisaForm | null>(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  // Search, Filters & Sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "needs_approval">("all");
  const [sortBy, setSortBy] = useState<"updated" | "name" | "forms_count">("updated");

  // Add Client Form States
  const [newClientName, setNewClientName] = useState("");
  const [newClientFormTitle, setNewClientFormTitle] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  // Create New Form for Client States
  const [newFormTitle, setNewFormTitle] = useState("");
  const [newFormApplicantName, setNewFormApplicantName] = useState("");
  const [showCreateFormModal, setShowCreateFormModal] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  });

  const [processors, setProcessors] = useState<any[]>([]);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [selectedProcessorId, setSelectedProcessorId] = useState("");
  const [forwardNote, setForwardNote] = useState("");

  const triggerToast = (message: string) => {
    setToast({ message, visible: true });
  };

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast((t) => ({ ...t, visible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const session = localStorage.getItem("user_session");
      if (!session) {
        window.location.href = "/login";
        return;
      }
      const user = JSON.parse(session);
      
      const { data: { user: sbUser } } = await supabase.auth.getUser();
      if (!sbUser || sbUser.id !== user.id) {
        window.location.href = "/login";
        return;
      }
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("name, username")
        .eq("id", user.id)
        .single();

      const dbUsername = profile?.username || user.username || "";
      const currentName = profile?.name || user.name;

      setAgentName(currentName);
      setAgentUsername(dbUsername);

      // Validate URL parameter matches logged-in agent's username
      if (usernameParam && dbUsername && usernameParam.toLowerCase() !== dbUsername.toLowerCase()) {
        router.push(`/${dbUsername.toLowerCase()}/agent-dashboard`);
        return;
      }

      const { data: clientsData, error: clientsErr } = await supabase
        .from("clients")
        .select(`
          id,
          name,
          email,
          phone,
          visa_forms (
            id,
            title,
            applicant_name,
            status,
            created_at,
            updated_at,
            form_data,
            approved_data
          )
        `)
        .eq("agent_id", user.id)
        .order("name", { ascending: true });

      if (clientsErr) {
        console.error("Error loading clients:", clientsErr.message);
        return;
      }

      const formattedClients: ClientProfile[] = (clientsData || []).map((client: any) => ({
        id: client.id,
        name: client.name,
        email: client.email || "",
        phone: client.phone || "",
        forms: (client.visa_forms || []).map((form: any) => ({
          id: form.id,
          title: form.title,
          applicantName: form.applicant_name || "",
          status: form.status,
          created_at: form.created_at,
          updated_at: form.updated_at,
          formData: form.form_data || {},
          approvedData: form.approved_data || {},
        })),
      }));

      setClients(formattedClients);

      // Fetch all active processors to select for forwarding
      const { data: procData } = await supabase
        .from("profiles")
        .select("id, name, email")
        .eq("role", "processor")
        .eq("status", "approved");

      if (procData) {
        setProcessors(procData);
        if (procData.length > 0) {
          setSelectedProcessorId(procData[0].id);
        }
      }
    };

    checkAuthAndLoad();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("user_session");
    window.location.href = "/login";
  };

  const generateFormId = () => {
    const cleanUsername = (agentUsername || "agent").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    const now = new Date();
    const yy = now.getFullYear().toString().slice(-2);
    const mm = (now.getMonth() + 1).toString().padStart(2, "0");
    const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();
    return `QH-${cleanUsername}-${yy}${mm}-${randomDigits}`;
  };

  // Add Client - Only Name and Form Title are required! Email and Phone are optional.
  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setAddSuccess("");

    if (!newClientName.trim() || !newClientFormTitle.trim()) {
      setAddError("Full Name and Form Title are required.");
      return;
    }

    const session = localStorage.getItem("user_session");
    if (!session) return;
    const user = JSON.parse(session);

    const formId = generateFormId();

    const { data: dbClient, error: clientErr } = await supabase
      .from("clients")
      .insert({
        agent_id: user.id,
        name: newClientName.trim(),
        email: newClientEmail.trim() || null,
        phone: newClientPhone.trim() || null,
      })
      .select()
      .single();

    if (clientErr || !dbClient) {
      setAddError(clientErr?.message || "Failed to register client.");
      return;
    }

    const { data: dbForm, error: formErr } = await supabase
      .from("visa_forms")
      .insert({
        id: formId,
        client_id: dbClient.id,
        title: newClientFormTitle.trim(),
        applicant_name: newClientName.trim(),
        status: "draft",
        form_data: {
          address_email: newClientEmail.trim(),
          address_phone: newClientPhone.trim(),
        },
        approved_data: {},
      })
      .select()
      .single();

    if (formErr || !dbForm) {
      setAddError(formErr?.message || "Failed to create initial form.");
      await supabase.from("clients").delete().eq("id", dbClient.id);
      return;
    }

    const initialForm: VisaForm = {
      id: formId,
      title: newClientFormTitle.trim(),
      applicantName: newClientName.trim(),
      status: "draft",
      created_at: dbForm.created_at,
      updated_at: dbForm.updated_at,
      formData: dbForm.form_data,
      approvedData: dbForm.approved_data,
    };

    const newClient: ClientProfile = {
      id: dbClient.id,
      name: dbClient.name,
      email: dbClient.email || "",
      phone: dbClient.phone || "",
      forms: [initialForm]
    };

    setClients((prev) => [newClient, ...prev]);

    setNewClientName("");
    setNewClientFormTitle("");
    setNewClientEmail("");
    setNewClientPhone("");
    setAddSuccess(`Client registered successfully! First form ID: ${formId}`);
    setSidebarTab("clients");

    setSelectedClient(newClient);
    setSelectedForm(initialForm);
  };

  // Add new form to existing client profile
  const handleCreateNewForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    const title = newFormTitle.trim() || "New Schengen Visa Form";
    const applicant = newFormApplicantName.trim() || selectedClient.name;
    const formId = generateFormId();

    const { data: dbForm, error: formErr } = await supabase
      .from("visa_forms")
      .insert({
        id: formId,
        client_id: selectedClient.id,
        title,
        applicant_name: applicant,
        status: "draft",
        form_data: {
          address_email: selectedClient.email || "",
          address_phone: selectedClient.phone || "",
        },
        approved_data: {},
      })
      .select()
      .single();

    if (formErr || !dbForm) {
      alert(formErr?.message || "Failed to create new visa form draft.");
      return;
    }

    const newForm: VisaForm = {
      id: formId,
      title,
      applicantName: applicant,
      status: "draft",
      created_at: dbForm.created_at,
      updated_at: dbForm.updated_at,
      formData: dbForm.form_data,
      approvedData: dbForm.approved_data,
    };

    const updatedClients = clients.map((c) => {
      if (c.id === selectedClient.id) {
        const updatedClient = {
          ...c,
          forms: [newForm, ...c.forms]
        };
        setSelectedClient(updatedClient);
        return updatedClient;
      }
      return c;
    });

    setClients(updatedClients);
    setSelectedForm(newForm);
    setNewFormTitle("");
    setNewFormApplicantName("");
    setShowCreateFormModal(false);
  };

  // Check if a client needs approval (has completed forms or unapproved edits)
  const clientNeedsApproval = (client: ClientProfile) => {
    return client.forms.some((form) => {
      if (form.status === "client_completed") return true;
      // Check if there are unapproved differences
      return Object.keys(form.formData || {}).some((k) => {
        const val = form.formData[k];
        const app = form.approvedData?.[k];
        return val !== app && val !== "";
      });
    });
  };

  // Helper to get client's last updated time across all forms
  const getClientLastUpdatedTime = (client: ClientProfile) => {
    if (client.forms.length === 0) return 0;
    const times = client.forms.map((f) => new Date(f.updated_at).getTime());
    return Math.max(...times);
  };

  // Filter clients
  const filteredClients = clients.filter((c) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      c.name.toLowerCase().includes(query) ||
      (c.email && c.email.toLowerCase().includes(query)) ||
      (c.phone && c.phone.toLowerCase().includes(query)) ||
      c.forms.some((form) => 
        form.id.toLowerCase().includes(query) ||
        form.title.toLowerCase().includes(query) ||
        (form.applicantName && form.applicantName.toLowerCase().includes(query)) ||
        form.status.toLowerCase().includes(query)
      );

    if (filterType === "needs_approval") {
      return matchesSearch && clientNeedsApproval(c);
    }
    return matchesSearch;
  });

  // Sort clients
  const sortedClients = [...filteredClients].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === "forms_count") {
      return b.forms.length - a.forms.length;
    }
    // Default: Sort by last updated timestamp
    return getClientLastUpdatedTime(b) - getClientLastUpdatedTime(a);
  });

  // Edit / Approve handlers for current selected form
  const updateLocalStorageForm = async (updatedForm: VisaForm) => {
    if (!selectedClient) return;

    const { error } = await supabase
      .from("visa_forms")
      .update({
        title: updatedForm.title,
        applicant_name: updatedForm.applicantName || "",
        status: updatedForm.status,
        form_data: updatedForm.formData,
        approved_data: updatedForm.approvedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", updatedForm.id);

    if (error) {
      console.error("Failed to update form in database:", error.message);
    }

    const updatedClients = clients.map((c) => {
      if (c.id === selectedClient.id) {
        const updatedClient = {
          ...c,
          forms: c.forms.map((f) => (f.id === updatedForm.id ? updatedForm : f))
        };
        setSelectedClient(updatedClient);
        return updatedClient;
      }
      return c;
    });

    setClients(updatedClients);
  };

  const handleApproveField = (fieldId: string, value: string) => {
    if (!selectedForm) return;

    const nextApproved = { ...(selectedForm.approvedData || {}), [fieldId]: value };
    const updatedForm: VisaForm = {
      ...selectedForm,
      approvedData: nextApproved,
      updated_at: new Date().toISOString()
    };
    setSelectedForm(updatedForm);
    updateLocalStorageForm(updatedForm);
  };

  const handleApproveAllChanges = () => {
    if (!selectedForm) return;

    const updatedForm: VisaForm = {
      ...selectedForm,
      approvedData: { ...(selectedForm.formData || {}) },
      updated_at: new Date().toISOString()
    };
    setSelectedForm(updatedForm);
    updateLocalStorageForm(updatedForm);
  };

  const handleFinalApproveAndLock = () => {
    if (!selectedForm) return;

    const updatedForm: VisaForm = {
      ...selectedForm,
      status: "approved" as const,
      approvedData: { ...(selectedForm.formData || {}) },
      updated_at: new Date().toISOString()
    };
    setSelectedForm(updatedForm);
    updateLocalStorageForm(updatedForm);
  };

  const handleForwardApprovedForms = async () => {
    if (!selectedClient) return;

    // Find all approved forms for this client
    const approvedForms = selectedClient.forms.filter(f => f.status === "approved");
    if (approvedForms.length === 0) {
      alert("There are no approved forms for this client to forward. Please final-approve forms first.");
      return;
    }

    if (!selectedProcessorId) {
      alert("Please select a processing team member first.");
      return;
    }

    const processor = processors.find(p => p.id === selectedProcessorId);
    const procName = processor?.name || "Processor";
    const procEmail = processor?.email || "";

    // Forward each form by merging assignment fields into its form_data
    for (const form of approvedForms) {
      const nextFormData = {
        ...(form.formData || {}),
        assigned_processor_id: selectedProcessorId,
        assigned_processor_name: procName,
        assigned_processor_email: procEmail,
        forward_note: forwardNote,
      };

      const { error } = await supabase
        .from("visa_forms")
        .update({
          status: "needs_approval",
          form_data: nextFormData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", form.id);

      if (error) {
        alert(`Failed to forward form ${form.id}: ${error.message}`);
        return;
      }
    }

    // Update local state
    const approvedFormIds = approvedForms.map(f => f.id);
    const updatedClients = clients.map((c) => {
      if (c.id === selectedClient.id) {
        const updatedForms = c.forms.map((f) => {
          if (approvedFormIds.includes(f.id)) {
            const nextFormData = {
              ...(f.formData || {}),
              assigned_processor_id: selectedProcessorId,
              assigned_processor_name: procName,
              assigned_processor_email: procEmail,
              forward_note: forwardNote,
            };
            return {
              ...f,
              status: "needs_approval" as const,
              formData: nextFormData,
            };
          }
          return f;
        });
        const updatedClient = { ...c, forms: updatedForms };
        setSelectedClient(updatedClient);
        if (selectedForm && approvedFormIds.includes(selectedForm.id)) {
          const nextFormData = {
            ...(selectedForm.formData || {}),
            assigned_processor_id: selectedProcessorId,
            assigned_processor_name: procName,
            assigned_processor_email: procEmail,
            forward_note: forwardNote,
          };
          setSelectedForm({
            ...selectedForm,
            status: "needs_approval",
            formData: nextFormData,
          });
        }
        return updatedClient;
      }
      return c;
    });

    setClients(updatedClients);
    setShowForwardModal(false);
    setForwardNote("");
    triggerToast(`Successfully forwarded approved forms to ${procName}!`);
  };

  const handleDeleteForm = async () => {
    if (!selectedForm || !selectedClient) return;

    if (!confirm("Are you sure you want to permanently delete this visa form application?")) {
      return;
    }

    const { error } = await supabase
      .from("visa_forms")
      .delete()
      .eq("id", selectedForm.id);

    if (error) {
      alert("Failed to delete visa form: " + error.message);
      return;
    }

    // Update local state
    const updatedForms = selectedClient.forms.filter((f) => f.id !== selectedForm.id);
    const updatedClient = { ...selectedClient, forms: updatedForms };
    
    const updatedClients = clients.map((c) => 
      c.id === selectedClient.id ? updatedClient : c
    );

    setClients(updatedClients);
    setSelectedClient(updatedClient);
    setSelectedForm(updatedForms[0] || null);
    triggerToast("Visa form successfully deleted.");
  };

  const handleResetFormStatus = () => {
    if (!selectedForm) return;

    const updatedForm: VisaForm = {
      ...selectedForm,
      status: "draft" as const,
      updated_at: new Date().toISOString()
    };
    setSelectedForm(updatedForm);
    updateLocalStorageForm(updatedForm);
  };

  const handleAgentEditField = (fieldId: string, value: string) => {
    if (!selectedForm) return;

    const nextFormData = { ...(selectedForm.formData || {}), [fieldId]: value };
    const updatedForm: VisaForm = {
      ...selectedForm,
      formData: nextFormData,
      updated_at: new Date().toISOString()
    };
    setSelectedForm(updatedForm);
    updateLocalStorageForm(updatedForm);
  };

  // Word Document exporter
  const handleExportWord = (form: VisaForm, clientName: string) => {
    const data = form.approvedData || form.formData || {};
    
    // Helper to get divider headers
    const getDividerRow = (fieldId: string) => {
      if (fieldId === "address_street") {
        return `
          <tr>
            <td colspan="2" style="background-color: #FAFAFA; font-weight: bold; text-align: center; font-size: 10.5pt; border: 1px solid #000000; padding: 6px 10px; font-family: 'Arial', sans-serif; color: #0F2148;">
              Full Residence Address
            </td>
          </tr>
        `;
      }
      if (fieldId === "emp_street") {
        return `
          <tr>
            <td colspan="2" style="background-color: #FAFAFA; font-weight: bold; text-align: center; font-size: 10.5pt; border: 1px solid #000000; padding: 6px 10px; font-family: 'Arial', sans-serif; color: #0F2148;">
              Employer/University/College Full Address
            </td>
          </tr>
        `;
      }
      return "";
    };

    const docHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns:v='urn:schemas-microsoft-com:vml' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>Schengen Visa Draft Form - ${clientName}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          v\\:* { behavior: url(#default#VML); }
          o\\:* { behavior: url(#default#VML); }
          w\\:* { behavior: url(#default#VML); }
          .shape { behavior: url(#default#VML); }
          
          @page Section1 {
            size: 8.5in 11.0in;
            margin: 1.0in 1.5in 1.0in 1.5in;
            mso-header-margin: .5in;
            mso-footer-margin: .5in;
            mso-header: h1;
          }
          div.Section1 { page: Section1; }
          
          body { font-family: 'Arial', sans-serif; color: #0F2148; line-height: 1.4; }
          h1 { text-align: center; margin-bottom: 2px; }
          .subtitle { color: #1F497D; font-size: 16pt; text-align: center; font-weight: bold; margin-bottom: 20px; }
          h2 { color: #5B9BD5; font-size: 14pt; margin-top: 20px; margin-bottom: 8px; font-weight: bold; }
          table { width: 100%; table-layout: fixed; border-collapse: collapse; margin-top: 5px; margin-bottom: 15px; border: 1px solid #000000; }
          th, td { word-wrap: break-word; word-break: break-all; overflow-wrap: break-word; }
        </style>
      </head>
      <body>
        <div class="Section1">
          <!-- Watermark VML Definition in Page Header -->
          <div style="mso-element:header" id="h1">
            <p class="MsoHeader" style="text-align:left;line-height:normal;margin:0;">
              <!--[if gte vml 1]>
              <v:shapetype id="_x0000_t136" coordsize="21600,21600" o:spt="136" adj="10800" path="m@7,l@8,m@5,21600l@6,21600e">
                <v:formulas/>
                <v:path textpathok="t" o:connecttype="custom" o:connectlocs="0,0"/>
                <v:textpath on="t" fitshape="t"/>
              </v:shapetype>
              <v:shape id="WaterMark" o:spid="_x0000_s2051" type="#_x0000_t136" 
                style="position:absolute;width:450pt;height:120pt;z-index:-251658240;
                mso-position-horizontal:center;mso-position-horizontal-relative:margin;
                mso-position-vertical:center;mso-position-vertical-relative:margin;
                rotation:-30;" fillcolor="#E6E9EF" stroked="f">
                <v:textpath string="QUICK HOLIDAYS" style="font-family:'Arial';font-weight:bold;"/>
              </v:shape>
              <![endif]-->
            </p>
          </div>

          <!-- Document Brand Header -->
          <h1 style="text-align: center; margin-top: 0; margin-bottom: 2px;">
            <span style="color: #E36C0A; font-family: 'Arial Black', sans-serif; font-weight: 900; font-size: 26pt; letter-spacing: 0.5px;">QUICK</span>
            <span style="color: #1F497D; font-family: 'Arial Black', sans-serif; font-weight: 900; font-size: 26pt; letter-spacing: 0.5px;"> HOLIDAYS</span>
          </h1>
          <div class="subtitle">Future Vision Organization Limited</div>
          
          <div style="font-family: 'Arial', sans-serif; font-size: 10pt; color: #0F2148; line-height: 1.45; margin-bottom: 15px; text-align: left;">
            Please fill in <strong>CLEAR BLOCK CAPITAL LETTERS</strong>.<br>
            The details you provide will be used to complete the online application form.<br>
            Any mistakes, faint or unclear writing may cause errors in your application.<br>
            It is <strong>your responsibility</strong> to provide correct and readable information.<br>
            <span style="color: #FF0000;">In case of any errors on the visa draft form, the <strong>company will not be held responsible</strong>. Please carefully <strong>re-check your form</strong> before submitting.</span>
          </div>

          <!-- Agent Name Table -->
          <table border="1" cellspacing="0" cellpadding="8" style="width: 100%; table-layout: fixed; border-collapse: collapse; margin-top: 5px; margin-bottom: 20px; border: 1px solid #000000;">
            <tr>
              <th style="border: 1px solid #000000; padding: 8px 10px; text-align: left; font-size: 10pt; background-color: #FAFAFA; font-weight: bold; width: 35%; font-family: 'Arial', sans-serif; color: #0F2148; word-wrap: break-word; word-break: break-all; overflow-wrap: break-word;">Agent Name</th>
              <td style="border: 1px solid #000000; padding: 8px 10px; text-align: left; font-size: 10pt; background-color: #FFFFFF; width: 65%; font-family: 'Arial', sans-serif; color: #0F2148; font-weight: bold; word-wrap: break-word; word-break: break-all; overflow-wrap: break-word;">${agentName.toUpperCase()}</td>
            </tr>
          </table>

          <!-- Form Sections -->
          ${visaSections.map((section) => `
            <p style="color: #FF0000; font-size: 9.5pt; font-family: 'Arial', sans-serif; margin-top: 22px; margin-bottom: 4px; text-align: left; font-weight: bold;">
              &#9888; Warning: <span style="font-weight: normal;">The company holds no responsibility for errors. Check form carefully before submitting.</span>
            </p>
            <h2 style="color: #5B9BD5; font-size: 14pt; margin-top: 0px; margin-bottom: 8px; font-weight: bold; font-family: 'Arial', sans-serif; text-align: left;">${section.title}</h2>
            <table border="1" cellspacing="0" cellpadding="8" style="width: 100%; table-layout: fixed; border-collapse: collapse; margin-top: 5px; margin-bottom: 15px; border: 1px solid #000000;">
              ${section.fields.map((field) => `
                ${getDividerRow(field.id)}
                <tr>
                  <th style="border: 1px solid #000000; padding: 8px 10px; text-align: left; font-size: 10pt; background-color: #FAFAFA; font-weight: bold; width: 35%; font-family: 'Arial', sans-serif; color: #0F2148; word-wrap: break-word; word-break: break-all; overflow-wrap: break-word;">${field.label}</th>
                  <td style="border: 1px solid #000000; padding: 8px 10px; text-align: left; font-size: 10pt; background-color: #FFFFFF; width: 65%; font-family: 'Arial', sans-serif; color: #0F2148; word-wrap: break-word; word-break: break-all; overflow-wrap: break-word;">${data[field.id] || ""}</td>
                </tr>
              `).join("")}
            </table>
          `).join("")}

          <!-- Footer Acknowledgment & Contact details -->
          <p style="color: #1F497D; font-size: 11pt; font-weight: bold; text-align: center; margin-top: 25px; margin-bottom: 20px; font-family: 'Arial', sans-serif;">
            Thank you for your cooperation and patience.
          </p>

          <div style="font-family: 'Arial', sans-serif; font-size: 10pt; color: #1F497D; text-align: left; margin-top: 15px; line-height: 1.5;">
            <strong>☎ Contact Us</strong>
            <ul style="margin-top: 5px; margin-bottom: 0; padding-left: 20px; list-style-type: disc;">
              <li>Phone: +44 800 058 4673</li>
              <li>WhatsApp: +44 7428 878936</li>
              <li>Email: info@quickholidays.co.uk</li>
            </ul>
          </div>

        </div>
      </body>
      </html>
    `;

    const blob = new Blob(["\ufeff" + docHtml], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Visa_Draft_${clientName.replace(/\s+/g, "_")}_${form.id}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const getAgentSectionStatus = (section: typeof visaSections[0], form: VisaForm) => {
    const fields = section.fields;
    const data = form.formData || {};
    const approved = form.approvedData || {};
    
    const filledCount = fields.filter((f) => {
      const val = data[f.id];
      return val !== undefined && val !== null && String(val).trim() !== "";
    }).length;

    const unapprovedCount = fields.filter((f) => {
      const val = data[f.id] || "";
      const app = approved[f.id] || "";
      return val !== app && val !== "";
    }).length;

    return {
      filled: filledCount,
      total: fields.length,
      percentage: Math.round((filledCount / fields.length) * 100),
      unapproved: unapprovedCount
    };
  };

  const handleFieldsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const containerTop = container.getBoundingClientRect().top;
    
    let closestIndex = 0;
    let minDistance = Infinity;
    
    for (let i = 0; i < visaSections.length; i++) {
      const el = document.getElementById(`section-${i}`);
      if (el) {
        const distance = Math.abs(el.getBoundingClientRect().top - containerTop - 10);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }
    }
    setActiveSectionIndex(closestIndex);
  };

  return (
    <div className="min-h-screen bg-brand-cream text-slate-800 font-sans flex h-screen overflow-hidden antialiased">
        {/* 1. SIDEBAR (Premium Light Layout) */}
      <aside className={`w-full lg:w-85 bg-white text-slate-850 flex flex-col shrink-0 border-r border-brand-gold/15 shadow-sm relative z-20 h-full ${selectedClient ? "hidden lg:flex" : "flex"}`}>
        
        {/* Sidebar Brand Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 text-left">
          <div className="flex items-center justify-between">
            <span className="font-serif text-xl font-black text-brand-navy tracking-wider uppercase">
              Quick Holidays
            </span>
            <span className="bg-brand-gold/10 text-brand-navy text-[9px] uppercase font-extrabold tracking-widest rounded-full px-2.5 py-0.5 border border-brand-gold/20 shadow-xs">
              Agent Portal
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">
            Authorized Agent: <strong className="text-slate-800 font-bold">{agentName}</strong> {agentUsername && <span className="text-slate-400">(@{agentUsername})</span>}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-100 bg-slate-50/20 shrink-0">
          <button
            onClick={() => setSidebarTab("clients")}
            className={`flex-1 py-3.5 text-xs uppercase tracking-wider font-extrabold transition-all border-b-2 cursor-pointer ${
              sidebarTab === "clients"
                ? "border-brand-gold text-brand-navy bg-brand-cream/[0.15]"
                : "border-transparent text-slate-400 hover:text-slate-650"
            }`}
          >
            Clients Form
          </button>
          <button
            onClick={() => setSidebarTab("add_client")}
            className={`flex-1 py-3.5 text-xs uppercase tracking-wider font-extrabold transition-all border-b-2 cursor-pointer ${
              sidebarTab === "add_client"
                ? "border-brand-gold text-brand-navy bg-brand-cream/[0.15]"
                : "border-transparent text-slate-400 hover:text-slate-650"
            }`}
          >
            + Add Client
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {sidebarTab === "clients" ? (
            <>
              {/* Needs Approval Filter / All Tabs */}
              <div className="flex bg-slate-100 rounded-xl p-1 shrink-0 border border-slate-200/50">
                <button
                  onClick={() => setFilterType("all")}
                  className={`flex-1 py-2 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer ${
                    filterType === "all"
                      ? "bg-white text-slate-800 shadow-xs"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  All Clients
                </button>
                <button
                  onClick={() => setFilterType("needs_approval")}
                  className={`flex-1 py-2 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all relative cursor-pointer ${
                    filterType === "needs_approval"
                      ? "bg-white text-slate-800 shadow-xs"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Needs Approval
                  {clients.some(clientNeedsApproval) && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  )}
                </button>
              </div>

              {/* Sorting Filters Controls */}
              <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 text-[10px] text-slate-500">
                <span>Sort by:</span>
                <CustomSelect
                  value={sortBy}
                  onChange={(val) => setSortBy(val as any)}
                  options={[
                    { value: "updated", label: "Last Updated" },
                    { value: "name", label: "Name (A-Z)" },
                    { value: "forms_count", label: "Forms Count" }
                  ]}
                  className="w-32"
                  buttonClassName="flex items-center gap-1 bg-transparent border-none text-slate-700 focus:outline-none cursor-pointer font-bold text-[10px] p-0 shadow-none hover:text-brand-gold transition-colors"
                />
              </div>

              {/* Search Box */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search name, email, form ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 pl-9 text-xs text-slate-800 placeholder-slate-400 focus:border-brand-gold focus:outline-none transition-all shadow-xs"
                />
                <span className="absolute left-3 top-3 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
                  </svg>
                </span>
              </div>

              {/* Clients List */}
              <div className="space-y-2 pt-1">
                {sortedClients.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs italic">
                    No clients found.
                  </div>
                ) : (
                  sortedClients.map((client) => {
                    const isSelected = selectedClient?.id === client.id;
                    const needsApproval = clientNeedsApproval(client);
                    return (
                      <div
                        key={client.id}
                        onClick={() => {
                          setSelectedClient(client);
                          // Default select first form if it exists
                          setSelectedForm(client.forms[0] || null);
                        }}
                        className={`p-4 rounded-2xl text-left border cursor-pointer transition-all duration-200 relative overflow-hidden ${
                          isSelected
                            ? "bg-brand-cream border-brand-gold text-brand-navy shadow-sm transform scale-[1.01] font-bold"
                            : "bg-white border-slate-100 text-slate-700 hover:bg-slate-50 shadow-xs"
                        }`}
                      >
                        {/* Highlights Indicator */}
                        {needsApproval && !isSelected && (
                          <div className="absolute right-0 top-0 w-2 h-full bg-amber-500" title="Unapproved changes pending review" />
                        )}

                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-black line-clamp-1">{client.name}</h4>
                          <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full shrink-0 border ${
                            isSelected 
                              ? "bg-brand-navy text-white border-brand-navy"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}>
                            {client.forms.length} Form{client.forms.length !== 1 ? "s" : ""}
                          </span>
                        </div>

                        {client.email && (
                          <p className={`text-[10px] truncate mt-1 ${isSelected ? "text-slate-650" : "text-slate-400"}`}>
                            {client.email}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-3 text-[9px] font-semibold opacity-60">
                          <span>Updated</span>
                          <span>
                            {new Date(getClientLastUpdatedTime(client)).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            /* Add Client tab - only Name is required! */
            <form onSubmit={handleAddClient} className="space-y-4 text-left p-4 bg-slate-50 rounded-2xl border border-slate-150">
              <h3 className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">New Client Profile</h3>
              
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rachel Green"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-brand-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">First Form Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spain Schengen Visa"
                  value={newClientFormTitle}
                  onChange={(e) => setNewClientFormTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-brand-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Email (Optional)</label>
                <input
                  type="email"
                  placeholder="e.g. client@example.com"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-brand-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Phone Number (Optional)</label>
                <input
                  type="tel"
                  placeholder="e.g. 7507677927"
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-brand-gold focus:outline-none"
                />
              </div>

              {addError && <p className="text-[10px] text-red-500 font-bold">{addError}</p>}
              {addSuccess && <p className="text-[10px] text-green-600 font-bold">{addSuccess}</p>}

              <button
                type="submit"
                className="w-full rounded-full bg-brand-navy hover:bg-brand-gold hover:text-brand-navy text-white transition-all duration-200 py-3 text-xs font-black cursor-pointer shadow-md mt-2"
              >
                Register Client Profile
              </button>
            </form>
          )}
        </div>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={handleLogout}
            className="w-full rounded-full border border-slate-200 hover:border-brand-gold hover:bg-brand-gold hover:text-brand-navy text-slate-500 hover:text-slate-800 transition-all duration-200 py-2.5 text-xs font-bold cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <main className={`flex-1 flex flex-col h-full overflow-hidden bg-brand-cream relative z-10 ${selectedClient ? "flex" : "hidden lg:flex"}`}>
        {selectedClient ? (
          <>
            {/* Main Header & Client Info Bar */}
            <div className="bg-white border-b border-brand-gold/15 p-6 shadow-sm shrink-0 text-left flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => {
                      setSelectedClient(null);
                      setSelectedForm(null);
                    }}
                    className="lg:hidden p-2 -ml-2 rounded-full hover:bg-slate-100 text-brand-navy cursor-pointer flex items-center justify-center shrink-0"
                    aria-label="Back to Clients"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <h2 className="font-serif text-2xl font-black text-brand-navy truncate max-w-[150px] sm:max-w-none">{selectedClient.name}</h2>
                  <span className="bg-brand-gold/10 text-brand-navy text-[10px] font-bold px-2 py-0.5 rounded-md border border-brand-gold/10 shrink-0">
                    {selectedClient.forms.length} Visa Dossier{selectedClient.forms.length !== 1 ? "s" : ""}
                  </span>
                </div>
                
                {/* Client Contact Info */}
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
                  {selectedClient.email && <span>Email: <strong className="text-slate-800 font-medium">{selectedClient.email}</strong></span>}
                  {selectedClient.email && selectedClient.phone && <span className="text-slate-300">|</span>}
                  {selectedClient.phone && <span>Phone: <strong className="text-slate-800 font-medium">{selectedClient.phone}</strong></span>}
                </div>
              </div>

              {/* Client-level action: Create New Form */}
              <button
                onClick={() => setShowCreateFormModal(true)}
                className="rounded-full bg-brand-navy hover:bg-brand-gold hover:text-brand-navy text-white text-xs font-bold px-5 py-2.5 cursor-pointer transition-all duration-200 shadow-sm"
              >
                + Create New Form
              </button>
            </div>

            {/* Split Panel: Client Forms Selector (Left) vs Selected Form Reviewer (Right) */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Form Review Core Editor (Right Panel) */}
              <div className="flex-1 flex flex-col bg-white overflow-hidden">
                {selectedForm ? (
                  <>
                    {/* Secondary Form Title & Export Bar */}
                    <div className="bg-slate-50 border-b border-brand-gold/10 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shrink-0 text-left">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Active Dossier:</span>
                          {(() => {
                            const activeFormNeedsApproval = selectedForm.status === "client_completed" || Object.keys(selectedForm.formData || {}).some((k) => {
                              const val = selectedForm.formData[k];
                              const app = selectedForm.approvedData?.[k];
                              return val !== app && val !== "";
                            });
                            return (
                              <div className="relative flex items-center gap-2">
                                <CustomSelect
                                  value={selectedForm.id}
                                  onChange={(val) => {
                                    const found = selectedClient.forms.find((f) => f.id === val);
                                    if (found) setSelectedForm(found);
                                  }}
                                  options={selectedClient.forms.map((f) => {
                                    const needsApproval = f.status === "client_completed" || Object.keys(f.formData || {}).some((k) => {
                                      const val = f.formData[k];
                                      const app = f.approvedData?.[k];
                                      return val !== app && val !== "";
                                    });
                                    let statusLabel = "Draft";
                                    if (f.status === "client_completed") statusLabel = "Needs Approval";
                                    if (f.status === "needs_approval") statusLabel = "Forwarded to Processing";
                                    if (f.status === "approved") statusLabel = "Final Approved";
                                    return {
                                      value: f.id,
                                      label: `${f.title}${f.applicantName ? ` (for ${f.applicantName})` : ""} [${statusLabel}]${needsApproval ? " ⚠️" : ""}`
                                    };
                                  })}
                                  className="w-80"
                                  buttonClassName={`flex items-center justify-between gap-2 bg-white border rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 shadow-xs transition-all cursor-pointer focus:outline-none focus:ring-1 ${
                                    activeFormNeedsApproval
                                      ? "border-amber-400 focus:border-amber-500 focus:ring-amber-500 text-amber-900 bg-amber-50/10"
                                      : "border-slate-200 hover:border-brand-gold focus:border-brand-gold focus:ring-brand-gold"
                                  }`}
                                />
                                {activeFormNeedsApproval && (
                                  <span className="bg-amber-500 text-white font-extrabold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full animate-pulse shrink-0 shadow-xs">
                                    Needs Approval
                                  </span>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                          <span className="font-mono">URL Link ID: <strong>{selectedForm.id}</strong></span>
                          <span className="text-slate-300">|</span>
                          <a
                            href={`/visa-form/${selectedForm.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-gold hover:underline font-semibold"
                          >
                            Open Client Link
                          </a>
                          <button
                            onClick={() => {
                              const secureUrl = `${window.location.origin}/visa-form/${selectedForm.id}`;
                              navigator.clipboard.writeText(secureUrl);
                              triggerToast("Client Form link copied!");
                            }}
                            className="p-0.5 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition-colors"
                            title="Copy link"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5m-6-9h7.5m-7.5 3h7.5m-7.5 3h7.5" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Exporter & State finalization */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          onClick={handleApproveAllChanges}
                          className="rounded-full border border-slate-200 hover:border-brand-gold bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-1.5 transition-all duration-200 cursor-pointer"
                        >
                          Approve All Edits
                        </button>
                        <button
                          onClick={() => handleExportWord(selectedForm, selectedClient.name)}
                          className="rounded-full bg-brand-navy hover:bg-brand-gold hover:text-brand-navy text-white text-xs font-bold px-3.5 py-1.5 transition-all duration-200 cursor-pointer shadow-sm"
                          title="Export Schengen Visa application to a Microsoft Word document (.doc)"
                        >
                          Word Doc
                        </button>
                        
                        {selectedClient.forms.some(f => f.status === "approved") && (
                          <button
                            onClick={() => setShowForwardModal(true)}
                            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-1.5 transition-all duration-200 cursor-pointer shadow-sm flex items-center gap-1.5"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                            Forward to Processing
                          </button>
                        )}

                        <button
                          onClick={handleDeleteForm}
                          className="rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3.5 py-1.5 transition-all duration-200 cursor-pointer shadow-sm flex items-center gap-1"
                          title="Delete this visa application form permanently"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete Form
                        </button>

                        {selectedForm.status !== "approved" ? (
                          <button
                            onClick={handleFinalApproveAndLock}
                            className="rounded-full bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3.5 py-1.5 transition-all duration-200 cursor-pointer shadow-sm"
                          >
                            Final Approve
                          </button>
                        ) : (
                          <button
                            onClick={handleResetFormStatus}
                            className="rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3.5 py-1.5 transition-all duration-200 cursor-pointer shadow-sm"
                          >
                            Unlock to Edit
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Form Review fields core split view */}
                    <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                      
                      {/* Sticky Navigation Sidebar on the Left */}
                      <div className="hidden md:flex w-64 border-r border-slate-100 bg-slate-50/50 flex-col overflow-y-auto p-4 shrink-0 text-left">
                        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-3">Sections</h3>
                        <div className="space-y-1.5">
                          {visaSections.map((section, idx) => {
                            const status = getAgentSectionStatus(section, selectedForm);
                            const isActive = activeSectionIndex === idx;
                            return (
                              <button
                                type="button"
                                key={section.title}
                                onClick={() => {
                                  setActiveSectionIndex(idx);
                                  const el = document.getElementById(`section-${idx}`);
                                  if (el) {
                                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                                  }
                                }}
                                className={`w-full text-left p-3 rounded-xl border text-xs transition-all relative cursor-pointer ${
                                  isActive
                                    ? "bg-white border-brand-gold text-brand-navy shadow-sm font-bold ring-1 ring-brand-gold"
                                    : "bg-white/40 border-slate-100 text-slate-655 hover:bg-white hover:text-slate-800"
                                }`}
                              >
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-serif line-clamp-1 pr-2">{section.title}</span>
                                  {status.unapproved > 0 && (
                                    <span className="bg-amber-500 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded-full shrink-0 animate-pulse">
                                      {status.unapproved} new
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 mt-1.5">
                                  <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all duration-350 ${
                                        status.percentage === 100 ? "bg-green-500" : "bg-brand-navy"
                                      }`}
                                      style={{ width: `${status.percentage}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-[9px] font-bold text-slate-400 shrink-0 font-mono">
                                    {status.filled}/{status.total}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Main Fields List scroll container */}
                      <div
                        onScroll={handleFieldsScroll}
                        className="flex-1 overflow-y-auto p-6 space-y-10"
                      >
                        {/* Banner showing status details */}
                        <div className={`border rounded-2xl p-4 text-left text-xs ${
                          selectedForm.status === "approved"
                            ? "bg-green-50 border-green-200 text-green-800"
                            : selectedForm.status === "client_completed"
                            ? "bg-amber-50 border-amber-200 text-amber-800 animate-pulse"
                            : "bg-blue-50 border-blue-200 text-blue-800"
                        }`}>
                          <div className="flex gap-2">
                            <span className="text-sm">📌</span>
                            <div>
                              <span className="font-bold block uppercase tracking-wider mb-0.5">Form Status: {selectedForm.status}</span>
                              <p className="opacity-90 leading-relaxed">
                                {selectedForm.status === "approved"
                                  ? "All client visa fields have been approved and locked. This dossier is complete and ready for processing."
                                  : selectedForm.status === "client_completed"
                                  ? "The client has marked this form as finished. Please review all fields, check unapproved edits highlighted below, and click Final Approve."
                                  : "The client is still editing this form. You can make direct edits or approve fields at any time."}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Sections List */}
                        <div className="space-y-10">
                          {visaSections.map((section, idx) => (
                            <div
                              key={section.title}
                              id={`section-${idx}`}
                              className="border border-slate-100 rounded-3xl p-6 shadow-xs text-left relative overflow-hidden bg-white scroll-mt-6"
                            >
                              <h3 className="font-serif text-base font-bold text-brand-navy mb-6 border-b border-slate-100 pb-2">
                                {section.title}
                              </h3>

                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {section.fields.map((field) => {
                                  const currentValue = (selectedForm.formData || {})[field.id] || "";
                                  const approvedValue = (selectedForm.approvedData || {})[field.id] || "";
                                  const isUnapproved = currentValue !== approvedValue && currentValue !== "";

                                  return (
                                    <div
                                      key={field.id}
                                      className={`p-4 rounded-2xl border transition-all ${
                                        isUnapproved
                                          ? "bg-amber-50/20 border-amber-300"
                                          : "bg-slate-50/20 border-slate-100"
                                      }`}
                                    >
                                      <div className="flex justify-between items-center gap-2 mb-2">
                                        <span className="text-[10px] font-bold text-brand-navy uppercase tracking-wider">
                                          {field.label}
                                        </span>

                                        {isUnapproved && (
                                          <button
                                            onClick={() => handleApproveField(field.id, currentValue)}
                                            className="bg-brand-navy hover:bg-brand-gold text-white hover:text-brand-navy text-[9px] font-black px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                                          >
                                            Approve Field
                                          </button>
                                        )}
                                      </div>

                                      <div className="space-y-2.5">
                                        <div>
                                          {field.type === "select" ? (
                                            <CustomSelect
                                              disabled={selectedForm.status === "approved"}
                                              value={currentValue}
                                              onChange={(val) => handleAgentEditField(field.id, val)}
                                              options={field.options || []}
                                              placeholder="-- Select Option --"
                                            />
                                          ) : field.type === "date" ? (
                                            <input
                                              disabled={selectedForm.status === "approved"}
                                              type="date"
                                              value={currentValue}
                                              onChange={(e) => handleAgentEditField(field.id, e.target.value)}
                                              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-gold"
                                            />
                                          ) : field.type === "textarea" ? (
                                            <textarea
                                              disabled={selectedForm.status === "approved"}
                                              rows={2}
                                              value={currentValue}
                                              onChange={(e) => handleAgentEditField(field.id, e.target.value)}
                                              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-gold"
                                            />
                                          ) : (
                                            <input
                                              disabled={selectedForm.status === "approved"}
                                              type="text"
                                              value={currentValue}
                                              onChange={(e) => handleAgentEditField(field.id, e.target.value)}
                                              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-gold"
                                            />
                                          )}
                                        </div>

                                        <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-left flex items-center justify-between gap-2">
                                          <span className="text-[9px] text-slate-400 uppercase tracking-wide shrink-0">Approved Value:</span>
                                          <span className="text-xs text-slate-700 font-bold font-mono truncate">
                                            {approvedValue ? (
                                              <span className="text-green-700">{approvedValue}</span>
                                            ) : (
                                              <span className="text-slate-400 italic font-normal">None / Blank</span>
                                            )}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </>
                ) : (
                  /* Client selected, but no form selected */
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="max-w-sm bg-slate-50 border border-slate-100 rounded-2xl p-6">
                      <p className="text-xs text-slate-500 italic">
                        No active visa form selected. Please choose a form from the client's form selection bar on the left, or click "+ Create New Form" to create a new application draft.
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </>
        ) : (
          /* Initial Welcome Workspace Page */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none bg-brand-cream/30">
            <div className="max-w-md bg-white border border-brand-gold/15 rounded-[32px] p-10 shadow-sm">
              <div className="w-16 h-16 bg-brand-cream border border-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128A9.321 9.321 0 0 1 12 19.5c-1.074 0-2.102-.18-3.06-.51M9 19.128v-.003c0-1.113.285-2.16.786-3.07M9 19.128A9.321 9.321 0 0 0 12 19.5M9.786 16.058a9.337 9.337 0 0 1-4.121-.952 4.125 4.125 0 0 1 7.533-2.493M9.786 16.058a9.38 9.38 0 0 1 2.428-1.558M12 9a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-black text-brand-navy mb-2">Welcome, Agent</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Review and manage your clients' Schengen travel documentation here. Select a client from the sidebar, click on their form, or register a new user to start compiling visa applications.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* 3. CREATE NEW FORM MODAL */}
      {showCreateFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 text-left">
          <div className="bg-brand-cream border border-brand-gold/20 rounded-[32px] max-w-sm w-full p-8 shadow-2xl relative">
            <button
              onClick={() => setShowCreateFormModal(false)}
              className="absolute right-6 top-6 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="font-serif text-xl font-bold text-brand-navy mb-1">Create Visa Form</h3>
            <p className="text-xs text-slate-500 mb-6">Set up a new collaborative Schengen visa form draft for {selectedClient?.name}.</p>

            <form onSubmit={handleCreateNewForm} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-brand-navy uppercase tracking-widest mb-1.5">Form Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spain Schengen Visa Draft"
                  value={newFormTitle}
                  onChange={(e) => setNewFormTitle(e.target.value)}
                  className="w-full rounded-xl border border-brand-gold/30 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-brand-navy uppercase tracking-widest mb-1.5">Applicant Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Emma Green (Leave blank to use client's name)"
                  value={newFormApplicantName}
                  onChange={(e) => setNewFormApplicantName(e.target.value)}
                  className="w-full rounded-xl border border-brand-gold/30 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-brand-navy hover:bg-brand-gold hover:text-brand-navy text-white transition-all duration-300 py-2.5 text-xs font-bold cursor-pointer mt-2"
              >
                Create Application Draft
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. SELECT PROCESSOR FORWARD MODAL */}
      {showForwardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 text-left">
          <div className="bg-brand-cream border border-brand-gold/20 rounded-[32px] max-w-sm w-full p-8 shadow-2xl relative">
            <button
              onClick={() => setShowForwardModal(false)}
              className="absolute right-6 top-6 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="font-serif text-xl font-bold text-brand-navy mb-1">Forward to Processing</h3>
            <p className="text-xs text-slate-500 mb-6">Select a visa processing specialist to assign and forward {selectedClient?.name}'s approved forms.</p>

            {processors.length === 0 ? (
              <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
                <p className="text-[11px] text-slate-500 font-medium">No active processing team members found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-brand-navy uppercase tracking-widest mb-1.5 font-semibold">Select Processor *</label>
                  <select
                    value={selectedProcessorId}
                    onChange={(e) => setSelectedProcessorId(e.target.value)}
                    className="w-full rounded-xl border border-brand-gold/30 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy cursor-pointer font-semibold"
                  >
                    {processors.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-brand-navy uppercase tracking-widest mb-1.5 font-semibold">Add note for processing team (optional)</label>
                  <textarea
                    placeholder="e.g. Urgent travel date, please export promptly."
                    value={forwardNote}
                    onChange={(e) => setForwardNote(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-brand-gold/30 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy resize-none font-medium"
                  />
                </div>

                <button
                  onClick={handleForwardApprovedForms}
                  className="w-full rounded-full bg-brand-navy hover:bg-brand-gold hover:text-brand-navy text-white transition-all duration-300 py-2.5 text-xs font-bold cursor-pointer mt-2"
                >
                  Forward Approved Forms
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <div
        className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-[#0F2148]/95 text-white rounded-2xl border border-brand-gold/20 shadow-[0_15px_40px_rgba(15,33,72,0.25),0_0_20px_rgba(204,163,82,0.1)] backdrop-blur-md transition-all duration-500 transform ${
          toast.visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
        }`}
      >
        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <span className="text-xs font-bold tracking-wide">{toast.message}</span>
      </div>

    </div>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  disabled?: boolean;
  value: string;
  onChange: (val: string) => void;
  options: (string | SelectOption)[];
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
}

function CustomSelect({ disabled, value, onChange, options, placeholder, className, buttonClassName }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const parsedOptions: SelectOption[] = options.map((opt) => {
    if (typeof opt === "string") {
      return { value: opt, label: opt };
    }
    return opt;
  });

  const selectedOption = parsedOptions.find((opt) => opt.value === value);
  const selectedLabel = selectedOption ? selectedOption.label : placeholder || "-- Select Option --";

  return (
    <div ref={dropdownRef} className={`relative z-10 text-left ${className || "w-full"}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClassName || `w-full text-left rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-850 bg-white focus:outline-none focus:border-brand-gold transition-all flex items-center justify-between cursor-pointer ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        <span className={value ? "text-slate-800 font-bold" : "text-slate-400"}>{selectedLabel}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className={`w-3 h-3 text-slate-500 transition-transform duration-200 shrink-0 ml-1.5 ${isOpen ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen && !disabled && (
        <div className="absolute right-0 mt-1.5 w-48 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl z-50 py-1">
          {placeholder && (
            <div
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className="px-3.5 py-2 text-xs text-slate-400 hover:bg-slate-50 cursor-pointer font-medium"
            >
              {placeholder}
            </div>
          )}
          {parsedOptions.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`px-3.5 py-2 text-xs hover:bg-brand-cream/80 hover:text-brand-navy cursor-pointer font-bold transition-colors flex items-center justify-between ${
                value === opt.value ? "bg-brand-cream text-brand-navy" : "text-slate-700"
              }`}
            >
              <span>{opt.label}</span>
              {value === opt.value && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5 text-brand-gold">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
