import { 
  LayoutDashboard, 
  CreditCard, 
  Wallet, 
  User, 
  LogOut 
} from "lucide-react";

export const residentLinks = [
  {
    id: 1,
    label: "Dashboard",
    route: "/resident/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: 2,
    label: "Subscriptions",
    route: "/resident/subscriptions",
    icon: CreditCard,
  },
  {
    id: 3,
    label: "Pay Now",
    route: "/resident/pay-now",
    icon: Wallet,
  },
  {
    id: 4,
    label: "Profile",
    route: "/resident/profile",
    icon: User,
  },
];