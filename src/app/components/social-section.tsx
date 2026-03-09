"use client";

import { Instagram, Youtube } from 'lucide-react';
import { useState } from 'react';

const socialLinks = [
  {
    name: "Instagram",
    url: "#",
    icon: Instagram,
    color: "#E4405F"
  },
  {
    name: "X",
    url: "#",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    color: "#000000"
  },
  {
    name: "Naver",
    url: "#",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.273 12.845 7.376 0H0v24h7.726l8.898-12.845L24 24V0h-7.727z"/>
      </svg>
    ),
    color: "#03C75A"
  },
  {
    name: "YouTube",
    url: "#",
    icon: Youtube,
    color: "#FF0000"
  }
];

export function SocialSection() {
  const [clickedIcons, setClickedIcons] = useState<Set<string>>(new Set());

  const handleClick = (name: string) => {
    setClickedIcons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(name)) {
        newSet.delete(name);
      } else {
        newSet.add(name);
      }
      return newSet;
    });
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl mb-4 inline-block border-b-4 border-accent pb-2">
            SNS
          </h2>
        </div>

        <div className="flex justify-center gap-6 flex-wrap">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            const isClicked = clickedIcons.has(social.name);
            return (
              <button
                key={social.name}
                onClick={() => handleClick(social.name)}
                className="group border-4 border-foreground rounded-full p-6 hover:shadow-xl transition-all duration-200"
                style={{
                  backgroundColor: isClicked ? social.color : '#ffffff',
                  color: isClicked ? '#ffffff' : social.color
                }}
                aria-label={social.name}
              >
                <Icon className="w-8 h-8 transition-colors duration-200" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}