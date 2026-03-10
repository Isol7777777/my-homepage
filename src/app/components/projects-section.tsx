"use client";

import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Plus,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { format } from "date-fns";
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
import { ProjectFormModal } from "./ProjectFormModal";
import { ProjectMemoModal } from "./ProjectMemoModal";
import type { Project } from "@/data/projects";

function toDisplayProjects(projects: Project[]) {
  return projects.map((p) => {
    const start = new Date(p.startDate);
    const end = p.endDate ? new Date(p.endDate) : null;

    const formattedStartDate = !isNaN(start.getTime())
      ? format(start, "yyyy.MM")
      : "";
    const formattedEndDate =
      end && !isNaN(end.getTime()) ? format(end, "yyyy.MM") : "";

    return {
      id: p.id,
      title: p.name,
      description: p.description,
      image: p.imageUrl ?? null,
      status: p.status,
      statusColor:
        p.status === "완료"
          ? "primary"
          : p.status === "진행중"
          ? "accent"
          : "secondary",
      date: formattedEndDate ? `${formattedStartDate} - ${formattedEndDate}` : `${formattedStartDate} -`,
    };
  });
}

interface ProjectsSectionProps {
  initialProjects: Project[];
  isAdmin?: boolean;
}

export function ProjectsSection({ initialProjects, isAdmin = false }: ProjectsSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [localProjects, setLocalProjects] = useState<Project[]>(initialProjects);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editProjectId, setEditProjectId] = useState<number | null>(null);
  const [memoProjectId, setMemoProjectId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  useEffect(() => {
    setLocalProjects(initialProjects);
  }, [initialProjects]);

  // Determine items per page based on screen size
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerPage(3); // Desktop: 3 cards
      } else if (window.innerWidth >= 768) {
        setItemsPerPage(2); // Tablet: 2 cards
      } else {
        setItemsPerPage(1); // Mobile: 1 card
      }
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const toggleMenu = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  function handleAddSuccess(newProject: Project) {
    setLocalProjects((prev) => [...prev, newProject]);
    setAddModalOpen(false);
  }

  function handleEditSuccess(updated: Project) {
    setLocalProjects((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    setEditProjectId(null);
  }

  function handleMemoSuccess(updated: Project) {
    setLocalProjects((prev) =>
      prev.map((p) =>
        p.id === updated.id ? { ...p, adminNote: updated.adminNote } : p
      )
    );
    setMemoProjectId(null);
  }

  async function handleConfirmDelete() {
    if (deleteConfirmId == null) return;
    try {
      const res = await fetch(`/api/admin/projects/${deleteConfirmId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("삭제에 실패했습니다.");
      setLocalProjects((prev) => prev.filter((p) => p.id !== deleteConfirmId));
      setDeleteConfirmId(null);
      setOpenMenuId(null);
    } catch {
      setDeleteConfirmId(null);
    }
  }

  const displayItems = toDisplayProjects(localProjects);
  const allItems = isAdmin
    ? [...displayItems, { id: "add", isAddButton: true }]
    : displayItems;
  const totalPages = Math.ceil(allItems.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = allItems.slice(startIndex, endIndex);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentPage((prevPage) => {
      let nextPage = prevPage + newDirection;
      if (nextPage < 0) nextPage = totalPages - 1;
      if (nextPage >= totalPages) nextPage = 0;
      return nextPage;
    });
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl mb-4 inline-block border-b-4 border-primary pb-2">
            프로젝트
          </h2>
        </div>

        <div className="relative overflow-hidden px-4 md:px-12">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentPage}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {currentItems.map((item: any) => {
                if (item.isAddButton) {
                  // Add Project Card
                  return (
                    <button
                      key="add"
                      type="button"
                      onClick={() => setAddModalOpen(true)}
                      className="bg-card border-4 border-dashed border-foreground rounded-2xl hover:shadow-2xl transition-all duration-300 hover:scale-105 h-full min-h-[400px] flex flex-col items-center justify-center gap-4 group"
                    >
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all">
                        <Plus className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                      </div>
                      <span className="text-xl text-muted-foreground group-hover:text-foreground transition-colors">
                        Add Project
                      </span>
                    </button>
                  );
                }

                // Regular Project Card
                return (
                  <div key={item.id} className="relative group">
                    <div className="bg-card border-4 border-foreground rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 h-full">
                      <div className="aspect-video overflow-hidden">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                          <Badge
                            className={`px-4 py-1 text-sm border-2 border-foreground ${
                              item.statusColor === 'primary' 
                                ? 'bg-primary text-primary-foreground' 
                                : item.statusColor === 'accent'
                                ? 'bg-accent text-accent-foreground'
                                : 'bg-secondary text-secondary-foreground'
                            }`}
                          >
                            {item.status}
                          </Badge>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{item.date}</span>
                          </div>
                        </div>

                        <h3 className="text-xl md:text-2xl mb-3">
                          {item.title}
                        </h3>
                        
                        <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Kebab menu: Admin only — never shown to guests */}
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => toggleMenu(item.id)}
                          className="absolute top-4 right-4 p-2 bg-card rounded-full border-2 border-foreground
                            shadow-md hover:scale-110 transition-transform z-10"
                          aria-label="메뉴"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        {openMenuId === item.id && (
                          <div className="absolute top-16 right-4 bg-background border-4 border-foreground rounded-lg shadow-xl overflow-hidden z-20 min-w-[120px]">
                            <button
                              type="button"
                              onClick={() => {
                                setEditProjectId(item.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              편집(Edit)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setDeleteConfirmId(item.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-destructive hover:text-destructive-foreground transition-colors border-t-2 border-foreground"
                            >
                              삭제(Delete)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setMemoProjectId(item.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-primary hover:text-primary-foreground transition-colors border-t-2 border-foreground"
                            >
                              메모(Admin Note)
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          {totalPages > 1 && (
            <>
              <button
                onClick={() => paginate(-1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10
                  bg-card text-foreground p-3 rounded-full border-2 border-foreground
                  shadow-xl hover:bg-primary hover:text-primary-foreground
                  hover:scale-110 transition-all"
                aria-label="이전"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={() => paginate(1)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10
                  bg-card text-foreground p-3 rounded-full border-2 border-foreground
                  shadow-xl hover:bg-primary hover:text-primary-foreground
                  hover:scale-110 transition-all"
                aria-label="다음"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Dots indicator */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentPage ? 1 : -1);
                  setCurrentPage(index);
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentPage
                    ? 'bg-secondary border-2 border-secondary scale-125'
                    : 'bg-muted border border-foreground/40'
                }`}
                aria-label={`페이지 ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      {isAdmin && (
        <>
          <ProjectFormModal
            open={addModalOpen || editProjectId != null}
            onOpenChange={(open) => {
              if (!open) {
                setAddModalOpen(false);
                setEditProjectId(null);
              }
            }}
            mode={editProjectId != null ? "edit" : "add"}
            project={editProjectId != null ? localProjects.find((p) => p.id === editProjectId) ?? null : null}
            onSuccess={(project) => (editProjectId != null ? handleEditSuccess(project) : handleAddSuccess(project))}
          />
          <ProjectMemoModal
            open={memoProjectId != null}
            onOpenChange={(open) => {
              if (!open) setMemoProjectId(null);
            }}
            project={memoProjectId != null ? localProjects.find((p) => p.id === memoProjectId) ?? null : null}
            onSuccess={handleMemoSuccess}
          />
          <AlertDialog open={deleteConfirmId != null} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>삭제 확인</AlertDialogTitle>
                <AlertDialogDescription>정말로 삭제하시겠습니까?</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
