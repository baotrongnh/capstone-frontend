"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  UserOutlined,
  HomeOutlined,
  WalletOutlined,
  BarChartOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  LogoutOutlined,
  FileTextOutlined,
  ApartmentOutlined,
  ContactsOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Avatar, Menu } from "antd";
import {
  ProfileNavItem,
  ProfileRole,
  ProfileSidebarProps,
} from "@/types/profile";
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
      key: "cooperations",
      label: t("sidebar.cooperations"),
      icon: <FileTextOutlined />,
      path: "/profile/cooperations",
    },
    {
      key: "my-schedule",
      label: t("sidebar.mySchedule"),
      icon: <CalendarOutlined />,
      path: "/profile/my-schedule",
    },
    {
      key: "invoices",
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

    items.splice(6, 0, {
      key: "partner-revenues",
      label: t("sidebar.revenue"),
      icon: <BarChartOutlined />,
      path: "/profile/partner-revenues",
    });
  }

  return items;
};

export default function ProfileSidebar({
  role,
  displayName,
  displayEmail,
  displayAvatarUrl,
  onLogout,
}: ProfileSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("Profile");
  const roleLabel = role === "partner" ? t("sidebar.rolePartner") : t("sidebar.roleUser");
  const identityName = displayName?.trim() || roleLabel;
  const identityEmail = displayEmail?.trim() || "";
  const avatarText = identityName.charAt(0).toUpperCase();
  const avatarUrl = displayAvatarUrl?.trim() || undefined;

  const navigationItems = useMemo(() => getNavigationItems(role, t), [role, t]);

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
      return "invoices";
    }

    const matchedItem = navigationItems.find(
      (item) => pathname === item.path || pathname.startsWith(`${item.path}/`),
    );
    return matchedItem?.key || "account";
  }, [pathname, navigationItems, searchParams]);

  return (
    <div className="h-full flex flex-col border border-gray-200 shadow-sm bg-white rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar
            src={avatarUrl}
            size={48}
            className="bg-blue-50! text-primary! font-semibold border border-blue-100"
          >
            {avatarText}
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="text-lg  font-semibold truncate">{identityName}</p>
            {identityEmail ? (
              <p className="text-sm text-muted truncate">{identityEmail}</p>
            ) : null}
          </div>
        </div>

        <div className="mt-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-medium text-primary">
            <SafetyCertificateOutlined />
            {roleLabel}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          items={menuItems}
          className="border-0 p-0 m-0"
          style={{ borderRight: 0 }}
        />
      </div>

      <div className="border-t border-gray-200 p-3 bg-white">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogoutOutlined />
          <span className="font-medium">{t("sidebar.logout")}</span>
        </button>
      </div>
    </div>
  );
}
