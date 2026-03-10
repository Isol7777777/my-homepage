"use client";

import { Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      toast.error("환경 변수 설정 확인이 필요합니다.");
      setIsSending(false);
      return;
    }

    // 템플릿 변수와 formData를 직접 매핑
    const templateParams = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      time: new Date().toLocaleString(),
    };

    try {
      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      toast.success("메일이 성공적으로 발송되었습니다!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      // 에러 내용을 더 자세히 출력하도록 변경
      console.error("EmailJS 상세 에러:", error);
      toast.error("메일 발송에 실패했습니다.");
    } finally {
      setIsSending(false);
    }
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
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border-2 border-foreground bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="홍길동"
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-2">
                이메일
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border-2 border-foreground bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block mb-2">
                메시지
              </label>
              <textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full min-h-[150px] resize-y rounded-lg border-2 border-foreground bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="메시지를 입력해주세요..."
              />
            </div>

            {/* Hidden field for time, matching EmailJS template variable */}
            <input type="hidden" name="time" value={new Date().toLocaleString()} />

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-xl border-4 border-foreground bg-primary px-8 py-6 text-lg shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:opacity-50"
              disabled={isSending}
            >
              {isSending ? (
                "전송 중..."
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  메일 보내기
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
      <Toaster />
    </section>
  );
}
