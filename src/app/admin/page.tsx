"use client";

import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-background px-4 py-20">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">관리자 모드</h1>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border-2 border-foreground bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90"
          >
            로그아웃
          </button>
        </div>
        <p className="text-muted-foreground">
          로그인되었습니다. 메인 페이지로 이동하면 프로젝트 카드에 케밥 메뉴가 표시됩니다.
        </p>
        <a
          href="/"
          className="mt-4 inline-block text-primary underline hover:no-underline"
        >
          메인으로 돌아가기
        </a>
      </div>
    </main>
  );
}
