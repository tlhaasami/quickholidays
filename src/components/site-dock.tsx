"use client";

import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconCalendarEvent,
  IconHelpCircle,
  IconHome,
  IconRoute,
  IconStar,
  IconUsers,
  IconWorld,
} from "@tabler/icons-react";

const links = [
  {
    title: "Home",
    icon: <IconHome className="h-full w-full text-primary" />,
    href: "/",
  },
  {
    title: "Schengen Visa",
    icon: <IconWorld className="h-full w-full text-primary" />,
    href: "/schengen-visa",
  },
  {
    title: "How It Works",
    icon: <IconRoute className="h-full w-full text-primary" />,
    href: "/how-it-works",
  },
  {
    title: "FAQ",
    icon: <IconHelpCircle className="h-full w-full text-primary" />,
    href: "/faq",
  },
  {
    title: "Reviews",
    icon: <IconStar className="h-full w-full text-primary" />,
    href: "/reviews",
  },
  {
    title: "About Us",
    icon: <IconUsers className="h-full w-full text-primary" />,
    href: "/about-us",
  },
  {
    title: "Book a Free Consultation",
    icon: <IconCalendarEvent className="h-full w-full text-primary" />,
    href: "/contact-us",
  },
];

export function SiteDock() {
  return (
    <FloatingDock
      items={links}
      desktopClassName="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
      mobileClassName="fixed bottom-4 right-4 z-40"
    />
  );
}
