import { useEffect, useRef, useState } from "react";
import { createWaterSurface } from "./waterMotion";

const preferenceKey = "kyujin-home-motion-paused";

export default function HomeGraphic() {
  const canvasRef = useRef(null);
  const surfaceRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(() => {
    try { return window.localStorage.getItem(preferenceKey) === "true"; }
    catch { return false; }
  });
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    surfaceRef.current = createWaterSurface(canvasRef.current, setReady);
    return () => surfaceRef.current?.destroy();
  }, []);

  useEffect(() => {
    surfaceRef.current?.setPaused(paused || reducedMotion);
  }, [paused, reducedMotion]);

  function toggleMotion() {
    const next = !paused;
    setPaused(next);
    try { window.localStorage.setItem(preferenceKey, String(next)); }
    catch { /* Motion still works when browser storage is unavailable. */ }
  }

  return (
    <div className="home-graphic" data-motion={reducedMotion ? "reduced" : paused ? "paused" : "running"} data-renderer={ready ? "webgl" : "fallback"}>
      <svg className="home-water-fallback" viewBox="0 0 1100 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        <path d="M-100 230C250 30 350 480 690 330S1060 180 1200 400" fill="none" stroke="#30322f" strokeWidth="100" />
        <path d="M-100 210C250 50 350 460 690 330S1060 200 1200 400" fill="none" stroke="#555750" strokeWidth="3" />
        <path d="M-100 540C280 340 360 700 700 550S1060 480 1200 650" fill="none" stroke="#30322f" strokeWidth="70" />
      </svg>
      <canvas ref={canvasRef} className="home-water" aria-hidden="true" />
      {ready && !reducedMotion && <button className="home-motion-toggle" type="button" onClick={toggleMotion} aria-label={paused ? "Resume background motion" : "Pause background motion"} title={paused ? "Resume motion" : "Pause motion"}>
        <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">{paused ? <path d="m7 4 8 6-8 6Z" fill="currentColor" /> : <path d="M7 4v12M13 4v12" fill="none" stroke="currentColor" strokeWidth="1.5" />}</svg>
      </button>}
    </div>
  );
}
