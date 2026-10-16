export function Arrow({ direction = "right", ...props }) {
  return (
    <svg viewBox="0 0 24 24" className="icon" aria-hidden="true" {...props}>
      <path d={direction === "left" ? "M19 12H5m0 0 6-6m-6 6 6 6" : "M5 12h14m0 0-6-6m6 6-6 6"} />
    </svg>
  );
}

export function CloseIcon() {
  return <svg viewBox="0 0 24 24" className="icon" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>;
}

export function PlayIcon() {
  return <svg viewBox="0 0 24 24" className="play-icon" aria-hidden="true"><path d="m9 5 11 7-11 7Z" /></svg>;
}
