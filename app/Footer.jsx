"use client";
import React, { useState, useEffect } from "react";
import { t, useI18n } from "@/app/il8n";

/* ---------------------------------------------------------
   FLAVORIZ — Footer
   Dark editorial footer on #202020, cream/orange accents,
   Outfit display font, light & fully responsive.
--------------------------------------------------------- */

const FONT_LINK_ID = "flavoriz-fonts-2";

function useFlavorizFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_LINK_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_LINK_ID;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

const COLUMNS = [
  {
    titleKey: "footer.company",
    links: [
      "footer.aboutUs",
      "footer.ourStory",
      "footer.careers",
      "footer.press",
    ],
  },
  {
    titleKey: "footer.support",
    links: [
      "footer.helpCenter",
      "footer.contactUs",
      "footer.privacyPolicy",
      "footer.termsOfService",
    ],
  },
  {
    titleKey: "footer.explore",
    links: [
      "footer.allRecipes",
      "footer.categories",
      "footer.popularRecipes",
      "footer.recentlyAdded",
    ],
  },
];

const SOCIALS = [];

export default function Footer() {
  const { language } = useI18n();
  useFlavorizFonts();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <footer
      className="w-full bg-[#202020] text-stone-400"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-14 sm:pt-16">
        {/* Newsletter */}

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10 sm:gap-8 py-12 sm:py-14">
          {/* Brand */}
          <div className="max-w-xs">
            <a href="#" className="inline-flex items-center gap-2.5 mb-4">
              <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                {/* <ChefHat size={17} className="text-[#ffa71c]" /> */}
              </span>
              <span
                className="text-[18px] text-white tracking-tight"
                style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}
              >
                FLA<span className="text-[#ffa71c]">VORIZ</span>
              </span>
            </a>
            <p className="text-[13px] leading-relaxed mb-5">
              {t("footer.description")}
            </p>

            <div className="space-y-2 text-[12.5px]">
              <div className="flex items-center gap-2.5">
                <span>{t("footer.email")}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span>{t("footer.phone")}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span>{t("footer.location")}</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.titleKey}>
              <h4
                className="text-[13px] text-white uppercase tracking-wide mb-4"
                style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}
              >
                {t(col.titleKey)}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[13px] hover:text-[#ffa71c] transition-colors"
                    >
                      {t(link)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="h-px bg-white/10" />

        {/* Bottom bar */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-5 py-6">
          <p className="text-[12px] text-stone-500 text-center sm:text-left">
            {t("footer.copyright")}
          </p>

          <div className="flex items-center gap-3">
            {SOCIALS.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-8.5 h-8.5 w-[34px] h-[34px] rounded-full bg-white/5 flex items-center justify-center text-stone-400 hover:bg-[#ffa71c] hover:text-stone-900 transition-colors"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-5 text-[12px] text-stone-500">
            <a href="#" className="hover:text-[#ffa71c] transition-colors">
              {t("footer.privacyPolicy")}
            </a>
            <a href="#" className="hover:text-[#ffa71c] transition-colors">
              {t("footer.termsOfService")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
