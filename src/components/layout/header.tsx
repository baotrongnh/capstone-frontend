'use client'

import { ROUTES } from "@/constants/routes"
import { Icon } from "@iconify/react"
import { Avatar, Button, Dropdown } from "antd"
import { BellRing, ChevronDown, MessageSquareText, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react";
import AuthModal from "../auth-modal";
import { useTranslations } from "next-intl"

export default function Header() {
     const [open, setOpen] = useState(false)
     const t1 = useTranslations("Auth")

     const items = [
          {
               key: '1',
               label: (
                    <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                         1st menu item
                    </a>
               ),
          },
          {
               key: '4',
               danger: true,
               label: 'a danger item',
          },
     ];

     return (
          <header className="flex justify-center items-center h-22 w-full">
               <div className="container flex justify-between items-center">
                    <div className="max-w-56">
                         LOGO
                    </div>
                    <ul className="hidden lg:flex gap-10 font-medium shrink-0">
                         <Link href={ROUTES.APARTMENT} className="hover:opacity-75">Tìm căn hộ</Link>
                         <Link href='/' className="flex items-center gap-1 hover:opacity-75">
                              Căn hộ của bạn
                              <Icon icon="lucide:chevron-down" width={17} />
                         </Link>
                         <Link href='/' className="hover:opacity-75">Hóa đơn</Link>
                         <Link href='/' className="hover:opacity-75">Hỗ trợ</Link>
                    </ul>
                    <div className="hidden lg:flex items-center gap-5 shrink-0">
                         <Icon icon="flag:vn-4x3" width="24" height="24" />
                         <MessageSquareText strokeWidth={1.4} />
                         <BellRing strokeWidth={1.4} />
                         <Button shape="round" type="primary">Trở thành đối tác</Button>

                         <div className="flex items-center">
                              <span className="mr-3">Name</span>
                              <Avatar size="default" icon={<User />} />
                              <Dropdown menu={{ items }}>
                                   <ChevronDown strokeWidth={1.6} size={15} />
                              </Dropdown>
                         </div>
                         <Button type="primary" onClick={() => setOpen(true)}>
                              {t1("login")}
                         </Button>

                         <AuthModal
                              open={open}
                              onClose={() => setOpen(false)}
                         >
                         </AuthModal>
                    </div>
               </div>
          </header>
     )
}
