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

  const contentType = request.headers.get("content-type") ?? "";
  let body: Partial<
    Pick<Project, "name" | "description" | "startDate" | "endDate" | "status" | "imageUrl" | "adminNote">
  > = {};
  let imageFile: File | null = null;
  let existingImageUrl: string | undefined;

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const name = (formData.get("name") as string | null)?.trim();
    const description = (formData.get("description") as string | null)?.trim();
    const startDate = (formData.get("startDate") as string | null)?.trim();
    const endDate = (formData.get("endDate") as string | null)?.trim();
    const status = (formData.get("status") as string | null)?.trim();
    existingImageUrl = (formData.get("existingImageUrl") as string | null)?.trim() || undefined;
    const file = formData.get("imageFile");
    if (file instanceof File && file.size > 0) {
      imageFile = file;
    }

    if (name !== undefined) body.name = name;
    if (description !== undefined) body.description = description;
    if (startDate !== undefined) body.startDate = startDate;
    if (endDate !== undefined) body.endDate = endDate;
    if (status !== undefined) body.status = status as Project["status"];
  } else {
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ message: "Invalid body" }, { status: 400 });
    }
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
  if (body.adminNote !== undefined) updates.admin_note = body.adminNote?.trim() ?? null;

  if (Object.keys(updates).length === 0 && !imageFile && existingImageUrl === undefined) {
    return NextResponse.json({ message: "No fields to update" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseServerClient();
    if (imageFile || existingImageUrl !== undefined) {
      let finalImageUrl: string | null = existingImageUrl ?? null;
      if (imageFile) {
        const originalName = imageFile.name || "image.jpg";
        const ext = originalName.split(".").pop() || "jpg";
        const uniqueName = `${crypto.randomUUID()}.${ext}`;
        const filePath = `projects/${uniqueName}`;

        const { error: uploadError } = await supabase.storage
          .from("project-images")
          .upload(filePath, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.warn("[Supabase] project image upload error:", uploadError.message);
          return NextResponse.json({ message: "이미지 업로드에 실패했습니다." }, { status: 500 });
        }

        const { data } = supabase.storage.from("project-images").getPublicUrl(filePath);
        finalImageUrl = data.publicUrl ?? null;
      }
      updates.image_url = finalImageUrl;
    }

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
