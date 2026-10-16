import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Clock3, MapPin, Moon, RefreshCw, Search, Sparkles, Sun, Vibrate } from "lucide-react";
import { getEventById, getEvents } from "./api/events";

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

const formatDate = (value) => value ? new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short" }).format(new Date(value)) : "Date to be announced";
const formatTime = (value) => value ? new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(new Date(value)) : "Time to be announced";

function EventCard({ event }) {
  return <a className="event-card" href={`/events/${event.id}`}><div className="event-card__image">{event.image ? <img src={event.image} alt={event.imageAlt} loading="lazy" /> : <span>{event.category?.slice(0, 1)}</span>}<span className="event-card__badge">{event.category}</span></div><div className="event-card__body"><div className="event-card__meta"><span><CalendarDays size={15} />{formatDate(event.date)}</span><span><Clock3 size={15} />{formatTime(event.date)}</span></div><h3>{event.title}</h3><p>{event.description}</p><div className="event-card__footer"><span><MapPin size={15} />{event.location}</span><ArrowUpRight size={19} /></div></div></a>;
}

function Header({ navigate, darkMode, setDarkMode, hapticsEnabled, setHapticsEnabled }) {
  return <header className="site-header"><a className="logo" href="/" onClick={(event) => { event.preventDefault(); navigate("/"); }}><span>g</span>ather<span className="logo-dot">.</span></a><nav><a href="/events" onClick={(event) => { event.preventDefault(); navigate("/events"); }}>Explore events</a><a href="/#about">Our point of view</a></nav><div className="header-actions"><button className={`theme-toggle ${hapticsEnabled ? "is-enabled" : ""}`} type="button" onClick={() => setHapticsEnabled((value) => !value)} aria-pressed={hapticsEnabled} aria-label={`Turn haptics ${hapticsEnabled ? "off" : "on"}`}><Vibrate size={16} /><span>Haptics {hapticsEnabled ? "on" : "off"}</span></button><button className="theme-toggle" type="button" onClick={() => setDarkMode((value) => !value)} aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}>{darkMode ? <Sun size={16} /> : <Moon size={16} />}<span>{darkMode ? "Light" : "Dark"}</span></button><a className="header-link" href="/events" onClick={(event) => { event.preventDefault(); navigate("/events"); }}>Find an event <ArrowUpRight size={16} /></a></div></header>;
}

function Landing({ events, navigate }) {
  return <><section className="hero"><div className="hero__eyebrow"><Sparkles size={16} /> Curious by default</div><h1>Make room for<br /><em>something new.</em></h1><p>Gather is a calmer way to find events, ideas, and people worth making time for.</p><a className="button button--dark" href="/events" onClick={(event) => { event.preventDefault(); navigate("/events"); }}>Explore events <ArrowUpRight size={17} /></a><div className="hero__scribble">scroll to wander ↓</div></section><section className="intro" id="about"><div className="section-label">01 / Why gather</div><div><h2>The best plans start with<br /><em>“what if I went?”</em></h2><p>From small workshops to big conversations, discover what is happening around you without the noise. A little inspiration, neatly arranged.</p></div></section><section className="events-section"><div className="section-heading"><div><div className="section-label">02 / Coming up</div><h2>Go on,<br /><em>pick one.</em></h2></div><a className="text-button" href="/events" onClick={(event) => { event.preventDefault(); navigate("/events"); }}>See all events <ArrowUpRight size={15} /></a></div><div className="event-grid">{events.slice(0, 3).map((event) => <EventCard event={event} key={event.id} />)}</div></section><section className="closing"><div className="section-label">03 / Keep in touch</div><h2>Leave a little space<br />for <em>serendipity.</em></h2><p>Good things happen when you look up from the usual.</p><a className="button button--light" href="/events" onClick={(event) => { event.preventDefault(); navigate("/events"); }}>Browse the calendar <ArrowUpRight size={17} /></a></section></>;
}

