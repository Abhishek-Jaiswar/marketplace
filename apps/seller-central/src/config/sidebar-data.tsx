
import { SidebarData } from "@workspace/ui/components/app-sidebar"
import {
  LayoutDashboardIcon,
  PackageIcon,
  ShoppingCartIcon,
  BarChart3Icon,
  SettingsIcon,
  BellIcon,
  InboxIcon,
  HelpCircleIcon,
  UserPlusIcon,
  LayersIcon,
  ZapIcon,
  ClockIcon,
  CheckCircle2Icon,
} from "lucide-react"

export const sellerSidebarData: SidebarData = {
  appName: "Seller Central",
  appSubtitle: "seller.cbsmarketplace.com",
  appLogo: "/shopping.png",
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
          title: "Orders Pipeline",
          url: "/dashboard/orders",
          icon: <ShoppingCartIcon />,
          items: [
            {
              title: "New Orders",
              url: "/dashboard/orders?status=new",
              icon: <LayersIcon />,
              badge: 24,
            },
            {
              title: "In Processing",
              url: "/dashboard/orders?status=processing",
              icon: <ZapIcon />,
              badge: 4,
            },
            {
              title: "Fulfillment Review",
              url: "/dashboard/orders?status=fulfillment",
              icon: <ClockIcon />,
              badge: 7,
            },
            {
              title: "Completed",
              url: "/dashboard/orders?status=completed",
              icon: <CheckCircle2Icon />,
              badge: 13,
            },
          ],
        },
      ],
    },
    {
      groupTitle: "Tools & Catalog",
      items: [
        {
          title: "Notifications",
          url: "/dashboard/notifications",
          icon: <BellIcon />,
          badge: 7,
          badgeColor: "red",
        },
        {
          title: "Buyer Messages",
          url: "/dashboard/messages",
          icon: <InboxIcon />,
        },
        {
          title: "Products & Stock",
          url: "/dashboard/products",
          icon: <PackageIcon />,
        },
        {
          title: "Sales Reporting",
          url: "/dashboard/analytics",
          icon: <BarChart3Icon />,
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
      title: "Store Settings",
      url: "/dashboard/settings",
      icon: <SettingsIcon />,
    },
    {
      title: "Invite Team Members",
      url: "/dashboard/team",
      icon: <UserPlusIcon />,
    },
  ],
}
