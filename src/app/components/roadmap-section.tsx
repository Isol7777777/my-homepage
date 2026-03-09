import { CheckCircle2, Circle } from 'lucide-react';

const roadmapItems = [
  {
    year: "2020",
    title: "디자인 여정의 시작",
    description: "홍익대학교 시각디자인학과 입학, 디자인의 기초를 다지다",
    completed: true
  },
  {
    year: "2021",
    title: "첫 프리랜스 프로젝트",
    description: "스타트업 브랜딩 및 웹 디자인 프로젝트 수행, 실무 경험 축적",
    completed: true
  },
  {
    year: "2022",
    title: "UX/UI 전문가로의 성장",
    description: "네이버 인턴십 합격, 대규모 서비스 디자인 경험",
    completed: true
  },
  {
    year: "2023",
    title: "주니어 디자이너 입사",
    description: "IT 기업 정규직 입사, 팀 프로젝트 리드 경험",
    completed: true
  },
  {
    year: "2024",
    title: "포트폴리오 확장",
    description: "다양한 산업군 프로젝트 수행, 수상 경력 3회",
    completed: true
  },
  {
    year: "2025",
    title: "시니어 디자이너로 도약",
    description: "팀 리더 승진, 디자인 시스템 구축 프로젝트 진행 중",
    completed: false
  },
  {
    year: "2026",
    title: "글로벌 진출 목표",
    description: "해외 프로젝트 참여 및 국제 디자인 컨퍼런스 발표 계획",
    completed: false
  }
];

export function RoadmapSection() {
  return (
    <section className="py-20 px-4 bg-muted">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl mb-4 inline-block border-b-4 border-secondary pb-2">
            나의 로드맵
          </h2>
        </div>

        <div className="relative">
          {/* Timeline vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-foreground transform md:-translate-x-1/2"></div>

          <div className="space-y-12">
            {roadmapItems.map((item, index) => (
              <div
                key={item.year}
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
                      <span className={`text-3xl px-4 py-1 rounded-lg border-2 border-foreground ${
                        item.completed 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {item.year}
                      </span>
                      {!item.completed && (
                        <span className="px-3 py-1 text-sm bg-accent text-accent-foreground border-2 border-foreground rounded-full">
                          예정
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-2xl mb-2">
                      {item.title}
                    </h3>
                    
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
    </section>
  );
}
