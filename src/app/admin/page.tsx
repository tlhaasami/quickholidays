"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TESTIMONIALS, DESTINATIONS, SCHENGEN_DESTINATIONS, heroBg, whyChooseUsBg, formBg, mapStoredTestimonials, mapStoredDestinations, mapStoredFlags } from "@/constants/data";
import { visaSections } from "@/constants/visaFields";
import { createClient } from "@/lib/supabase/client";

interface UserRequest {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "agent" | "processor" | "admin";
  status: "pending" | "approved" | "suspended";
  created_at: string;
  password?: string;
}

interface ConfirmModalState {
  isOpen: boolean;
  step: 1 | 2;
  action: "approve" | "reject";
  userId: string;
  userName: string;
  userEmail: string;
  userRole: "agent" | "processor" | "admin";
}

interface CustomSelectProps {
  value: any;
  onChange: (val: any) => void;
  options: { label: string; value: any }[];
  className?: string;
}

function CustomSelect({ value, onChange, options, className = "" }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-full bg-white border border-slate-200 px-6 py-2.5 text-sm text-left font-medium text-slate-700 hover:border-brand-gold focus:outline-none focus:border-brand-gold transition-all duration-200 cursor-pointer select-none"
      >
        <span>{selectedOption ? selectedOption.label : ""}</span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30 cursor-default" onClick={() => setIsOpen(false)} />
          <div className="absolute z-40 w-full mt-2 bg-white border border-slate-200 rounded-[20px] shadow-lg max-h-60 overflow-y-auto py-2 animate-fadeIn text-left">
            {options.map((opt) => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-6 py-2.5 text-sm transition-colors duration-150 cursor-pointer ${
                  opt.value === value
                    ? "bg-brand-navy text-white font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-brand-navy"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [animateCard, setAnimateCard] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);
  // Active Navigation Tab State
  const [activeTab, setActiveTab] = useState<"users" | "footer" | "reviews" | "destinations" | "countries" | "backgrounds" | "agents_work">("users");
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  // Dashboard state
  const [requests, setRequests] = useState<UserRequest[]>([]);

  // Add User Form States
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"agent" | "processor" | "admin">("agent");
  const [allClients, setAllClients] = useState<any[]>([]);
  const [expandedAgentId, setExpandedAgentId] = useState<string | null>(null);
  const [agentsSearchQuery, setAgentsSearchQuery] = useState("");
  const [previewForm, setPreviewForm] = useState<any>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewActiveTab, setPreviewActiveTab] = useState(0);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  // Change Password States
  const [changePasswordUser, setChangePasswordUser] = useState<UserRequest | null>(null);
  const [changePasswordVal, setChangePasswordVal] = useState("");
  const [changePasswordError, setChangePasswordError] = useState("");
  const [changePasswordSuccess, setChangePasswordSuccess] = useState("");
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);

  // Custom UI Dialog Modal State (Replaces native confirm dialogs)
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    step: 1,
    action: "approve",
    userId: "",
    userName: "",
    userEmail: "",
    userRole: "agent",
  });

  // Content Management States
  const [adminTestimonials, setAdminTestimonials] = useState<any[]>([]);
  const [adminDestinations, setAdminDestinations] = useState<any[]>([]);
  const [adminFlags, setAdminFlags] = useState<any[]>([]);
  const [adminFooter, setAdminFooter] = useState({
    email: "info@quickholidays.co.uk",
    phone: "+448000584673",
    address: "39 Stanley Street, Fairfield,\nLiverpool, L7 0JN",
    copyright: "Quick Holidays. All rights reserved.",
    whatsapp: "",
    linkedin: "",
    instagram: "",
    facebook: "",
  });

  // Footer Form States
  const [editFooterEmail, setEditFooterEmail] = useState("");
  const [editFooterPhone, setEditFooterPhone] = useState("");
  const [editFooterAddress, setEditFooterAddress] = useState("");
  const [editFooterCopyright, setEditFooterCopyright] = useState("");
  const [editFooterWhatsapp, setEditFooterWhatsapp] = useState("");
  const [editFooterLinkedin, setEditFooterLinkedin] = useState("");
  const [editFooterInstagram, setEditFooterInstagram] = useState("");
  const [editFooterFacebook, setEditFooterFacebook] = useState("");

  // Review Form States
  const [reviewName, setReviewName] = useState("");
  const [reviewLocation, setReviewLocation] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewQuote, setReviewQuote] = useState("");
  const [reviewAvatar, setReviewAvatar] = useState("");

  // Destination Form States
  const [destName, setDestName] = useState("");
  const [destImage, setDestImage] = useState("");

  // Flag/Country Form States
  const [flagName, setFlagName] = useState("");
  const [flagSlug, setFlagSlug] = useState("");
  const [flagImage, setFlagImage] = useState("");

  // Content Save Messages
  const [contentSuccess, setContentSuccess] = useState("");
  const [contentError, setContentError] = useState("");
  // Dynamic Background Images States
  const [customLoginBg, setCustomLoginBg] = useState<string | null>(null);
  const [customHeroBg, setCustomHeroBg] = useState<string | null>(null);
  const [customWhyBg, setCustomWhyBg] = useState<string | null>(null);
  const [customConsultationBg, setCustomConsultationBg] = useState<string | null>(null);
  const [reviewSortOrder, setReviewSortOrder] = useState<"newest" | "highest" | "lowest">("newest");

  // Load state and profiles
  useEffect(() => {
    setAnimateCard(true);

    const checkAuthAndLoad = async () => {
      const { data: { user: sbUser } } = await supabase.auth.getUser();
      if (sbUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, status")
          .eq("id", sbUser.id)
          .single();
        
        if (profile && profile.role === "admin" && profile.status === "approved") {
          setIsAuthenticated(true);
        } else {
          window.location.href = window.location.origin.replace("admin.", "") + "/login";
          return;
        }
      } else {
        window.location.href = window.location.origin.replace("admin.", "") + "/login";
        return;
      }

      // Load backgrounds
      setCustomLoginBg(localStorage.getItem("quick_holidays_bg_login"));
      setCustomHeroBg(localStorage.getItem("quick_holidays_bg_hero"));
      setCustomWhyBg(localStorage.getItem("quick_holidays_bg_why_choose_us"));
      setCustomConsultationBg(localStorage.getItem("quick_holidays_bg_consultation_form"));

      // Load user signup requests from profiles
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, name, username, email, role, status, created_at")
        .order("created_at", { ascending: false });
      
      if (!error && profiles) {
        const mapped = profiles.map((p: any) => ({
          id: p.id,
          name: p.name,
          username: p.username,
          email: p.email,
          role: p.role,
          status: p.status,
          created_at: new Date(p.created_at).toLocaleString(),
        }));
        setRequests(mapped);
      }

      // Load all clients and forms for admin view
      const { data: clientsData, error: clientsErr } = await supabase
        .from("clients")
        .select(`
          id,
          name,
          email,
          phone,
          agent_id,
          visa_forms (
            id,
            title,
            applicant_name,
            status,
            created_at,
            updated_at
          )
        `);
      
      if (!clientsErr && clientsData) {
        setAllClients(clientsData);
      }
    };

    checkAuthAndLoad();

    // Load Testimonials
    const storedTestimonials = localStorage.getItem("quick_holidays_testimonials");
    if (storedTestimonials) {
      try {
        setAdminTestimonials(mapStoredTestimonials(JSON.parse(storedTestimonials)));
      } catch (e) {
        setAdminTestimonials(TESTIMONIALS);
      }
    } else {
      localStorage.setItem("quick_holidays_testimonials", JSON.stringify(TESTIMONIALS));
      setAdminTestimonials(TESTIMONIALS);
    }

    // Load Destinations
    const storedDestinations = localStorage.getItem("quick_holidays_destinations");
    if (storedDestinations) {
      try {
        setAdminDestinations(mapStoredDestinations(JSON.parse(storedDestinations)));
      } catch (e) {
        setAdminDestinations(DESTINATIONS);
      }
    } else {
      localStorage.setItem("quick_holidays_destinations", JSON.stringify(DESTINATIONS));
      setAdminDestinations(DESTINATIONS);
    }

    // Load Flags
    const storedFlags = localStorage.getItem("quick_holidays_flags");
    if (storedFlags) {
      try {
        setAdminFlags(mapStoredFlags(JSON.parse(storedFlags)));
      } catch (e) {
        setAdminFlags(SCHENGEN_DESTINATIONS);
      }
    } else {
      localStorage.setItem("quick_holidays_flags", JSON.stringify(SCHENGEN_DESTINATIONS));
      setAdminFlags(SCHENGEN_DESTINATIONS);
    }

    // Load Footer Info
    const storedFooter = localStorage.getItem("quick_holidays_footer_info");
    if (storedFooter) {
      const parsed = JSON.parse(storedFooter);
      setAdminFooter(parsed);
      setEditFooterEmail(parsed.email || "info@quickholidays.co.uk");
      setEditFooterPhone(parsed.phone || "+448000584673");
      setEditFooterAddress(parsed.address || "39 Stanley Street, Fairfield,\nLiverpool, L7 0JN");
      setEditFooterCopyright(parsed.copyright || "Quick Holidays. All rights reserved.");
      setEditFooterWhatsapp(parsed.whatsapp || "");
      setEditFooterLinkedin(parsed.linkedin || "");
      setEditFooterInstagram(parsed.instagram || "");
      setEditFooterFacebook(parsed.facebook || "");
    } else {
      const defaultFooter = {
        email: "info@quickholidays.co.uk",
        phone: "+448000584673",
        address: "39 Stanley Street, Fairfield,\nLiverpool, L7 0JN",
        copyright: "Quick Holidays. All rights reserved.",
        whatsapp: "",
        linkedin: "",
        instagram: "",
        facebook: "",
      };
      localStorage.setItem("quick_holidays_footer_info", JSON.stringify(defaultFooter));
      setAdminFooter(defaultFooter);
      setEditFooterEmail(defaultFooter.email);
      setEditFooterPhone(defaultFooter.phone);
      setEditFooterAddress(defaultFooter.address);
      setEditFooterCopyright(defaultFooter.copyright);
      setEditFooterWhatsapp(defaultFooter.whatsapp);
      setEditFooterLinkedin(defaultFooter.linkedin);
      setEditFooterInstagram(defaultFooter.instagram);
      setEditFooterFacebook(defaultFooter.facebook);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("Please log in through the main Portal sign in page.");
  };

  const openPreview = async (formId: string) => {
    setIsPreviewOpen(true);
    setPreviewLoading(true);
    setPreviewActiveTab(0);
    setPreviewForm(null);
    try {
      const { data, error } = await supabase
        .from("visa_forms")
        .select(`
          id,
          title,
          applicant_name,
          status,
          created_at,
          updated_at,
          form_data,
          approved_data,
          clients (
            id,
            name,
            email,
            phone
          )
        `)
        .eq("id", formId)
        .single();

      if (!error && data) {
        setPreviewForm(data);
      } else {
        console.error("Failed to load form for preview:", error);
      }
    } catch (err) {
      console.error("Error fetching preview form:", err);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleApproveForm = async (formId: string) => {
    try {
      const { error } = await supabase
        .from("visa_forms")
        .update({
          status: "approved",
          updated_at: new Date().toISOString()
        })
        .eq("id", formId);
        
      if (error) {
        alert("Failed to approve form: " + error.message);
        return;
      }
      
      // Update local state by setting form status to 'approved' in allClients
      setAllClients((prevClients) => 
        prevClients.map((client) => {
          if (!client.visa_forms) return client;
          return {
            ...client,
            visa_forms: client.visa_forms.map((f: any) => 
              f.id === formId ? { ...f, status: "approved", updated_at: new Date().toISOString() } : f
            )
          };
        })
      );
      
      // Update preview form status if open
      if (previewForm && previewForm.id === formId) {
        setPreviewForm((prev: any) => ({ ...prev, status: "approved" }));
      }
      
      alert("Visa form approved successfully!");
    } catch (err: any) {
      alert("Error approving form: " + err.message);
    }
  };

  const handleDeleteForm = async (formId: string) => {
    if (!confirm("Are you sure you want to permanently delete this visa application form?")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from("visa_forms")
        .delete()
        .eq("id", formId);
        
      if (error) {
        alert("Failed to delete form: " + error.message);
        return;
      }
      
      // Update local state by removing the form from allClients
      setAllClients((prevClients) => 
        prevClients.map((client) => {
          if (!client.visa_forms) return client;
          return {
            ...client,
            visa_forms: client.visa_forms.filter((f: any) => f.id !== formId)
          };
        })
      );
      
      // If the deleted form was open in the preview modal, close it
      if (previewForm && previewForm.id === formId) {
        setIsPreviewOpen(false);
      }
      
      alert("Visa form deleted successfully!");
    } catch (err: any) {
      alert("Error deleting form: " + err.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("user_session");
    setIsAuthenticated(false);
    window.location.href = window.location.origin.replace("admin.", "") + "/login";
  };

  const updateRequestStatus = async (id: string, newStatus: "approved" | "suspended" | "pending") => {
    const { error } = await supabase
      .from("profiles")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      alert("Failed to update status: " + error.message);
      return;
    }

    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );
  };

  const deleteRequest = async (id: string) => {
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Failed to delete request: " + error.message);
      return;
    }

    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  // Open custom modal for approval check
  const triggerApproveModal = (user: UserRequest) => {
    setConfirmModal({
      isOpen: true,
      step: 1,
      action: "approve",
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
    });
  };

  // Open custom modal for rejection check
  const triggerRejectModal = (user: UserRequest) => {
    setConfirmModal({
      isOpen: true,
      step: 1,
      action: "reject",
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
    });
  };

  // Process the action committed in the custom modal
  const handleCommitModalAction = () => {
    if (confirmModal.action === "approve") {
      updateRequestStatus(confirmModal.userId, "approved");
    } else {
      deleteRequest(confirmModal.userId);
    }
    // Close modal
    setConfirmModal((m) => ({ ...m, isOpen: false }));
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changePasswordUser || !changePasswordVal) return;

    setChangePasswordError("");
    setChangePasswordSuccess("");
    setChangePasswordLoading(true);

    try {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: changePasswordUser.id, newPassword: changePasswordVal }),
      });
      const data = await response.json();
      if (data.error) {
        setChangePasswordError(data.error);
      } else {
        setChangePasswordSuccess("Password updated successfully!");
        setChangePasswordVal("");
        setTimeout(() => {
          setChangePasswordUser(null);
          setChangePasswordSuccess("");
        }, 1500);
      }
    } catch (err: any) {
      setChangePasswordError("Failed to update password. Please try again.");
    } finally {
      setChangePasswordLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setAddSuccess("");

    if (!newFullName || !newUsername || !newEmail || !newPassword) {
      setAddError("Please fill out all fields.");
      return;
    }

    const cleanedFullName = newFullName.trim();
    const cleanedUsername = newUsername.trim().toLowerCase();
    const cleanedEmail = newEmail.trim().toLowerCase();

    // Check unique username in DB
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", cleanedUsername)
      .maybeSingle();

    if (existingUser) {
      setAddError("This username is already taken. Please choose another one.");
      return;
    }

    // Register user in Supabase
    const { data: authData, error: signupErr } = await supabase.auth.signUp({
      email: cleanedEmail,
      password: newPassword,
      options: {
        data: {
          name: cleanedFullName,
          username: cleanedUsername,
          role: newRole,
        }
      }
    });

    if (signupErr) {
      setAddError(signupErr.message || "Failed to create user account.");
      return;
    }

    if (authData.user) {
      // Force update profiles status to 'approved' and save the selected role
      const { error: updateErr } = await supabase
        .from("profiles")
        .update({ status: "approved", role: newRole })
        .eq("id", authData.user.id);
      
      if (updateErr) {
        console.error("Failed to set user status to approved:", updateErr.message);
      }
    }

    // Reload the requests list
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, name, username, email, role, status, created_at")
      .order("created_at", { ascending: false });
    
    if (profiles) {
      const mapped = profiles.map((p: any) => ({
        id: p.id,
        name: p.name,
        username: p.username,
        email: p.email,
        role: p.role,
        status: p.status,
        created_at: new Date(p.created_at).toLocaleString(),
      }));
      setRequests(mapped);
    }

    setAddSuccess(`Account for ${newFullName.trim()} created successfully!`);
    
    // Clear inputs
    setNewFullName("");
    setNewUsername("");
    setNewEmail("");
    setNewPassword("");
    
    setTimeout(() => {
      setAddSuccess("");
      setShowAddUserForm(false);
    }, 2500);
  };

  // Reusable client-side image optimization pipeline using HTML Canvas
  const processImageFile = (
    file: File,
    width: number,
    height: number,
    crop: boolean,
    callback: (base64: string) => void
  ) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new globalThis.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          if (crop) {
            const imgAspect = img.width / img.height;
            const targetAspect = width / height;
            let srcX = 0, srcY = 0, srcW = img.width, srcH = img.height;

            if (imgAspect > targetAspect) {
              srcW = img.height * targetAspect;
              srcX = (img.width - srcW) / 2;
            } else {
              srcH = img.width / targetAspect;
              srcY = (img.height - srcH) / 2;
            }
            ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, width, height);
          } else {
            ctx.drawImage(img, 0, 0, width, height);
          }
          let dataUrl = canvas.toDataURL("image/webp", 0.75);
          if (!dataUrl.startsWith("data:image/webp")) {
            dataUrl = canvas.toDataURL("image/jpeg", 0.75);
          }
          callback(dataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // File to base64 helper with size target optimization pipeline
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (base64: string) => void,
    type: "avatar" | "destination" | "flag"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      let width = 600;
      let height = 600;
      if (type === "avatar") {
        width = 120;
        height = 120;
      } else if (type === "flag") {
        width = 120;
        height = 80;
      }
      processImageFile(file, width, height, true, callback);
    }
  };

  const handleUpdateFooter = (e: React.FormEvent) => {
    e.preventDefault();
    setContentSuccess("");
    setContentError("");

    const updatedFooter = {
      email: editFooterEmail,
      phone: editFooterPhone,
      address: editFooterAddress,
      copyright: editFooterCopyright,
      whatsapp: editFooterWhatsapp,
      linkedin: editFooterLinkedin,
      instagram: editFooterInstagram,
      facebook: editFooterFacebook,
    };

    localStorage.setItem("quick_holidays_footer_info", JSON.stringify(updatedFooter));
    setAdminFooter(updatedFooter);
    setContentSuccess("Footer contact details updated successfully!");
    setTimeout(() => setContentSuccess(""), 3000);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    setContentSuccess("");
    setContentError("");

    if (!reviewName || !reviewLocation || !reviewQuote) {
      setContentError("Please fill out all review fields.");
      return;
    }

    const defaultAvatar = adminTestimonials[0]?.avatar || "/assets/profile-icons/review-profile-1.jpg";

    const newReview = {
      name: reviewName,
      location: reviewLocation,
      rating: Number(reviewRating),
      quote: reviewQuote,
      avatar: reviewAvatar || defaultAvatar,
    };

    const updated = [newReview, ...adminTestimonials];
    localStorage.setItem("quick_holidays_testimonials", JSON.stringify(updated));
    setAdminTestimonials(updated);
    setContentSuccess(`Review by ${reviewName} added successfully!`);

    setReviewName("");
    setReviewLocation("");
    setReviewRating(5);
    setReviewQuote("");
    setReviewAvatar("");
    setTimeout(() => setContentSuccess(""), 3000);
  };

  const handleDeleteReview = (index: number) => {
    setContentSuccess("");
    const updated = adminTestimonials.filter((_, idx) => idx !== index);
    localStorage.setItem("quick_holidays_testimonials", JSON.stringify(updated));
    setAdminTestimonials(updated);
    setContentSuccess("Review deleted successfully!");
    setTimeout(() => setContentSuccess(""), 3000);
  };

  const handleAddDestination = (e: React.FormEvent) => {
    e.preventDefault();
    setContentSuccess("");
    setContentError("");

    if (!destName || !destImage) {
      setContentError("Please fill in destination name and upload/provide an image.");
      return;
    }

    const newDest = {
      name: destName,
      image: destImage,
    };

    const updated = [...adminDestinations, newDest];
    localStorage.setItem("quick_holidays_destinations", JSON.stringify(updated));
    setAdminDestinations(updated);
    setContentSuccess(`Destination ${destName} added successfully!`);

    setDestName("");
    setDestImage("");
    setTimeout(() => setContentSuccess(""), 3000);
  };

  const handleDeleteDestination = (index: number) => {
    setContentSuccess("");
    const updated = adminDestinations.filter((_, idx) => idx !== index);
    localStorage.setItem("quick_holidays_destinations", JSON.stringify(updated));
    setAdminDestinations(updated);
    setContentSuccess("Destination deleted successfully!");
    setTimeout(() => setContentSuccess(""), 3000);
  };

  const handleAddFlag = (e: React.FormEvent) => {
    e.preventDefault();
    setContentSuccess("");
    setContentError("");

    if (!flagName || !flagSlug || !flagImage) {
      setContentError("Please fill in country name, slug, and upload/provide a flag image.");
      return;
    }

    const newFlag = {
      name: flagName,
      slug: flagSlug.trim().toLowerCase(),
      flag: flagImage,
    };

    const updated = [...adminFlags, newFlag];
    localStorage.setItem("quick_holidays_flags", JSON.stringify(updated));
    setAdminFlags(updated);
    setContentSuccess(`Country flag for ${flagName} added successfully!`);

    setFlagName("");
    setFlagSlug("");
    setFlagImage("");
    setTimeout(() => setContentSuccess(""), 3000);
  };

  const handleDeleteFlag = (index: number) => {
    setContentSuccess("");
    const updated = adminFlags.filter((_, idx) => idx !== index);
    localStorage.setItem("quick_holidays_flags", JSON.stringify(updated));
    setAdminFlags(updated);
    setContentSuccess("Country flag deleted successfully!");
    setTimeout(() => setContentSuccess(""), 3000);
  };

  const handleBgChange = (e: React.ChangeEvent<HTMLInputElement>, key: string, setter: (val: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file, 1280, 720, true, (base64String) => {
        localStorage.setItem(key, base64String);
        setter(base64String);
        setContentSuccess("Background image updated successfully!");
        setTimeout(() => setContentSuccess(""), 3000);
      });
    }
  };

  const handleBgReset = (key: string, setter: (val: string | null) => void) => {
    localStorage.removeItem(key);
    setter(null);
    setContentSuccess("Background image restored to default!");
    setTimeout(() => setContentSuccess(""), 3000);
  };

  // Login View
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen flex items-center justify-start bg-white font-sans p-6 md:pl-28 select-none overflow-hidden">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes float-plane {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(8deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          .animate-plane {
            animation: float-plane 4s ease-in-out infinite;
          }
        `}} />
        {/* Back to Site Button */}
        <div className="absolute top-6 right-6 z-20">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all duration-300 hover:scale-[1.04]"
          >
            Back to Site
          </Link>
        </div>
        
        {/* CLEAR background image layer */}
        <div className="absolute inset-0 w-full h-full z-0">
          {customLoginBg ? (
            <img
              src={customLoginBg}
              alt="Admin Login Background"
              onLoad={() => setBgLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover object-center select-none transition-all duration-[1500ms] ease-out ${
                bgLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-[1.05] blur-sm"
              }`}
            />
          ) : (
            <Image
              src={heroBg}
              alt="Admin Login Background"
              fill
              sizes="100vw"
              onLoad={() => setBgLoaded(true)}
              className={`object-cover object-center select-none transition-all duration-[1500ms] ease-out ${
                bgLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-[1.05] blur-sm"
              }`}
              priority
            />
          )}
          {/* Light overlay to remove blue shading and keep the image natural */}
          <div className="absolute inset-0 bg-white/10 pointer-events-none" />
        </div>

        {/* Main glassmorphic card positioned to the left with entrance animation - gold border top & shadow glow */}
        <div className={`relative z-10 w-full max-w-lg bg-[#0F2148]/80 border border-white/10 border-t-4 border-t-brand-gold/60 rounded-[32px] p-8 shadow-2xl shadow-[0_20px_50px_rgba(15,33,72,0.35),0_0_35px_rgba(204,163,82,0.15)] backdrop-blur-md text-left flex flex-col justify-center dark-autofill transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          animateCard ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
        }`}>
          
          {/* Branding Title with animated aeroplane */}
          <div className="mb-6 flex justify-between items-start relative">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold block mb-2">
                System Administrator
              </span>
              <h1 className="font-serif text-3xl font-extrabold text-white">
                Admin Sign In
              </h1>
            </div>
            <div className="animate-plane text-brand-gold shrink-0 mt-1 mr-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8 drop-shadow-[0_0_8px_rgba(204,163,82,0.6)]">
                <path d="M3.4 20.4l17.4-8.4L3.4 3.6v6.6l12 1.8-12 1.8v6.6z" />
              </svg>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 text-red-300 text-xs font-semibold rounded-2xl p-3.5 mb-5 border border-red-500/20">
              {error}
            </div>
          )}

          <div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="admin-user" className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-2 ml-1">
                  Username
                </label>
                <input
                  id="admin-user"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full rounded-full bg-[#182C54]/60 border border-white/10 px-6 py-2.5 text-sm text-white placeholder-white/30 focus:bg-[#182C54]/80 focus:outline-none focus:border-brand-gold transition-all duration-200"
                />
              </div>

              <div>
                <label htmlFor="admin-pass" className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-2 ml-1">
                  Password
                </label>
                <input
                  id="admin-pass"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-full bg-[#182C54]/60 border border-white/10 px-6 py-2.5 text-sm text-white placeholder-white/30 focus:bg-[#182C54]/80 focus:outline-none focus:border-brand-gold transition-all duration-200"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center rounded-full bg-brand-gold hover:bg-brand-gold-dark text-brand-navy hover:scale-[1.01] active:scale-[0.99] hover:shadow-[0_0_20px_rgba(204,163,82,0.45)] px-8 py-3 text-sm font-bold transition-all duration-300 cursor-pointer"
                >
                  Login to System
                </button>
              </div>
            </form>

            {/* Separator line */}
            <div className="flex items-center gap-4 my-5">
              <span className="grow h-[1px] bg-white/10" />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Or continue with Google</span>
              <span className="grow h-[1px] bg-white/10" />
            </div>

            {/* Continue with Google button with multicolor Google logo */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-bold py-2.5 px-6 text-xs transition-all duration-300 shadow-sm hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] active:scale-[0.98] cursor-pointer group"
            >
              <svg className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="text-left text-[10px] text-white/40 mt-5 border-t border-white/10 pt-4 ml-1">
            Secure administrator console area.
          </div>

        </div>

      </div>
    );
  }

  const getTabHeader = () => {
    switch (activeTab) {
      case "users":
        return {
          title: "System Control Room",
          subtitle: "Welcome back, Administrator. Manage registration requests, add team members, and check active accounts.",
        };
      case "footer":
        return {
          title: "Footer & Social Settings",
          subtitle: "Manage public site contact details, physical address, social links, and copyright text.",
        };
      case "reviews":
        return {
          title: "Testimonials Manager",
          subtitle: "Manage feedback cards. Add reviews, delete submissions, and sort by rating.",
        };
      case "destinations":
        return {
          title: "Places & Destinations Manager",
          subtitle: "Manage popular destinations visual cards rendered on your homepage.",
        };
      case "countries":
        return {
          title: "Schengen Visa Countries Manager",
          subtitle: "Manage country flags and names displayed on the Schengen Visa countries page.",
        };
      case "backgrounds":
        return {
          title: "Website Wallpapers Manager",
          subtitle: "Upload custom background wallpapers across main website pages and portal login screens.",
        };
      case "agents_work":
        return {
          title: "Agents & Client Workspaces",
          subtitle: "Oversee agent pipelines, search all client records, and preview detailed visa application forms.",
        };
      default:
        return {
          title: "System Control Room",
          subtitle: "Welcome back, Administrator.",
        };
    }
  };

  const tabHeader = getTabHeader();
  const pendingRequests = requests.filter((r) => r.status === "pending" && r.role !== "admin");
  const approvedUsers = requests.filter((r) => (r.status === "approved" || r.status === "suspended") && r.role !== "admin");

  return (
    <div className="min-h-screen bg-brand-cream text-slate-800 font-sans flex">
      
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-[#0F2148] text-white border-r border-white/10 z-30 justify-between p-6 select-none">
        <div className="space-y-8">
          {/* Logo / Branding */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-6">
            <span className="font-serif text-xl font-bold tracking-tight text-brand-gold">
              Quick Holidays
            </span>
            <span className="bg-amber-500/20 text-amber-500 text-[9px] uppercase font-bold tracking-wider rounded-md px-1.5 py-0.5 border border-amber-500/20">
              Admin
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("users");
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group ${
                activeTab === "users" ? "bg-brand-gold text-brand-navy font-bold shadow-md shadow-brand-gold/15" : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <svg className={`w-4 h-4 shrink-0 group-hover:scale-110 transition-transform duration-200 ${activeTab === "users" ? "text-brand-navy" : "text-brand-gold"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Users & Requests
            </a>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("agents_work");
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group ${
                activeTab === "agents_work" ? "bg-brand-gold text-brand-navy font-bold shadow-md shadow-brand-gold/15" : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <svg className={`w-4 h-4 shrink-0 group-hover:scale-110 transition-transform duration-200 ${activeTab === "agents_work" ? "text-brand-navy" : "text-brand-gold"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Agents & Client Forms
            </a>

            <div className="pt-4 border-t border-white/10 space-y-1">
              <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest px-4 block mb-2">Content Manager</span>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("footer");
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 group ${
                  activeTab === "footer" ? "bg-brand-gold text-brand-navy font-bold shadow-md shadow-brand-gold/15" : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg className={`w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform duration-200 ${activeTab === "footer" ? "text-brand-navy" : "text-indigo-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                Edit Footer Info
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("reviews");
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 group ${
                  activeTab === "reviews" ? "bg-brand-gold text-brand-navy font-bold shadow-md shadow-brand-gold/15" : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg className={`w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform duration-200 ${activeTab === "reviews" ? "text-brand-navy" : "text-rose-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Edit Client Reviews
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("destinations");
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 group ${
                  activeTab === "destinations" ? "bg-brand-gold text-brand-navy font-bold shadow-md shadow-brand-gold/15" : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg className={`w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform duration-200 ${activeTab === "destinations" ? "text-brand-navy" : "text-teal-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Edit Popular Places
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("countries");
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 group ${
                  activeTab === "countries" ? "bg-brand-gold text-brand-navy font-bold shadow-md shadow-brand-gold/15" : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg className={`w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform duration-200 ${activeTab === "countries" ? "text-brand-navy" : "text-red-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21v8h-6l-1-1H5v4m0 4h18" />
                </svg>
                Edit Country Flags
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("backgrounds");
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 group ${
                  activeTab === "backgrounds" ? "bg-brand-gold text-brand-navy font-bold shadow-md shadow-brand-gold/15" : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg className={`w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform duration-200 ${activeTab === "backgrounds" ? "text-brand-navy" : "text-purple-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Edit BGs & Wallpaper
              </a>
            </div>
          </nav>
        </div>

        {/* Logout at bottom */}
        <div className="border-t border-white/10 pt-6">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-red-500/15 hover:bg-red-600 text-red-400 hover:text-white text-xs font-bold py-3 px-6 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 min-h-screen pt-0 md:pt-8 pb-16">
        {/* Mobile top bar for Admin Dashboard */}
        <div className="md:hidden sticky top-0 z-40 bg-[#0F2148] text-white flex items-center justify-between p-4 shadow-md shrink-0">
          <span className="font-serif text-lg font-bold tracking-wider uppercase text-brand-gold">
            Quick Holidays Admin
          </span>
          <button
            onClick={() => setIsAdminMenuOpen(true)}
            className="p-2 rounded-md hover:bg-white/10 text-white focus:outline-none cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="pt-8 md:pt-0">
      
      {/* Top Welcome Title Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-brand-navy/10 pb-6 mb-8 text-left">
          <div>
            <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight animate-fadeIn">
              {tabHeader.title}
            </h1>
            <p className="text-slate-600 text-sm mt-1 animate-fadeIn">
              {tabHeader.subtitle}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="md:hidden rounded-full bg-brand-navy hover:bg-brand-gold hover:text-brand-navy text-white text-xs font-bold px-6 py-2.5 transition-all duration-300 shadow-md hover:scale-[1.03] cursor-pointer"
          >
            Log Out from Portal
          </button>
        </div>

        {/* Enhanced Full-Width UI Dashboard Container */}
        <div className="space-y-8">
          {activeTab === "users" && (
            <>
              {/* Stats section */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Stat 1: Pending Requests */}
            <div className="bg-white rounded-3xl p-6 border border-brand-gold/15 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-center justify-between">
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Requests</p>
                <p className="text-3xl font-extrabold text-amber-500 mt-2">{pendingRequests.length}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 ml-3">
                <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            {/* Stat 2: Total Registrations */}
            <div className="bg-white rounded-3xl p-6 border border-brand-gold/15 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-center justify-between">
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Registered</p>
                <p className="text-3xl font-extrabold text-brand-navy mt-2">{requests.length}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-brand-navy/5 text-brand-navy flex items-center justify-center shrink-0 ml-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>

            {/* Stat 3: Approved Agents */}
            <div className="bg-white rounded-3xl p-6 border border-brand-gold/15 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-center justify-between">
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Approved Agents</p>
                <p className="text-3xl font-extrabold text-emerald-600 mt-2">
                  {requests.filter((r) => r.role === "agent" && r.status === "approved").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 ml-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            {/* Stat 4: Approved Processors */}
            <div className="bg-white rounded-3xl p-6 border border-brand-gold/15 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-center justify-between">
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Approved Processors</p>
                <p className="text-3xl font-extrabold text-blue-600 mt-2">
                  {requests.filter((r) => r.role === "processor" && r.status === "approved").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 ml-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Direct Admin Control: Add User Account Card */}
          <div id="add-user" className="bg-white border border-brand-gold/15 rounded-3xl p-6 sm:p-8 shadow-sm text-left hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-sans text-xl font-bold text-brand-navy leading-tight">
                    Create Agent / Processor Account
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Directly register a secure agent or processor account.</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddUserForm(!showAddUserForm)}
                className={`rounded-full px-6 py-2.5 text-xs font-bold transition-all duration-300 cursor-pointer shrink-0 ${
                  showAddUserForm
                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    : "bg-brand-gold hover:bg-brand-gold-dark text-brand-navy hover:shadow-[0_0_15px_rgba(204,163,82,0.3)] hover:scale-[1.02]"
                }`}
              >
                {showAddUserForm ? "Hide Form" : "Create Account"}
              </button>
            </div>

            {showAddUserForm && (
              <form onSubmit={handleAddUser} className="space-y-4 border-t border-slate-100 pt-6 mt-6 animate-fadeIn">
                {addError && (
                  <div className="bg-red-50 text-red-600 text-xs font-semibold rounded-xl p-3.5 border border-red-100">
                    {addError}
                  </div>
                )}
                {addSuccess && (
                  <div className="bg-green-50 text-green-700 text-xs font-semibold rounded-xl p-3.5 border border-green-100">
                    {addSuccess}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      placeholder="e.g. David Jones"
                      className="w-full rounded-full border border-slate-200 bg-slate-50/50 px-5 py-2.5 text-xs focus:bg-white focus:outline-none focus:border-brand-gold transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Unique Username</label>
                    <input
                      type="text"
                      required
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="e.g. djones"
                      className="w-full rounded-full border border-slate-200 bg-slate-50/50 px-5 py-2.5 text-xs focus:bg-white focus:outline-none focus:border-brand-gold transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="e.g. djones@quickholidays.co.uk"
                      className="w-full rounded-full border border-slate-200 bg-slate-50/50 px-5 py-2.5 text-xs focus:bg-white focus:outline-none focus:border-brand-gold transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Assign secret password"
                      className="w-full rounded-full border border-slate-200 bg-slate-50/50 px-5 py-2.5 text-xs focus:bg-white focus:outline-none focus:border-brand-gold transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1 font-semibold">Select Account Role</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setNewRole("agent")}
                      className={`flex-1 rounded-full py-2.5 text-xs font-bold transition-all border ${
                        newRole === "agent"
                          ? "bg-brand-navy border-brand-navy text-white shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      Agent Team
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewRole("processor")}
                      className={`flex-1 rounded-full py-2.5 text-xs font-bold transition-all border ${
                        newRole === "processor"
                          ? "bg-brand-navy border-brand-navy text-white shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      Proccessing Team
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewRole("admin")}
                      className={`flex-1 rounded-full py-2.5 text-xs font-bold transition-all border ${
                        newRole === "admin"
                          ? "bg-brand-navy border-brand-navy text-white shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      Admin Team
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="rounded-full bg-brand-navy hover:bg-brand-gold hover:text-brand-navy text-white text-xs font-bold px-8 py-3 transition-all duration-300 shadow-md hover:scale-[1.02] cursor-pointer"
                  >
                    Save & Approve User
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Awaiting Approvals Card */}
          <div id="pending-requests" className="bg-white border border-brand-gold/15 rounded-3xl p-6 sm:p-8 shadow-sm text-left hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="font-sans text-xl font-bold text-brand-navy">
                  Access Requests Awaiting Approval ({pendingRequests.length})
                </h2>
              </div>
              {pendingRequests.length > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full animate-pulse">
                  Action Needed
                </span>
              )}
            </div>

            {pendingRequests.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-500 font-medium">No pending requests at this time.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[600px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px] pb-4">
                      <th className="pb-3 text-left">Name</th>
                      <th className="pb-3 text-left">Email</th>
                      <th className="pb-3 text-left">Role</th>
                      <th className="pb-3 text-left">Request Date</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 font-bold text-brand-navy">{req.name}</td>
                        <td className="py-4 text-slate-600">{req.email}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                            req.role === "agent" ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-blue-50 text-blue-700 border border-blue-100"
                          }`}>
                            {req.role === "agent" ? "Agent Team" : "Proccessing Team"}
                          </span>
                        </td>
                        <td className="py-4 text-slate-500 text-xs">{req.created_at}</td>
                        <td className="py-4 text-right space-x-2">
                          <button
                            onClick={() => triggerApproveModal(req)}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-full px-5 py-1.5 text-xs font-bold transition-all shadow-sm hover:scale-[1.03] cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => triggerRejectModal(req)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 rounded-full px-5 py-1.5 text-xs font-bold transition-all hover:scale-[1.03] cursor-pointer"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Registered Users Table Card */}
          <div id="approved-accounts" className="bg-white border border-brand-gold/15 rounded-3xl p-6 sm:p-8 shadow-sm text-left hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="font-sans text-xl font-bold text-brand-navy">
                Approved & Registered Accounts ({approvedUsers.length})
              </h2>
            </div>

            {approvedUsers.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-500 font-medium">No registered accounts yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[650px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px] pb-4">
                      <th className="pb-3 text-left">Name</th>
                      <th className="pb-3 text-left">Email</th>
                      <th className="pb-3 text-left">Role</th>
                      <th className="pb-3 text-left">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {approvedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 font-bold text-brand-navy">{user.name}</td>
                        <td className="py-4 text-slate-600">{user.email}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                            user.role === "agent" ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-blue-50 text-blue-700 border border-blue-100"
                          }`}>
                            {user.role === "agent" ? "Agent Team" : "Proccessing Team"}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            user.status === "approved" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                          }`}>
                            {user.status === "approved" ? "Active" : "Suspended"}
                          </span>
                        </td>
                        <td className="py-4 text-right space-x-2 whitespace-nowrap font-medium text-slate-800">
                          {user.status === "approved" ? (
                            <button
                              onClick={() => updateRequestStatus(user.id, "suspended")}
                              className="bg-red-50 hover:bg-red-100 text-red-600 rounded-full px-3 py-1.5 text-xs font-bold transition-all cursor-pointer"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => updateRequestStatus(user.id, "approved")}
                              className="bg-green-50 hover:bg-green-100 text-green-700 rounded-full px-3 py-1.5 text-xs font-bold transition-all cursor-pointer"
                            >
                              Unsuspend
                            </button>
                          )}
                          <button
                            onClick={() => setChangePasswordUser(user)}
                            className="bg-[#CCA352]/10 hover:bg-[#CCA352] text-[#0F2148] hover:text-white rounded-full px-3 py-1.5 text-xs font-bold transition-all cursor-pointer border border-[#CCA352]/25"
                          >
                            Password
                          </button>
                          <button
                            onClick={() => deleteRequest(user.id)}
                            className="text-slate-400 hover:text-red-600 transition-colors p-1"
                            aria-label="Delete user"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 inline">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          </>
          )}

          {/* Agents & Forms Work tab content */}
          {activeTab === "agents_work" && (
            <div className="space-y-8 text-left animate-fadeIn">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-brand-gold/15 shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Active Forms</p>
                  <p className="text-3xl font-extrabold text-brand-navy mt-2">
                    {allClients.reduce((acc, client) => acc + (client.visa_forms?.length || 0), 0)}
                  </p>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-brand-gold/15 shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Forms Awaiting Approval</p>
                  <p className="text-3xl font-extrabold text-amber-500 mt-2">
                    {allClients.reduce((acc, client) => 
                      acc + (client.visa_forms?.filter((f: any) => f.status === "needs_approval")?.length || 0), 0
                    )}
                  </p>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-brand-gold/15 shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Clients Managed</p>
                  <p className="text-3xl font-extrabold text-emerald-600 mt-2">
                    {allClients.length}
                  </p>
                </div>
              </div>

              {/* Agents list */}
              <div className="bg-white border border-brand-gold/15 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <h3 className="font-serif text-2xl font-bold text-brand-navy">
                    Agent Workspaces ({requests.filter((r) => r.role === "agent" && r.status === "approved").length})
                  </h3>
                  
                  {/* Search Bar */}
                  <div className="relative w-full md:w-80">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Search agents, clients, forms..."
                      value={agentsSearchQuery}
                      onChange={(e) => setAgentsSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 text-xs rounded-full border border-slate-200 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold bg-slate-50 text-slate-700 transition-all placeholder-slate-400"
                    />
                    {agentsSearchQuery && (
                      <button
                        onClick={() => setAgentsSearchQuery("")}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {(() => {
                    const approvedAgents = requests.filter((r) => r.role === "agent" && r.status === "approved");
                    const filteredAgents = approvedAgents.filter((agent) => {
                      if (!agentsSearchQuery.trim()) return true;
                      const query = agentsSearchQuery.toLowerCase().trim();
                      
                      const agentMatches = 
                        agent.name?.toLowerCase().includes(query) ||
                        agent.username?.toLowerCase().includes(query) ||
                        agent.email?.toLowerCase().includes(query);
                      if (agentMatches) return true;
                      
                      const agentClients = allClients.filter((c) => c.agent_id === agent.id);
                      const clientMatches = agentClients.some((client) => 
                        client.name?.toLowerCase().includes(query) ||
                        client.email?.toLowerCase().includes(query) ||
                        client.phone?.toLowerCase().includes(query) ||
                        client.visa_forms?.some((form: any) => 
                          form.id?.toString().toLowerCase().includes(query) ||
                          form.title?.toLowerCase().includes(query) ||
                          form.applicant_name?.toLowerCase().includes(query) ||
                          form.status?.toLowerCase().includes(query)
                        )
                      );
                      return clientMatches;
                    });

                    if (filteredAgents.length === 0) {
                      return (
                        <div className="text-center py-12 text-slate-500 font-medium bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                          No agent workspaces or client forms found matching your search.
                        </div>
                      );
                    }

                    return filteredAgents.map((agent) => {
                      const agentClients = allClients.filter((c) => c.agent_id === agent.id);
                      const agentFormsCount = agentClients.reduce((acc, c) => acc + (c.visa_forms?.length || 0), 0);
                      
                      // Auto-expand agent if search matches agent or agent's children
                      const isExpanded = expandedAgentId === agent.id || (!!agentsSearchQuery.trim() && (
                        agent.name?.toLowerCase().includes(agentsSearchQuery.toLowerCase().trim()) ||
                        agent.username?.toLowerCase().includes(agentsSearchQuery.toLowerCase().trim()) ||
                        agent.email?.toLowerCase().includes(agentsSearchQuery.toLowerCase().trim()) ||
                        agentClients.some(client => 
                          client.name?.toLowerCase().includes(agentsSearchQuery.toLowerCase().trim()) ||
                          client.email?.toLowerCase().includes(agentsSearchQuery.toLowerCase().trim()) ||
                          client.phone?.toLowerCase().includes(agentsSearchQuery.toLowerCase().trim()) ||
                          client.visa_forms?.some((form: any) => 
                            form.id?.toString().toLowerCase().includes(agentsSearchQuery.toLowerCase().trim()) ||
                            form.title?.toLowerCase().includes(agentsSearchQuery.toLowerCase().trim()) ||
                            form.applicant_name?.toLowerCase().includes(agentsSearchQuery.toLowerCase().trim()) ||
                            form.status?.toLowerCase().includes(agentsSearchQuery.toLowerCase().trim())
                          )
                        )
                      ));

                      const filteredClients = agentClients.filter((client) => {
                        if (!agentsSearchQuery.trim()) return true;
                        const query = agentsSearchQuery.toLowerCase().trim();
                        
                        const agentMatches = 
                          agent.name?.toLowerCase().includes(query) ||
                          agent.username?.toLowerCase().includes(query) ||
                          agent.email?.toLowerCase().includes(query);
                        if (agentMatches) return true;
                        
                        const clientMatches = 
                          client.name?.toLowerCase().includes(query) ||
                          client.email?.toLowerCase().includes(query) ||
                          client.phone?.toLowerCase().includes(query);
                        if (clientMatches) return true;
                        
                        const formMatches = client.visa_forms?.some((form: any) => 
                          form.id?.toString().toLowerCase().includes(query) ||
                          form.title?.toLowerCase().includes(query) ||
                          form.applicant_name?.toLowerCase().includes(query) ||
                          form.status?.toLowerCase().includes(query)
                        );
                        return formMatches;
                      });

                      return (
                        <div 
                          key={agent.id} 
                          className="border border-slate-100 rounded-2xl overflow-hidden hover:border-brand-gold/30 transition-all duration-300 bg-white"
                        >
                          {/* Agent Summary Header Row */}
                          <div 
                            onClick={() => setExpandedAgentId(isExpanded ? null : agent.id)}
                            className="bg-slate-50/50 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                          >
                            <div className="space-y-1 text-left">
                              <h4 className="font-sans font-bold text-slate-800 text-sm">{agent.name}</h4>
                              <p className="text-[10px] text-slate-500 font-medium">@{agent.username} • {agent.email}</p>
                            </div>

                            <div className="flex items-center gap-6">
                              <div className="text-right shrink-0">
                                <span className="text-[10px] font-bold text-slate-400 uppercase block">Clients</span>
                                <span className="text-sm font-bold text-slate-700">{agentClients.length}</span>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-[10px] font-bold text-slate-400 uppercase block">Forms</span>
                                <span className="text-sm font-bold text-slate-700">{agentFormsCount}</span>
                              </div>
                              <button className="text-slate-400 hover:text-brand-navy">
                                <svg 
                                  className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} 
                                  fill="none" 
                                  viewBox="0 0 24 24" 
                                  stroke="currentColor" 
                                  strokeWidth={2}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          {/* Expanded details */}
                          {isExpanded && (
                            <div className="p-6 bg-white border-t border-slate-100 space-y-6">
                              {filteredClients.length === 0 ? (
                                <p className="text-xs text-slate-500 text-center py-2 font-medium">No clients found matching the filter.</p>
                              ) : (
                                <div className="space-y-6">
                                  {filteredClients.map((client) => (
                                    <div key={client.id} className="bg-slate-50/30 rounded-2xl p-5 border border-slate-100 space-y-4 text-left">
                                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3 gap-2">
                                        <div>
                                          <h5 className="font-sans font-bold text-xs text-slate-800">{client.name}</h5>
                                          <p className="text-[10px] text-slate-500">{client.email} • {client.phone}</p>
                                        </div>
                                        <span className="text-[10px] font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                                          Client ID: {client.id}
                                        </span>
                                      </div>

                                      {/* Client Forms Table */}
                                      <div className="space-y-2">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Client Visa Applications</p>
                                        {!client.visa_forms || client.visa_forms.length === 0 ? (
                                          <p className="text-[11px] text-slate-500 font-medium pl-1">No visa forms created for this client.</p>
                                        ) : (
                                          <div className="overflow-x-auto">
                                            <table className="w-full min-w-[650px] text-left text-[11px] text-slate-600 border-collapse">
                                              <thead>
                                                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase">
                                                  <th className="pb-2 font-medium">Application ID</th>
                                                  <th className="pb-2 font-medium">Title</th>
                                                  <th className="pb-2 font-medium">Applicant</th>
                                                  <th className="pb-2 font-medium">Status</th>
                                                  <th className="pb-2 font-medium">Last Updated</th>
                                                  <th className="pb-2 font-medium text-right pr-2">Actions</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {client.visa_forms.filter((form: any) => {
                                                  if (!agentsSearchQuery.trim()) return true;
                                                  const query = agentsSearchQuery.toLowerCase().trim();
                                                  
                                                  const agentMatches = 
                                                    agent.name?.toLowerCase().includes(query) ||
                                                    agent.username?.toLowerCase().includes(query) ||
                                                    agent.email?.toLowerCase().includes(query);
                                                  
                                                  const clientMatches = 
                                                    client.name?.toLowerCase().includes(query) ||
                                                    client.email?.toLowerCase().includes(query) ||
                                                    client.phone?.toLowerCase().includes(query);
                                                    
                                                  if (agentMatches || clientMatches) return true;
                                                  
                                                  return (
                                                    form.id?.toString().toLowerCase().includes(query) ||
                                                    form.title?.toLowerCase().includes(query) ||
                                                    form.applicant_name?.toLowerCase().includes(query) ||
                                                    form.status?.toLowerCase().includes(query)
                                                  );
                                                }).map((form: any) => (
                                                  <tr key={form.id} className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50/50">
                                                    <td className="py-2.5 font-semibold text-slate-700">{form.id}</td>
                                                    <td className="py-2.5 font-medium">{form.title}</td>
                                                    <td className="py-2.5 text-slate-500">{form.applicant_name || "N/A"}</td>
                                                    <td className="py-2.5">
                                                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                                        form.status === "approved" 
                                                          ? "bg-green-50 text-green-600 border border-green-100" 
                                                          : form.status === "needs_approval" 
                                                            ? "bg-amber-50 text-amber-600 border border-amber-100" 
                                                            : form.status === "client_completed" 
                                                              ? "bg-blue-50 text-blue-600 border border-blue-100" 
                                                              : "bg-slate-100 text-slate-600 border border-slate-200"
                                                      }`}>
                                                        {form.status.replace("_", " ")}
                                                      </span>
                                                    </td>
                                                    <td className="py-2.5 text-slate-500">
                                                      {new Date(form.updated_at || form.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-2.5 text-right pr-2 space-x-1.5 whitespace-nowrap">
                                                      <button 
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          openPreview(form.id);
                                                        }}
                                                        className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0F2148] hover:text-brand-gold bg-[#CCA352]/10 hover:bg-[#0F2148]/10 px-2.5 py-1 rounded-full transition-all cursor-pointer border border-[#CCA352]/25"
                                                      >
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        Preview
                                                      </button>

                                                      {form.status !== "approved" && (
                                                        <button 
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleApproveForm(form.id);
                                                          }}
                                                          className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:text-white bg-emerald-500/10 hover:bg-emerald-600 px-2.5 py-1 rounded-full transition-all cursor-pointer border border-emerald-500/25"
                                                        >
                                                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                          </svg>
                                                          Approve
                                                        </button>
                                                      )}

                                                      <button 
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          handleDeleteForm(form.id);
                                                        }}
                                                        className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 hover:text-white bg-rose-500/10 hover:bg-rose-600 px-2.5 py-1 rounded-full transition-all cursor-pointer border border-rose-500/25"
                                                      >
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Delete
                                                      </button>
                                                    </td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Card A: Edit Footer Info & Social Links */}
          {activeTab === "footer" && (
            <div id="edit-footer" className="bg-white border border-brand-gold/15 rounded-3xl p-6 sm:p-8 shadow-sm text-left hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </div>
              <div>
                <h2 className="font-sans text-xl font-bold text-brand-navy">
                  Edit Footer & Social Links
                </h2>
                <p className="text-xs text-slate-500 mt-1">Manage public site contact details, physical address, social links, and copyright text.</p>
              </div>
            </div>

            {contentSuccess && (
              <div className="bg-green-50 text-green-700 text-xs font-semibold rounded-xl p-3.5 border border-green-100 mt-6 animate-fadeIn">
                {contentSuccess}
              </div>
            )}
            {contentError && (
              <div className="bg-red-50 text-red-600 text-xs font-semibold rounded-xl p-3.5 border border-red-100 mt-6 animate-fadeIn">
                {contentError}
              </div>
            )}

            <form onSubmit={handleUpdateFooter} className="space-y-4 pt-6 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Phone Number</label>
                  <input
                    type="text"
                    value={editFooterPhone}
                    onChange={(e) => setEditFooterPhone(e.target.value)}
                    className="w-full rounded-full bg-slate-50 border border-slate-200 px-6 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                  <input
                    type="email"
                    value={editFooterEmail}
                    onChange={(e) => setEditFooterEmail(e.target.value)}
                    className="w-full rounded-full bg-slate-50 border border-slate-200 px-6 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                    WhatsApp Link(s) / Number(s)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 fill-[#25D366]" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966a9.9 9.9 0 00-6.974-2.879c-5.439 0-9.867 4.372-9.87 9.802 0 1.73.473 3.41 1.37 4.915l-.972 3.548 3.666-.972zm9.294-4.882c-.3-.15-1.771-.875-2.046-.975-.276-.1-.476-.15-.676.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-1.206-.6-2.012-1.125-2.771-2.428-.15-.25-.15-.435-.02-.596.12-.14.275-.325.412-.49.137-.165.18-.275.27-.45.09-.18.04-.33-.02-.48-.06-.15-.675-1.625-.925-2.225-.244-.589-.496-.51-.676-.51-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.11 3.224 5.11 4.525.714.31 1.27.495 1.7.635.717.229 1.37.196 1.885.12.574-.085 1.771-.725 2.021-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. https://wa.me/447123, 447456, 447789"
                      value={editFooterWhatsapp}
                      onChange={(e) => setEditFooterWhatsapp(e.target.value)}
                      className="w-full rounded-full bg-slate-50 border border-slate-200 pl-11 pr-6 py-2.5 text-sm focus:outline-none focus:border-brand-gold focus:bg-white transition-all"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block ml-2">Use commas to split multiple links. They will rotate to route visitors evenly.</span>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">LinkedIn Link</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 fill-[#0077B5]" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. https://linkedin.com"
                      value={editFooterLinkedin}
                      onChange={(e) => setEditFooterLinkedin(e.target.value)}
                      className="w-full rounded-full bg-slate-50 border border-slate-200 pl-11 pr-6 py-2.5 text-sm focus:outline-none focus:border-brand-gold focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Instagram Link</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 fill-[#E1306C]" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. https://instagram.com"
                      value={editFooterInstagram}
                      onChange={(e) => setEditFooterInstagram(e.target.value)}
                      className="w-full rounded-full bg-slate-50 border border-slate-200 pl-11 pr-6 py-2.5 text-sm focus:outline-none focus:border-brand-gold focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Facebook Link</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. https://facebook.com"
                      value={editFooterFacebook}
                      onChange={(e) => setEditFooterFacebook(e.target.value)}
                      className="w-full rounded-full bg-slate-50 border border-slate-200 pl-11 pr-6 py-2.5 text-sm focus:outline-none focus:border-brand-gold focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Copyright Footer Text</label>
                <input
                  type="text"
                  value={editFooterCopyright}
                  onChange={(e) => setEditFooterCopyright(e.target.value)}
                  className="w-full rounded-full bg-slate-50 border border-slate-200 px-6 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Physical Address (use new lines for formatting)</label>
                <textarea
                  rows={3}
                  value={editFooterAddress}
                  onChange={(e) => setEditFooterAddress(e.target.value)}
                  className="w-full rounded-2xl bg-slate-50 border border-slate-200 px-6 py-3 text-sm focus:outline-none focus:border-brand-gold"
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="rounded-full bg-brand-navy hover:bg-brand-gold hover:text-brand-navy text-white text-xs font-bold px-6 py-2.5 transition-all duration-300 shadow-sm cursor-pointer"
                >
                  Save Footer Settings
                </button>
              </div>
            </form>
          </div>
          )}

          {/* Card B: Edit Client Reviews */}
          {activeTab === "reviews" && (
            <div id="edit-reviews" className="bg-white border border-brand-gold/15 rounded-3xl p-6 sm:p-8 shadow-sm text-left hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h2 className="font-sans text-xl font-bold text-brand-navy">
                  Edit Client Reviews & Testimonials
                </h2>
                <p className="text-xs text-slate-500 mt-1">Manage feedback cards. Sort by rating count to review active submissions.</p>
              </div>
            </div>

            {/* Add review form */}
            <form onSubmit={handleAddReview} className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4 pt-6 mt-6">
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider block mb-1">Add New Testimonial Card</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Client Name</label>
                  <input
                    type="text"
                    placeholder="e.g. James Wilson"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full rounded-full bg-white border border-slate-200 px-6 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Client Location</label>
                  <input
                    type="text"
                    placeholder="e.g. London, United Kingdom"
                    value={reviewLocation}
                    onChange={(e) => setReviewLocation(e.target.value)}
                    className="w-full rounded-full bg-white border border-slate-200 px-6 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Rating Stars (1-5)</label>
                  <CustomSelect
                    value={reviewRating}
                    onChange={(val) => setReviewRating(Number(val))}
                    options={[
                      { label: "★★★★★ (5 Stars)", value: 5 },
                      { label: "★★★★☆ (4 Stars)", value: 4 },
                      { label: "★★★☆☆ (3 Stars)", value: 3 },
                      { label: "★★☆☆☆ (2 Stars)", value: 2 },
                      { label: "★☆☆☆☆ (1 Star)", value: 1 },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Client Profile Image / Avatar</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setReviewAvatar, "avatar")}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                  />
                </div>
              </div>
              {reviewAvatar && (
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Image Preview:</span>
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200">
                    <img src={reviewAvatar} alt="Reviewer Avatar Preview" className="object-cover w-full h-full" />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Review Quote / Comment</label>
                <textarea
                  rows={3}
                  placeholder="Type the review text..."
                  value={reviewQuote}
                  onChange={(e) => setReviewQuote(e.target.value)}
                  className="w-full rounded-2xl bg-white border border-slate-200 px-6 py-3 text-sm focus:outline-none focus:border-brand-gold"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-brand-gold hover:bg-brand-gold-dark text-brand-navy text-xs font-bold px-6 py-2.5 transition-all duration-300 shadow-sm cursor-pointer"
              >
                Add Testimonial
              </button>
            </form>

            {/* List testimonials */}
            <div className="space-y-4 pt-6 mt-6 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block ml-1">Active Testimonial Cards ({adminTestimonials.length})</span>
                
                {/* Star Sorting Order Option */}
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Sort by:</label>
                  <CustomSelect
                    value={reviewSortOrder}
                    onChange={(val) => setReviewSortOrder(val)}
                    options={[
                      { label: "Newest First", value: "newest" },
                      { label: "Highest Rating First", value: "highest" },
                      { label: "Lowest Rating First", value: "lowest" },
                    ]}
                    className="w-48"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...adminTestimonials]
                  .sort((a, b) => {
                    if (reviewSortOrder === "highest") return b.rating - a.rating;
                    if (reviewSortOrder === "lowest") return a.rating - b.rating;
                    return 0; // default newest
                  })
                  .map((test, index) => {
                    const avatarSrc = typeof test.avatar === "string" ? test.avatar : (test.avatar && (test.avatar as any).src) || "";
                    
                    return (
                      <div key={index} className="bg-white border border-brand-gold/15 rounded-2xl p-4 flex gap-4 items-start justify-between shadow-sm hover:border-brand-gold transition-all duration-300">
                        <div className="flex gap-3 text-left">
                          <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden border border-slate-100 bg-slate-50 relative flex items-center justify-center">
                            {avatarSrc ? (
                              <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-brand-navy flex items-center justify-center text-white text-xs font-bold">
                                {test.name ? test.name[0] : "C"}
                              </div>
                            )}
                          </div>
                          <div className="text-left">
                            <h4 className="font-bold text-sm text-brand-navy">{test.name}</h4>
                            <p className="text-[10px] text-slate-400">{test.location}</p>
                            <p className="text-xs text-brand-gold font-bold">{"★".repeat(test.rating)}</p>
                            <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">"{test.quote}"</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            // Delete matching by specific name and quote
                            const updated = adminTestimonials.filter((r) => r.name !== test.name || r.quote !== test.quote);
                            localStorage.setItem("quick_holidays_testimonials", JSON.stringify(updated));
                            setAdminTestimonials(updated);
                            setContentSuccess("Review deleted successfully!");
                            setTimeout(() => setContentSuccess(""), 3000);
                          }}
                          className="bg-red-50 hover:bg-red-100 text-red-600 rounded-full px-3.5 py-1.5 text-[10px] font-bold transition-all cursor-pointer shrink-0"
                        >
                          Delete
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          )}

          {/* Card C: Edit Popular Destinations */}
          {activeTab === "destinations" && (
            <div id="edit-destinations" className="bg-white border border-brand-gold/15 rounded-3xl p-6 sm:p-8 shadow-sm text-left hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <div>
                <h2 className="font-sans text-xl font-bold text-brand-navy">
                  Edit Popular Places & Cards
                </h2>
                <p className="text-xs text-slate-500 mt-1">Manage destination visual cards rendered on your homepage.</p>
              </div>
            </div>

            {/* Add Destination Form */}
            <form onSubmit={handleAddDestination} className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4 pt-6 mt-6">
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider block mb-1">Add New Destination Card</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Destination Name (Country)</label>
                  <input
                    type="text"
                    placeholder="e.g. Austria"
                    value={destName}
                    onChange={(e) => setDestName(e.target.value)}
                    className="w-full rounded-full bg-white border border-slate-200 px-6 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Destination Background Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setDestImage, "destination")}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                  />
                </div>
              </div>
              {destImage && (
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Image Preview:</span>
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200">
                    <img src={destImage} alt="Destination Preview" className="object-cover w-full h-full" />
                  </div>
                </div>
              )}
              <button
                type="submit"
                className="rounded-full bg-brand-gold hover:bg-brand-gold-dark text-brand-navy text-xs font-bold px-6 py-2.5 transition-all duration-300 shadow-sm cursor-pointer"
              >
                Add Destination
              </button>
            </form>

            {/* List Destinations */}
            <div className="space-y-3 pt-6 mt-6 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block ml-1">Active Destinations ({adminDestinations.length})</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {adminDestinations.map((dest, index) => {
                  const imageSrc = typeof dest.image === "string" ? dest.image : (dest.image && (dest.image as any).src) || "";
                  
                  return (
                    <div key={index} className="bg-white border border-brand-gold/15 rounded-[20px] p-3 flex flex-col justify-between h-48 shadow-sm hover:-translate-y-1 hover:border-brand-gold hover:shadow-md transition-all duration-300">
                      <div className="relative grow rounded-xl overflow-hidden border border-slate-100 bg-slate-50 mb-2">
                        {imageSrc ? (
                          <img src={imageSrc} alt={dest.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 text-xs">
                            Static Asset
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center px-1 mt-1 gap-2">
                        <span className="text-xs font-bold text-brand-navy truncate">{dest.name}</span>
                        <button
                          onClick={() => handleDeleteDestination(index)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 rounded-full px-3 py-1 text-[9px] font-bold transition-all cursor-pointer shrink-0"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          )}

          {/* Card D: Edit Country Flags */}
          {activeTab === "countries" && (
            <div id="edit-countries" className="bg-white border border-brand-gold/15 rounded-3xl p-6 sm:p-8 shadow-sm text-left hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21v8h-6l-1-1H5v4m0 4h18" />
                </svg>
              </div>
              <div>
                <h2 className="font-sans text-xl font-bold text-brand-navy">
                  Edit Schengen Visa Countries & Flags
                </h2>
                <p className="text-xs text-slate-500 mt-1">Manage countries list and flags displayed on the Schengen Visa countries page.</p>
              </div>
            </div>

            {/* Add Flag Form */}
            <form onSubmit={handleAddFlag} className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4 pt-6 mt-6">
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider block mb-1">Add New Schengen Country</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Country Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Italy"
                    value={flagName}
                    onChange={(e) => setFlagName(e.target.value)}
                    className="w-full rounded-full bg-white border border-slate-200 px-6 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Slug (URL parameter, e.g. italy)</label>
                  <input
                    type="text"
                    placeholder="e.g. italy"
                    value={flagSlug}
                    onChange={(e) => setFlagSlug(e.target.value)}
                    className="w-full rounded-full bg-white border border-slate-200 px-6 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Flag Image (upload national flag)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setFlagImage, "flag")}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                />
              </div>
              {flagImage && (
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Flag Preview:</span>
                  <div className="relative w-16 h-10 rounded border border-slate-250 overflow-hidden shadow-sm">
                    <img src={flagImage} alt="Flag Preview" className="object-cover w-full h-full scale-[1.25]" />
                  </div>
                </div>
              )}
              <button
                type="submit"
                className="rounded-full bg-brand-gold hover:bg-brand-gold-dark text-brand-navy text-xs font-bold px-6 py-2.5 transition-all duration-300 shadow-sm cursor-pointer"
                  >
                Add Country
              </button>
            </form>

            {/* List Schengen countries */}
            <div className="space-y-3 pt-6 mt-6 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block ml-1">Active Schengen Countries ({adminFlags.length})</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {adminFlags.map((country, index) => {
                  const flagSrc = typeof country.flag === "string" ? country.flag : (country.flag && (country.flag as any).src) || "";
                  
                  return (
                    <div key={index} className="bg-white border border-brand-gold/15 rounded-[20px] p-3 flex flex-col justify-between items-center text-center shadow-sm hover:-translate-y-1 hover:border-brand-gold hover:shadow-md transition-all duration-300 h-38">
                      <div className="relative w-16 h-10 rounded border border-slate-100 bg-slate-50 overflow-hidden mb-2 flex items-center justify-center shrink-0">
                        {flagSrc ? (
                          <img src={flagSrc} alt={country.name} className="w-full h-full object-cover scale-[1.2]" />
                        ) : (
                          <div className="w-full h-full bg-slate-200 flex items-center justify-center text-[8px] text-slate-400">
                            Static Flag
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-brand-navy truncate w-full px-1 mb-2">{country.name}</span>
                      <button
                        onClick={() => handleDeleteFlag(index)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 rounded-full px-3 py-1.5 text-[9px] font-bold transition-all cursor-pointer shrink-0"
                      >
                        Delete
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          )}

          {/* Card E: Edit Website Backgrounds */}
          {activeTab === "backgrounds" && (
            <div id="edit-backgrounds" className="bg-white border border-brand-gold/15 rounded-3xl p-6 sm:p-8 shadow-sm text-left hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="font-sans text-xl font-bold text-brand-navy">
                  Edit Website Background Images
                </h2>
                <p className="text-xs text-slate-500 mt-1">Upload custom background wallpapers across main website pages and portal login screens.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Background 1: Hero Section */}
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-4 text-left flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Hero Section Wallpaper</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleBgChange(e, "quick_holidays_bg_hero", setCustomHeroBg)}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                  />
                </div>
                <div className="space-y-3 pt-2">
                  <div className="w-full h-48 sm:h-52 rounded-2xl overflow-hidden border border-slate-200 bg-slate-250 relative shadow-inner">
                    <img
                      src={customHeroBg || (typeof heroBg === "string" ? heroBg : (heroBg as any).src || "")}
                      alt="Hero Wallpaper"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  {customHeroBg && (
                    <button
                      type="button"
                      onClick={() => handleBgReset("quick_holidays_bg_hero", setCustomHeroBg)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 rounded-full px-4 py-1.5 text-[10px] font-bold transition-all cursor-pointer"
                    >
                      Restore Default Hero
                    </button>
                  )}
                </div>
              </div>

              {/* Background 2: Why Choose Us */}
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-4 text-left flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Why Choose Us Section Wallpaper</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleBgChange(e, "quick_holidays_bg_why_choose_us", setCustomWhyBg)}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                  />
                </div>
                <div className="space-y-3 pt-2">
                  <div className="w-full h-48 sm:h-52 rounded-2xl overflow-hidden border border-slate-200 bg-slate-250 relative shadow-inner">
                    <img
                      src={customWhyBg || (typeof whyChooseUsBg === "string" ? whyChooseUsBg : (whyChooseUsBg as any).src || "")}
                      alt="Why Choose Us Wallpaper"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  {customWhyBg && (
                    <button
                      type="button"
                      onClick={() => handleBgReset("quick_holidays_bg_why_choose_us", setCustomWhyBg)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 rounded-full px-4 py-1.5 text-[10px] font-bold transition-all cursor-pointer"
                    >
                      Restore Default Why Choose Us
                    </button>
                  )}
                </div>
              </div>

              {/* Background 3: Consultation Form */}
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-4 text-left flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Consultation Form Section Wallpaper</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleBgChange(e, "quick_holidays_bg_consultation_form", setCustomConsultationBg)}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                  />
                </div>
                <div className="space-y-3 pt-2">
                  <div className="w-full h-48 sm:h-52 rounded-2xl overflow-hidden border border-slate-200 bg-slate-250 relative shadow-inner">
                    <img
                      src={customConsultationBg || (typeof formBg === "string" ? formBg : (formBg as any).src || "")}
                      alt="Consultation Wallpaper"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  {customConsultationBg && (
                    <button
                      type="button"
                      onClick={() => handleBgReset("quick_holidays_bg_consultation_form", setCustomConsultationBg)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 rounded-full px-4 py-1.5 text-[10px] font-bold transition-all cursor-pointer"
                    >
                      Restore Default Consultation
                    </button>
                  )}
                </div>
              </div>

              {/* Background 4: Portal Login Background */}
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-4 text-left flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Portal Log In Background</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleBgChange(e, "quick_holidays_bg_login", setCustomLoginBg)}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                  />
                </div>
                <div className="space-y-3 pt-2">
                  <div className="w-full h-48 sm:h-52 rounded-2xl overflow-hidden border border-slate-200 bg-slate-250 relative shadow-inner">
                    <img
                      src={customLoginBg || (typeof heroBg === "string" ? heroBg : (heroBg as any).src || "")}
                      alt="Portal Login Wallpaper"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  {customLoginBg && (
                    <button
                      type="button"
                      onClick={() => handleBgReset("quick_holidays_bg_login", setCustomLoginBg)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 rounded-full px-4 py-1.5 text-[10px] font-bold transition-all cursor-pointer"
                    >
                      Restore Default Login
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          )}

        </div>

      </div>

      {/* CUSTOM DOUBLE-CONFIRMATION MODAL (Replaces default browser alert confirm dialog) */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-fadeIn">
          
          <div className="bg-white border border-brand-gold/20 rounded-[32px] max-w-md w-full p-8 shadow-2xl text-left relative animate-scaleUp">
            
            {/* Modal Subheader Step */}
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em] block mb-1">
              Step {confirmModal.step} of 2 • Confirm Action
            </span>

            {/* Modal Step 1 */}
            {confirmModal.step === 1 && (
              <div className="space-y-5">
                <h3 className="font-serif text-2xl font-bold text-brand-navy leading-snug">
                  {confirmModal.action === "approve"
                    ? "Verify Account Approval"
                    : "Confirm Registration Rejection"}
                </h3>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs space-y-2 text-slate-700">
                  <p><strong>Name:</strong> {confirmModal.userName}</p>
                  <p><strong>Email:</strong> {confirmModal.userEmail}</p>
                  <p><strong>Target Role:</strong> {confirmModal.userRole === "agent" ? "Agent Team" : "Proccessing Team"}</p>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed">
                  {confirmModal.action === "approve"
                    ? "Approving this user creates an active, verified account in the workspace. They will be granted full access to log in with their credentials and manage customer bookings immediately."
                    : "Rejecting this user deletes their registration request. They will be blocked from accessing the workspace and their request record will be permanently deleted."}
                </p>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setConfirmModal((m) => ({ ...m, step: 2 }))}
                    className="flex-1 rounded-full bg-brand-navy hover:bg-brand-gold hover:text-brand-navy text-white text-xs font-bold py-3 transition-all duration-300 shadow-md cursor-pointer text-center"
                  >
                    Proceed to Step 2
                  </button>
                  <button
                    onClick={() => setConfirmModal((m) => ({ ...m, isOpen: false }))}
                    className="flex-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold py-3 transition-all duration-300 cursor-pointer text-center"
                  >
                    Cancel Action
                  </button>
                </div>
              </div>
            )}

            {/* Modal Step 2 */}
            {confirmModal.step === 2 && (
              <div className="space-y-5">
                <h3 className="font-serif text-2xl font-bold text-brand-navy leading-snug">
                  Double Check Confirmation
                </h3>

                <p className="text-slate-600 text-xs leading-relaxed">
                  Are you absolutely sure you want to {confirmModal.action === "approve" ? "APPROVE" : "REJECT & DELETE"} the account for <strong>{confirmModal.userName}</strong>? This action will immediately update the database.
                </p>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleCommitModalAction}
                    className={`flex-1 rounded-full text-white text-xs font-bold py-3 transition-all duration-300 shadow-md cursor-pointer text-center ${
                      confirmModal.action === "approve"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    Yes, Commit Action
                  </button>
                  <button
                    onClick={() => setConfirmModal((m) => ({ ...m, step: 1 }))}
                    className="flex-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold py-3 transition-all duration-300 cursor-pointer text-center"
                  >
                    Back to Step 1
                  </button>
                </div>
              </div>
            )}

          </div>
          
        </div>
      )}

      {/* VISA FORM PREVIEW MODAL */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 md:p-6 animate-fadeIn">
          <div className="bg-white border border-brand-gold/20 rounded-[32px] max-w-4xl w-full h-[85vh] flex flex-col shadow-2xl relative overflow-hidden animate-scaleUp">
            
            {/* Modal Header */}
            <div className="bg-[#0F2148] text-white px-6 py-4 flex justify-between items-center border-b border-white/10 shrink-0">
              <div className="text-left">
                <span className="text-[9px] font-bold text-brand-gold uppercase tracking-[0.2em] block mb-0.5">
                  Client Form Preview
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white flex items-center gap-3">
                  {previewForm?.title || "Visa Application Form"}
                  {previewForm?.status && (
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      previewForm.status === "approved" 
                        ? "bg-green-500/20 text-green-300 border border-green-500/30" 
                        : previewForm.status === "needs_approval" 
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" 
                          : previewForm.status === "client_completed" 
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" 
                            : "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                    }`}>
                      {previewForm.status.replace("_", " ")}
                    </span>
                  )}
                </h3>
              </div>
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {previewLoading ? (
              <div className="flex flex-col items-center justify-center flex-1 py-12 bg-brand-cream/15">
                <svg className="animate-spin h-8 w-8 text-brand-gold mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-slate-500 font-medium text-xs">Fetching visa form data...</p>
              </div>
            ) : !previewForm ? (
              <div className="flex flex-col items-center justify-center flex-1 py-12 text-slate-500 bg-brand-cream/15">
                <p className="font-semibold text-sm">Failed to load form details.</p>
                <p className="text-xs text-slate-400 mt-1">Please try again or contact support.</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Sections Sidebar */}
                <div className="w-full md:w-60 bg-slate-50 border-r border-slate-100 overflow-x-auto md:overflow-x-hidden overflow-y-hidden md:overflow-y-auto p-4 shrink-0 flex md:flex-col gap-1 text-left scrollbar-none whitespace-nowrap">
                  {visaSections.map((section, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPreviewActiveTab(idx)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        previewActiveTab === idx 
                          ? "bg-brand-navy text-white shadow-md shadow-brand-navy/15" 
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </div>

                {/* Section Content Area */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-brand-cream/5 text-left">
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="border-b border-slate-100 pb-4 mb-4">
                      <h4 className="font-serif text-xl font-bold text-brand-navy">
                        {visaSections[previewActiveTab].title}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                        Applicant: {previewForm.applicant_name || "N/A"} • ID: {previewForm.id}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {visaSections[previewActiveTab].fields.map((field) => {
                        const submittedVal = previewForm.form_data?.[field.id];
                        const approvedVal = previewForm.approved_data?.[field.id];
                        const hasDiff = approvedVal !== undefined && approvedVal !== null && approvedVal !== "" && approvedVal !== submittedVal;

                        return (
                          <div key={field.id} className="space-y-1.5">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              {field.label}
                            </span>
                            <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm space-y-2">
                              {/* Submitted Value */}
                              <div>
                                <span className="text-[9px] font-bold text-slate-400 uppercase block leading-none mb-1">
                                  Submitted
                                </span>
                                {submittedVal ? (
                                  <span className="text-xs text-slate-800 font-medium break-words">
                                    {submittedVal}
                                  </span>
                                ) : (
                                  <span className="text-xs text-slate-400 italic font-medium">
                                    Not filled
                                  </span>
                                )}
                              </div>

                              {/* Approved Value (if different) */}
                              {hasDiff && (
                                <div className="pt-2 border-t border-slate-50">
                                  <span className="text-[9px] font-bold text-amber-500 uppercase block leading-none mb-1">
                                    Approved/Corrected Value
                                  </span>
                                  <span className="text-xs text-amber-600 font-bold break-words">
                                    {approvedVal}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="bg-slate-50 px-4 sm:px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
              <span className="text-[10px] font-semibold text-slate-400 text-center sm:text-left">
                Created: {new Date(previewForm?.created_at).toLocaleDateString()} • Updated: {new Date(previewForm?.updated_at).toLocaleDateString()}
              </span>

              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 w-full sm:w-auto">
                {previewForm?.status !== "approved" && (
                  <button
                    onClick={() => handleApproveForm(previewForm.id)}
                    className="rounded-full bg-emerald-600 hover:bg-emerald-705 text-white text-xs font-bold px-4 py-2 transition-all duration-300 shadow-md cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Approve Form
                  </button>
                )}

                <button
                  onClick={() => handleDeleteForm(previewForm.id)}
                  className="rounded-full bg-rose-600 hover:bg-rose-705 text-white text-xs font-bold px-4 py-2 transition-all duration-300 shadow-md cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Form
                </button>

                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="rounded-full bg-brand-navy hover:bg-brand-gold hover:text-brand-navy text-white text-xs font-bold px-4 py-2 transition-all duration-300 shadow-md cursor-pointer shrink-0"
                >
                  Close Preview
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {changePasswordUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 text-left animate-fadeIn">
          <div className="bg-white border border-brand-gold/20 rounded-[32px] max-w-sm w-full p-8 shadow-2xl relative animate-scaleUp">
            <button
              onClick={() => {
                setChangePasswordUser(null);
                setChangePasswordVal("");
                setChangePasswordError("");
                setChangePasswordSuccess("");
              }}
              className="absolute right-6 top-6 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="font-serif text-xl font-bold text-brand-navy mb-1">Change Password</h3>
            <p className="text-xs text-slate-500 mb-6">
              Update password for <strong>{changePasswordUser.name}</strong> ({changePasswordUser.role === "agent" ? "Agent" : "Processor"}).
            </p>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              {changePasswordError && (
                <p className="text-[10px] text-red-500 font-bold bg-red-50 border border-red-100 p-2 rounded-lg">{changePasswordError}</p>
              )}
              {changePasswordSuccess && (
                <p className="text-[10px] text-green-600 font-bold bg-green-50 border border-green-100 p-2 rounded-lg">{changePasswordSuccess}</p>
              )}

              <div>
                <label className="block text-[10px] font-bold text-brand-navy uppercase tracking-widest mb-1.5 font-semibold">New Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Enter at least 6 characters"
                  value={changePasswordVal}
                  onChange={(e) => setChangePasswordVal(e.target.value)}
                  className="w-full rounded-xl border border-brand-gold/30 bg-white px-3.5 py-2.5 text-xs text-slate-805 focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={changePasswordLoading}
                className="w-full rounded-full bg-brand-navy hover:bg-brand-gold hover:text-brand-navy text-white transition-all duration-300 py-2.5 text-xs font-bold cursor-pointer mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {changePasswordLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

        </div> {/* Closing pt-8 md:pt-0 */}

        {/* Mobile Menu Drawer Overlay */}
        <div
          className={`fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 md:hidden ${
            isAdminMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsAdminMenuOpen(false)}
        >
          <div
            className={`fixed left-0 top-0 bottom-0 w-64 bg-[#0F2148] text-white p-6 shadow-2xl transition-transform duration-300 flex flex-col justify-between ${
              isAdminMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <span className="font-serif text-lg font-black tracking-wider uppercase text-brand-gold">
                Menu
              </span>
              <button
                onClick={() => setIsAdminMenuOpen(false)}
                className="rounded-md p-2 text-white hover:bg-white/10 focus:outline-none cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Navigation Links */}
            <nav className="flex-1 space-y-2 py-6 overflow-y-auto">
              <button
                onClick={() => {
                  setActiveTab("users");
                  setIsAdminMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase font-bold tracking-wider transition-all cursor-pointer text-left ${
                  activeTab === "users" ? "bg-brand-gold text-brand-navy font-bold shadow-md shadow-brand-gold/15" : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                Users Verification
              </button>
              <button
                onClick={() => {
                  setActiveTab("agents_work");
                  setIsAdminMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase font-bold tracking-wider transition-all cursor-pointer text-left ${
                  activeTab === "agents_work" ? "bg-brand-gold text-brand-navy font-bold shadow-md shadow-brand-gold/15" : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                Agents & Forms
              </button>
              <button
                onClick={() => {
                  setActiveTab("footer");
                  setIsAdminMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase font-bold tracking-wider transition-all cursor-pointer text-left ${
                  activeTab === "footer" ? "bg-brand-gold text-brand-navy font-bold shadow-md shadow-brand-gold/15" : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                Footer Info
              </button>
              <button
                onClick={() => {
                  setActiveTab("reviews");
                  setIsAdminMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase font-bold tracking-wider transition-all cursor-pointer text-left ${
                  activeTab === "reviews" ? "bg-brand-gold text-brand-navy font-bold shadow-md shadow-brand-gold/15" : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                Reviews
              </button>
              <button
                onClick={() => {
                  setActiveTab("destinations");
                  setIsAdminMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase font-bold tracking-wider transition-all cursor-pointer text-left ${
                  activeTab === "destinations" ? "bg-brand-gold text-brand-navy font-bold shadow-md shadow-brand-gold/15" : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                Destinations
              </button>
              <button
                onClick={() => {
                  setActiveTab("countries");
                  setIsAdminMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase font-bold tracking-wider transition-all cursor-pointer text-left ${
                  activeTab === "countries" ? "bg-brand-gold text-brand-navy font-bold shadow-md shadow-brand-gold/15" : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                Countries
              </button>
              <button
                onClick={() => {
                  setActiveTab("backgrounds");
                  setIsAdminMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase font-bold tracking-wider transition-all cursor-pointer text-left ${
                  activeTab === "backgrounds" ? "bg-brand-gold text-brand-navy font-bold shadow-md shadow-brand-gold/15" : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                Backgrounds
              </button>
            </nav>

            {/* Drawer Logout */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  handleLogout();
                  setIsAdminMenuOpen(false);
                }}
                className="w-full flex items-center justify-center rounded-full bg-brand-navy px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-brand-gold hover:text-brand-navy transition-all cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