function EventOrbit({ events, navigate }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const orbitRef = useRef(null);
  const itemsRef = useRef(null);
  const itemRefs = useRef([]);
  const activeEvent = events[activeIndex] || events[0];

  useEffect(() => {
    setActiveIndex((index) => Math.min(index, Math.max(0, events.length - 1)));
  }, [events.length]);

  useEffect(() => {
    let frame = 0;
    const updateRotation = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => itemsRef.current?.style.setProperty("--orbit-rotation", `${window.scrollY * 0.16}deg`));
    };
    window.addEventListener("scroll", updateRotation, { passive: true });
    updateRotation();
    return () => { window.removeEventListener("scroll", updateRotation); cancelAnimationFrame(frame); };
  }, []);

  const selectNearest = (event) => {
    if (!orbitRef.current || event.pointerType === "touch") return;
    const bounds = orbitRef.current.getBoundingClientRect();
    const pointerX = event.clientX;
    const pointerY = event.clientY;
    let nearestIndex = -1;
    let nearestDistance = Infinity;
    itemRefs.current.forEach((item, index) => {
      if (!item) return;
      const rect = item.getBoundingClientRect();
      const distance = Math.hypot(pointerX - (rect.left + rect.width / 2), pointerY - (rect.top + rect.height / 2));
      if (distance < nearestDistance) { nearestDistance = distance; nearestIndex = index; }
    });
    if (nearestIndex >= 0 && nearestDistance < 112 && bounds.width > 0) setActiveIndex(nearestIndex);
  };

  if (!activeEvent) return null;
  return <div className="orbit-wrap">
    <div className="orbit-stage" ref={orbitRef} onPointerMove={selectNearest}>
      <div className="orbit-ring" aria-hidden="true" />
      <div className="orbit-ring orbit-ring--inner" aria-hidden="true" />
      <div className="orbit-items" ref={itemsRef} style={{ "--orbit-mobile-node-size": `${Math.max(27, Math.min(48, 820 / events.length))}px` }}>
        {events.map((event, index) => {
          const angle = (360 / events.length) * index;
          const selected = index === activeIndex;
          return <button
            className={`orbit-node ${selected ? "is-active" : ""}`}
            key={event.id}
            ref={(node) => { itemRefs.current[index] = node; }}
            style={{ "--node-angle": `${angle}deg`, "--counter-angle": `${-angle}deg` }}
            type="button"
            aria-label={`Preview ${event.title}`}
            aria-pressed={selected}
            onFocus={() => setActiveIndex(index)}
            onPointerEnter={() => setActiveIndex(index)}
            onClick={() => setActiveIndex(index)}
          >
            {event.image ? <img src={event.image} alt="" loading="lazy" /> : <span className="orbit-node__fallback">{event.category?.slice(0, 1)}</span>}
            <span className="orbit-node__number">{String(index + 1).padStart(2, "0")}</span>
          </button>;
        })}
      </div>
      <article className="orbit-preview" key={activeEvent.id}>
        <span className="orbit-preview__eyebrow">{String(activeIndex + 1).padStart(2, "0")} <span> / {String(events.length).padStart(2, "0")}</span></span>
        <span className="orbit-preview__category">{activeEvent.category}</span>
        <h2>{activeEvent.title}</h2>
        <p>{activeEvent.description}</p>
        <div className="orbit-preview__meta"><span><CalendarDays size={14} />{formatDate(activeEvent.date)}</span><span><MapPin size={14} />{activeEvent.location}</span></div>
        <a href={`/events/${activeEvent.id}`} onClick={(click) => { click.preventDefault(); navigate(`/events/${activeEvent.id}`); }}>Explore event <ArrowUpRight size={15} /></a>
      </article>
      <span className="orbit-hint"><span /> Move closer to explore</span>
    </div>
    <p className="orbit-count">A full orbit of things to do <span>{events.length} EVENTS</span></p>
  </div>;
}

function EventsPage({ events, navigate }) {
  const [query, setQuery] = useState("");
  const visible = useMemo(() => events.filter((event) => `${event.title} ${event.description} ${event.location} ${event.category}`.toLowerCase().includes(query.toLowerCase())), [events, query]);
  return <section className="events-page"><a className="back-link" href="/" onClick={(event) => { event.preventDefault(); navigate("/"); }}><ArrowLeft size={16} /> Back home</a><div className="page-heading"><div><div className="section-label">02 / Events</div><h1>Find your<br /><em>next thing.</em></h1></div><label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events" aria-label="Search events" /></label></div>{visible.length ? <EventOrbit events={visible} navigate={navigate} /> : <div className="state-card"><h3>No matches found.</h3><p>Try a different search.</p></div>}</section>;
}

