"use client";

import { Instagram, Youtube } from 'lucide-react';

const socialLinks = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/isol7_yes/",
    icon: Instagram,
    color: "#E4405F"
  },
  {
    name: "X",
    url: "https://x.com/isol7_yes",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    color: "#000000"
  },
  {
    name: "Naver",
    url: "https://blog.naver.com/isla7777",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.273 12.845 7.376 0H0v24h7.726l8.898-12.845L24 24V0h-7.727z"/>
      </svg>
    ),
    color: "#03C75A"
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@isol7-yes",
    icon: Youtube,
    color: "#FF0000"
  }
];

export function SocialSection() {
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
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"             // 새 탭에서 열기
                rel="noopener noreferrer"  // 보안 설정
                className="group border-4 border-foreground rounded-full p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                style={{
                  backgroundColor: '#ffffff',
                  color: social.color
                }}
                // 마우스 올렸을 때 색상이 반전되도록 CSS 클래스 활용 추천
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = social.color;
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.color = social.color;
                }}
              >
                <Icon className="w-8 h-8 transition-colors duration-200" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}