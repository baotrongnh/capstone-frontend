"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  UserOutlined,
  HomeOutlined,
  WalletOutlined,
  CalendarOutlined,
  SettingOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { ActorType } from "@/types/auth";
import { ProfileNavItem, ProfileSidebarProps } from "@/types/profile";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

const getNavigationItems = (
  userId: string,
  actorType: ActorType,
  t: (key: string) => string,
): ProfileNavItem[] => {
  const baseItems: ProfileNavItem[] = [];

  const userItems: ProfileNavItem[] = [
    {
      key: "account",
      label: t("sidebar.myInformation"),
      icon: <UserOutlined />,
      path: `/profile/${userId}/account`,
      roles: [ActorType.USER],
    },
    {
      key: "my-apartment",
      label: t("sidebar.myApartment"),
      icon: <HomeOutlined />,
      path: `/profile/${userId}/my-apartment`,
      roles: [ActorType.USER],
    },
    {
      key: "payment-history",
      label: t("sidebar.paymentHistory"),
      icon: <WalletOutlined />,
      path: `/profile/${userId}/payment-history`,
      roles: [ActorType.USER],
    },
    {
      key: "my-contracts",
      label: t("sidebar.myContracts"),
      icon: <WalletOutlined />,
      path: `/profile/${userId}/my-contracts`,
      roles: [ActorType.USER],
    },
    {
      key: "settings",
      label: t("sidebar.settings"),
      icon: <SettingOutlined />,
      path: `/profile/${userId}/settings`,
      roles: [ActorType.PARTNER],
    },
  ];

  const partnerItems: ProfileNavItem[] = [
    {
      key: "account",
      label: t("sidebar.accountInformation"),
      icon: <UserOutlined />,
      path: `/profile/${userId}/account`,
      roles: [ActorType.PARTNER],
    },
    {
      key: "partner-dashboard",
      label: t("sidebar.partnerDashboard"),
      icon: <DashboardOutlined />,
      path: `/profile/${userId}/dashboard`,
      roles: [ActorType.PARTNER],
    },

    {
      key: "my-properties",
      label: t("sidebar.myProperties"),
      icon: <HomeOutlined />,
      path: `/profile/${userId}/my-properties`,
      roles: [ActorType.PARTNER],
    },
    {
      key: "bookings",
      label: t("sidebar.bookings"),
      icon: <CalendarOutlined />,
      path: `/profile/${userId}/bookings`,
      roles: [ActorType.PARTNER],
    },
    {
      key: "revenue",
      label: t("sidebar.revenue"),
      icon: <WalletOutlined />,
      path: `/profile/${userId}/revenue`,
      roles: [ActorType.PARTNER],
    },
    {
      key: "settings",
      label: t("sidebar.settings"),
      icon: <SettingOutlined />,
      path: `/profile/${userId}/settings`,
      roles: [ActorType.PARTNER],
    },
  ];

  let roleSpecificItems: ProfileNavItem[] = [];

  switch (actorType) {
    case ActorType.USER:
      roleSpecificItems = userItems;
      break;
    case ActorType.PARTNER:
      roleSpecificItems = partnerItems;
      break;
  }

  return [...roleSpecificItems, ...baseItems];
};

export default function ProfileSidebar({
  userId,
  actorType,
  onLogout,
}: ProfileSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Profile");

  const navigationItems = useMemo(
    () => getNavigationItems(userId, actorType, t),
    [userId, actorType, t],
  );

  const menuItems = navigationItems.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
    onClick: () => router.push(item.path),
  }));

  const activeKey = useMemo(() => {
    const matchedItem = navigationItems.find((item) => pathname === item.path);
    return matchedItem?.key || "account";
  }, [pathname, navigationItems]);

  return (
    <div className="h-full flex flex-col shadow-sm">
      <div className="flex-1 overflow-y-auto">
        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          items={menuItems}
          className="border-0"
        />
      </div>

      <div className="border-t border-gray-200 p-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogoutOutlined />
          <span className="font-medium">{t("sidebar.logout")}</span>
        </button>
      </div>
    </div>
  );
}
