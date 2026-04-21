import AuthProvider from "@/components/providers/auth-provider";
import ChatSupport from "@/components/chat/chat-support";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import ReactQueryProvider from "@/components/providers/react-query-provider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App, ConfigProvider } from "antd";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Inter } from "next/font/google";
import "./globals.css";
import SocketProvider from "@/components/providers/socket-provider";
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "INTELLISERVOPS",
  description: "INTELLISERVOPS",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                fontFamily: inter.style.fontFamily,
                colorPrimary: "#3b82f6",
                colorInfo: "#3b82f6",
                colorTextBase: "#0f172a",
                colorLink: "#0f172a",
                colorLinkHover: "#0f172a",
                colorLinkActive: "#0f172a",
              },
            }}
          >
            <App>
              <ReactQueryProvider>
                <NextIntlClientProvider messages={messages}>
                  <AuthProvider>
                    <SocketProvider>
                      <Header />
                      <main className="mt-24">{children}</main>
                      <Footer />
                      <ChatSupport />
                      <SpeedInsights />
                    </SocketProvider>
                  </AuthProvider>
                </NextIntlClientProvider>
              </ReactQueryProvider>
            </App>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
