'use client';

import { Linkedin, Mail, Github, BookOpen, Instagram, Podcast, Twitter } from 'lucide-react';

interface FooterProps {
  currentPage: 'engineer' | 'marketer' | 'creator';
}

export function Footer({ currentPage }: FooterProps) {
  // 根據頁面顯示不同的連結
  const getLinks = () => {
    const baseLinks = [
      {
        href: '#',
        icon: Linkedin,
        label: 'LinkedIn',
      },
      {
        href: 'mailto:hello@example.com',
        icon: Mail,
        label: 'Email',
      },
    ];

    if (currentPage === 'engineer') {
      return [
        {
          href: 'https://github.com/yourusername',
          icon: Github,
          label: 'GitHub',
        },
        {
          href: 'https://medium.com/@yourusername',
          icon: BookOpen,
          label: 'Medium',
        },
        {
          href: 'https://medium.com/@yourusername',
          icon: Twitter,
          label: 'Threads',
        },
        ...baseLinks,
      ];
    }

    if (currentPage === 'creator') {
      return [
        {
          href: 'https://instagram.com/yourusername',
          icon: Instagram,
          label: 'Instagram',
        },
        {
          href: '#podcast',
          icon: Podcast,
          label: 'Podcast',
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
          &copy; 2024 Tiny Daily Life. Designed with intent.
        </div>

        <div className="flex gap-6 flex-wrap justify-center">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
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
