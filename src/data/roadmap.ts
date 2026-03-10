export interface RoadmapItem {
  id: number;
  title: string;
  description: string;
  /** 로드맵 시작일 (YYYY-MM-DD, DB start_date) */
  startDate?: string;
  /** 로드맵 종료일 (YYYY-MM-DD, 선택 사항, DB end_date) */
  endDate?: string;
  /** 선택: Supabase created_at 등을 문자열로 보관 */
  createdAt?: string;
}

export const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    id: 1,
    title: "디자인 여정의 시작",
    description: "홍익대학교 시각디자인학과 입학, 디자인의 기초를 다지다",
    startDate: "2020-01-01",
    endDate: "2020-12-31",
  },
  {
    id: 2,
    title: "첫 프리랜스 프로젝트",
    description: "스타트업 브랜딩 및 웹 디자인 프로젝트 수행, 실무 경험 축적",
    startDate: "2021-01-01",
    endDate: "2021-12-31",
  },
  {
    id: 3,
    title: "UX/UI 전문가로의 성장",
    description: "네이버 인턴십 합격, 대규모 서비스 디자인 경험",
    startDate: "2022-01-01",
    endDate: "2022-12-31",
  },
  {
    id: 4,
    title: "주니어 디자이너 입사",
    description: "IT 기업 정규직 입사, 팀 프로젝트 리드 경험",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
  },
  {
    id: 5,
    title: "포트폴리오 확장",
    description: "다양한 산업군 프로젝트 수행, 수상 경력 3회",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
  },
  {
    id: 6,
    title: "시니어 디자이너로 도약",
    description: "팀 리더 승진, 디자인 시스템 구축 프로젝트 진행 중",
    startDate: "2025-01-01",
    endDate: undefined,
  },
  {
    id: 7,
    title: "글로벌 진출 목표",
    description: "해외 프로젝트 참여 및 국제 디자인 컨퍼런스 발표 계획",
    startDate: "2026-01-01",
    endDate: undefined,
  },
];

