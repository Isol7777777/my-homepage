import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseClient";
import { isAdminServer } from "@/lib/adminAuth";
import type { Project } from "@/data/projects";

export async function POST(request: Request) {
  if (!(await isAdminServer())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  let name: string | undefined;
  let description = "";
  let startDate: string | undefined;
  let endDate: string | null = null;
  let status: string = "진행예정";
  let existingImageUrl: string | undefined;
  let imageFile: File | null = null;

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    name = (formData.get("name") as string | null)?.trim();
    description = (formData.get("description") as string | null)?.trim() ?? "";
    startDate = (formData.get("startDate") as string | null)?.trim();
    const endRaw = (formData.get("endDate") as string | null)?.trim();
    endDate = endRaw ? endRaw : null;
    status = (formData.get("status") as string | null) ?? "진행예정";
    existingImageUrl = (formData.get("existingImageUrl") as string | null)?.trim() || undefined;
    const file = formData.get("imageFile");
    if (file instanceof File && file.size > 0) {
      imageFile = file;
    }
  } else {
    let body: Partial<
      Pick<Project, "name" | "description" | "startDate" | "endDate" | "status" | "imageUrl">
    >;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ message: "Invalid body" }, { status: 400 });
    }
    name = body.name?.trim();
    description = body.description?.trim() ?? "";
    startDate = body.startDate?.trim();
    endDate = body.endDate?.trim() ?? null;
    status = body.status ?? "진행예정";
    existingImageUrl = body.imageUrl?.trim() || undefined;
  }

  if (!name || !startDate) {
    return NextResponse.json({ message: "name and startDate are required" }, { status: 400 });
  }

  const validStatuses = ["진행중", "진행예정", "완료"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseServerClient();
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

    const { data, error } = await supabase
      .from("projects")
      .insert({
        name,
        description,
        start_date: startDate,
        end_date: endDate,
        status,
        image_url: finalImageUrl,
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
