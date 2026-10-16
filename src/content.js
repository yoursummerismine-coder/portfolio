import { AI_WORKS, COMMERCIALS, FILMS } from "./data";

export const CATEGORIES = [
  { id: "archive", label: "Archive" },
  { id: "commercials", label: "Commercials" },
  { id: "films", label: "Films" },
  { id: "ai-work", label: "AI Work" },
  { id: "crew", label: "Crew" },
];

const commercialProjects = COMMERCIALS.map((work) => ({
  ...work,
  key: work.id,
  group: "commercials",
  groupLabel: "Commercials",
  category: "Commercial",
  thumbnail: work.image,
  aspect: `${work.imageWidth} / ${work.imageHeight}`,
}));

// Intrinsic lead-still sizes, measured from the existing files (not a forced crop).
const FILM_FRAMES = { 1: [1206, 651], 2: [3456, 1852], 3: [2466, 1760], 4: [2200, 943] };

const filmProjects = FILMS.map((film) => ({
  ...film,
  key: `film-${film.id}`,
  group: "films",
  groupLabel: "Films",
  subtitle: film.titleKr,
  thumbnail: film.stills[0],
  imageAlt: `A still from ${film.title}`,
  imageWidth: FILM_FRAMES[film.id][0],
  imageHeight: FILM_FRAMES[film.id][1],
  aspect: `${FILM_FRAMES[film.id][0]} / ${FILM_FRAMES[film.id][1]}`,
}));

const aiProjects = AI_WORKS.map((work, index) => {
  const [imageWidth, imageHeight] = (work.aspect || "16 / 9").split("/").map(Number);
  const poster = work.poster || work.src.replace("/ai/", "/ai/posters/").replace(/\.mp4$/, ".jpg");
  return {
    ...work,
    key: `ai-${work.id}`,
    title: `AI Study ${String(index + 1).padStart(2, "0")}`,
    group: "ai-work",
    groupLabel: "AI Work",
    category: "AI Work",
    role: "AI Artist",
    subtitle: work.tools || "Generative moving image",
    thumbnail: poster,
    poster,
    imageAlt: `Poster for AI moving image study ${index + 1}`,
    imageWidth,
    imageHeight,
  };
});

export const PROJECTS = [...commercialProjects, ...filmProjects, ...aiProjects];

export function getProjects(group) {
  return group === "archive" ? PROJECTS : PROJECTS.filter((project) => project.group === group);
}

export function getProject(key) {
  return PROJECTS.find((project) => project.key === key);
}

export function getYouTubeId(url) {
  if (!url) return null;
  const parsed = new URL(url);
  return parsed.hostname === "youtu.be" ? parsed.pathname.slice(1) : parsed.searchParams.get("v");
}