function EventPage({ event, events, navigate }) {
  const [details, setDetails] = useState(event);
  const [detailsStatus, setDetailsStatus] = useState("loading");
  useEffect(() => { const controller = new AbortController(); setDetails(event); getEventById(event.id, controller.signal).then((item) => setDetails(item)).catch(() => {}).finally(() => setDetailsStatus("ready")); return () => controller.abort(); }, [event]);
  const index = events.findIndex((item) => item.id === event.id);
  const next = events[(index + 1) % events.length];
  return <section className="event-detail"><a className="back-link" href="/events" onClick={(click) => { click.preventDefault(); navigate("/events"); }}><ArrowLeft size={16} /> All events</a><div className="event-detail__top"><div className="event-detail__visual">{details.bannerImage || details.image ? <img src={details.bannerImage || details.image} alt={details.imageAlt} /> : <span>{details.category?.slice(0, 1)}</span>}</div><div className="event-detail__content"><div className="section-label">{details.category} · {details.event_mode || "EVENT"}</div><h1>{details.title}</h1><p className="event-detail__description">{details.description}</p><div className="detail-list"><div><CalendarDays size={19} /><span><strong>{formatDate(details.date)}</strong>Date</span></div><div><Clock3 size={19} /><span><strong>{formatTime(details.date)}</strong>Time</span></div><div><MapPin size={19} /><span><strong>{details.location}</strong>Location</span></div></div><div className="event-stats"><span>{details.registration_status || "OPEN"}</span>{details.price === 0 ? <span>Free</span> : details.price ? <span>₹{details.price}</span> : null}{details.total_seats ? <span>{details.seats_filled || 0}/{details.total_seats} seats</span> : null}</div></div></div>{details.highlights?.length > 0 && <div className="event-detail__extra"><div className="section-label">Good to know</div><div className="highlight-grid">{details.highlights.slice(0, 4).map((highlight) => <div key={highlight}>{highlight}</div>)}</div></div>}{details.tags?.length > 0 && <div className="tag-row">{details.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}<a className="next-event" href={`/events/${next.id}`} onClick={(click) => { click.preventDefault(); navigate(`/events/${next.id}`); }}><span>{detailsStatus === "loading" ? "Loading details" : "Next event"}</span><strong>{next.title}</strong><ArrowRight size={18} /></a></section>;
}

function App() {
  const [events, setEvents] = useState(fallbackEvents);
  const [route, setRoute] = useState(window.location.pathname);
  const [status, setStatus] = useState("loading");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("gather-theme") === "dark");
  const [hapticsEnabled, setHapticsEnabled] = useState(() => localStorage.getItem("gather-haptics") !== "off");
  const navigate = (path) => { window.history.pushState({}, "", path); setRoute(path); window.scrollTo(0, 0); };
  useEffect(() => { document.documentElement.dataset.theme = darkMode ? "dark" : "light"; localStorage.setItem("gather-theme", darkMode ? "dark" : "light"); }, [darkMode]);
  useEffect(() => { localStorage.setItem("gather-haptics", hapticsEnabled ? "on" : "off"); }, [hapticsEnabled]);
  useEffect(() => {
    if (!hapticsEnabled || typeof navigator.vibrate !== "function") return undefined;
    const onClick = (event) => {
      if (event.target.closest("a, button, input, [role='button']")) navigator.vibrate(8);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [hapticsEnabled]);
  useEffect(() => { const onPopState = () => setRoute(window.location.pathname); window.addEventListener("popstate", onPopState); return () => window.removeEventListener("popstate", onPopState); }, []);
  useEffect(() => { const controller = new AbortController(); getEvents(controller.signal).then((items) => { if (items.length) setEvents(items); setStatus(items.length ? "ready" : "empty"); }).catch(() => setStatus("error")); return () => controller.abort(); }, []);
  const eventId = route.match(/^\/events\/([^/]+)/)?.[1];
  const selected = events.find((event) => event.id === eventId);
  return <div className="app-shell"><Header navigate={navigate} darkMode={darkMode} setDarkMode={setDarkMode} hapticsEnabled={hapticsEnabled} setHapticsEnabled={setHapticsEnabled} /><main id="top">{eventId && selected ? <EventPage event={selected} events={events} navigate={navigate} /> : route === "/events" ? <EventsPage events={events} navigate={navigate} /> : <Landing events={events} navigate={navigate} />}{status === "error" && <div className="notice"><strong>Events are temporarily unavailable.</strong> We’re showing the saved calendar so you can keep browsing. <button onClick={() => window.location.reload()}><RefreshCw size={14} /> Retry connection</button></div>}</main><footer><a className="logo" href="/" onClick={(event) => { event.preventDefault(); navigate("/"); }}><span>g</span>ather<span className="logo-dot">.</span></a><span>Made for the pleasantly curious.</span><span>© 2026</span></footer></div>;
}

export default App;
