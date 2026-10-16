import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, CalendarDays, ChevronDown, Clock3, MapPin, RefreshCw, Search, Sparkles } from "lucide-react";
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
  return new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short" }).format(new Date(value));
}

function formatTime(value) {
  if (!value) return "Time to be announced";
  return new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function EventCard({ event, featured = false }) {
  return (
    <article className={`event-card ${featured ? "event-card--featured" : ""}`}>
      <div className="event-card__image" style={event.image ? { backgroundImage: `url(${event.image})` } : undefined}>
        {!event.image && <span>{event.category?.slice(0, 1)}</span>}
        <span className="event-card__badge">{event.category}</span>
      </div>
      <div className="event-card__body">
        <div className="event-card__meta"><span><CalendarDays size={15} />{formatDate(event.date)}</span><span><Clock3 size={15} />{formatTime(event.date)}</span></div>
        <h3>{event.title}</h3>
        <p>{event.description}</p>
        <div className="event-card__footer"><span><MapPin size={15} />{event.location}</span><button aria-label={`View ${event.title}`}><ArrowUpRight size={19} /></button></div>
      </div>
    </article>
  );
}

function App() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("loading");
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All events");

  const loadEvents = () => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 8000);
    setStatus("loading");
    getEvents(controller.signal).then((items) => { setEvents(items); setStatus(items.length ? "ready" : "empty"); }).catch(() => setStatus("error")).finally(() => window.clearTimeout(timer));
    return () => { controller.abort(); window.clearTimeout(timer); };
  };

  useEffect(() => loadEvents(), []);

  const visibleEvents = useMemo(() => {
    const source = status === "error" ? fallbackEvents : events;
    return source.filter((event) => `${event.title} ${event.description} ${event.location} ${event.category}`.toLowerCase().includes(query.toLowerCase())).filter((event) => activeFilter === "All events" || event.category === activeFilter);
  }, [events, status, query, activeFilter]);

  const filters = ["All events", ...new Set(events.map((event) => event.category))];

  return <div className="app-shell">
    <header className="site-header"><a className="logo" href="#top"><span>g</span>ather<span className="logo-dot">.</span></a><nav><a href="#events">Explore</a><a href="#about">Our point of view</a></nav><a className="header-link" href="#events">Find an event <ArrowUpRight size={16} /></a></header>
    <main id="top">
      <section className="hero"><div className="hero__eyebrow"><Sparkles size={16} /> Curious by default</div><h1>Make room for<br /><em>something new.</em></h1><p>Gather is a calmer way to find events, ideas, and people worth making time for.</p><a className="button button--dark" href="#events">Explore events <ArrowUpRight size={17} /></a><div className="hero__scribble">scroll to wander ↓</div></section>
      <section className="intro" id="about"><div className="section-label">01 / Why gather</div><div><h2>The best plans start with<br /><em>“what if I went?”</em></h2><p>From small workshops to big conversations, discover what is happening around you without the noise. A little inspiration, neatly arranged.</p></div></section>
      <section className="events-section" id="events"><div className="section-heading"><div><div className="section-label">02 / Coming up</div><h2>Go on,<br /><em>pick one.</em></h2></div><div className="events-controls"><label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events" aria-label="Search events" /></label><div className="filter-row">{filters.map((filter) => <button className={activeFilter === filter ? "active" : ""} key={filter} onClick={() => setActiveFilter(filter)}>{filter}<ChevronDown size={14} /></button>)}</div></div></div>
        {status === "loading" && <div className="state-card"><div className="loader" /><p>Looking around for good things…</p></div>}
        {status === "empty" && <div className="state-card"><h3>Nothing on the calendar yet.</h3><p>Try checking back soon, or broaden your search.</p><button className="text-button" onClick={loadEvents}>Refresh events <RefreshCw size={15} /></button></div>}
        {visibleEvents.length > 0 && <div className="event-grid">{visibleEvents.map((event, index) => <EventCard event={event} featured={index === 0} key={event.id} />)}</div>}
        {status === "error" && <div className="notice"><strong>We hit a small snag.</strong> Showing a few sample events while the events service wakes up. <button onClick={loadEvents}>Try again</button></div>}
        {status === "ready" && visibleEvents.length === 0 && <div className="state-card"><h3>No matches found.</h3><p>Try a different search or category.</p></div>}
      </section>
      <section className="closing"><div className="section-label">03 / Keep in touch</div><h2>Leave a little space<br />for <em>serendipity.</em></h2><p>Good things happen when you look up from the usual.</p><a className="button button--light" href="#events">Browse the calendar <ArrowUpRight size={17} /></a></section>
    </main>
    <footer><a className="logo" href="#top"><span>g</span>ather<span className="logo-dot">.</span></a><span>Made for the pleasantly curious.</span><span>© 2026</span></footer>
  </div>;
}

export default App;
