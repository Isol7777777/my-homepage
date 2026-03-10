import { getSupabaseServerClient } from "@/lib/supabaseClient";
import type { RoadmapItem } from "./roadmap";

interface SupabaseRoadmapRow {
  id: number;
  title: string;
  description: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
}

export async function fetchRoadmapFromSupabase(
  fallback: RoadmapItem[]
): Promise<RoadmapItem[]> {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("roadmap")
      .select("id, title, description, start_date, end_date")
      .order("start_date", { ascending: false });

    if (error) {
      console.warn("[Supabase] roadmap fetch error:", error.message);
      return fallback;
    }

    if (!data || data.length === 0) {
      return fallback;
    }

    return (data as SupabaseRoadmapRow[]).map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      startDate: row.start_date,
      endDate: row.end_date ?? undefined,
    }));
  } catch (e) {
    console.warn("[Supabase] roadmap fetch failed:", e);
    return fallback;
  }
}

