"use client";

import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { FOOTER_I18N_KEYS } from "@/constants";
import Link from "next/link";
import { IMG_URL, ROUTES } from "@/constants/routes";
import Image from "next/image";

export default function Footer() {
  const t = useTranslations("Footer");

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-root mt-16 bg-[#0F172A] text-white pt-14 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href={ROUTES.HOME} className="inline-flex">
            <Image
              alt="Logo"
              src={IMG_URL.LOGO}
              width={150}
              height={80}
            />
          </Link>
        </div>
        <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-12">
          <div className="w-full lg:w-4/12 xl:w-3/12 space-y-6">
            <div className="space-y-4 text-sm leading-relaxed max-w-sm">
              <div className="flex items-start gap-3">
                <MapPin
                  className="w-5 h-5 shrink-0 mt-0.5 text-white"
                  strokeWidth={1.5}
                />
                <p>
                  {t(FOOTER_I18N_KEYS.CONTACT.ADDRESS_LINE_1)}
                  <br />
                  {t(FOOTER_I18N_KEYS.CONTACT.ADDRESS_LINE_2)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone
                  className="w-5 h-5 shrink-0 text-white"
                  strokeWidth={1.5}
                />
                <p>{t(FOOTER_I18N_KEYS.CONTACT.PHONE)}</p>
              </div>

              <div className="flex items-center gap-3">
                <Mail
                  className="w-5 h-5 shrink-0 text-white"
                  strokeWidth={1.5}
                />
                <p>{t(FOOTER_I18N_KEYS.CONTACT.EMAIL)}</p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-8/12 xl:w-9/12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 text-sm">
            {/* Main Menu */}
            <div className="lg:col-span-4 xl:col-span-4">
              <h3 className="font-semibold text-white mb-4 tracking-wide">
                {t(FOOTER_I18N_KEYS.SECTIONS.MAIN_MENU.TITLE)}
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-white hover:text-blue-300 transition">
                    {t(FOOTER_I18N_KEYS.SECTIONS.MAIN_MENU.PARTNER)}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:text-blue-300 transition">
                    {t(FOOTER_I18N_KEYS.SECTIONS.MAIN_MENU.POST)}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:text-blue-300 transition">
                    {t(FOOTER_I18N_KEYS.SECTIONS.MAIN_MENU.REQUEST)}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:text-blue-300 transition">
                    {t(FOOTER_I18N_KEYS.SECTIONS.MAIN_MENU.VALUATION)}
                  </a>
                </li>
              </ul>
            </div>

            {/* Categories - Danh mục bất động sản */}
            <div className="lg:col-span-3 xl:col-span-3">
              <h3 className="font-semibold text-white mb-4 tracking-wide">
                {t(FOOTER_I18N_KEYS.SECTIONS.CATEGORIES.TITLE)}
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-white hover:text-blue-300 transition">
                    {t(FOOTER_I18N_KEYS.SECTIONS.CATEGORIES.RESIDENTIAL)}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:text-blue-300 transition">
                    {t(FOOTER_I18N_KEYS.SECTIONS.CATEGORIES.COMMERCIAL)}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:text-blue-300 transition">
                    {t(FOOTER_I18N_KEYS.SECTIONS.CATEGORIES.ENTERTAINMENT)}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:text-blue-300 transition">
                    {t(FOOTER_I18N_KEYS.SECTIONS.CATEGORIES.AGRICULTURAL)}
                  </a>
                </li>
              </ul>
            </div>

            {/* About */}
            <div className="lg:col-span-5 xl:col-span-5">
              <h3 className="font-semibold text-white mb-4 tracking-wide">
                {t(FOOTER_I18N_KEYS.SECTIONS.ABOUT.TITLE)}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-white hover:text-blue-300 transition">
                      {t(FOOTER_I18N_KEYS.SECTIONS.ABOUT.TERMS)}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white hover:text-blue-300 transition">
                      {t(FOOTER_I18N_KEYS.SECTIONS.ABOUT.PRIVACY)}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white hover:text-blue-300 transition">
                      {t(FOOTER_I18N_KEYS.SECTIONS.ABOUT.LEGAL)}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white hover:text-blue-300 transition">
                      {t(FOOTER_I18N_KEYS.SECTIONS.ABOUT.CONTACT)}
                    </a>
                  </li>
                </ul>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-white hover:text-blue-300 transition">
                      {t(FOOTER_I18N_KEYS.SECTIONS.ABOUT.ABOUT_US)}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white hover:text-blue-300 transition">
                      {t(FOOTER_I18N_KEYS.SECTIONS.ABOUT.TEAM)}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white hover:text-blue-300 transition">
                      {t(FOOTER_I18N_KEYS.SECTIONS.ABOUT.FAQ)}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white hover:text-blue-300 transition">
                      {t(FOOTER_I18N_KEYS.SECTIONS.ABOUT.SUPPORT)}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-slate-400/30 text-center text-xs text-white">
          {t(FOOTER_I18N_KEYS.COPYRIGHT, { year: currentYear })}
        </div>
      </div>
      <style jsx>{`
        .footer-root a {
          color: #fff !important;
        }

        .footer-root a:hover {
          color: #93c5fd !important;
        }
      `}</style>
    </footer>
  );
}
