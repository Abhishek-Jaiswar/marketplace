import { SidebarData } from "@workspace/ui/components/app-sidebar"
import {
  LayoutDashboardIcon,
  UsersIcon,
  StoreIcon,
  CreditCardIcon,
  SettingsIcon,
  ShieldCheckIcon,
  BellIcon,
  HelpCircleIcon,
  UserPlusIcon,
  ClockIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
} from "lucide-react"

export const adminSidebarData: SidebarData = {
  appName: "Admin Central",
  appSubtitle: "admin.cbsmarketplace.studio",
  appLogo: <ShieldCheckIcon className="size-4" />,
  user: {
    name: "Kamil Bachanek",
    email: "kamil@microdose.studio",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  },
  groups: [
    {
      groupTitle: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: <LayoutDashboardIcon />,
          isActive: true,
        },
        {
          title: "Seller Approvals",
          url: "/dashboard/sellers",
          icon: <StoreIcon />,
          items: [
            {
              title: "Pending KYC",
              url: "/dashboard/sellers?status=pending",
              icon: <ClockIcon />,
              badge: 18,
            },
            {
              title: "In Review",
              url: "/dashboard/sellers?status=review",
              icon: <AlertTriangleIcon />,
              badge: 4,
            },
            {
              title: "Approved Merchants",
              url: "/dashboard/sellers?status=approved",
              icon: <CheckCircle2Icon />,
              badge: 1842,
            },
          ],
        },
      ],
    },
    {
      groupTitle: "Ecosystem Tools",
      items: [
        {
          title: "System Alerts",
          url: "/dashboard/alerts",
          icon: <BellIcon />,
          badge: 3,
          badgeColor: "red",
        },
        {
          title: "User Management",
          url: "/dashboard/users",
          icon: <UsersIcon />,
        },
        {
          title: "Financials & Payouts",
          url: "/dashboard/financials",
          icon: <CreditCardIcon />,
        },
      ],
    },
  ],
  bottomItems: [
    {
      title: "Help Center",
      url: "https://docs.cbsmarketplace.com",
      icon: <HelpCircleIcon />,
      isExternal: true,
    },
    {
      title: "Platform Settings",
      url: "/dashboard/settings",
      icon: <SettingsIcon />,
    },
    {
      title: "Invite Admins",
      url: "/dashboard/invite",
      icon: <UserPlusIcon />,
    },
  ],
}
