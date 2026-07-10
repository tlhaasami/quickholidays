import logoTop from "@/assets/image 1.png";
import logoBottom from "@/assets/Quick Holidays Logo-Bottom.png";

// Backgrounds
import heroBg from "@/assets/ChatGPT Image Jul 1, 2026, 11_12_18 PM 1 (1).png";
import whyChooseUsBg from "@/assets/ChatGPT Image Jul 1, 2026, 11_12_18 PM 1.png";
import formBg from "@/assets/ChatGPT Image Jul 1, 2026, 01_29_45 AM 1.png";

// Icons
import statIcon1 from "@/assets/image 38 (4).png"; // badge/handshake/experience
import statIcon2 from "@/assets/image 38 (8).png"; // user/clients
import statIcon3 from "@/assets/image 38 (7).png"; // success rate

import serviceIcon1 from "@/assets/image 38.png";
import serviceIcon2 from "@/assets/image 38 (1).png";
import serviceIcon3 from "@/assets/image 38 (2).png";
import serviceIcon4 from "@/assets/image 38 (3).png";
import serviceIcon5 from "@/assets/image 38 (6).png";

// Testimonial Avatars
import avatarJames from "@/assets/Ellipse 3.png";
import avatarSarah from "@/assets/Ellipse 1.png";
import avatarDaniel from "@/assets/image 9.png";

// Destinations
import destAustria from "@/assets/Rectangle 10.png";
import destEstonia from "@/assets/Rectangle 11.png";
import destFinland from "@/assets/ChatGPT Image Jun 30, 2026, 06_56_48 PM 1.png";
import destFrance from "@/assets/Rectangle 13.png";
import destGermany from "@/assets/Rectangle 14.png";

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
    icon: serviceIcon3,
  },
  {
    title: "Application Preparation",
    description: "Preparing complete and accurate applications to reduce delays and improve accuracy.",
    icon: serviceIcon4,
  },
  {
    title: "Appointment Assistance",
    description: "Helping clients secure and manage Schengen visa appointments with ease.",
    icon: serviceIcon2,
  },
  {
    title: "Documentation Review",
    description: "Carefully reviewing supporting documents before submission.",
    icon: serviceIcon5,
  },
  {
    title: "Ongoing Support",
    description: "Dedicated assistance throughout every stage of your application.",
    icon: serviceIcon1,
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
    avatar: avatarDaniel,
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
