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
import type { MenuProps } from "antd";
import {
  ProfileNavItem,
  ProfileRole,
  ProfileSidebarProps,
  ResolvedSidebarSection,
  SidebarSection,
} from "@/types/profile";
import { useEffect, useMemo, useState } from "react";
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

    items.splice(1, 0, {
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

  const navigationMap = useMemo(
    () => new Map(navigationItems.map((item) => [item.key, item])),
    [navigationItems],
  );

  const navigationPathMap = useMemo(
    () => new Map(navigationItems.map((item) => [item.key, item.path])),
    [navigationItems],
  );

  const navigationSections = useMemo<SidebarSection[]>(
    () => [
      {
        key: "section-account-revenue",
        label: t("sidebar.sectionAccountRevenue"),
        icon: <UserOutlined />,
        itemKeys: ["account", ...(role === "partner" ? ["partner-revenues"] : [])],
      },
      {
        key: "section-apartment-property",
        label: t("sidebar.sectionApartmentProperty"),
        icon: <HomeOutlined />,
        itemKeys: ["my-apartment", ...(role === "partner" ? ["my-properties"] : [])],
      },
      {
        key: "section-contracts",
        label: t("sidebar.sectionContracts"),
        icon: <FileTextOutlined />,
        itemKeys: ["contracts", "cooperations"],
      },
      {
        key: "section-schedule",
        label: t("sidebar.sectionSchedule"),
        icon: <CalendarOutlined />,
        itemKeys: ["my-schedule"],
      },
      {
        key: "section-billing",
        label: t("sidebar.sectionBilling"),
        icon: <WalletOutlined />,
        itemKeys: ["invoices", "payment-history"],
      },
      {
        key: "section-settings",
        label: t("sidebar.sectionSettings"),
        icon: <SettingOutlined />,
        itemKeys: ["settings"],
      },
    ],
    [role, t],
  );

  const sectionLabelClassName = "text-[10px] font-semibold uppercase tracking-wide text-gray-500";
  const singleSectionItemLabelClassName = "single-section-item-label text-[10px] font-semibold uppercase tracking-wide";


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

  const resolvedSections = useMemo<ResolvedSidebarSection[]>(
    () =>
      navigationSections
        .map((section) => ({
          key: section.key,
          label: section.label,
          icon: section.icon,
          items: section.itemKeys
            .map((key) => navigationMap.get(key))
            .filter((item): item is ProfileNavItem => item !== undefined),
        }))
        .filter((section) => section.items.length > 0),
    [navigationMap, navigationSections],
  );

  const menuItems = useMemo<MenuProps["items"]>(() => {
    const items: NonNullable<MenuProps["items"]> = [];

    resolvedSections.forEach((section, sectionIndex) => {
      if (section.items.length === 1) {
        const [singleItem] = section.items;
        items.push({
          key: singleItem.key,
          icon: singleItem.icon,
          className: "!h-10 !min-h-10 !leading-10 !mb-1",
          label: <span className={singleSectionItemLabelClassName}>{singleItem.label}</span>,
        });
      } else {
        items.push({
          key: section.key,
          icon: section.icon,
          label: <span className={sectionLabelClassName}>{section.label}</span>,
          children: section.items.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            className: "!mb-1",
          })),
        });
      }

      if (sectionIndex < resolvedSections.length - 1) {
        items.push({ type: "divider" as const });
      }
    });

    return items;
  }, [resolvedSections]);

  const defaultOpenSectionKeys = useMemo(
    () =>
      resolvedSections
        .filter((section) => section.items.length > 1)
        .filter((section) => section.items.some((item) => item.key === activeKey))
        .map((section) => section.key),
    [activeKey, resolvedSections],
  );

  const [openSectionKeys, setOpenSectionKeys] = useState<string[]>(defaultOpenSectionKeys);

  useEffect(() => {
    setOpenSectionKeys(defaultOpenSectionKeys);
  }, [defaultOpenSectionKeys]);

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    const targetPath = navigationPathMap.get(String(key));
    if (targetPath) {
      router.push(targetPath);
    }
  };

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
              <p className="text-xs text-muted truncate">{identityEmail}</p>
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
          openKeys={openSectionKeys}
          onOpenChange={(keys) => setOpenSectionKeys(keys.map(String))}
          onClick={handleMenuClick}
          className="border-0 p-0 m-0 [&_.ant-menu-item]:rounded-lg! [&_.ant-menu-item]:bg-white! [&_.ant-menu-item]:text-gray-700! [&_.ant-menu-item:not(.ant-menu-item-selected):hover]:bg-blue-100! [&_.ant-menu-item:not(.ant-menu-item-selected):hover]:text-primary! [&_.ant-menu-item:not(.ant-menu-item-selected):hover_.ant-menu-item-icon]:text-primary! [&_.ant-menu-item-selected]:bg-primary! [&_.ant-menu-item-selected]:text-white! [&_.ant-menu-item-selected_.ant-menu-item-icon]:text-white! [&_.ant-menu-item-selected_.ant-menu-title-content]:text-white! [&_.ant-menu-item-selected_.single-section-item-label]:text-white! [&_.ant-menu-item-selected.ant-menu-item-active]:bg-primary! [&_.ant-menu-item-selected.ant-menu-item-active]:text-white! [&_.ant-menu-item-selected.ant-menu-item-active_.ant-menu-item-icon]:text-white! [&_.ant-menu-item-selected.ant-menu-item-active_.ant-menu-title-content]:text-white! [&_.ant-menu-item-selected.ant-menu-item-active_.single-section-item-label]:text-white! [&_.ant-menu-submenu-title]:rounded-lg! [&_.ant-menu-submenu-title:hover]:bg-blue-100! [&_.ant-menu-submenu-title:hover]:text-primary! [&_.ant-menu-submenu-title:hover_.ant-menu-item-icon]:text-primary! [&_.ant-menu-sub.ant-menu-inline]:bg-white!"
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
