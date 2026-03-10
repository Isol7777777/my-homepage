"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import type { Project } from "@/data/projects";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";
import { Calendar } from "@/app/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { getSupabaseClient } from "@/lib/supabaseClient";

type ProjectStatus = Project["status"];

/** API 응답 행을 Project 타입으로 변환 */
function apiRowToProject(row: {
  id: number;
  name: string;
  description: string;
  status: string;
  memo?: string;
  adminNote?: string;
  imageUrl?: string | null;
  start_date: string;
  end_date?: string | null;
}): Project {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    startDate: row.start_date,
    endDate: row.end_date ?? undefined,
    status: row.status as ProjectStatus,
    memo: row.memo,
    adminNote: row.adminNote,
    imageUrl: row.imageUrl ?? undefined,
  };
}

const STATUS_OPTIONS: ProjectStatus[] = ["진행예정", "진행중", "완료"];

interface ProjectFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  project?: Project | null;
  /** 호출 시 생성/수정된 프로젝트 객체를 넘김 (로컬 상태 동기화용) */
  onSuccess: (project: Project) => void;
}

export function ProjectFormModal({
  open,
  onOpenChange,
  mode,
  project,
  onSuccess,
}: ProjectFormModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<ProjectStatus>("진행예정");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setError("");
      if (mode === "edit" && project) {
        setName(project.name);
        setDescription(project.description);
        setStartDate(new Date(project.startDate));
        setEndDate(project.endDate ? new Date(project.endDate) : undefined);
        setStatus(project.status);
        setImageUrl(project.imageUrl ?? "");
        setImageFile(null);
        setImagePreview(project.imageUrl ?? null);
      } else if (mode === "add") {
        setName("");
        setDescription("");
        setStartDate(undefined);
        setEndDate(undefined);
        setStatus("진행예정");
        setImageUrl("");
        setImageFile(null);
        setImagePreview(null);
      }
    }
  }, [open, mode, project]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    if (!name.trim() || !startDate) {
      setError("제목과 시작일을 입력해 주세요.");
      setSaving(false);
      return;
    }

    try {
      const supabase = getSupabaseClient();

      // 1) 이미지 파일이 선택되어 있으면 먼저 업로드해서 public URL 확보
      let finalImageUrl: string | undefined =
        imageUrl.trim() !== "" ? imageUrl.trim() : undefined;

      if (imageFile) {
        const ext = imageFile.name.split(".").pop() ?? "jpg";
        const uniqueName = `${crypto.randomUUID()}.${ext}`;
        const filePath = `projects/${uniqueName}`;

        const { error: uploadError } = await supabase.storage
          .from("project-images")
          .upload(filePath, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw new Error("이미지 업로드에 실패했습니다.");
        }

        const { data } = supabase.storage
          .from("project-images")
          .getPublicUrl(filePath);

        finalImageUrl = data.publicUrl;
      }

      if (mode === "edit" && project) {
        const res = await fetch(`/api/admin/projects/${project.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim(),
            startDate: startDate?.toISOString().split('T')[0],
            endDate: endDate?.toISOString().split('T')[0] ?? null,
            status,
            imageUrl: finalImageUrl,
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message ?? "수정에 실패했습니다.");
        }
        const data = await res.json();
        onSuccess(apiRowToProject(data));
        onOpenChange(false);
      } else if (mode === "add") {
        const res = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim(),
            startDate: startDate?.toISOString().split('T')[0],
            endDate: endDate?.toISOString().split('T')[0] ?? null,
            status,
            imageUrl: finalImageUrl,
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message ?? "추가에 실패했습니다.");
        }
        const data = await res.json();
        onSuccess(apiRowToProject(data));
        onOpenChange(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "새 프로젝트 추가" : "프로젝트 편집"}
          </DialogTitle>
        </DialogHeader>
        {mode === "edit" && !project ? (
          <p className="py-4 text-muted-foreground">프로젝트 정보를 불러오는 중…</p>
        ) : (
        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div>
            <label htmlFor="form-name" className="mb-1 block text-sm font-medium text-foreground">
              제목
            </label>
            <input
              id="form-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border-2 border-border bg-background px-3 py-2 text-foreground"
              placeholder="프로젝트 제목"
            />
          </div>
          <div>
            <label htmlFor="form-desc" className="mb-1 block text-sm font-medium text-foreground">
              설명
            </label>
            <textarea
              id="form-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border-2 border-border bg-background px-3 py-2 text-foreground"
              placeholder="프로젝트 설명"
            />
          </div>
          <div>
            <label htmlFor="form-startDate" className="mb-1 block text-sm font-medium text-foreground">
              시작일 <span className="text-destructive">*</span>
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span className="text-muted-foreground">날짜 선택</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label htmlFor="form-endDate" className="mb-1 block text-sm font-medium text-foreground">
              마감일 (선택)
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span className="text-muted-foreground">날짜 선택</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label htmlFor="form-status" className="mb-1 block text-sm font-medium text-foreground">
              상태
            </label>
            <select
              id="form-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              className="w-full rounded-lg border-2 border-border bg-background px-3 py-2 text-foreground"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="form-image" className="mb-1 block text-sm font-medium text-foreground">
              이미지 업로드 (선택)
            </label>
            <input
              id="form-image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setImageFile(file);
                if (file) {
                  const url = URL.createObjectURL(file);
                  setImagePreview(url);
                } else {
                  setImagePreview(project?.imageUrl ?? null);
                }
              }}
              className="w-full rounded-lg border-2 border-border bg-background px-3 py-2 text-foreground"
            />
            {imagePreview && (
              <div className="mt-3">
                <p className="mb-1 text-xs text-muted-foreground">미리보기</p>
                <img
                  src={imagePreview}
                  alt="선택한 이미지 미리보기"
                  className="max-h-48 w-full rounded-lg border object-cover"
                />
              </div>
            )}
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg border-2 border-foreground px-4 py-2 text-foreground hover:bg-muted"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? "저장 중…" : mode === "add" ? "추가" : "저장"}
            </button>
          </DialogFooter>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
