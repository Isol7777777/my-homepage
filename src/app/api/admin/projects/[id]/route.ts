import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseClient";
import { isAdminServer } from "@/lib/adminAuth";
import type { Project } from "@/data/projects";

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

  let body: Partial<
    Pick<Project, "name" | "description" | "startDate" | "endDate" | "status" | "imageUrl" | "adminNote">
  >;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid body" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (body.name !== undefined) updates.name = body.name.trim();
  if (body.description !== undefined) updates.description = body.description.trim();
  if (body.startDate !== undefined) updates.start_date = body.startDate.trim();
  if (body.endDate !== undefined) updates.end_date = body.endDate?.trim() ?? null;
  if (body.status !== undefined) {
    const valid = ["진행중", "진행예정", "완료"];
    if (valid.includes(body.status)) updates.status = body.status;
  }
  if (body.imageUrl !== undefined) updates.image_url = body.imageUrl?.trim() ?? null;
  if (body.adminNote !== undefined) updates.admin_note = body.adminNote?.trim() ?? null;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ message: "No fields to update" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", id)
      .select("id, name, description, status, memo, admin_note, image_url, start_date, end_date")
      .single();

    if (error) {
      console.warn("[Supabase] project update error:", error.message);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      id: data.id,
      name: data.name,
      description: data.description,
      startDate: data.start_date,
      endDate: data.end_date ?? undefined,
      status: data.status,
      memo: data.memo,
      adminNote: data.admin_note,
      imageUrl: data.image_url,
    });
  } catch (e) {
    console.warn("[Supabase] project update failed:", e);
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
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      console.warn("[Supabase] project delete error:", error.message);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.warn("[Supabase] project delete failed:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
