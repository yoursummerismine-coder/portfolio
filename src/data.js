const STILLS_LB = [
  "/stills/lb-01.jpg",
  "/stills/lb-02.jpg",
  "/stills/lb-03.jpg",
  "/stills/lb-04.jpg",
  "/stills/lb-05.jpg",
  "/stills/lb-06.jpg",
];

const STILLS_TC = [
  "/stills/tc-01.jpg",
  "/stills/tc-02.jpg",
  "/stills/tc-03.jpg",
];

const STILLS_TB = [
  "/stills/tb-01.jpg",
  "/stills/tb-02.jpg",
  "/stills/tb-03.jpg",
];

export const FILMS = [
  {
    id: 1,
    title: "Ear Candle",
    titleKr: "이봉",
    category: "Short Film",
    year: "2026",
    role: "Director of Photography · DI Colorist",
    director: "Park Jinyeong",
    format: "Digital — Sony Burano",
    duration: "In Post-Production",
    description:
      "A portrait of disconnection — between a person and the world surrounding them. Deep shadows and stark contrast carve out the isolation, letting darkness speak as loudly as light.",
    stills: STILLS_LB,
    watchUrl: null,
    watchLabel: null,
  },
  {
    id: 2,
    title: "Trash Can",
    titleKr: "쓰레기통",
    category: "Short Film",
    year: "2024",
    role: "Director of Photography",
    director: "Kim Boae",
    format: "Digital — Sony FX6",
    duration: "19 min",
    description:
      "Fluorescent corridors and muted daylight frame quiet acts of care and loss. The camera holds its distance — observing rather than intruding — finding meaning in the objects people carry and the spaces they pass through.",
    stills: STILLS_TC,
    watchUrl: "https://youtu.be/j2Ym8KJnWGk?si=Zrtgty2UYI4Z7iq6",
    watchLabel: "Watch on YouTube",
  },
  {
    id: 3,
    title: "How to Dispose of Tangerine Box",
    titleKr: "귤박스를 처리하는 방법",
    category: "Short Film",
    year: "2023",
    role: "Gaffer",
    director: "Cha Hyunseo",
    format: "",
    duration: "",
    description:
      "Warm practicals and soft window light fill a domestic interior where two people navigate the small, unspoken weight of being together. As gaffer, the goal was to let every lamp in the room do the storytelling.",
    stills: STILLS_TB,
    watchUrl: null,
    watchLabel: null,
  },
];

// `aspect` is the source file's native frame ratio, measured with ffprobe.
// Cards render at this ratio so no work is cropped to a uniform tile.
export const AI_WORKS = [
  { id: 18, src: "/ai/ai-17.mp4", poster: "/ai/posters/ai-17.jpg", aspect: "2206 / 946", description: "A generative video study composed through cinematic motion and atmospheric texture.", year: "2026" },
  { id: 17, src: "/ai/ai-18.mp4", poster: "/ai/posters/ai-18.jpg", aspect: "4096 / 1716", description: "A generative video study composed through cinematic motion and atmospheric texture.", year: "2026" },
  { id: 16, src: "/ai/ai-19.mp4", poster: "/ai/posters/ai-19.jpg", aspect: "2206 / 946", description: "A generative video study composed through cinematic motion and atmospheric texture.", tools: "Seedance 2.0 · ComfyUI", year: "2026" },
  { id: 15, src: "/ai/ai-16.mp4", aspect: "1984 / 864", description: "A generative video study composed through cinematic motion and atmospheric texture.", year: "2026" },
  { id: 14, src: "/ai/ai-13.mp4", aspect: "1920 / 1080", description: "A generative video study composed through cinematic motion and atmospheric texture.", year: "2026" },
  { id: 13, src: "/ai/ai-14.mp4", aspect: "2580 / 1080", description: "A generative video study composed through cinematic motion and atmospheric texture.", year: "2026" },
  { id: 12, src: "/ai/ai-15.mp4", aspect: "1920 / 1080", description: "A generative video study composed through cinematic motion and atmospheric texture.", year: "2026" },
  { id: 11, src: "/ai/ai-12.mp4", aspect: "3072 / 2048", description: "A generative video study composed through cinematic motion and atmospheric texture.", tools: "GPT Image 2 · SEEDANCE 2.0", year: "2026" },
  { id: 10, src: "/ai/ai-10.mp4", aspect: "3840 / 2160", description: "A generative video study composed through cinematic motion and atmospheric texture.", tools: "GPT Image 2 · SEEDANCE 2.0", year: "2026" },
  { id: 9, src: "/ai/ai-09.mp4", aspect: "1828 / 1332", description: "A generative video study composed through cinematic motion and atmospheric texture.", tools: "GPT Image 2 · SEEDANCE 2.0", year: "2026" },
  { id: 8, src: "/ai/ai-08.mp4", aspect: "1920 / 1080", description: "A generative video study composed through cinematic motion and atmospheric texture.", tools: "GPT Image 2 · SEEDANCE 2.0", year: "2026" },
  { id: 7, src: "/ai/ai-07.mp4", aspect: "3832 / 2160", description: "A generative video study focused on cinematic movement and atmospheric texture.", tools: "NANO BANANA · RUNWAY GEN-4.5", year: "2026" },
  { id: 6, src: "/ai/ai-06.mp4", aspect: "3840 / 2160", description: "A generative video study composed through AI-driven motion and cinematic atmosphere.", tools: "SEEDANCE 2.0", year: "2026" },
  { id: 5, src: "/ai/ai-05.mp4", aspect: "1920 / 1080", description: "A generative video study shaped through motion, texture, and cinematic atmosphere.", tools: "Runway Gen-4.5", year: "2026" },
  { id: 4, src: "/ai/ai-04.mp4", aspect: "3840 / 2160", description: "An AI-generated moving image study — exploring texture, motion, and atmosphere through a cinematic frame.", tools: "Runway Aleph", year: "2026" },
  { id: 2, src: "/ai/ai-02.mp4", poster: "/ai/posters/ai-02.jpg", aspect: "1280 / 720", description: "An exercise in surreal mise-en-scène. Suspended blossoms frame a single figure, blending photographic realism with a painterly, dreamlike composition.", tools: "Nano Banana · Kling", year: "2026" },
  { id: 1, src: "/ai/ai-11.mp4", aspect: "1920 / 1080", description: "A generative video study composed through cinematic motion and atmospheric texture.", tools: "Midjourney · Kling", year: "2026" },
];

