import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseClient";
import { isAdminServer } from "@/lib/adminAuth";

interface RoadmapBody {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export async function POST(request: Request) {
  if (!(await isAdminServer())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: RoadmapBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid body" }, { status: 400 });
  }

  const title = body.title?.trim();
  const description = body.description?.trim() ?? "";
  const startDate = body.startDate?.trim() ?? null;
  const endDate = body.endDate?.trim() ?? null;

  if (!title || !startDate) {
    return NextResponse.json({ message: "title and startDate are required" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("roadmap")
      .insert({
        title,
        description,
        start_date: startDate,
        end_date: endDate,
      })
      .select("id, title, description, start_date, end_date")
      .single();

    if (error || !data) {
      console.warn("[Supabase] roadmap insert error:", error?.message);
      return NextResponse.json({ message: error?.message ?? "Insert failed" }, { status: 500 });
    }

    return NextResponse.json({
      id: data.id,
      title: data.title,
      description: data.description,
      startDate: data.start_date,
      endDate: data.end_date ?? undefined,
    });
  } catch (e) {
    console.warn("[Supabase] roadmap insert failed:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

