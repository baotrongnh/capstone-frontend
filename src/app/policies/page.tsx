"use client";

import {
  Building2,
  CreditCard,
  History,
  Home,
  Phone,
  RefreshCcw,
  Shield,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface TitleProps {
  badge: string;
  title: string;
  desc?: string;
  color?: "blue" | "emerald" | "amber" | "violet";
}

interface CardProps {
  title: string;
  desc: string;
}

const colorMap = {
  blue: "text-blue-600",
  emerald: "text-emerald-600",
  amber: "text-amber-600",
  violet: "text-violet-600",
};

const Title: React.FC<TitleProps> = ({
  badge,
  title,
  desc,
  color = "blue",
}) => (
  <div className="mb-8">
    <p
      className={`uppercase tracking-[4px] text-xs font-bold ${colorMap[color]}`}
    >
      {badge}
    </p>
    <h2 className="text-4xl font-bold text-slate-900 mt-3">{title}</h2>
    {desc && <p className="text-slate-500 mt-4 leading-8 max-w-3xl">{desc}</p>}
  </div>
);

const Card: React.FC<CardProps> = ({ title, desc }) => (
  <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className="flex items-start gap-3">
      <CheckCircle2 className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
      <div>
        <h3 className="text-lg font-semibold text-slate-900 italic">{title}</h3>
        <p className="mt-2 text-slate-600 leading-8 italic">{desc}</p>
      </div>
    </div>
  </div>
);

const menuItems = [
  { id: "gioi-thieu", icon: Home, label: "1. Giới thiệu chung" },
  { id: "thue-nha", icon: Building2, label: "2. Chính sách thuê nhà" },
  { id: "hop-tac", icon: Shield, label: "3. Chính sách hợp tác" },
  { id: "thanh-toan", icon: CreditCard, label: "4. Thanh toán & đặt cọc" },
  { id: "hoan-coc", icon: RefreshCcw, label: "5. Hoàn cọc / chấm dứt HĐ" },
  { id: "cap-nhat", icon: History, label: "6. Cập nhật điều khoản" },
  { id: "lien-he", icon: Phone, label: "7. Liên hệ hỗ trợ" },
];

export default function PolicyPage() {
  const t = useTranslations("Policies");
  const [activeItem, setActiveItem] = useState("gioi-thieu");

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.scrollY - 90;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });

    setActiveItem(id);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 160;

      for (let i = menuItems.length - 1; i >= 0; i--) {
        const section = document.getElementById(menuItems[i].id);
        if (section && scrollY >= section.offsetTop) {
          setActiveItem(menuItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700">
      <section className="relative overflow-hidden border-b border-slate-200 bg-linear-to-br from-blue-100 to-blue-100">
        {/* Soft Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_35%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_30%)]" />

        <div className="relative max-w-7xl mx-auto px-5 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-sky-100 text-sky-600 text-sm font-medium shadow-sm">
            <Sparkles className="w-4 h-4" />
            HomeIQ Premium Policies
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mt-6 leading-tight tracking-tight">
            {t("pageTitle")}
          </h1>

          <p className="text-slate-600 max-w-3xl mx-auto mt-5 leading-8 text-lg">
            {t("pageSubtitle")}
          </p>

          <div className="mt-10 flex justify-center">
            <div className="h-1.5 w-28 rounded-full bg-linear-to-r from-sky-400 to-blue-500" />
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-5 py-10 flex flex-col lg:flex-row gap-10">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 text-lg mb-4">
              Danh mục chính sách
            </h3>

            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = activeItem === item.id;

                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => scrollToSection(e, item.id)}
                      className={`group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                        active
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="flex-1">{item.label}</span>
                      <ArrowRight className="w-4 h-4 opacity-60" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Content */}
        <section className="flex-1 space-y-16">
          <article id="gioi-thieu" className="scroll-mt-28">
            <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
              <Title
                badge="OVERVIEW"
                title="1. Giới thiệu HomeIQ"
                desc={t("introduction.description")}
              />

              <div className="grid md:grid-cols-3 gap-5 mt-6">
                {(t.raw("introduction.features") as string[]).map((item, i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-slate-50 p-5 text-center font-medium text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article id="thue-nha" className="scroll-mt-28">
            <Title
              badge="FOR TENANTS"
              title="2. Chính sách dành cho người thuê"
              desc={t("rentalPolicy.description")}
              color="blue"
            />

            <div className="grid gap-5">
              {(
                t.raw("rentalPolicy.items") as Array<{
                  title: string;
                  content: string;
                }>
              ).map((item) => (
                <Card key={item.title} title={item.title} desc={item.content} />
              ))}
            </div>
          </article>

          <article id="hop-tac" className="scroll-mt-28">
            <Title
              badge="FOR PARTNERS"
              title="3. Chính sách hợp tác gửi căn hộ"
              desc={t("cooperationPolicy.description")}
              color="emerald"
            />

            <div className="grid md:grid-cols-1 gap-5 mb-8">
              {(
                t.raw("cooperationPolicy.items") as Array<{
                  percentage: string;
                  description: string;
                  details: string[];
                }>
              ).map((item, i) => (
                <div
                  key={i}
                  className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-xl transition"
                >
                  <p className="text-4xl font-bold text-emerald-600">
                    {item.percentage}
                  </p>
                  <h3 className="text-xl font-semibold mt-3 text-slate-900">
                    {item.description}
                  </h3>
                  <p className="mt-2 text-slate-600 leading-8 italic">
                    {item.details.join(", ")}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-5">
              {(
                t.raw("cooperationPolicy.policyDetails") as Array<{
                  title: string;
                  content: string;
                }>
              ).map((item) => (
                <Card key={item.title} title={item.title} desc={item.content} />
              ))}
            </div>
          </article>

          <article id="thanh-toan" className="scroll-mt-28">
            <Title
              badge="PAYMENT"
              title="4. Thanh toán & đặt cọc"
              color="blue"
            />

            <div className="grid gap-4">
              {[
                t("payment.deposit"),
                t("payment.methods"),
                t("payment.reminder"),
                t("payment.receipt"),
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm"
                >
                  <p className="italic text-slate-600">
                    {i + 1}. {item}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article id="hoan-coc" className="scroll-mt-28">
            <Title
              badge="REFUND"
              title="5. Hoàn cọc / Chấm dứt hợp đồng"
              color="amber"
            />

            <div className="rounded-3xl bg-amber-50 border border-amber-100 p-8">
              <p className="leading-8 italic text-slate-700">
                {t("refund.content")}
              </p>
            </div>
          </article>

          <article id="cap-nhat" className="scroll-mt-28">
            <Title
              badge="UPDATE"
              title="6. Cập nhật điều khoản"
              color="violet"
            />

            <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
              <p className="leading-8 italic text-slate-600">
                {t("update.content")}
              </p>
            </div>
          </article>

          <article id="lien-he" className="scroll-mt-28">
            <Title badge="SUPPORT" title="7. Liên hệ hỗ trợ" color="emerald" />

            <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl">
              <h3 className="text-2xl font-semibold">{t("support.heading")}</h3>

              <p className="text-slate-300 mt-4 leading-8">
                {t("support.email")}
                <br />
                {t("support.phone")}
                <br />
                {t("support.hours")}
              </p>

              <button className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl font-semibold transition">
                {t("support.button")}
              </button>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
