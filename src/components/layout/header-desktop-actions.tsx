'use client'

import { ROUTES } from "@/constants/routes"
import type { MenuProps } from "antd"
import { Avatar, Button, Dropdown } from "antd"
import { ChevronDown, User } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import NotificationDropdown from "./notification-dropdown"

type HeaderDesktopActionsProps = {
     isLoggedIn: boolean
     langButton: ReactNode
     userMenuItems: MenuProps['items']
     userFullName: string
     becomePartnerLabel: string
     loginLabel: string
     avatar: string | null | undefined
     onOpenAuth: () => void
}

export default function HeaderDesktopActions({
     isLoggedIn,
     langButton,
     userMenuItems,
     userFullName,
     becomePartnerLabel,
     loginLabel,
     onOpenAuth,
     avatar
}: HeaderDesktopActionsProps) {
     return (
          <div className="hidden lg:flex items-center gap-5">
               {langButton}
               {/* {isLoggedIn && <MessageSquareText strokeWidth={1.4} />} */}
               {isLoggedIn && <NotificationDropdown />}

               <Link href={ROUTES.PARTNER_REQUEST}>
                    <Button shape="round" type="primary">{becomePartnerLabel}</Button>
               </Link>

               {isLoggedIn ? (
                    <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
                         <div className="flex items-center cursor-pointer gap-2">
                              <span className="font-medium">{userFullName}</span>
                              <Avatar icon={<User />} src={avatar} />
                              <ChevronDown strokeWidth={1.6} size={15} />
                         </div>
                    </Dropdown>
               ) : (
                    <Button shape="round" onClick={onOpenAuth}>{loginLabel}</Button>
               )}
          </div>
     )
}
