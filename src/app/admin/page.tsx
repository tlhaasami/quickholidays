"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { TESTIMONIALS, DESTINATIONS, SCHENGEN_DESTINATIONS, heroBg, whyChooseUsBg, formBg } from "@/constants/data";

interface UserRequest {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "agent" | "processor";
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
  userRole: "agent" | "processor";
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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [animateCard, setAnimateCard] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);
  // Active Navigation Tab State
  const [activeTab, setActiveTab] = useState<"users" | "footer" | "reviews" | "destinations" | "countries" | "backgrounds">("users");

  // Dashboard state
  const [requests, setRequests] = useState<UserRequest[]>([]);

  // Add User Form States
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"agent" | "processor">("agent");
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

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

  // Load state and sample data if empty
  useEffect(() => {
    // Trigger animation
    setAnimateCard(true);

    // Check authentication
    const authStatus = localStorage.getItem("admin_auth") === "true";
    setIsAuthenticated(authStatus);

    // Load backgrounds
    setCustomLoginBg(localStorage.getItem("quick_holidays_bg_login"));
    setCustomHeroBg(localStorage.getItem("quick_holidays_bg_hero"));
    setCustomWhyBg(localStorage.getItem("quick_holidays_bg_why_choose_us"));
    setCustomConsultationBg(localStorage.getItem("quick_holidays_bg_consultation_form"));

    // Load user signup requests
    const storedRequests = localStorage.getItem("quick_holidays_user_requests");
    if (storedRequests) {
      setRequests(JSON.parse(storedRequests));
    } else {
      // Seed sample data for immediate evaluation
      const sampleRequests: UserRequest[] = [
        {
          id: "req-1",
          name: "Amara Okoye",
          username: "amara",
          email: "amara.o@quickholidays.co.uk",
          role: "agent",
          status: "pending",
          created_at: new Date(Date.now() - 3600000 * 2).toLocaleString(),
          password: "password123",
        },
        {
          id: "req-2",
          name: "Liam O'Connor",
          username: "liam",
          email: "liam.oc@quickholidays.co.uk",
          role: "processor",
          status: "pending",
          created_at: new Date(Date.now() - 3600000 * 24).toLocaleString(),
          password: "password123",
        },
        {
          id: "req-3",
          name: "Chloe Dupont",
          username: "chloe",
          email: "chloe.d@quickholidays.co.uk",
          role: "agent",
          status: "approved",
          created_at: new Date(Date.now() - 3600000 * 48).toLocaleString(),
          password: "password123",
        },
        {
          id: "req-4",
          name: "David Smith",
          username: "david",
          email: "david.s@quickholidays.co.uk",
          role: "processor",
          status: "approved",
          created_at: new Date(Date.now() - 3600000 * 72).toLocaleString(),
          password: "password123",
        },
      ];
      localStorage.setItem("quick_holidays_user_requests", JSON.stringify(sampleRequests));
      setRequests(sampleRequests);
    }

    // Load Testimonials
    const storedTestimonials = localStorage.getItem("quick_holidays_testimonials");
    if (storedTestimonials) {
      setAdminTestimonials(JSON.parse(storedTestimonials));
    } else {
      localStorage.setItem("quick_holidays_testimonials", JSON.stringify(TESTIMONIALS));
      setAdminTestimonials(TESTIMONIALS);
    }

    // Load Destinations
    const storedDestinations = localStorage.getItem("quick_holidays_destinations");
    if (storedDestinations) {
      setAdminDestinations(JSON.parse(storedDestinations));
    } else {
      localStorage.setItem("quick_holidays_destinations", JSON.stringify(DESTINATIONS));
      setAdminDestinations(DESTINATIONS);
    }

    // Load Flags
    const storedFlags = localStorage.getItem("quick_holidays_flags");
    if (storedFlags) {
      setAdminFlags(JSON.parse(storedFlags));
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
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("admin_auth", "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid administrator credentials.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
  };

  const updateRequestStatus = (id: string, newStatus: "approved" | "suspended" | "pending") => {
    const updated = requests.map((req) => {
      if (req.id === id) {
        return { ...req, status: newStatus };
      }
      return req;
    });
    localStorage.setItem("quick_holidays_user_requests", JSON.stringify(updated));
    setRequests(updated);
  };

  const deleteRequest = (id: string) => {
    const updated = requests.filter((req) => req.id !== id);
    localStorage.setItem("quick_holidays_user_requests", JSON.stringify(updated));
    setRequests(updated);
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

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setAddSuccess("");

    if (!newFullName || !newUsername || !newEmail || !newPassword) {
      setAddError("Please fill out all fields.");
      return;
    }

    // Check unique username
    const usernameExists = requests.some(
      (r) => r.username && r.username.toLowerCase() === newUsername.trim().toLowerCase()
    );
    if (usernameExists) {
      setAddError("This username is already taken. Please choose another one.");
      return;
    }

    // Check unique email
    const emailExists = requests.some(
      (r) => r.email.toLowerCase() === newEmail.trim().toLowerCase()
    );
    if (emailExists) {
      setAddError("This email address is already registered.");
      return;
    }

    const newUser: UserRequest = {
      id: `req-${Date.now()}`,
      name: newFullName.trim(),
      username: newUsername.trim().toLowerCase(),
      email: newEmail.trim().toLowerCase(),
      role: newRole,
      status: "approved", // Automatically approved when created by Admin
      created_at: new Date().toLocaleString(),
      password: newPassword,
    };

    const updated = [newUser, ...requests];
    localStorage.setItem("quick_holidays_user_requests", JSON.stringify(updated));
    setRequests(updated);

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
      default:
        return {
          title: "System Control Room",
          subtitle: "Welcome back, Administrator.",
        };
    }
  };

  const tabHeader = getTabHeader();
  const pendingRequests = requests.filter((r) => r.status === "pending");
  const approvedUsers = requests.filter((r) => r.status === "approved" || r.status === "suspended");

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
      <div className="flex-1 md:ml-64 min-h-screen pt-8 pb-16">
      
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
                <table className="w-full text-xs">
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
                <table className="w-full text-xs">
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
                        <td className="py-4 text-right space-x-2">
                          {user.status === "approved" ? (
                            <button
                              onClick={() => updateRequestStatus(user.id, "suspended")}
                              className="bg-red-50 hover:bg-red-100 text-red-600 rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => updateRequestStatus(user.id, "approved")}
                              className="bg-green-50 hover:bg-green-100 text-green-700 rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer"
                            >
                              Unsuspend
                            </button>
                          )}
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

      </div>
    </div>
  );
}
