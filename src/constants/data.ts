import logoTop from "@/assets/logos/quick-holidays-logo.png";
import logoBottom from "@/assets/logos/quick-holidays-logo-bottom.png";

// Backgrounds
import heroBg from "@/assets/backgrounds/home-bg.png";
import schengenVisaBg from "@/assets/backgrounds/schengen-visa-bg.png";
import whyChooseUsBg from "@/assets/backgrounds/why-choose-us-bg.png";
import formBg from "@/assets/backgrounds/consulation-bg.png";
import flagPlaceholder from "@/assets/flags/france-flag.png";

// Flags
import flagAustria from "@/assets/flags/austria-flag.png";
import flagBelgium from "@/assets/flags/belgium-flag.png";
import flagBulgaria from "@/assets/flags/bulgaria-flag.png";
import flagCroatia from "@/assets/flags/croatia-flag.png";
import flagCzechRepublic from "@/assets/flags/czech-republic-flag.png";
import flagDenmark from "@/assets/flags/denmark-flag.png";
import flagEstonia from "@/assets/flags/estonia-flag.png";
import flagFinland from "@/assets/flags/finland-flag.png";
import flagFrance from "@/assets/flags/france-flag.png";
import flagGermany from "@/assets/flags/germany-flag.png";
import flagItaly from "@/assets/flags/italy-flag.png";
import flagSpain from "@/assets/flags/spain-flag.png";

// Icons for Stats
import statIcon1 from "@/assets/icons/years-of-expereince.png";     // star badge icon
import statIcon2 from "@/assets/icons/happy-clients.png";     // person with star icon
import statIcon3 from "@/assets/icons/visa-success-rate.png";        // passport cover icon

// Icons for Services
import serviceIcon1 from "@/assets/icons/schengen-tourest-visa-consultation.png";
import serviceIcon2 from "@/assets/icons/application-preparation.png";
import serviceIcon3 from "@/assets/icons/appointment-assistance.png"; // briefcase/globe for Appointment Assistance
import serviceIcon4 from "@/assets/icons/documentaiton-review.png";
import serviceIcon5 from "@/assets/icons/onging-support.png"; // customer support headset

// Testimonial Avatars
import avatarSarah from "@/assets/profile-icons/review-profile-1.png"; // woman portrait
import avatarJames from "@/assets/profile-icons/review-profile-2.png"; // man portrait (James)
import avatarRayan from "@/assets/profile-icons/review-profile-3.png"; // man portrait (Daniel/James)

// Destinations
import destAustria from "@/assets/places-bg/austria-place-bg.png";
import destEstonia from "@/assets/places-bg/estonia-place-bg.png";
import destFinland from "@/assets/places-bg/finland-place-bg.png";
import destFrance from "@/assets/places-bg/france-place-bg.png";
import destGermany from "@/assets/places-bg/germany-place-bg.png";

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

export {
  schengenVisaBg,
  flagPlaceholder,
  flagAustria,
  flagBelgium,
  flagBulgaria,
  flagCroatia,
  flagCzechRepublic,
  flagDenmark,
  flagEstonia,
  flagFinland,
  flagFrance,
  flagGermany,
  flagItaly,
  flagSpain,
};

export const SCHENGEN_DESTINATIONS = [
  { name: "France", slug: "france", flag: flagFrance },
  { name: "Spain", slug: "spain", flag: flagSpain },
  { name: "Italy", slug: "italy", flag: flagItaly },
  { name: "Austria", slug: "austria", flag: flagAustria },
  { name: "Belgium", slug: "belgium", flag: flagBelgium },
  { name: "Bulgaria", slug: "bulgaria", flag: flagBulgaria },
  { name: "Croatia", slug: "croatia", flag: flagCroatia },
  { name: "Czech Republic", slug: "czech-republic", flag: flagCzechRepublic },
  { name: "Denmark", slug: "denmark", flag: flagDenmark },
  { name: "Estonia", slug: "estonia", flag: flagEstonia },
  { name: "Finland", slug: "finland", flag: flagFinland },
  { name: "Germany", slug: "germany", flag: flagGermany },
];
