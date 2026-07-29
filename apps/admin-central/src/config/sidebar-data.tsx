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
} from "lucide-react"

export const adminSidebarData: SidebarData = {
  appName: "Admin Central",
  appSubtitle: "admin.cbsmarketplace.studio",
  appLogo: <ShieldCheckIcon className="size-4" />,
  groups: [
    {
      groupTitle: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: <LayoutDashboardIcon />,
        },
        {
          title: "Seller Approvals",
          url: "/dashboard/sellers",
          icon: <StoreIcon />,
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
