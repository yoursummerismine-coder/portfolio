import { useCallback, useEffect, useRef, useState } from "react";
import { CATEGORIES } from "../content";
import { useModalFocus } from "../hooks/useModalFocus";
import { Arrow, CloseIcon } from "./Icons";

export default function Sidebar({ activePage }) {
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useModalFocus(sidebarRef, open, close);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1000px)");
    const handleResize = () => { if (desktop.matches) close(); };
    desktop.addEventListener("change", handleResize);
    return () => desktop.removeEventListener("change", handleResize);
  }, [close]);

  return (
    <aside ref={sidebarRef} className={`sidebar ${open ? "is-open" : ""}`} role={open ? "dialog" : undefined} aria-modal={open || undefined} aria-label={open ? "Navigation" : undefined}>
      <a className="wordmark" href="#/" onClick={close} aria-label="Kyujin Choi — Home"><span>Kyujin</span><span>Choi.</span></a>
      <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen((value) => !value)}>
        {open ? <><span>Close</span><CloseIcon /></> : <><span>Menu</span><svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16M4 16h16" /></svg></>}
      </button>
      <div className="navigation-panel" id="site-navigation">
        <nav className="primary-nav" aria-label="Work navigation">
          {CATEGORIES.map((item) => (
            <a key={item.id} href={`#/${item.id}`} onClick={close} aria-current={activePage === item.id ? "page" : undefined}>
              <span>{item.label}</span><Arrow />
            </a>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <nav className="secondary-nav" aria-label="Information navigation">
            <a href="#/about" onClick={close} aria-current={activePage === "about" ? "page" : undefined}>About</a>
            <a href="#/contact" onClick={close} aria-current={activePage === "contact" ? "page" : undefined}>Contact</a>
          </nav>
          <p>Seoul, South Korea</p>
        </div>
      </div>
    </aside>
  );
}
