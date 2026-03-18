'use client'

import { ROUTES } from "@/constants/routes"
import { Avatar, Button, Drawer } from "antd"
import { BellRing, LogOut, MessageSquareText, User } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

type NavLink = {
     href: string
     label: string
}

type HeaderMobileDrawerProps = {
     open: boolean
     onClose: () => void
     navLinks: NavLink[]
     isLoggedIn: boolean
     langButton: ReactNode
     guestAddressTypeButton: ReactNode
     userFullName: string
     becomePartnerLabel: string
     loginLabel: string
     profileLabel: string
     logoutLabel: string
     onOpenAuth: () => void
     onProfile: () => void
     onLogout: () => void
}

export default function HeaderMobileDrawer({
     open,
     onClose,
     navLinks,
     isLoggedIn,
     langButton,
     guestAddressTypeButton,
     userFullName,
     becomePartnerLabel,
     loginLabel,
     profileLabel,
     logoutLabel,
     onOpenAuth,
     onProfile,
     onLogout,
}: HeaderMobileDrawerProps) {
     return (
          <Drawer open={open} onClose={onClose} placement="right">
               <nav className="flex flex-col gap-1 mb-4">
                    {navLinks.map(({ href, label }) => (
                         <Link
                              key={label}
                              href={href}
                              onClick={onClose}
                              className="px-3 py-2.5 rounded-lg font-medium hover:bg-gray-100"
                         >
                              {label}
                         </Link>
                    ))}
               </nav>

               <div className="flex items-center gap-4 px-3 mb-4">
                    {langButton}
                    {!isLoggedIn && guestAddressTypeButton}
                    {isLoggedIn && <MessageSquareText strokeWidth={1.4} size={20} />}
                    {isLoggedIn && <BellRing strokeWidth={1.4} size={20} />}
               </div>

               <div className="flex flex-col gap-2">
                    <Link href={ROUTES.CONTACT} onClick={onClose}>
                         <Button shape="round" type="primary" block>
                              {becomePartnerLabel}
                         </Button>
                    </Link>

                    {isLoggedIn ? (
                         <>
                              <div className="flex items-center gap-3 px-3 py-2">
                                   <Avatar icon={<User />} />
                                   <span className="font-medium">{userFullName}</span>
                              </div>

                              <button
                                   onClick={onProfile}
                                   className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-sm"
                              >
                                   <User size={16} /> {profileLabel}
                              </button>

                              <button
                                   onClick={onLogout}
                                   className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-500 text-sm"
                              >
                                   <LogOut size={16} /> {logoutLabel}
                              </button>
                         </>
                    ) : (
                         <Button shape="round" block onClick={onOpenAuth}>{loginLabel}</Button>
                    )}
               </div>
          </Drawer>
     )
}
