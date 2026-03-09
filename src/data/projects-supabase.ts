import { getSupabaseServerClient } from "@/lib/supabaseClient";
import type { Project } from "./projects";

/** Supabase projects 테이블 행 타입 (컬럼명 그대로) */
interface SupabaseProjectRow {
  id: number;
  name: string;
  description: string;
  period: string;
  status: string;
  memo?: string;
  image_url?: string;
}

/**
 * 서버에서만 호출. SUPABASE_SERVICE_ROLE_KEY 사용 시 RLS 무시하고 읽기 가능.
 * @param fallback - Supabase 실패 시 반환할 로컬 데이터
 */
export async function fetchProjectsFromSupabase(
  fallback: Project[]
): Promise<Project[]> {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("projects")
      .select("id, name, description, period, status, memo, image_url");

    if (error) {
      console.warn("[Supabase] projects fetch error:", error.message);
      return fallback;
    }

    if (!data || data.length === 0) {
      return fallback;
    }

    return (data as SupabaseProjectRow[]).map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      period: row.period,
      status: row.status as Project["status"],
      memo: row.memo,
      imageUrl: row.image_url,
    }));
  } catch (e) {
    console.warn("[Supabase] projects fetch failed:", e);
    return fallback;
  }
}