export const FILMOGRAPHY = [
  { id: 20, title: "아이우에오", titleEn: "A I W E O", year: "2026", role: "2nd AC", director: "—", format: "Music Video", watchUrl: "https://youtu.be/awlTdqgNRf0" },
  { id: 1, title: "이봉", titleEn: "Ear Candle", year: "2026", role: "Director of Photography", director: "Park Jinyeong", format: "Short Film" },
  { id: 2, title: "쿠쿠 리네이처 메디킨하이", titleEn: "", year: "2026", role: "3rd AC", director: "—", format: "Commercial" },
  { id: 3, title: "누가 내 십자가를 훔쳐갔는가?", titleEn: "", year: "2025", role: "3rd AC", director: "—", format: "Feature Film" },
  { id: 4, title: "1993년", titleEn: "", year: "2025", role: "3rd AC", director: "—", format: "Music Video" },
  { id: 19, title: "물고기도 숨을 쉰다", titleEn: "", year: "2024", role: "Assistant Director", director: "—", format: "Short Film" },
  { id: 5, title: "쓰레기통", titleEn: "Trash Can", year: "2024", role: "Director of Photography", director: "Kim Boae", format: "Short Film" },
  { id: 6, title: "스카이 스위트 한강브릿지 서울", titleEn: "", year: "2024", role: "3rd AC", director: "—", format: "Commercial" },
  { id: 7, title: "힙지로 직장인 (EP.13, 16, 17, 18)", titleEn: "", year: "2024", role: "3rd Assistant Director", director: "—", format: "Web Drama" },
  { id: 8, title: "KNOCKONMYDOOR — 천재 아니 바보", titleEn: "", year: "2024", role: "2nd AC", director: "—", format: "Music Video" },
  { id: 9, title: "OVERBOOKING", titleEn: "", year: "2023", role: "Director of Photography", director: "—", format: "Short Film" },
  { id: 10, title: "2023 무비히어로 캠페인", titleEn: "", year: "2023", role: "Assistant Director", director: "—", format: "Campaign" },
  { id: 11, title: "막세판", titleEn: "", year: "2023", role: "2nd AC", director: "—", format: "Short Film" },
  { id: 12, title: "얼씨구", titleEn: "", year: "2023", role: "3rd AC", director: "—", format: "Short Film" },
  { id: 13, title: "귤박스를 처리하는 방법", titleEn: "How to Dispose of Tangerine Box", year: "2023", role: "Gaffer", director: "Cha Hyunseo", format: "Short Film" },
  { id: 14, title: "좋아요", titleEn: "", year: "2022", role: "Director of Photography", director: "—", format: "Short Film" },
  { id: 15, title: "나의 연필은 무기가 되어", titleEn: "", year: "2022", role: "Set Helper", director: "—", format: "Short Film" },
  { id: 16, title: "5월이란?", titleEn: "", year: "2022", role: "Gaffer", director: "—", format: "Documentary" },
  { id: 17, title: "낚시", titleEn: "", year: "2022", role: "3rd AC", director: "—", format: "Short Film" },
  { id: 18, title: "잔아 박물관 홍보 영상", titleEn: "", year: "2020", role: "Director · DP · Editor", director: "—", format: "Viral Video" },
];
