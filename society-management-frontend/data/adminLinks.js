import {
  LayoutDashboard,
  Building,
  CreditCard,
  Calendar,
  Wallet,
  BarChart,
  Bell,
  User
} from "lucide-react";

export const adminLinks = [
  {
    id: 1,
    label: "Dashboard",
    route: "/admin/dashboard",
    icon: LayoutDashboard
  },
  {
    id: 2,
    label: "Flats",
    route: "/admin/flats",
    icon: Building
  },
  {
    id: 3,
    label: "Subscriptions",
    route: "/admin/subscriptions",
    icon: CreditCard
  },
  {
    id: 4,
    label: "Monthly Records",
    route: "/admin/monthly-records",
    icon: Calendar
  },
  {
    id: 5,
    label: "Payment Entry",
    route: "/admin/payment-entry",
    icon: Wallet
  },
  {
    id: 6,
    label: "Reports",
    route: "/admin/reports",
    icon: BarChart
  },
  {
    id: 7,
    label: "Notifications",
    route: "/admin/notifications",
    icon: Bell
  },
  {
    id: 8,
    label: "Profile",
    route: "/admin/profile",
    icon: User
  }
];


