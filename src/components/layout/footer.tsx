"use client";

import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");

  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-[#A3D5FF] text-[#0C4A6E] pt-16 pb-6 font-sans">
      <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8">
          <div className="lg:w-1/3 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-2xl font-bold w-auto">TOLETX</div>
            </div>

            <div className="space-y-4 text-sm leading-relaxed">
              <div className="flex items-start gap-3">
                <MapPin
                  className="w-5 h-5 shrink-0 mt-0.5 text-slate-600"
                  strokeWidth={1.5}
                />
                <p>
                  {t("contact.addressLine1")}
                  <br />
                  {t("contact.addressLine2")}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone
                  className="w-5 h-5 shrink-0 text-slate-600"
                  strokeWidth={1.5}
                />
                <p>{t("contact.phone")}</p>
              </div>

              <div className="flex items-center gap-3">
                <Mail
                  className="w-5 h-5 shrink-0 text-slate-600"
                  strokeWidth={1.5}
                />
                <p>{t("contact.email")}</p>
              </div>
            </div>
          </div>

          <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 text-sm">
            <div>
              <h3 className="font-semibold text-[#0C4A6E] mb-4">
                {t("sections.mainMenu.title")}
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    {t("sections.mainMenu.partner")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    {t("sections.mainMenu.post")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    {t("sections.mainMenu.request")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    {t("sections.mainMenu.valuation")}
                  </a>
                </li>
              </ul>
            </div>

            <div className="ml-0 md:ml-10 lg:ml-10">
              <h3 className="font-semibold text-[#0C4A6E] mb-4">
                {t("sections.hive.title")}
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    {t("sections.hive.buy")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    {t("sections.hive.sell")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    {t("sections.hive.blog")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    {t("sections.hive.group")}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold w-40 text-[#0C4A6E] mb-4">
                {t("sections.categories.title")}
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    {t("sections.categories.residential")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    {t("sections.categories.commercial")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    {t("sections.categories.entertainment")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    {t("sections.categories.agricultural")}
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-2 ml-0 md:ml-10 lg:ml-10">
              <h3 className="font-semibold text-[#0C4A6E] mb-4">
                {t("sections.about.title")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="hover:text-blue-700 transition">
                      {t("sections.about.terms")}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-700 transition">
                      {t("sections.about.privacy")}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-700 transition">
                      {t("sections.about.legal")}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-700 transition">
                      {t("sections.about.contact")}
                    </a>
                  </li>
                </ul>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="hover:text-blue-700 transition">
                      {t("sections.about.aboutUs")}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-700 transition">
                      {t("sections.about.team")}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-700 transition">
                      {t("sections.about.faq")}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-700 transition">
                      {t("sections.about.support")}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-slate-400/30 text-center text-xs text-slate-600">
          {t("copyright", { year: currentYear })}
        </div>
      </div>
    </footer>
  );
}
