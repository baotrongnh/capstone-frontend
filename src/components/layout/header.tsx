'use client'

import { APP_NAME } from "@/constants"
import { IMG_URL, ROUTES } from "@/constants/routes"
import { useAddressTypePreference } from "@/hooks/useAddressTypePreference"
import { useLogout } from "@/hooks/query/useAuth"
import { useAuthStore } from "@/stores/auth.store"
import { Icon } from "@iconify/react"
import type { MenuProps } from "antd"
import { Avatar, Button, Drawer, Dropdown } from "antd"
import { BellRing, Check, ChevronDown, LogOut, MapPin, Menu, MessageSquareText, User } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { startTransition, useEffect, useState } from "react"
import AuthModal from "../modal/auth-modal"

const NAV_LINKS = (t: (k: string) => string) => [
  { href: ROUTES.APARTMENT, label: t('findApartment') },
  // { href: '/', label: t('yourApartment') },
  // { href: '/', label: t('bills') },
  { href: '/', label: t('support') },
  { href: '/', label: t('contact') },
]

export default function Header() {
  const searchParams = useSearchParams()
  const t = useTranslations('Header')
  const router = useRouter()
  const { addressType, setAddressType } = useAddressTypePreference()
  const { user, isAuthenticated, isHydrated } = useAuthStore()
  const { mutateAsync: logoutApi } = useLogout(() => router.push(ROUTES.HOME))

  const [authOpen, setAuthOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const locale = useLocale()
  const navLinks = NAV_LINKS(t)
  const isLoggedIn = Boolean(isHydrated && isAuthenticated && user)
  const currentAddressTypeLabel = addressType === 'new' ? t('addressTypeNew') : t('addressTypeOld')

  useEffect(() => {
    if (searchParams.get('openAuthModal') === 'true') {
      startTransition(() => setAuthOpen(true))
    }
  }, [searchParams])

  function toggleLanguage() {
    const next = locale === 'vi' ? 'en' : 'vi'
    document.cookie = `${APP_NAME}_LOCALE=${next}; path=/`
    router.refresh()
  }

  function openAuth(closeDrawer = false) {
    setAuthOpen(true)
    if (closeDrawer) {
      setDrawerOpen(false)
    }
  }

  function goProfile(closeDrawer = false) {
    router.push(ROUTES.PROFILE)
    if (closeDrawer) {
      setDrawerOpen(false)
    }
  }

  function logout(closeDrawer = false) {
    if (closeDrawer) {
      setDrawerOpen(false)
    }
    logoutApi()
  }

  const flagIcon = locale === 'vi' ? 'flag:vn-4x3' : 'flag:us-4x3'
  const toggleAddressType = () => setAddressType(addressType === 'new' ? 'old' : 'new')

  const addressTypeButton = (
    <Button
      shape="round"
      size="small"
      icon={<MapPin size={14} />}
      onClick={toggleAddressType}
      title={t('addressTypeLabel')}
    >
      {currentAddressTypeLabel}
    </Button>
  )

  const addressTypeMenuItems: MenuProps['items'] = [
    {
      key: 'address-type-new',
      label: (
        <div className="flex items-center justify-between min-w-40">
          <span>{t('addressTypeNew')}</span>
          {addressType === 'new' && <Check size={14} />}
        </div>
      ),
      onClick: () => setAddressType('new'),
    },
    {
      key: 'address-type-old',
      label: (
        <div className="flex items-center justify-between min-w-40">
          <span>{t('addressTypeOld')}</span>
          {addressType === 'old' && <Check size={14} />}
        </div>
      ),
      onClick: () => setAddressType('old'),
    },
  ]

  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', label: t('profile'), icon: <User size={16} />, onClick: () => goProfile() },
    {
      key: 'address-type',
      label: t('addressTypeLabel'),
      icon: <MapPin size={16} />,
      children: addressTypeMenuItems,
    },
    { type: 'divider' },
    { key: 'logout', label: t('logout'), icon: <LogOut size={16} />, danger: true, onClick: () => logout() },
  ]

  const langBtn = (
    <button onClick={toggleLanguage} className="hover:opacity-75 cursor-pointer">
      <Icon icon={flagIcon} width={24} height={24} />
    </button>
  )

  return (
    <header className="flex justify-center items-center h-22 w-full fixed top-0 left-0 z-50 bg-white shadow-sm">
      <div className="container flex justify-between items-center">

        <Link href={ROUTES.HOME}>
          <Image alt="Logo" src={IMG_URL.LOGO} width={100} height={100} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex gap-10 font-medium">
          {navLinks.map(({ href, label }) => (
            <Link key={label} href={href} className="hover:opacity-75">{label}</Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-5">
          {langBtn}
          {!isLoggedIn && addressTypeButton}
          <MessageSquareText strokeWidth={1.4} />
          <BellRing strokeWidth={1.4} />
          <Link href={ROUTES.CONTACT}><Button shape="round" type="primary">{t('becomePartner')}</Button></Link>
          {isLoggedIn ? (
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
              <div className="flex items-center cursor-pointer gap-2">
                <span className="font-medium">{user?.fullName || ''}</span>
                <Avatar icon={<User />} />
                <ChevronDown strokeWidth={1.6} size={15} />
              </div>
            </Dropdown>
          ) : (
            <Button shape="round" onClick={() => openAuth()}>{t('login')}</Button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="lg:hidden p-2 text-gray-600" onClick={() => setDrawerOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="right"
      >
        <nav className="flex flex-col gap-1 mb-4">
          {navLinks.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setDrawerOpen(false)}
              className="px-3 py-2.5 rounded-lg font-medium hover:bg-gray-100"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 px-3 mb-4">
          {langBtn}
          {!isLoggedIn && addressTypeButton}
          <MessageSquareText strokeWidth={1.4} size={20} />
          <BellRing strokeWidth={1.4} size={20} />
        </div>

        <div className="flex flex-col gap-2">
          <Link href={ROUTES.CONTACT} onClick={() => setDrawerOpen(false)}>
            <Button shape="round" type="primary" block>
              {t('becomePartner')}
            </Button>
          </Link>
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-3 px-3 py-2">
                <Avatar icon={<User />} />
                <span className="font-medium">{user?.fullName || ''}</span>
              </div>
              <button onClick={() => goProfile(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-sm">
                <User size={16} /> {t('profile')}
              </button>
              <button onClick={() => logout(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-500 text-sm">
                <LogOut size={16} /> {t('logout')}
              </button>
            </>
          ) : (
            <Button shape="round" block onClick={() => openAuth(true)}>{t('login')}</Button>
          )}
        </div>
      </Drawer>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  )
}