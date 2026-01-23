import type { Metadata } from "next"
import "./globals.css"
import { AntdRegistry } from "@ant-design/nextjs-registry"
import { ConfigProvider } from "antd"

export const metadata: Metadata = {
  title: "INTELLISERVOPS",
  description: "INTELLISERVOPS",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body>
        <AntdRegistry>
          <ConfigProvider>
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html >
  )
}
