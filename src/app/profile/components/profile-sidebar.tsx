"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  UserOutlined,
  HomeOutlined,
  WalletOutlined,
  SettingOutlined,
  LogoutOutlined,
  FileTextOutlined,
  ApartmentOutlined,
  ContactsOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { ProfileNavItem, ProfileRole, ProfileSidebarProps } from "@/types/profile";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

const getNavigationItems = (
  role: ProfileRole,
  t: (key: string) => string,
): ProfileNavItem[] => {
  const items: ProfileNavItem[] = [
    {
      key: "account",
      label: t("sidebar.myInformation"),
      icon: <UserOutlined />,
      path: "/profile/account",
    },
    {
      key: "my-apartment",
      label: t("sidebar.myApartment"),
      icon: <HomeOutlined />,
      path: "/profile/my-apartment",
    },
    {
      key: "contracts",
      label: t("sidebar.myContracts"),
      icon: <ContactsOutlined />,
      path: "/profile/contracts",
    },
    {
      key: "Invoices",
      label: t("sidebar.myBills"),
      icon: <FileTextOutlined />,
      path: "/profile/invoices",
    },
    {
      key: "payment-history",
      label: t("sidebar.paymentHistory"),
      icon: <WalletOutlined />,
      path: "/profile/payment-history",
    },
    {
      key: "settings",
      label: t("sidebar.settings"),
      icon: <SettingOutlined />,
      path: "/profile/settings",
    },
  ];

  if (role === "partner") {
    items.splice(2, 0, {
      key: "my-properties",
      label: t("sidebar.myProperties"),
      icon: <ApartmentOutlined />,
      path: "/profile/my-properties",
    });
  }

  return items;
};

export default function ProfileSidebar({
  role,
  onLogout,
}: ProfileSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("Profile");

  const navigationItems = useMemo(
    () => getNavigationItems(role, t),
    [role, t],
  );

  const menuItems = navigationItems.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
    onClick: () => router.push(item.path),
  }));

  const activeKey = useMemo(() => {
    if (pathname.startsWith("/profile/invoices/")) {
      const from = searchParams.get("from");
      if (from === "payments") {
        return "payment-history";
      }
      return "Invoices";
    }

    const matchedItem = navigationItems.find((item) =>
      pathname === item.path || pathname.startsWith(`${item.path}/`),
    );
    return matchedItem?.key || "account";
  }, [pathname, navigationItems, searchParams]);

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
