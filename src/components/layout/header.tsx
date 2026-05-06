"use client";

import { APP_NAME } from "@/constants";
import { IMG_URL, ROUTES } from "@/constants/routes";
import { useLogout } from "@/hooks/query/useAuth";
import { useAuthStore } from "@/stores/auth.store";
import { Icon } from "@iconify/react";
import type { MenuProps } from "antd";
import { House, LogOut, Menu, Smartphone, User } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import AuthModal from "../modal/auth-modal";
import HeaderDesktopActions from "./header-desktop-actions";
import HeaderMobileDrawer from "./header-mobile-drawer";

export default function Header() {
  const searchParams = useSearchParams();
  const t = useTranslations("Header");
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isHydrated } = useAuthStore();
  const { mutateAsync: logoutApi } = useLogout(() => router.push(ROUTES.HOME));

  const [authOpen, setAuthOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const locale = useLocale();
  const navLinks = [
    { href: ROUTES.APARTMENT, label: t("findApartment") },
    { href: "/policies", label: 'Chính sách' },
    { href: "/contact", label: t("contact") },
  ];
  const normalizePath = (path: string) => {
    if (path === "/") {
      return "/";
    }

    return path.replace(/\/$/, "");
  };

  const stripLocalePrefix = (path: string) => {
    const prefix = `/${locale}`;
    if (path === prefix) {
      return "/";
    }

    return path.startsWith(`${prefix}/`) ? path.slice(prefix.length) : path;
  };

  const isActiveLink = (href: string) => {
    const currentPath = pathname ?? "/";
    const current = normalizePath(stripLocalePrefix(currentPath));
    const target = normalizePath(stripLocalePrefix(href));

    if (target === "/") {
      return current === "/";
    }

    return current === target || current.startsWith(`${target}/`);
  };
  const isLoggedIn = Boolean(isHydrated && isAuthenticated && user);
  const userFullName = user?.fullName || "";
  const avatar = user?.profileImageUrl
  const becomePartnerLabel = t("becomePartner");
  const loginLabel = t("login");
  const profileLabel = t("profile");
  const logoutLabel = t("logout");

  useEffect(() => {
    if (searchParams.get("openAuthModal") === "true") {
      startTransition(() => setAuthOpen(true));
    }
  }, [searchParams]);

  function toggleLanguage() {
    const next = locale === "vi" ? "en" : "vi";
    document.cookie = `${APP_NAME}_LOCALE=${next}; path=/`;
    router.refresh();
  }

  function openAuth() {
    setAuthOpen(true);
    setDrawerOpen(false);
  }

  function goProfile() {
    router.push(ROUTES.PROFILE);
    setDrawerOpen(false);
  }

  function goApartment() {
    router.push(ROUTES.MY_APARTMENT);
    setDrawerOpen(false);
  }

  function logout() {
    setDrawerOpen(false);
    logoutApi();
  }

  function openAppGuide() {
    router.push(ROUTES.APP_GUIDE);
    setDrawerOpen(false);
  }

  const flagIcon = locale === "vi" ? "flag:vn-4x3" : "flag:us-4x3";
  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: profileLabel,
      icon: <User size={16} />,
      onClick: () => goProfile(),
    },
    {
      key: "my-apartment",
      label: "Căn hộ của tôi",
      icon: <House size={16} />,
      onClick: () => goApartment(),
    },
    {
      key: "app-guide",
      label: "Hướng dẫn dùng app",
      icon: <Smartphone size={16} />,
      onClick: () => openAppGuide(),
    },
    { type: "divider" },
    {
      key: "logout",
      label: logoutLabel,
      icon: <LogOut size={16} />,
      danger: true,
      onClick: () => logout(),
    },
  ];

  const langBtn = (
    <button
      onClick={toggleLanguage}
      className="hover:opacity-75 cursor-pointer"
    >
      <Icon icon={flagIcon} width={24} height={24} />
    </button>
  );

  return (
    <header className="flex justify-center items-center h-22 w-full fixed top-0 left-0 z-50 bg-white shadow-sm">
      <div className="container flex justify-between items-center">
        <Link href={ROUTES.HOME}>
          <Image alt="Logo" src={IMG_URL.LOGO} width={100} height={100} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex gap-10 font-medium">
          {navLinks.map(({ href, label }) => {
            const isActive = isActiveLink(href);
            return (
              <Link
                key={label}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "relative inline-flex items-center text-primary after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-primary after:content-['']"
                    : "relative inline-flex items-center text-gray-700 hover:text-primary after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:content-[''] hover:after:w-full"
                }
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <HeaderDesktopActions
          isLoggedIn={isLoggedIn}
          langButton={langBtn}
          userMenuItems={userMenuItems}
          userFullName={userFullName}
          becomePartnerLabel={becomePartnerLabel}
          loginLabel={loginLabel}
          onOpenAuth={openAuth}
          avatar={avatar}
        />

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 text-gray-600"
          onClick={() => setDrawerOpen(true)}
        >
          <Menu size={24} />
        </button>
      </div>

      <HeaderMobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        navLinks={navLinks}
        isLoggedIn={isLoggedIn}
        langButton={langBtn}
        userFullName={userFullName}
        becomePartnerLabel={becomePartnerLabel}
        loginLabel={loginLabel}
        profileLabel={profileLabel}
        logoutLabel={logoutLabel}
        onOpenAuth={openAuth}
        onProfile={goProfile}
        onLogout={logout}
      />

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}
