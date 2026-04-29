import { PortfolioData } from './types';

export const initialData: PortfolioData = {
  profile: {
    name: "마케터 성함",
    mainTitle: "콘텐츠와 데이터를 연결해 고객 반응을 설계하는 마케터",
    subTitle: "트렌드를 읽고, 데이터를 해석하고, 실행 가능한 전략으로 연결합니다. 브랜드 경험 · 콘텐츠 기획 · 데이터 기반 마케팅에 강점을 가진 인재입니다.",
    keywords: ["Data Marketing", "Brand Strategy", "Content Planning"],
    aboutText: "데이터와 감각을 함께 보는 마케터입니다.\n\n신문방송학을 전공하며 커뮤니케이션의 근간을 이해했고, 영어강사 활동을 통해 사람들의 반응을 세밀하게 관찰하고 맞춤형 피드백을 제공하는 능력을 길렀습니다. 이를 바탕으로 콘텐츠 산업에 대한 깊은 관심을 데이터 분석 기술(Python, SQL)과 결합하여, 단순한 나열이 아닌 성장이 있는 스토리를 만들어가는 실무형 마케터로 성장하고 있습니다.",
    email: "marketer@example.com",
    phone: "010-1234-5678",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000",
    footerHeadline: "LET'S CONNECT.",
    footerSubtext: "브랜드의 문제를 데이터와 콘텐츠로 해결하는 마케터가 되겠습니다.\n언제든 편하게 연락주세요.",
    links: {
      linkedin: "#",
      notion: "#",
      github: "#"
    },
    education: [
      { school: "대학교 학교명", major: "신문방송학", status: "졸업", period: "2016.03 - 2021.02" }
    ],
    certifications: [
      { name: "SQLD (SQL 개발자)", date: "2023.09", grade: "합격" },
      { name: "ADsP (데이터분석 준전문가)", date: "2023.05", grade: "합격" },
      { name: "GAIQ", date: "2023.01", grade: "Pass" }
    ]
  },
  projects: [
    {
      id: "steam-analysis",
      title: "Steam 유저 군집 분석 기반 마케팅 전략",
      period: "2023.09 - 2023.11",
      tools: ["Python", "Pandas", "Scikit-learn", "Tableau"],
      role: "데이터 분석 및 전략 설계",
      problem: "게임 플랫폼 유저의 취향과 행동 패턴이 너무 다양하여 획일적인 메시지로는 전환율 확보에 한계가 있음",
      analysis: "유저 행동 데이터를 바탕으로 클러스터링을 진행하여 핵심 유저 군집을 도출하고 각 특성을 정의함",
      strategy: "군집별 특성에 최적화된 개인화 CRM 전략 및 맞춤형 할인 혜택 메시지 설계",
      result: "데이터 기반의 세밀한 타겟팅을 통한 개인화 마케팅 전략 제안서 완성 및 잠재 효율 확인",
      learnings: "데이터 분석이 어떻게 수치적인 전략으로 연결되어 비즈니스 효율을 높이는지 깊이 있게 파악함",
      images: ["https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800"],
      pdfUrl: "#"
    },
    {
      id: "megabox-campaign",
      title: "메가박스 서브컬쳐 특화 문화 공간 수립 - MSG",
      period: "2023.05 - 2023.08",
      tools: ["Photoshop", "Illustrator", "SNS Marketing"],
      role: "공간 기획 및 캠페인 전략",
      problem: "전통적인 극장 산업 내에서 오프라인 경험의 차별화와 신규 유입을 위한 강력한 유인 전략이 부재함",
      strategy: "서브컬처 팬덤 특화 공간 'MSG' 기획 및 팬덤 몰입형 캠페인 'Be the Scene' 전개",
      result: "서브컬처 타겟 고객의 높은 호응도와 브랜드 경험적 가치 제안 및 온라인 언급량 상승 견인",
      learnings: "타켓의 니즈와 문화를 깊이 이해한 브랜딩이 오프라인 공간에서 발휘하는 강력한 힘을 체험함",
      images: ["https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800"],
      pdfUrl: "#",
      pdfLabel: "PDF 보기",
      reportUrl: "#",
      reportLabel: "pdf 리포트 보기"
    },
    {
      id: "cinema-data",
      title: "영화관 특별상영 데이터 통합 및 트렌드 분석",
      period: "2023.01 - 2023.03",
      tools: ["Python", "SQL", "Excel"],
      role: "데이터 통합 및 분석 환경 구축",
      problem: "CGV, 롯데시네마, 메가박스 등 각 영화관 웹사이트에 분산된 특별상영 현황 데이터 수집의 비효율성",
      execution: "자동 크롤링 프로그램을 통해 상업 영화관들의 특별상영 데이터를 일원화하여 통합 DB 구축",
      strategy: "통합 데이터를 기반으로 한 이벤트 상영 트렌드 분석 및 배급 인사이트 도출",
      result: "상영 데이터 통합으로 분석 리소스 70% 절감 및 실시간 시장 변화 대응력 확보",
      learnings: "데이터 수집 자동화와 정제가 실무 의사결정의 속도를 얼마나 혁신적으로 바꾸는지 경험함",
      images: ["https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=800"],
      pdfUrl: "#"
    },
    {
      id: "etude-rebranding",
      title: "에뛰드 리브랜딩 제안서 - My attitude, Etude",
      period: "2023.10 - 2023.12",
      tools: ["Photoshop", "Illustrator", "After Effects", "Trend Analysis"],
      role: "브랜드 리뉴얼 및 영상 기획",
      problem: "브랜드 아이덴티티가 노후화되어 MZ세대 타겟 확장에 한계가 있음",
      strategy: "새로운 브랜드 슬로건 'PLAY WITH PRISM' 제안 및 톤앤매너 리뉴얼 전략 수립",
      result: "브랜드 리브랜딩 필름 제작 및 타겟 고객 선호도 15% 상승 확인",
      learnings: "전통적인 브랜드를 현대적인 감각으로 재해석하는 브랜딩 프로세스를 정립함",
      images: ["https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&q=80&w=800"],
      pdfUrl: "#",
      pdfLabel: "PDF 보기",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Placeholder video
    }
  ],
  skills: [
    {
      title: "AI Tools",
      skills: ["ChatGPT", "Midjourney", "Claude", "Gemini"]
    },
    {
      title: "Data Analysis",
      skills: ["SQL", "Python", "Tableau", "GA4", "Amplitude"]
    },
    {
      title: "Content&Communication",
      skills: ["Branding", "Copywriting", "SNS Strategy", "Public Relations"]
    }
  ],
  experiences: [
    {
      id: "edu-instr",
      company: "영어학원",
      role: "영어강사",
      period: "2019 - 2021",
      description: "단순한 지식 전달이 아닌, 학생별 취약점과 니즈를 분석하여 성과를 이끌어내는 '고객 소통'의 과정을 실습했습니다.",
      capabilities: ["고객 니즈 파악", "메시지 전달력", "문제 해결 능력", "반복적인 프로세스 개선"]
    }
  ]
};
