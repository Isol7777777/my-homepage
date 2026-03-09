"use client";

import { Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // mailto 링크 생성
    const subject = encodeURIComponent(`${formData.name}님의 문의`);
    const body = encodeURIComponent(
      `이름: ${formData.name}\n이메일: ${formData.email}\n\n메시지:\n${formData.message}`
    );
    
    window.location.href = `mailto:your-email@example.com?subject=${subject}&body=${body}`;
  };

  return (
    <section className="py-20 px-4 bg-muted">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl mb-4 inline-block border-b-4 border-secondary pb-2">
            연락하기
          </h2>
        </div>

        <div className="bg-card border-4 border-foreground rounded-2xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block mb-2">
                이름
              </label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border-2 border-foreground rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="홍길동"
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-2">
                이메일
              </label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border-2 border-foreground rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block mb-2">
                메시지
              </label>
              <textarea
                id="message"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full border-2 border-foreground rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary min-h-[150px] resize-y"
                placeholder="메시지를 입력해주세요..."
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border-4 border-foreground rounded-xl px-8 py-6 text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <Send className="w-5 h-5 mr-2" />
              메일 보내기
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
