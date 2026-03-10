"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import type { RoadmapItem } from "@/data/roadmap";

interface RoadmapFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  item?: RoadmapItem | null;
  onSuccess: (item: RoadmapItem) => void;
}

export function RoadmapFormModal({
  open,
  onOpenChange,
  mode,
  item,
  onSuccess,
}: RoadmapFormModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setError("");
      if (mode === "edit" && item) {
        setTitle(item.title);
        setDescription(item.description);
        setStartDate(item.startDate ?? "");
        setEndDate(item.endDate ?? "");
      } else if (mode === "add") {
        setTitle("");
        setDescription("");
        setStartDate("");
        setEndDate("");
      }
    }
  }, [open, mode, item]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    if (!title.trim() || !startDate.trim()) {
      setError("제목과 시작일을 입력해 주세요.");
      setSaving(false);
      return;
    }

    try {
      if (mode === "edit" && item) {
        const res = await fetch(`/api/admin/roadmap/${item.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            startDate: startDate.trim(),
            endDate: endDate.trim() || null,
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message ?? "수정에 실패했습니다.");
        }
        const data = await res.json();
        onSuccess(data as RoadmapItem);
        onOpenChange(false);
      } else if (mode === "add") {
        const res = await fetch("/api/admin/roadmap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            startDate: startDate.trim(),
            endDate: endDate.trim() || null,
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message ?? "추가에 실패했습니다.");
        }
        const data = await res.json();
        onSuccess(data as RoadmapItem);
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
            {mode === "add" ? "새 로드맵 항목 추가" : "로드맵 항목 편집"}
          </DialogTitle>
        </DialogHeader>
        {mode === "edit" && !item ? (
          <p className="py-4 text-muted-foreground">로드맵 정보를 불러오는 중…</p>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4 py-2">
            <div>
              <label htmlFor="roadmap-title" className="mb-1 block text-sm font-medium text-foreground">
                제목
              </label>
              <input
                id="roadmap-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border-2 border-border bg-background px-3 py-2 text-foreground"
                placeholder="로드맵 제목"
              />
            </div>
            <div>
              <label htmlFor="roadmap-desc" className="mb-1 block text-sm font-medium text-foreground">
                설명
              </label>
              <textarea
                id="roadmap-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-lg border-2 border-border bg-background px-3 py-2 text-foreground"
                placeholder="로드맵 설명"
              />
            </div>
            <div>
              <label htmlFor="roadmap-start" className="mb-1 block text-sm font-medium text-foreground">
                시작일 (start_date)
              </label>
              <input
                id="roadmap-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border-2 border-border bg-background px-3 py-2 text-foreground"
              />
            </div>
            <div>
              <label htmlFor="roadmap-end" className="mb-1 block text-sm font-medium text-foreground">
                종료일 (end_date, 선택)
              </label>
              <input
                id="roadmap-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border-2 border-border bg-background px-3 py-2 text-foreground"
              />
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

