"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  UserOutlined,
  HomeOutlined,
  WalletOutlined,
  SettingOutlined,
  LogoutOutlined,
  FileTextOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { ActorType } from "@/types/auth";
import { ProfileNavItem, ProfileSidebarProps } from "@/types/profile";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

const getNavigationItems = (
  actorType: ActorType,
  t: (key: string) => string,
): ProfileNavItem[] => {
  const items: ProfileNavItem[] = [
    {
      key: "account",
      label: t("sidebar.myInformation"),
      icon: <UserOutlined />,
      path: "/profile/account",
      roles: [ActorType.USER, ActorType.PARTNER],
    },
    {
      key: "my-apartment",
      label: t("sidebar.myApartment"),
      icon: <HomeOutlined />,
      path: "/profile/my-apartment",
      roles: [ActorType.USER, ActorType.PARTNER],
    },
    {
      key: "payment-history",
      label: t("sidebar.paymentHistory"),
      icon: <WalletOutlined />,
      path: "/profile/payment-history",
      roles: [ActorType.USER, ActorType.PARTNER],
    },
    {
      key: "bills",
      label: t("sidebar.myBills"),
      icon: <FileTextOutlined />,
      path: "/profile/bills",
      roles: [ActorType.USER, ActorType.PARTNER],
    },
    {
      key: "my-properties",
      label: t("sidebar.myProperties"),
      icon: <ApartmentOutlined />,
      path: "/profile/my-properties",
      roles: [ActorType.PARTNER],
    },
    {
      key: "settings",
      label: t("sidebar.settings"),
      icon: <SettingOutlined />,
      path: "/profile/settings",
      roles: [ActorType.USER, ActorType.PARTNER],
    },
  ];

  return items.filter((item) => item.roles.includes(actorType));
};

export default function ProfileSidebar({
  actorType,
  onLogout,
}: ProfileSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Profile");

  const navigationItems = useMemo(
    () => getNavigationItems(actorType, t),
    [actorType, t],
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
    <div className="h-full flex flex-col shadow-sm bg-white">
      <div className="flex-1 overflow-y-auto p-2">
        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          items={menuItems}
          className="border-0 p-0 m-0"
          style={{ borderRight: 0 }}
        />
      </div>

      <div className="border-t border-gray-200 p-4 bg-white ">
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
