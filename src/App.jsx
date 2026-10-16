import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, ChevronRight, Copy, Menu as MenuIcon, Pause, Play, X } from "lucide-react";
import { getEvents } from "./api/events";

const fallbackEvents = [
  { id: "sample-1", title: "Open Studio: Small Things", description: "An evening of makers, experiments, and unfinished ideas.", date: "2026-10-24T18:30:00", location: "The Courtyard", category: "Creative", image: null },
  { id: "sample-2", title: "Night Market Social", description: "Local food, records, and a little bit of late-night wandering.", date: "2026-10-30T19:00:00", location: "Old Mill Road", category: "Community", image: null },
  { id: "sample-3", title: "Designing for Real Life", description: "A candid conversation about useful interfaces and human attention.", date: "2026-11-08T11:00:00", location: "The Reading Room", category: "Talks", image: null },
  { id: "college-1", title: "Campus Hack Night", description: "Bring a rough idea, find collaborators, and ship a tiny prototype before sunrise.", date: "2026-11-14T18:00:00", location: "Innovation Lab", category: "Technology", image: null },
  { id: "college-2", title: "Inter-College Debate Open", description: "Teams from across the city meet for a fast-paced evening of ideas and rebuttals.", date: "2026-11-21T15:00:00", location: "Main Auditorium", category: "Competition", image: null },
  { id: "college-3", title: "Founders on Campus", description: "Three student founders share what worked, what broke, and what they learned next.", date: "2026-11-28T17:30:00", location: "Business School Atrium", category: "Talks", image: null },
  { id: "college-4", title: "Cultural Night: Open Stage", description: "Music, poetry, comedy, and dance from the people who make campus feel alive.", date: "2026-12-05T19:00:00", location: "Student Plaza", category: "Culture", image: null },
  { id: "college-5", title: "Design Sprint Weekend", description: "A hands-on weekend challenge to turn a campus problem into a thoughtful solution.", date: "2026-12-12T10:00:00", location: "Design Studio", category: "Workshop", image: null },
  { id: "college-6", title: "Robotics Arena", description: "Student teams put their autonomous builds through a series of creative challenges.", date: "2026-12-19T09:30:00", location: "Engineering Quad", category: "Technology", image: null },
  { id: "college-7", title: "Winter Sports Meet", description: "A spirited day of track, court, and field events across the university community.", date: "2027-01-09T08:00:00", location: "University Stadium", category: "Sports", image: null },
  { id: "college-8", title: "Photography Walk", description: "Explore overlooked corners of campus and learn to see everyday spaces differently.", date: "2027-01-16T07:30:00", location: "Arts Block Gate", category: "Creative", image: null },
  { id: "college-9", title: "Model United Nations", description: "Research, negotiate, and represent a nation in a day of fast-moving diplomacy.", date: "2027-01-23T09:00:00", location: "Conference Hall", category: "Competition", image: null },
  { id: "college-10", title: "Alumni Career Mixer", description: "Meet graduates from different paths and ask the questions that matter to you.", date: "2027-01-30T16:00:00", location: "Central Lawn", category: "Community", image: null },
  { id: "college-11", title: "Sustainability Fair", description: "Student-led projects, repair stations, and practical ideas for a lighter footprint.", date: "2027-02-06T11:00:00", location: "Green Commons", category: "Community", image: null },
  { id: "college-12", title: "Indie Game Showcase", description: "Play original games made by student developers and meet the teams behind them.", date: "2027-02-13T14:00:00", location: "Media Lab", category: "Technology", image: null },
  { id: "college-13", title: "Poetry Slam", description: "A warm room, an open mic, and bold new voices taking the stage.", date: "2027-02-20T18:30:00", location: "Amphitheatre", category: "Culture", image: null },
  { id: "college-14", title: "Research Open House", description: "See what campus labs are working on and find a project to be curious about.", date: "2027-02-27T10:00:00", location: "Science Centre", category: "Talks", image: null },
  { id: "college-15", title: "Student Startup Pitch Day", description: "Early-stage teams pitch useful ideas to a panel of founders, mentors, and peers.", date: "2027-03-06T13:00:00", location: "Incubation Centre", category: "Competition", image: null },
];

function formatDate(value) {
  if (!value) return "Date to be announced";
  return new Intl.DateTimeFormat("en-IN", { month: "short", year: "numeric" }).format(new Date(value));
}

function formatTime(value) {
  if (!value) return "Time to be announced";
  return new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(value));
}

function EventImage({ event, large = false }) {
  return <div className={`event-image ${large ? "event-image--large" : ""}`} style={event.image ? { backgroundImage: `url(${event.image})` } : undefined}>
    <span>{event.category.slice(0, 1)}</span>
    <i />
  </div>;
}

