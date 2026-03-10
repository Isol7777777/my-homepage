"use client";

import { CheckCircle2, Circle, MoreVertical, Plus } from 'lucide-react';
import { useState, useEffect } from "react";
import { format } from "date-fns";
import type { RoadmapItem } from "@/data/roadmap";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/app/components/ui/alert-dialog";
import { RoadmapFormModal } from "./roadmap/RoadmapFormModal";

interface RoadmapSectionProps {
  initialItems: RoadmapItem[];
  isAdmin?: boolean;
}

export function RoadmapSection({ initialItems, isAdmin = false }: RoadmapSectionProps) {
  const [items, setItems] = useState<RoadmapItem[]>(initialItems);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const toggleMenu = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  function handleAddSuccess(newItem: RoadmapItem) {
    setItems((prev) => [newItem, ...prev]);
    setAddModalOpen(false);
  }

  function handleEditSuccess(updated: RoadmapItem) {
    setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
    setEditId(null);
  }

  async function handleConfirmDelete() {
    if (deleteId == null) return;
    try {
      const res = await fetch(`/api/admin/roadmap/${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("삭제에 실패했습니다.");
      setItems((prev) => prev.filter((it) => it.id !== deleteId));
      setDeleteId(null);
      setOpenMenuId(null);
    } catch {
      setDeleteId(null);
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const roadmapItems = items.map((it) => {
    const hasEnd = !!it.endDate;
    const end = it.endDate ? new Date(it.endDate) : null;
    if (end) end.setHours(0, 0, 0, 0);

    const completed = hasEnd && end! < today;

    const startLabel = it.startDate
      ? format(new Date(it.startDate), "yyyy.MM")
      : "";
    const endLabel = it.endDate
      ? format(new Date(it.endDate), "yyyy.MM")
      : "";

    const period =
      startLabel && endLabel
        ? `${startLabel} - ${endLabel}`
        : startLabel
        ? `${startLabel} -`
        : "";

    return {
      id: it.id,
      period,
      title: it.title,
      description: it.description,
      completed,
    };
  });
  return (
    <section className="py-20 px-4 bg-muted">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-5xl md:text-6xl mb-4 inline-block border-b-4 border-secondary pb-2">
            나의 로드맵
          </h2>
        </div>

        {isAdmin && (
          <div className="mb-8 flex justify-end">
            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border-2 border-foreground bg-card px-4 py-2 text-sm font-semibold hover:bg-secondary"
            >
              <Plus className="w-4 h-4" />
              새 로드맵 항목 추가
            </button>
          </div>
        )}

        <div className="relative">
          {/* Timeline vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-foreground transform md:-translate-x-1/2"></div>

          <div className="space-y-12">
            {roadmapItems.map((item, index) => (
              <div
                key={item.id}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 -translate-y-1">
                  {item.completed ? (
                    <CheckCircle2 className="w-8 h-8 text-primary bg-background rounded-full" fill="currentColor" />
                  ) : (
                    <Circle className="w-8 h-8 text-muted-foreground bg-background rounded-full" />
                  )}
                </div>

                {/* Content card */}
                <div className={`flex-1 ml-20 md:ml-0 ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                  <div
                    className={`bg-card border-4 border-foreground rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                      item.completed ? 'hover:-translate-y-1' : 'opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <span className={`text-sm md:text-base px-4 py-1 rounded-lg border-2 border-foreground ${
                        item.completed 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {item.period}
                      </span>
                      {!item.completed && (
                        <span className="px-3 py-1 text-sm bg-accent text-accent-foreground border-2 border-foreground rounded-full">
                          예정
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-2xl">
                        {item.title}
                      </h3>
                      {isAdmin && (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => toggleMenu(item.id)}
                            className="p-1 rounded-full border-2 border-foreground bg-card hover:scale-110 transition-transform"
                            aria-label="로드맵 메뉴"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {openMenuId === item.id && (
                            <div className="absolute right-0 mt-2 min-w-[140px] rounded-lg border-2 border-foreground bg-background shadow-xl z-20 overflow-hidden">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditId(item.id);
                                  setOpenMenuId(null);
                                }}
                                className="block w-full px-4 py-2 text-left text-sm hover:bg-primary hover:text-primary-foreground"
                              >
                                편집(Edit)
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setDeleteId(item.id);
                                  setOpenMenuId(null);
                                }}
                                className="block w-full px-4 py-2 text-left text-sm border-t border-foreground hover:bg-destructive hover:text-destructive-foreground"
                              >
                                삭제(Delete)
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isAdmin && (
        <>
          <RoadmapFormModal
            open={addModalOpen || editId != null}
            onOpenChange={(open) => {
              if (!open) {
                setAddModalOpen(false);
                setEditId(null);
              }
            }}
            mode={editId != null ? "edit" : "add"}
            item={editId != null ? items.find((it) => it.id === editId) ?? null : null}
            onSuccess={(item) =>
              editId != null ? handleEditSuccess(item) : handleAddSuccess(item)
            }
          />
          <AlertDialog open={deleteId != null} onOpenChange={(open) => !open && setDeleteId(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>삭제 확인</AlertDialogTitle>
                <AlertDialogDescription>
                  선택한 로드맵 항목을 정말로 삭제하시겠습니까?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </section>
  );
}
