import logoTop from "@/assets/quick-holidays logo.png";
import logoBottom from "@/assets/quick-holidays-logo-bottom.png";

// Backgrounds
import heroBg from "@/assets/hero-section-bg.png";
import whyChooseUsBg from "@/assets/why-choose-us-bg.png";
import formBg from "@/assets/consulation-bg.png";

// Icons for Stats
import statIcon1 from "@/assets/years-of-expereince.png";     // star badge icon
import statIcon2 from "@/assets/happy-clients.png";     // person with star icon
import statIcon3 from "@/assets/visa-success-rate.png";        // passport cover icon

// Icons for Services
import serviceIcon1 from "@/assets/Schengen Tourest VisaConsultation.png";
import serviceIcon2 from "@/assets/application-preparation.png";
import serviceIcon3 from "@/assets/spain-flag.png"; // briefcase/globe for Appointment Assistance
import serviceIcon4 from "@/assets/Documentaiton Review.png";
import serviceIcon5 from "@/assets/onging-support.png"; // customer support headset

// Testimonial Avatars
import avatarSarah from "@/assets/review-profile-1.png"; // woman portrait
import avatarJames from "@/assets/review-profile-2.png"; // man portrait (James)
import avatarRayan from "@/assets/review-profile-3.png"; // man portrait (Daniel/James)

// Destinations
import destAustria from "@/assets/Austria-place-bg.png";
import destEstonia from "@/assets/Estonia.png";
import destFinland from "@/assets/Finland.png";
import destFrance from "@/assets/France.png";
import destGermany from "@/assets/Germany.png";

export { logoTop, logoBottom, heroBg, whyChooseUsBg, formBg };

export const STATS = [
  {
    value: "15+",
    label: "Years of Experience",
    icon: statIcon1,
  },
  {
    value: "50K+",
    label: "Happy Clients",
    icon: statIcon2,
  },
  {
    value: "96%",
    label: "Visa Success Rate",
    icon: statIcon3,
  },
];

export const SERVICES = [
  {
    title: "Schengen Tourist Visa Consultation",
    description: "Expert guidance tailored specifically for Schengen tourist visa applications.",
    icon: serviceIcon1,
  },
  {
    title: "Application Preparation",
    description: "Preparing complete and accurate applications to reduce delays and improve accuracy.",
    icon: serviceIcon2,
  },
  {
    title: "Appointment Assistance",
    description: "Helping clients secure and manage Schengen visa appointments with ease.",
    icon: serviceIcon3,
  },
  {
    title: "Documentation Review",
    description: "Carefully reviewing supporting documents before submission.",
    icon: serviceIcon4,
  },
  {
    title: "Ongoing Support",
    description: "Dedicated assistance throughout every stage of your application.",
    icon: serviceIcon5,
  },
];

export const WHY_CHOOSE_US_POINTS = [
  "Expert Schengen Visa Consultation",
  "Transparent & Honest Communication",
  "Fast, Efficient and Stress Free Process",
  "Approval Focused Approach",
  "Dedicated Support at Every Step",
];

export const TESTIMONIALS = [
  {
    quote: "The entire process was handled professionally from start to finish. The team explained every requirement clearly, helped me prepare my documents, and secured my appointment without any hassle. My Schengen visa was approved smoothly.",
    name: "James Wilson",
    location: "London, United Kingdom",
    avatar: avatarJames,
    rating: 5,
  },
  {
    quote: "I was nervous about applying for my first Schengen visa, but Quick Holidays made everything simple. Their communication was excellent, and they kept me informed at every stage. Highly recommended.",
    name: "Sarah Ahmad",
    location: "Manchester, United Kingdom",
    avatar: avatarSarah,
    rating: 5,
  },
  {
    quote: "Exceptional service and outstanding attention to detail. They reviewed every document thoroughly and answered all of my questions promptly. I couldn't have asked for a better experience.",
    name: "Daniel Carter",
    location: "Birmingham, United Kingdom",
    avatar: avatarRayan,
    rating: 5,
  },
];

export const DESTINATIONS = [
  {
    name: "Austria",
    image: destAustria,
  },
  {
    name: "Estonia",
    image: destEstonia,
  },
  {
    name: "Finland",
    image: destFinland,
  },
  {
    name: "France",
    image: destFrance,
  },
  {
    name: "Germany",
    image: destGermany,
  },
];
