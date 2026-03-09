import "@/styles/index.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이솔 | 김소현",
  description: "지속 가능한 도전을 추구합니다!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
