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

interface ProjectMemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  /** 저장된 프로젝트(adminNote 반영)를 넘겨 로컬 상태 동기화 */
  onSuccess: (updatedProject: Project) => void;
}

export function ProjectMemoModal({
  open,
  onOpenChange,
  project,
  onSuccess,
}: ProjectMemoModalProps) {
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && project) {
      setValue(project.adminNote ?? "");
      setError("");
    }
  }, [open, project?.id, project?.adminNote]);

  async function handleSave() {
    if (!project) return;
    setError("");
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNote: value }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? "저장에 실패했습니다.");
      }
      const data = await res.json();
      const updated: Project = {
        ...project,
        adminNote: data.adminNote ?? value,
      };
      onSuccess(updated);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>관리자 메모 (Admin Note)</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          이 메모는 관리자만 볼 수 있으며, 일반 방문자에게는 노출되지 않습니다.
        </p>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={4}
          className="w-full rounded-lg border-2 border-border bg-background px-3 py-2 text-foreground"
          placeholder="프로젝트에 대한 비공개 메모를 입력하세요."
        />
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
            닫기
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? "저장 중…" : "메모 저장"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
