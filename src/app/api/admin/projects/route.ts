import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseClient";
import { isAdminServer } from "@/lib/adminAuth";
import type { Project } from "@/data/projects";

export async function POST(request: Request) {
  if (!(await isAdminServer())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: Partial<Pick<Project, "name" | "description" | "startDate" | "endDate" | "status" | "imageUrl">>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid body" }, { status: 400 });
  }

  const name = body.name?.trim();
  const description = body.description?.trim() ?? "";
  const startDate = body.startDate?.trim();
  const endDate = body.endDate?.trim() ?? null;
  const status = body.status ?? "진행예정";
  const imageUrl = body.imageUrl?.trim() ?? null;

  if (!name || !startDate) {
    return NextResponse.json({ message: "name and startDate are required" }, { status: 400 });
  }

  const validStatuses = ["진행중", "진행예정", "완료"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("projects")
      .insert({
        name,
        description,
        start_date: startDate,
        end_date: endDate,
        status,
        image_url: imageUrl,
      })
      .select("id, name, description, status, image_url, start_date, end_date")
      .single();

    if (error) {
      console.warn("[Supabase] project insert error:", error.message);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      id: data.id,
      name: data.name,
      description: data.description,
      startDate: data.start_date,
      endDate: data.end_date ?? undefined,
      status: data.status,
      imageUrl: data.image_url,
    });
  } catch (e) {
    console.warn("[Supabase] project insert failed:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
