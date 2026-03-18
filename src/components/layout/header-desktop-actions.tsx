'use client'

import { ROUTES } from "@/constants/routes"
import type { MenuProps } from "antd"
import { Avatar, Button, Dropdown } from "antd"
import { ChevronDown, MessageSquareText, User } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import NotificationDropdown from "./notification-dropdown"

type HeaderDesktopActionsProps = {
     isLoggedIn: boolean
     langButton: ReactNode
     guestAddressTypeButton: ReactNode
     userMenuItems: MenuProps['items']
     userFullName: string
     becomePartnerLabel: string
     loginLabel: string
     onOpenAuth: () => void
}

export default function HeaderDesktopActions({
     isLoggedIn,
     langButton,
     guestAddressTypeButton,
     userMenuItems,
     userFullName,
     becomePartnerLabel,
     loginLabel,
     onOpenAuth,
}: HeaderDesktopActionsProps) {
     return (
          <div className="hidden lg:flex items-center gap-5">
               {langButton}
               {!isLoggedIn && guestAddressTypeButton}
               {isLoggedIn && <MessageSquareText strokeWidth={1.4} />}
               {isLoggedIn && <NotificationDropdown />}

               <Link href={ROUTES.CONTACT}>
                    <Button shape="round" type="primary">{becomePartnerLabel}</Button>
               </Link>

               {isLoggedIn ? (
                    <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
                         <div className="flex items-center cursor-pointer gap-2">
                              <span className="font-medium">{userFullName}</span>
                              <Avatar icon={<User />} />
                              <ChevronDown strokeWidth={1.6} size={15} />
                         </div>
                    </Dropdown>
               ) : (
                    <Button shape="round" onClick={onOpenAuth}>{loginLabel}</Button>
               )}
          </div>
     )
}
