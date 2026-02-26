'use client'

import { APP_NAME, DEFAULT_LOCALE, LOCALES } from "@/constants";
import { ROUTES } from "@/constants/routes";
import { Icon } from "@iconify/react";
import { Avatar, Button, Dropdown } from "antd";
import {
  BellRing,
  ChevronDown,
  MessageSquareText,
  User
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const t = useTranslations('Header')
  const router = useRouter()

  // Lazy initialization to avoid server-side issues
  const [locale, setLocale] = useState(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_LOCALE
    }

    const cookieLocale = document.cookie
      .split("; ")
      .find(row => row.startsWith(`${APP_NAME}_LOCALE=`))
      ?.split("=")[1]

    if (!cookieLocale) {
      document.cookie = `${APP_NAME}_LOCALE=${DEFAULT_LOCALE}; path=/`
      return DEFAULT_LOCALE
    }

    return cookieLocale
  })

  const toggleLanguage = () => {
    const newLocale = locale === 'vi' ? 'en' : 'vi'
    setLocale(newLocale)
    document.cookie = `${APP_NAME}_LOCALE=${newLocale}; path=/`
    router.refresh()
  }

  const getFlagIcon = () => {
    return locale === 'vi' ? 'flag:vn-4x3' : 'flag:us-4x3'
  }

  const items = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          1st menu item
        </a>
      ),
    },
    {
      key: "4",
      danger: true,
      label: "a danger item",
    },
  ];

  return (
    <header className="flex justify-center items-center h-22 w-full fixed top-0 left-0 z-50 bg-white shadow-sm">
      <div className="container flex justify-between items-center">
        <div className="max-w-56">LOGO</div>
        <ul className="hidden lg:flex gap-10 font-medium shrink-0">
          <Link href={ROUTES.APARTMENT} className="hover:opacity-75">
            {t('findApartment')}
          </Link>
          <Link href="/" className="flex items-center gap-1 hover:opacity-75">
            {t('yourApartment')}
            <Icon icon="lucide:chevron-down" width={17} />
          </Link>
          <Link href="/" className="hover:opacity-75">
            {t('bills')}
          </Link>
          <Link href="/" className="hover:opacity-75">
            {t('support')}
          </Link>
          <Link href={ROUTES.CONTACT} className="hover:opacity-75">
            {t('contact')}
          </Link>
        </ul>
        <div className="hidden lg:flex items-center gap-5 shrink-0">
          <button
            onClick={toggleLanguage}
            className="hover:opacity-75 transition-opacity cursor-pointer"
            title={locale === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
          >
            <Icon icon={getFlagIcon()} width={24} height={24} />
          </button>
          <MessageSquareText strokeWidth={1.4} />
          <BellRing strokeWidth={1.4} />
          <Button shape="round" type="primary">
            {t('becomePartner')}
          </Button>

          <div className="flex items-center">
            <span className="mr-3">Name</span>
            <Avatar size="default" icon={<User />} />
            <Dropdown menu={{ items }}>
              <ChevronDown strokeWidth={1.6} size={15} />
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
}
