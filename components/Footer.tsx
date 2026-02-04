"use client";

import {
  Linkedin,
  Mail,
  Github,
  BookOpen,
  Instagram,
  Podcast,
  AtSign,
} from "lucide-react";

interface FooterProps {
  currentPage: "engineer" | "marketer" | "creator";
}

export function Footer({ currentPage }: FooterProps) {
  // 根據頁面顯示不同的連結
  const getLinks = () => {
    const baseLinks = [
      {
        href: "https://www.linkedin.com/in/kochuang/",
        icon: Linkedin,
        label: "LinkedIn",
      },
      {
        href: "mailto:milk88084@gmail.com",
        icon: Mail,
        label: "Email",
      },
    ];

    if (currentPage === "engineer") {
      return [
        {
          href: "https://github.com/milk88084",
          icon: Github,
          label: "GitHub",
        },
        {
          href: "https://medium.com/@dearno.3",
          icon: BookOpen,
          label: "Medium",
        },
        {
          href: "https://www.threads.net/@93.70.21",
          icon: AtSign,
          label: "Threads",
        },
        ...baseLinks,
      ];
    }

    if (currentPage === "creator") {
      return [
        {
          href: "https://www.instagram.com/little.by.little.official/",
          icon: Instagram,
          label: "Instagram",
        },
        {
          href: "https://podcasts.apple.com/tw/podcast/%E5%BE%AE%E5%B0%8F%E6%97%A5%E5%B8%B8/id1529054627",
          icon: Podcast,
          label: "Podcast",
        },
        ...baseLinks,
      ];
    }

    return baseLinks;
  };

  const links = getLinks();

  return (
    <footer
      id="contact"
      className="py-12 px-6 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#050505] relative z-10 transition-colors duration-300"
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-sm text-gray-400 dark:text-gray-500">
          &copy; 2026
        </div>

        <div className="flex gap-6 flex-wrap justify-center">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2 text-sm group"
              aria-label={link.label}
            >
              <link.icon className="w-4 h-4" />
              <span className="hidden group-hover:inline">{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
