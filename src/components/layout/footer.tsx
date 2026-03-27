"use client";

import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { UI_BRAND, FOOTER_I18N_KEYS } from "@/constants";

export default function Footer() {
  const t = useTranslations("Footer");

  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-[#A3D5FF] text-[#0C4A6E] pt-16 pb-6 font-sans">
      <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8">
          <div className="lg:w-1/3 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-2xl font-bold w-auto">{UI_BRAND.LOGO}</div>
            </div>

            <div className="space-y-4 text-sm leading-relaxed">
              <div className="flex items-start gap-3">
                <MapPin
                  className="w-5 h-5 shrink-0 mt-0.5 text-slate-600"
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
                  className="w-5 h-5 shrink-0 text-slate-600"
                  strokeWidth={1.5}
                />
                <p>{t(FOOTER_I18N_KEYS.CONTACT.PHONE)}</p>
              </div>

              <div className="flex items-center gap-3">
                <Mail
                  className="w-5 h-5 shrink-0 text-slate-600"
                  strokeWidth={1.5}
                />
                <p>{t(FOOTER_I18N_KEYS.CONTACT.EMAIL)}</p>
              </div>
            </div>
          </div>

          <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 text-sm">
            <div>
              <h3 className="font-semibold text-[#0C4A6E] mb-4">
                {t(FOOTER_I18N_KEYS.SECTIONS.MAIN_MENU.TITLE)}
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    {t(FOOTER_I18N_KEYS.SECTIONS.MAIN_MENU.PARTNER)}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    {t(FOOTER_I18N_KEYS.SECTIONS.MAIN_MENU.POST)}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    {t(FOOTER_I18N_KEYS.SECTIONS.MAIN_MENU.REQUEST)}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    {t(FOOTER_I18N_KEYS.SECTIONS.MAIN_MENU.VALUATION)}
                  </a>
                </li>
              </ul>
            </div>

            <div className="ml-0 md:ml-10 lg:ml-10">
              <h3 className="font-semibold text-[#0C4A6E] mb-4">
                {t(FOOTER_I18N_KEYS.SECTIONS.HIVE.TITLE)}
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    {t(FOOTER_I18N_KEYS.SECTIONS.HIVE.BUY)}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    {t(FOOTER_I18N_KEYS.SECTIONS.HIVE.SELL)}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    {t(FOOTER_I18N_KEYS.SECTIONS.HIVE.BLOG)}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    {t(FOOTER_I18N_KEYS.SECTIONS.HIVE.GROUP)}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold w-40 text-[#0C4A6E] mb-4">
                {t(FOOTER_I18N_KEYS.SECTIONS.CATEGORIES.TITLE)}
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    {t(FOOTER_I18N_KEYS.SECTIONS.CATEGORIES.RESIDENTIAL)}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    {t(FOOTER_I18N_KEYS.SECTIONS.CATEGORIES.COMMERCIAL)}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    {t(FOOTER_I18N_KEYS.SECTIONS.CATEGORIES.ENTERTAINMENT)}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    {t(FOOTER_I18N_KEYS.SECTIONS.CATEGORIES.AGRICULTURAL)}
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-2 ml-0 md:ml-10 lg:ml-10">
              <h3 className="font-semibold text-[#0C4A6E] mb-4">
                {t(FOOTER_I18N_KEYS.SECTIONS.ABOUT.TITLE)}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="hover:text-blue-700 transition">
                      {t(FOOTER_I18N_KEYS.SECTIONS.ABOUT.TERMS)}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-700 transition">
                      {t(FOOTER_I18N_KEYS.SECTIONS.ABOUT.PRIVACY)}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-700 transition">
                      {t(FOOTER_I18N_KEYS.SECTIONS.ABOUT.LEGAL)}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-700 transition">
                      {t(FOOTER_I18N_KEYS.SECTIONS.ABOUT.CONTACT)}
                    </a>
                  </li>
                </ul>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="hover:text-blue-700 transition">
                      {t(FOOTER_I18N_KEYS.SECTIONS.ABOUT.ABOUT_US)}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-700 transition">
                      {t(FOOTER_I18N_KEYS.SECTIONS.ABOUT.TEAM)}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-700 transition">
                      {t(FOOTER_I18N_KEYS.SECTIONS.ABOUT.FAQ)}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-700 transition">
                      {t(FOOTER_I18N_KEYS.SECTIONS.ABOUT.SUPPORT)}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-slate-400/30 text-center text-xs text-slate-600">
          {t(FOOTER_I18N_KEYS.COPYRIGHT, { year: currentYear })}
        </div>
      </div>
    </footer>
  );
}