function App() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("loading");
  const [activeEvent, setActiveEvent] = useState(0);
  const [panel, setPanel] = useState(null);
  const [audioOn, setAudioOn] = useState(false);
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    getEvents(controller.signal).then((items) => { setEvents(items); setStatus(items.length ? "ready" : "empty"); }).catch(() => setStatus("error")).finally(() => window.clearTimeout(timeout));
    return () => { controller.abort(); window.clearTimeout(timeout); };
  }, []);

  useEffect(() => {
    const updateTime = () => setTime(new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date()));
    updateTime();
    const interval = window.setInterval(updateTime, 30000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.style.overflow = panel ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [panel]);

  useEffect(() => {
    if (!panel) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setPanel(null);
      if (event.key !== "Tab") return;
      const focusable = [...document.querySelectorAll(".overlay-panel a, .overlay-panel button")];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [panel]);

  const displayedEvents = useMemo(() => status === "error" || status === "empty" ? fallbackEvents : events, [events, status]);
  const selectedEvent = displayedEvents[activeEvent % Math.max(displayedEvents.length, 1)] || fallbackEvents[0];

  const copyEmail = async () => {
    await navigator.clipboard?.writeText("hello@gather.events");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const closePanel = () => setPanel(null);

  return <div className="portfolio-shell">
    <header className="utility-nav">
      <a href="#top" className="brand-lockup" aria-label="Gather home"><strong>GATHER</strong><span>EVENTS<br />2026</span></a>
      <button className="menu-trigger" onClick={() => setPanel("menu")} aria-label="Open menu"><MenuIcon size={14} /> Menu</button>
      <button className="showreel" onClick={() => setPanel("credits")}>’25 showreel <Play size={11} /></button>
      <div className="utility-controls"><button onClick={() => setAudioOn(!audioOn)} className="utility-button" aria-pressed={audioOn}>{audioOn ? <Pause size={12} /> : <Play size={12} />} Audio {audioOn ? "On" : "Off"}</button><span className="utility-location">Working globally<br /><b>HCMC, {time || "--:--"}</b></span></div>
      <button className="inquiry" onClick={copyEmail}><span>For inquiries</span><b>{copied ? "Copied" : "hello@gather.events"}</b><Copy size={12} /></button>
    </header>

    <main id="top">
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-name" id="hero-title"><span>Gather</span><span>Events</span></div>
        <div className="hero-meta"><div><span>Launch</span><strong>2026</strong></div><div><span>Recognition</span><strong>Campus events<br />Creative community<br />Open to everyone</strong></div></div>
        <div className="hero-feature"><EventImage event={selectedEvent} large /><div className="hero-feature__caption"><span>{selectedEvent.category}</span><strong>{selectedEvent.title}</strong><p>{selectedEvent.description}</p></div></div>
        <div className="hero-scroll">Scroll <ChevronRight size={12} /></div>
        <div className="hero-index"><span>01</span><b>/{String(Math.max(displayedEvents.length, 1)).padStart(2, "0")}</b></div>
        <div className="hero-side-list" aria-hidden="true">{displayedEvents.slice(1, 5).map((event) => <div key={event.id}><small>{event.category}</small><strong>{event.title}</strong><p>{event.description}</p></div>)}</div>
      </section>

      <section className="selected-work" id="work" aria-labelledby="selected-title">
        <div className="section-marker"><span id="selected-title">Selected work</span><strong>01</strong><b>/{String(Math.max(displayedEvents.length, 1)).padStart(2, "0")}</b></div>
        <div className="marquee-viewport"><div className="marquee-track">{[...displayedEvents, ...displayedEvents].map((event, index) => <button className="marquee-card" key={`${event.id}-${index}`} onClick={() => { setActiveEvent(index % displayedEvents.length); window.scrollTo({ top: 0, behavior: "smooth" }); }}><EventImage event={event} /><span>{event.category}</span><strong>{event.title}</strong><p>{event.description}</p></button>)}</div></div>
      </section>

      <section className="project-section" aria-labelledby="project-list-title">
        <div className="section-marker"><span id="project-list-title">All events</span><strong>{String(displayedEvents.length).padStart(2, "0")}</strong></div>
        <div className="project-list">{displayedEvents.map((event, index) => <a className="project-row" href={`#event-${event.id}`} key={event.id} onMouseEnter={() => setActiveEvent(index)}>
          <div className="project-row__title"><span>{event.category}</span><h2>{event.title}</h2><p>{event.description}</p></div><div className="project-row__meta"><span>{formatDate(event.date)}</span><span>{formatTime(event.date)}</span><span>{event.location}</span></div><div className="project-row__arrow"><ArrowUpRight size={17} /></div>
        </a>)}</div>
      </section>

      <section className="footer-cta" id="contact"><div className="section-marker"><span>Keep in touch</span></div><h2>Leave room for<br /><em>something new.</em></h2><p>{selectedEvent.description}</p><button onClick={copyEmail} className="outline-link">{copied ? "Copied" : "Say hello"} <ArrowUpRight size={15} /></button></section>
    </main>

    <footer className="site-footer"><div><strong>Independent event platform</strong><span>Working globally</span></div><div className="footer-marquee" aria-hidden="true">✳︎ &nbsp; GATHER &nbsp; ✳︎ &nbsp; GATHER &nbsp; ✳︎ &nbsp; GATHER &nbsp;</div><button className="credits-trigger" onClick={() => setPanel("credits")}>Credits · 2026</button></footer>

    {panel && <div className="panel-backdrop" role="presentation" onClick={closePanel}><section className="overlay-panel" role="dialog" aria-modal="true" aria-labelledby="panel-title" onClick={(event) => event.stopPropagation()}><button className="panel-close" autoFocus onClick={closePanel}><X size={16} /> Close</button>{panel === "menu" ? <><h2 id="panel-title">Navigate</h2><nav className="overlay-links"><a href="#work" onClick={closePanel}>WORK</a><a href="#top" onClick={closePanel}>ABOUT</a><a href="#work" onClick={closePanel}>PLAYGROUND</a><a href="#contact" onClick={closePanel}>CONTACT</a></nav><div className="overlay-social"><span>Come say hi</span><button onClick={copyEmail}>{copied ? "Copied" : "hello@gather.events"}</button><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a></div></> : <><h2 id="panel-title">Credits</h2><div className="credits-copy"><span>Design & direction</span><strong>Gather studio</strong><span>Events & community</span><strong>Working globally</strong><span>Typography</span><strong>Free grotesk fallback, ready for licensed font swap</strong></div></>}</section></div>}
  </div>;
}

export default App;
