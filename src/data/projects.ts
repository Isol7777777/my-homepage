export type ProjectStatus = "진행중" | "진행예정" | "완료";

export interface Project {
  id: number;
  name: string;
  description: string;
  /** 프로젝트 시작일 (YYYY-MM-DD) */
  startDate: string;
  /** 프로젝트 종료일 (YYYY-MM-DD, 선택 사항) */
  endDate?: string;
  status: ProjectStatus;
  /** 선택 메모 (요약, 회고 등) */
  memo?: string;
  /** 관리자 전용 메모 (Guest에게 노출되지 않음) */
  adminNote?: string;
  /** 카드 썸네일용 이미지 URL */
  imageUrl?: string;
}

const STATUS_WEIGHT: Record<ProjectStatus, number> = {
  진행중: 3,
  진행예정: 2,
  완료: 1,
};

/** 상태(진행중 > 진행예정 > 완료) 우선, 같은 상태 내에서는 원본 순서를 유지 */
export function sortProjectsByStatus(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    const diff = STATUS_WEIGHT[b.status] - STATUS_WEIGHT[a.status];
    return diff !== 0 ? diff : 0;
  });
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    name: "모바일 뱅킹 앱 리뉴얼",
    description:
      "사용자 경험을 개선한 모바일 뱅킹 애플리케이션 UI/UX 디자인. 직관적인 인터페이스와 모던한 비주얼로 사용성을 200% 향상시켰습니다.",
    startDate: "2024-09-01",
    endDate: "2024-12-31",
    status: "완료",
    memo: "리브랜딩과 UX 개선 A/B 테스트까지 포함된 풀 리뉴얼 프로젝트.",
    imageUrl:
      "https://images.unsplash.com/photo-1605108222700-0d605d9ebafe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: 2,
    name: "이커머스 플랫폼 웹사이트",
    description:
      "반응형 웹 디자인을 통한 통합 쇼핑 경험 제공. 전환율 150% 증가 달성한 성공적인 프로젝트입니다.",
    startDate: "2024-11-01",
    endDate: "2025-03-31",
    status: "진행중",
    memo: "현재 디자인 시스템 고도화와 퍼널 개선 진행 중.",
    imageUrl:
      "https://images.unsplash.com/photo-1760237877084-189a676623ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: 3,
    name: "스타트업 브랜딩 프로젝트",
    description:
      "완전히 새로운 브랜드 아이덴티티 구축. 로고, 컬러 시스템, 타이포그래피까지 전체 브랜드 가이드라인을 제작했습니다.",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    status: "완료",
    memo: "브랜드 키 비주얼과 온·오프라인 적용 가이드까지 포함.",
    imageUrl:
      "https://images.unsplash.com/photo-1634671495197-fb9ec3230ef5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: 4,
    name: "SaaS 대시보드 디자인",
    description:
      "복잡한 데이터를 시각화한 직관적인 대시보드. 관리자와 사용자 모두를 위한 최적화된 인터페이스를 설계했습니다.",
    startDate: "2025-01-01",
    endDate: undefined,
    status: "진행예정",
    memo: "데이터 구조 정리 및 핵심 KPI 정의 단계.",
    imageUrl:
      "https://images.unsplash.com/photo-1772272935464-2e90d8218987?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
];

