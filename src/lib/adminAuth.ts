import { cookies } from "next/headers";

const ADMIN_COOKIE = "admin";

/** 서버(API 라우트/서버 컴포넌트)에서 관리자 쿠키 확인 */
export async function isAdminServer(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === "1";
}
