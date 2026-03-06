'use client'

import { APP_NAME, DEFAULT_LOCALE } from "@/constants"
import { ROUTES } from "@/constants/routes"
import { useLogout } from "@/hooks/query/useAuth"
import { useAuthStore } from "@/stores/auth.store"
import { Icon } from "@iconify/react"
import type { MenuProps } from "antd"
import { Avatar, Button, Dropdown } from "antd"
import {
  BellRing,
  ChevronDown,
  LogOut,
  MessageSquareText,
  User
} from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { startTransition, useEffect, useState } from "react"
import AuthModal from "../auth-modal"

export default function Header() {
  const searchParams = useSearchParams()
  const t = useTranslations('Header')
  const router = useRouter()
  const { user, isAuthenticated, isHydrated } = useAuthStore()
  const { mutateAsync: logoutApi } = useLogout(() => router.push(ROUTES.HOME))
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  //Redirect to this page (làm xong nhớ xóa dùm t dòng log, nhớ code kĩ)
  //Mấy đường link còn fix cứng trong code mang ra constant cho t nha
  const redirect = searchParams.get('redirect')
  console.log(redirect)

  useEffect(() => {
    if (searchParams.get('auth') === 'true') startTransition(() => setIsAuthModalOpen(true))
  }, [searchParams])

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

  const handleLogout = async () => {
    await logoutApi()
  }

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: t('profile'),
      icon: <User size={16} />,
      onClick: () => {
        if (user) router.push(ROUTES.PROFILE(user.id))
      },
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: t('logout'),
      icon: <LogOut size={16} />,
      danger: true,
      onClick: handleLogout,
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

          {isHydrated && isAuthenticated && user ? (
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
              <div className="flex items-center cursor-pointer gap-2">
                <span className="font-medium">{user.fullName}</span>
                <Avatar size="default" icon={<User />} />
                <ChevronDown strokeWidth={1.6} size={15} />
              </div>
            </Dropdown>
          ) : (
            <Button type="default" shape="round" onClick={() => setIsAuthModalOpen(true)}>
              {t('login')}
            </Button>
          )}

          <AuthModal open={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
      </div>
    </header>
  );
}
