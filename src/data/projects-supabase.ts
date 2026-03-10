import { getSupabaseServerClient } from "@/lib/supabaseClient";
import type { Project } from "./projects";

/** Supabase projects 테이블 행 타입 (컬럼명 그대로) */
interface SupabaseProjectRow {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date?: string;
  status: string;
  memo?: string;
  admin_note?: string;
  image_url?: string;
}

/**
 * 서버에서만 호출. SUPABASE_SERVICE_ROLE_KEY 사용 시 RLS 무시하고 읽기 가능.
 * projects 테이블에 admin_note(text) 컬럼이 있어야 함. 없으면 Supabase에서 추가:
 *   ALTER TABLE projects ADD COLUMN IF NOT EXISTS admin_note text;
 * @param fallback - Supabase 실패 시 반환할 로컬 데이터
 */
export async function fetchProjectsFromSupabase(
  fallback: Project[]
): Promise<Project[]> {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("projects")
      .select("id, name, description, status, memo, admin_note, image_url, start_date, end_date")
      .order("start_date", { ascending: false });

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
      startDate: row.start_date,
      endDate: row.end_date ?? undefined,
      status: row.status as Project["status"],
      memo: row.memo,
      adminNote: row.admin_note,
      imageUrl: row.image_url,
    }));
  } catch (e) {
    console.warn("[Supabase] projects fetch failed:", e);
    return fallback;
  }
}
