import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import { AntdRegistry } from "@ant-design/nextjs-registry"
import { ConfigProvider } from "antd"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { NextIntlClientProvider } from "next-intl"

const inter = Inter({ subsets: ["latin", "vietnamese"] })

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
      <body className={inter.className}>
        <AntdRegistry>
          <ConfigProvider theme={{
            token: {
              fontFamily: inter.style.fontFamily,
              colorPrimary: "#3b82f6",
              colorInfo: "#3b82f6",
              colorTextBase: "#0f172a"
            }
          }}
          >
            <NextIntlClientProvider>
              <Header />
              <main className="mt-24">
                {children}
              </main>
              <Footer />
            </NextIntlClientProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html >
  )
}
