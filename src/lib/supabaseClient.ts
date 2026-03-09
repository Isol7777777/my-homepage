import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** 클라이언트(브라우저)용 - RLS 적용됨 */
export function getSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * 서버 전용 - service_role 키 사용 시 RLS 무시, 모든 테이블 읽기/쓰기 가능
 * .env.local에 SUPABASE_SERVICE_ROLE_KEY 추가 필요
 */
export function getSupabaseServerClient() {
  const key = supabaseServiceRoleKey ?? supabaseAnonKey;
  return createClient(supabaseUrl, key);
}
