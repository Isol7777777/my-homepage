import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseClient";
import { isAdminServer } from "@/lib/adminAuth";

interface RoadmapBody {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminServer())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (Number.isNaN(id) || id < 1) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  let body: RoadmapBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid body" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (body.title !== undefined) updates.title = body.title.trim();
  if (body.description !== undefined) updates.description = body.description.trim();
  if (body.startDate !== undefined) updates.start_date = body.startDate.trim();
  if (body.endDate !== undefined) updates.end_date = body.endDate?.trim() ?? null;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ message: "No fields to update" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("roadmap")
      .update(updates)
      .eq("id", id)
      .select("id, title, description, start_date, end_date")
      .single();

    if (error || !data) {
      console.warn("[Supabase] roadmap update error:", error?.message);
      return NextResponse.json({ message: error?.message ?? "Update failed" }, { status: 500 });
    }

    return NextResponse.json({
      id: data.id,
      title: data.title,
      description: data.description,
      startDate: data.start_date,
      endDate: data.end_date ?? undefined,
    });
  } catch (e) {
    console.warn("[Supabase] roadmap update failed:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminServer())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (Number.isNaN(id) || id < 1) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("roadmap").delete().eq("id", id);

    if (error) {
      console.warn("[Supabase] roadmap delete error:", error.message);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.warn("[Supabase] roadmap delete failed:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

